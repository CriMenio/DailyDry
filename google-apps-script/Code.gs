/**
 * Daily Dry — Google Sheets API (deploy as Web App)
 * Layout: DailyDryDB.xlsx (8 tabs). Setup: docs/APPS_SCRIPT_DEPLOY.md
 */

const SHEETS = {
  CONTACT: 'Contact',
  USER_SIGNUP: 'UserSignUp',
  CUSTOMER_ORDERS: 'Customer&Orders',
  REVIEWS: 'Reviews',
  ADMIN_SIGNUP: 'AdminLogin',
  STOCK: 'StockInventory',
  RETAIL_OFFLINE: 'RetailsOrder(Offline)',
  CUSTOMER_OFFLINE: 'CustomerOrder(Offline)',
  STORE_SETTINGS: 'StoreSettings',
};

const DEFAULT_SHIPPING_FEE = 49;
const DEFAULT_FREE_SHIPPING_MIN = 999;

const REVIEW_PRODUCT_PREFIX = '[[product:';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const result = routeAction(body);
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message || err) });
  }
}

function doGet() {
  return jsonResponse({ ok: true, message: 'Daily Dry API is running' });
}

function routeAction(body) {
  const action = body.action;
  switch (action) {
    case 'register':
      return register(body);
    case 'login':
      return login(body);
    case 'getInventory':
      return { ok: true, inventory: getInventory(), storeSettings: getStoreSettings() };
    case 'adminGetStoreSettings':
      verifyAdminToken(body.adminToken);
      return { ok: true, storeSettings: getStoreSettings() };
    case 'adminUpdateStoreSettings':
      adminUpdateStoreSettings(body);
      return { ok: true, storeSettings: getStoreSettings() };
    case 'createOrder':
      return createOrder(body);
    case 'getMyOrders':
      return { ok: true, orders: getMyOrders(body.token) };
    case 'trackOrder':
      return { ok: true, order: trackOrderByReference(body.orderNumber) };
    case 'submitReview':
      submitReview(body);
      return { ok: true };
    case 'getReviews':
      return { ok: true, reviews: getReviews(body.productName) };
    case 'getFeaturedReviews':
      return { ok: true, reviews: getFeaturedReviews() };
    case 'submitContact':
      submitContact(body);
      return { ok: true };
    case 'adminLogin':
      return adminLogin(body);
    case 'adminGetOrders':
      return { ok: true, orders: adminGetOrders(body.adminToken) };
    case 'adminUpdateOrderStatus':
      adminUpdateOrderStatus(body);
      return { ok: true };
    case 'adminUpdateInventory':
      adminUpdateInventory(body);
      return { ok: true };
    case 'adminGetRetailOrders':
      verifyAdminToken(body.adminToken);
      return { ok: true, rows: getRetailOrders() };
    case 'adminGetCustomerOrdersOffline':
      verifyAdminToken(body.adminToken);
      return { ok: true, rows: getCustomerOrdersOffline() };
    case 'adminAppendRetailOrder':
      adminSaveRetailOrder(body);
      return { ok: true };
    case 'adminAppendCustomerOrderOffline':
      adminSaveCustomerOrderOffline(body);
      return { ok: true };
    case 'uploadProductImage':
      return uploadProductImage(body);
    default:
      throw new Error('Unknown action: ' + action);
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getSpreadsheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Set SPREADSHEET_ID in Script Properties');
  return SpreadsheetApp.openById(id);
}

function sheet(name) {
  const ss = getSpreadsheet();
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error('Missing sheet tab: ' + name);
  return sh;
}

/** Next ID in column A (skips header row). */
function nextAutoId(sh) {
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return 1;
  const ids = sh.getRange(2, 1, lastRow, 1).getValues();
  let max = 0;
  for (let i = 0; i < ids.length; i++) {
    const n = Number(ids[i][0]);
    if (!isNaN(n)) max = Math.max(max, n);
  }
  return max + 1;
}

function hashPassword(password, salt) {
  const raw = salt + password;
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return Utilities.base64Encode(digest);
}

function encodePasswordCell(password) {
  const salt = Utilities.getUuid();
  const hash = hashPassword(password, salt);
  return hash + '|' + salt;
}

function verifyPasswordCell(password, cellValue) {
  const parts = String(cellValue).split('|');
  if (parts.length !== 2) return false;
  return hashPassword(password, parts[1]) === parts[0];
}

function createToken(userId) {
  const secret =
    PropertiesService.getScriptProperties().getProperty('SESSION_SECRET') || 'daily-dry-change-me';
  const payload = String(userId) + ':' + Date.now();
  const sig = Utilities.base64Encode(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, payload + secret)
  );
  return Utilities.base64EncodeWebSafe(payload + ':' + sig);
}

function verifyToken(token) {
  if (!token) throw new Error('Not signed in');
  const secret =
    PropertiesService.getScriptProperties().getProperty('SESSION_SECRET') || 'daily-dry-change-me';
  const decoded = Utilities.newBlob(Utilities.base64DecodeWebSafe(token)).getDataAsString();
  const parts = decoded.split(':');
  if (parts.length < 3) throw new Error('Invalid session');
  const sig = parts.pop();
  const ts = parts.pop();
  const userId = parts.join(':');
  const payload = userId + ':' + ts;
  const expected = Utilities.base64Encode(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, payload + secret)
  );
  if (sig !== expected) throw new Error('Invalid session');
  return userId;
}

function verifyAdminToken(adminToken) {
  if (!adminToken) throw new Error('Admin not signed in');
  const secret =
    PropertiesService.getScriptProperties().getProperty('ADMIN_SESSION_SECRET') ||
    'daily-dry-admin-change-me';
  const decoded = Utilities.newBlob(Utilities.base64DecodeWebSafe(adminToken)).getDataAsString();
  if (decoded.indexOf('admin:') !== 0) throw new Error('Invalid admin session');
  const payload = decoded.split(':')[1];
  const sig = decoded.split(':')[2];
  const expected = Utilities.base64Encode(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'admin:' + payload + secret)
  );
  if (sig !== expected) throw new Error('Invalid admin session');
}

function normalizeName(name) {
  return String(name || '')
    .trim()
    .toLowerCase();
}

function register(body) {
  const sh = sheet(SHEETS.USER_SIGNUP);
  const data = sh.getDataRange().getValues();
  const mobile = String(body.mobile).trim();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][3]) === mobile) throw new Error('Mobile number already registered');
  }
  const id = nextAutoId(sh);
  sh.appendRow([
    id,
    body.name,
    encodePasswordCell(body.password),
    mobile,
    body.email,
    body.address,
  ]);
  const user = {
    userId: String(id),
    name: body.name,
    mobile,
    email: body.email,
    address: body.address,
  };
  return { ok: true, user, token: createToken(String(id)) };
}

function login(body) {
  const sh = sheet(SHEETS.USER_SIGNUP);
  const data = sh.getDataRange().getValues();
  const mobile = String(body.mobile).trim();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][3]) === mobile) {
      if (!verifyPasswordCell(body.password, data[i][2])) {
        throw new Error('Invalid mobile or password');
      }
      const user = {
        userId: String(data[i][0]),
        name: data[i][1],
        mobile: String(data[i][3]),
        email: data[i][4],
        address: data[i][5],
      };
      return { ok: true, user, token: createToken(user.userId) };
    }
  }
  throw new Error('Invalid mobile or password');
}

function getInventory() {
  const sh = sheet(SHEETS.STOCK);
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return [];
  const cols = stockColumnIndices(data[0]);
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const productName = String(data[i][cols.productName] || '').trim();
    if (!productName) continue;
    const remarks1Raw = String(data[i][cols.r1] || '');
    const disabled = remarks1Raw.toLowerCase() === 'disabled';
    let weight = String(data[i][cols.weight] || '').trim();
    let remarks1 = remarks1Raw;
    if (!weight && remarks1 && !disabled) {
      weight = remarks1.trim();
      remarks1 = '';
    } else if (disabled) {
      remarks1 = '';
    }
    rows.push({
      sheetId: String(data[i][0]),
      productName: productName,
      category: String(data[i][cols.category] || ''),
      sellerType: String(data[i][cols.sellerType] || ''),
      mrp: Number(data[i][cols.mrp]) || 0,
      stock: Number(data[i][cols.stock]) || 0,
      imagePath: String(data[i][cols.image] || ''),
      weight: weight,
      remarks1: remarks1,
      remarks2: String(data[i][cols.r2] || ''),
      enabled: !disabled,
    });
  }
  return rows;
}

function defaultStoreSettings() {
  return {
    shippingFee: DEFAULT_SHIPPING_FEE,
    freeShippingMin: DEFAULT_FREE_SHIPPING_MIN,
  };
}

function storeSettingsColumnIndices(headerRow) {
  const norm = function (v) {
    return String(v || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  };
  const idx = function (labels, fallback) {
    for (let c = 0; c < headerRow.length; c++) {
      const n = norm(headerRow[c]);
      for (let L = 0; L < labels.length; L++) {
        if (n === labels[L] || n.indexOf(labels[L]) !== -1) return c;
      }
    }
    return fallback;
  };
  return {
    id: idx(['id'], 0),
    shippingFee: idx(['shippingfee', 'shippingcharge', 'deliveryfee'], 1),
    freeShippingMin: idx(['freeshippingmin', 'freeshippingthreshold', 'freeshiippingmin'], 2),
  };
}

function getStoreSettings() {
  try {
    const sh = sheet(SHEETS.STORE_SETTINGS);
    const data = sh.getDataRange().getValues();
    if (data.length < 2) return defaultStoreSettings();
    const cols = storeSettingsColumnIndices(data[0]);
    const row = data[1];
    const shippingFee = Math.max(0, Number(row[cols.shippingFee]));
    const freeShippingMin = Math.max(0, Number(row[cols.freeShippingMin]));
    return {
      shippingFee: isFinite(shippingFee) ? shippingFee : DEFAULT_SHIPPING_FEE,
      freeShippingMin: isFinite(freeShippingMin) ? freeShippingMin : DEFAULT_FREE_SHIPPING_MIN,
    };
  } catch (e) {
    return defaultStoreSettings();
  }
}

function calcShippingForSubtotal(subtotal, settings) {
  const cfg = settings || getStoreSettings();
  const sub = Number(subtotal) || 0;
  if (sub > cfg.freeShippingMin) return 0;
  return Math.max(0, Number(cfg.shippingFee) || 0);
}

function seedStoreSettingsIfEmpty() {
  const sh = sheet(SHEETS.STORE_SETTINGS);
  if (sh.getLastRow() >= 2) return;
  sh.appendRow([1, DEFAULT_SHIPPING_FEE, DEFAULT_FREE_SHIPPING_MIN]);
}

function adminUpdateStoreSettings(body) {
  verifyAdminToken(body.adminToken);
  const shippingFee = Number(body.shippingFee);
  const freeShippingMin = Number(body.freeShippingMin);
  if (!isFinite(shippingFee) || shippingFee < 0 || !isFinite(freeShippingMin) || freeShippingMin < 0) {
    throw new Error('Invalid shipping settings');
  }
  const ss = getSpreadsheet();
  let sh = ss.getSheetByName(SHEETS.STORE_SETTINGS);
  if (!sh) {
    sh = ss.insertSheet(SHEETS.STORE_SETTINGS);
    sh.getRange(1, 1, 1, 3).setValues([['ID', 'ShippingFee', 'FreeShippingMin']]);
  }
  seedStoreSettingsIfEmpty();
  sh.getRange(2, 2, 1, 2).setValues([[shippingFee, freeShippingMin]]);
}

/** Map StockInventory header row → 0-based column indices (supports Category before or after ProductName). */
function stockColumnIndices(headerRow) {
  const norm = function (v) {
    return String(v || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  };
  const idx = function (labels) {
    for (let c = 0; c < headerRow.length; c++) {
      const n = norm(headerRow[c]);
      for (let L = 0; L < labels.length; L++) {
        if (n === labels[L] || n.indexOf(labels[L]) !== -1) return c;
      }
    }
    return -1;
  };

  let category = idx(['category']);
  let productName = idx(['productname']);
  let mrp = idx(['mrp', 'productmrp']);
  let stock = idx(['totalstockremaning', 'totalstockremaining', 'stock']);
  let image = idx(['imagepath', 'productimagepath']);
  let r1 = idx(['remarks1']);
  let r2 = idx(['remarks2']);
  let sellerType = idx(['sellertype']);
  let weight = idx(['weight', 'weigh', 'packweight', 'pack']);

  if (productName < 0) productName = 1;
  if (category < 0) category = 2;
  if (mrp < 0) mrp = 3;
  if (stock < 0) stock = 4;
  if (image < 0) image = 5;
  if (r1 < 0) r1 = 6;
  if (r2 < 0) r2 = 7;
  if (sellerType < 0) sellerType = 8;
  if (weight < 0) weight = 9;

  return {
    category: category,
    productName: productName,
    mrp: mrp,
    stock: stock,
    image: image,
    weight: weight,
    r1: r1,
    r2: r2,
    sellerType: sellerType,
  };
}

function writeStockRow(sh, sheetRow, cols, row, existingRow) {
  const getExisting = function (key) {
    return existingRow ? existingRow[cols[key]] : '';
  };
  sh.getRange(sheetRow, cols.category + 1).setValue(row.category || getExisting('category') || '');
  if (row.sellerType !== undefined) {
    sh.getRange(sheetRow, cols.sellerType + 1).setValue(row.sellerType || '');
  }
  sh.getRange(sheetRow, cols.productName + 1).setValue(row.productName);
  sh.getRange(sheetRow, cols.mrp + 1).setValue(row.mrp !== undefined && row.mrp !== '' ? row.mrp : getExisting('mrp') || '');
  sh.getRange(sheetRow, cols.stock + 1).setValue(row.stock);
  sh.getRange(sheetRow, cols.image + 1).setValue(row.imagePath || getExisting('image') || '');
  if (row.weight !== undefined) {
    sh.getRange(sheetRow, cols.weight + 1).setValue(row.weight || '');
  }
  if (!row.enabled) {
    sh.getRange(sheetRow, cols.r1 + 1).setValue('DISABLED');
  } else if (row.remarks1 !== undefined) {
    sh.getRange(sheetRow, cols.r1 + 1).setValue(row.remarks1 || '');
  } else if (row.enabled === true) {
    sh.getRange(sheetRow, cols.r1 + 1).setValue('');
  }
  if (row.remarks2 !== undefined) {
    sh.getRange(sheetRow, cols.r2 + 1).setValue(row.remarks2);
  }
}

function stockAppendValues(cols, id, row) {
  const maxCol = Math.max(
    cols.category,
    cols.productName,
    cols.mrp,
    cols.stock,
    cols.image,
    cols.r1,
    cols.r2,
    cols.sellerType,
    cols.weight
  );
  const line = [];
  for (let c = 0; c <= maxCol; c++) {
    line.push('');
  }
  line[0] = id;
  line[cols.category] = row.category || '';
  line[cols.sellerType] = row.sellerType || '';
  line[cols.productName] = row.productName;
  line[cols.mrp] = row.mrp || '';
  line[cols.stock] = row.stock;
  line[cols.image] = row.imagePath || '';
  line[cols.weight] = row.weight || '';
  line[cols.r1] = row.enabled === false ? 'DISABLED' : row.remarks1 || '';
  line[cols.r2] = row.remarks2 || '';
  return line;
}

function findStockRow(productName) {
  const sh = sheet(SHEETS.STOCK);
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return null;
  const cols = stockColumnIndices(data[0]);
  const target = normalizeName(productName);
  for (let i = 1; i < data.length; i++) {
    if (normalizeName(data[i][cols.productName]) === target) return { sheetRow: i + 1, row: data[i], cols: cols };
  }
  return null;
}

function findStockRowById(sheetId) {
  const found = findRowBySheetId(sheet(SHEETS.STOCK), sheetId);
  if (!found) return null;
  const data = sheet(SHEETS.STOCK).getDataRange().getValues();
  const cols = stockColumnIndices(data[0]);
  return { sheetRow: found.sheetRow, row: found.row, cols: cols };
}

function findRowBySheetId(sh, sheetId) {
  const data = sh.getDataRange().getValues();
  const target = String(sheetId);
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === target) return { sheetRow: i + 1, row: data[i] };
  }
  return null;
}

function normalizeOrderRef(value) {
  return String(value || '')
    .trim()
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, '')
    .toUpperCase();
}

function customerOrderCellText(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(value || '').trim();
}

function customerOrderColumnIndices(headerRow) {
  const h = (headerRow || []).map(function (c) {
    return String(c || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  });
  function idx(names, fallback) {
    for (let n = 0; n < names.length; n++) {
      const i = h.indexOf(names[n]);
      if (i >= 0) return i;
    }
    return fallback;
  }
  return {
    id: idx(['id'], 0),
    customerName: idx(['customer name'], 1),
    mobile: idx(['mobile number', 'mobile'], 2),
    address: idx(['address'], 3),
    email: idx(['emailid', 'email id', 'email'], 4),
    orderNumber: idx(['order number'], 5),
    billNumber: idx(['bill number'], 6),
    product: idx(['product description', 'product'], 7),
    qty: idx(['quantity', 'qty'], 8),
    lineAmount: idx(['order amount'], 9),
    shipping: idx(['shipping charges'], 10),
    total: idx(['total amount'], 11),
    paymentStatus: idx(['payment status'], 12),
    orderStatus: idx(['order status'], 13),
  };
}

function nextOrderNumber() {
  const sh = sheet(SHEETS.CUSTOMER_ORDERS);
  const data = sh.getDataRange().getValues();
  const cols = customerOrderColumnIndices(data[0]);
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd');
  let max = 0;
  for (let i = 1; i < data.length; i++) {
    const on = customerOrderCellText(data[i][cols.orderNumber]);
    const m = on.match(/ORD-(\d{8})-(\d+)/i);
    if (m && m[1] === today) max = Math.max(max, Number(m[2]));
  }
  return 'ORD-' + today + '-' + String(max + 1).padStart(3, '0');
}

function nextBillNumber() {
  const sh = sheet(SHEETS.CUSTOMER_ORDERS);
  const data = sh.getDataRange().getValues();
  const cols = customerOrderColumnIndices(data[0]);
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd');
  let max = 0;
  for (let i = 1; i < data.length; i++) {
    const bill = customerOrderCellText(data[i][cols.billNumber]);
    const m = bill.match(/BILL-(\d{8})-(\d+)/i);
    if (m && m[1] === today) max = Math.max(max, Number(m[2]));
  }
  return 'BILL-' + today + '-' + String(max + 1).padStart(3, '0');
}

function hmacSha256Hex(message, secret) {
  const sig = Utilities.computeHmacSha256Signature(String(message), String(secret));
  return sig
    .map(function (b) {
      const v = (b < 0 ? b + 256 : b).toString(16);
      return v.length === 1 ? '0' + v : v;
    })
    .join('');
}

function verifyRazorpayPaymentToken(paymentId, razorpayOrderId, amountPaise, token) {
  const secret = PropertiesService.getScriptProperties().getProperty('RAZORPAY_KEY_SECRET');
  if (!secret) {
    throw new Error('Online payment is not configured in Apps Script (set RAZORPAY_KEY_SECRET in Script properties)');
  }
  const message = paymentId + '|' + razorpayOrderId + '|' + amountPaise;
  const expected = hmacSha256Hex(message, secret);
  if (expected !== String(token)) {
    throw new Error('Invalid payment verification');
  }
}

function createOrder(body) {
  const userId = verifyToken(body.token);
  const shUser = sheet(SHEETS.USER_SIGNUP);
  const users = shUser.getDataRange().getValues();
  let customer = null;
  for (let i = 1; i < users.length; i++) {
    if (String(users[i][0]) === String(userId)) {
      customer = {
        name: users[i][1],
        mobile: String(users[i][3]),
        email: users[i][4],
        address: users[i][5],
      };
      break;
    }
  }
  if (!customer) throw new Error('User not found');

  const items = body.items || [];
  const invList = getInventory();
  const invMap = {};
  invList.forEach(function (r) {
    invMap[normalizeName(r.productName)] = r;
  });

  for (let j = 0; j < items.length; j++) {
    const line = items[j];
    const row = invMap[normalizeName(line.name)];
    if (!row || !row.enabled) throw new Error('Product unavailable: ' + line.name);
    if (line.quantity > row.stock) throw new Error('Not enough stock for ' + line.name);
  }

  for (let j = 0; j < items.length; j++) {
    const line = items[j];
    const found = findStockRow(line.name);
    if (found) {
      const cols = found.cols || stockColumnIndices(sheet(SHEETS.STOCK).getDataRange().getValues()[0]);
      const newStock = Number(found.row[cols.stock]) - line.quantity;
      sheet(SHEETS.STOCK).getRange(found.sheetRow, cols.stock + 1).setValue(newStock);
    }
  }

  const orderNumber = nextOrderNumber();
  const billNumber = nextBillNumber();
  const address = body.address || customer.address;
  const shOrders = sheet(SHEETS.CUSTOMER_ORDERS);
  const paymentMethod = String(body.paymentMethod || 'COD').trim().toUpperCase();

  let computedSubtotal = 0;
  for (let j = 0; j < items.length; j++) {
    const line = items[j];
    const qty = Number(line.quantity) || 0;
    const unit = Number(line.unitPrice) || 0;
    computedSubtotal += qty * unit;
  }
  computedSubtotal = Math.round(computedSubtotal * 100) / 100;
  const orderAmount = Math.round(Number(body.orderAmount) * 100) / 100;
  if (Math.abs(orderAmount - computedSubtotal) > 0.02) {
    throw new Error('Order subtotal does not match cart');
  }
  const shippingSettings = getStoreSettings();
  const expectedShipping = calcShippingForSubtotal(computedSubtotal, shippingSettings);
  const shippingCharges = Math.round(Number(body.shippingCharges) * 100) / 100;
  if (Math.abs(shippingCharges - expectedShipping) > 0.02) {
    throw new Error('Shipping charge is out of date. Refresh the page and try again.');
  }
  const expectedTotal = Math.round((computedSubtotal + expectedShipping) * 100) / 100;
  const totalAmount = Math.round(Number(body.totalAmount) * 100) / 100;
  if (Math.abs(totalAmount - expectedTotal) > 0.02) {
    throw new Error('Order total is out of date. Refresh the page and try again.');
  }

  let paymentStatus = 'COD';
  if (paymentMethod === 'COD') {
    paymentStatus = 'COD';
  } else if (paymentMethod === 'RAZORPAY') {
    const paymentId = String(body.razorpayPaymentId || '').trim();
    const razorpayOrderId = String(body.razorpayOrderId || '').trim();
    const paymentToken = String(body.paymentToken || '').trim();
    if (!paymentId || !razorpayOrderId || !paymentToken) {
      throw new Error('Payment verification missing. Complete payment before placing the order.');
    }
    const amountPaise = Math.round(totalAmount * 100);
    verifyRazorpayPaymentToken(paymentId, razorpayOrderId, amountPaise, paymentToken);
    paymentStatus = 'Paid';
  } else {
    throw new Error('Unsupported payment method');
  }

  for (let j = 0; j < items.length; j++) {
    const line = items[j];
    const lineAmount = line.quantity * line.unitPrice;
    const id = nextAutoId(shOrders);
    shOrders.appendRow([
      id,
      customer.name,
      customer.mobile,
      address,
      customer.email,
      orderNumber,
      billNumber,
      line.name,
      line.quantity,
      lineAmount,
      expectedShipping,
      expectedTotal,
      paymentStatus,
      'Order Placed',
    ]);
  }

  return {
    ok: true,
    order: {
      orderId: orderNumber,
      orderNumber,
      billNumber,
      userId,
      customerName: customer.name,
      mobile: customer.mobile,
      email: customer.email,
      address,
      items,
      orderAmount: computedSubtotal,
      shippingCharges: expectedShipping,
      totalAmount: expectedTotal,
      paymentStatus: paymentStatus,
      orderStatus: 'Order Placed',
    },
  };
}

function groupOrderRows(data) {
  if (!data || data.length < 2) return [];
  const cols = customerOrderColumnIndices(data[0]);
  const map = {};
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const orderKey = customerOrderCellText(row[cols.orderNumber]);
    if (!orderKey) continue;
    const key = orderKey;
    if (!map[key]) {
      map[key] = {
        orderId: key,
        orderNumber: key,
        billNumber: customerOrderCellText(row[cols.billNumber]),
        customerName: row[cols.customerName],
        mobile: String(row[cols.mobile]),
        email: row[cols.email],
        address: row[cols.address],
        items: [],
        orderAmount: 0,
        shippingCharges: Number(row[cols.shipping]) || 0,
        totalAmount: Number(row[cols.total]) || 0,
        paymentStatus: row[cols.paymentStatus],
        orderStatus: row[cols.orderStatus],
      };
    }
    const qty = Number(row[cols.qty]) || 0;
    const lineAmount = Number(row[cols.lineAmount]) || 0;
    map[key].items.push({
      productId: '',
      name: row[cols.product],
      quantity: qty,
      unitPrice: qty > 0 ? lineAmount / qty : lineAmount,
    });
    map[key].orderAmount += lineAmount;
    map[key].orderStatus = row[cols.orderStatus];
    map[key].paymentStatus = row[cols.paymentStatus];
  }
  return Object.keys(map)
    .map(function (k) {
      return map[k];
    })
    .reverse();
}

function getMyOrders(token) {
  const userId = verifyToken(token);
  const shUser = sheet(SHEETS.USER_SIGNUP);
  const users = shUser.getDataRange().getValues();
  let mobile = '';
  for (let i = 1; i < users.length; i++) {
    if (String(users[i][0]) === String(userId)) {
      mobile = String(users[i][3]);
      break;
    }
  }
  const sh = sheet(SHEETS.CUSTOMER_ORDERS);
  const data = sh.getDataRange().getValues();
  const cols = customerOrderColumnIndices(data[0]);
  const filtered = [data[0]];
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][cols.mobile]) === mobile) filtered.push(data[i]);
  }
  return groupOrderRows(filtered);
}

function trackOrderByReference(reference) {
  const ref = String(reference || '').trim();
  if (!ref) throw new Error('Enter your order number');
  const sh = sheet(SHEETS.CUSTOMER_ORDERS);
  const data = sh.getDataRange().getValues();
  if (data.length < 2) {
    throw new Error('Order not found. Use the order number from checkout (e.g. ORD-20260313-001).');
  }
  const cols = customerOrderColumnIndices(data[0]);
  const filtered = [data[0]];
  let found = false;
  const normRef = normalizeOrderRef(ref);
  for (let i = 1; i < data.length; i++) {
    const orderNo = customerOrderCellText(data[i][cols.orderNumber]);
    const billNo = customerOrderCellText(data[i][cols.billNumber]);
    if (
      orderNo === ref ||
      billNo === ref ||
      normalizeOrderRef(orderNo) === normRef ||
      normalizeOrderRef(billNo) === normRef
    ) {
      filtered.push(data[i]);
      found = true;
    }
  }
  if (!found) {
    throw new Error('Order not found. Use the order number from checkout (e.g. ORD-20260313-001).');
  }
  const orders = groupOrderRows(filtered);
  if (!orders.length) {
    throw new Error(
      'Order row found but Order Number column is empty. Check row ' +
        (filtered.length > 1 ? 'in Customer&Orders' : '') +
        ' — column header must be "Order Number".'
    );
  }
  return orders[0];
}

function reviewTag(productName) {
  const n = productName != null ? String(productName).trim() : '';
  if (!n || n === 'undefined' || n === 'null') return null;
  return REVIEW_PRODUCT_PREFIX + n + ']]';
}

function stripReviewTag(text) {
  const s = String(text);
  const end = s.indexOf(']]');
  if (s.indexOf(REVIEW_PRODUCT_PREFIX) === 0 && end !== -1) {
    return s.substring(end + 2).trim();
  }
  return s.trim();
}

function submitReview(body) {
  let fullName = String(body.fullName || '').trim();
  if (body.token) {
    try {
      const userId = verifyToken(body.token);
      const shUser = sheet(SHEETS.USER_SIGNUP);
      const users = shUser.getDataRange().getValues();
      for (let i = 1; i < users.length; i++) {
        if (String(users[i][0]) === String(userId)) {
          if (!fullName) fullName = String(users[i][1] || '').trim();
          break;
        }
      }
    } catch (e) {
      /* guest review allowed */
    }
  }
  if (!fullName) throw new Error('Please enter your name');
  const text = String(body.text || '').trim();
  if (!text) throw new Error('Please write your review');
  const rating = Number(body.rating);
  if (!rating || rating < 1 || rating > 5) throw new Error('Choose a rating from 1 to 5');

  const sh = sheet(SHEETS.REVIEWS);
  const id = nextAutoId(sh);
  let productName = body.productName != null ? String(body.productName).trim() : '';
  if (productName === 'undefined' || productName === 'null') productName = '';
  const tag = reviewTag(productName);
  const cellText = tag ? tag + ' ' + text : text;
  sh.appendRow([id, fullName, rating, cellText]);
}

function getFeaturedReviews() {
  const sh = sheet(SHEETS.REVIEWS);
  const data = sh.getDataRange().getValues();
  const reviews = [];
  for (let i = 1; i < data.length; i++) {
    if (!data[i][1] && !data[i][3]) continue;
    const raw = String(data[i][3] || '');
    reviews.push({
      reviewId: String(data[i][0]),
      fullName: String(data[i][1] || 'Customer'),
      rating: Number(data[i][2]) || 5,
      text: stripReviewTag(raw),
    });
  }
  return reviews.reverse();
}

function getReviews(productName) {
  const name = productName != null ? String(productName).trim() : '';
  if (!name) {
    return getFeaturedReviews();
  }
  const sh = sheet(SHEETS.REVIEWS);
  const data = sh.getDataRange().getValues();
  const tag = reviewTag(name);
  if (!tag) {
    return getFeaturedReviews();
  }
  const reviews = [];
  for (let i = 1; i < data.length; i++) {
    const text = String(data[i][3] || '');
    if (text.indexOf(tag) !== 0) continue;
    reviews.push({
      reviewId: String(data[i][0]),
      fullName: data[i][1],
      rating: Number(data[i][2]),
      text: stripReviewTag(text),
    });
  }
  return reviews.reverse();
}

function submitContact(body) {
  const sh = sheet(SHEETS.CONTACT);
  const id = nextAutoId(sh);
  sh.appendRow([
    id,
    body.customerName,
    body.mobile,
    body.email || '',
    body.address || '',
    body.remarks || '',
  ]);
}

function adminLogin(body) {
  const sh = sheet(SHEETS.ADMIN_SIGNUP);
  const data = sh.getDataRange().getValues();
  const userName = String(body.userName).trim();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]) === userName) {
      if (!verifyPasswordCell(body.password, data[i][2])) {
        throw new Error('Invalid admin credentials');
      }
      const secret =
        PropertiesService.getScriptProperties().getProperty('ADMIN_SESSION_SECRET') ||
        'daily-dry-admin-change-me';
      const payload = Date.now();
      const sig = Utilities.base64Encode(
        Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'admin:' + payload + secret)
      );
      const adminToken = Utilities.base64EncodeWebSafe('admin:' + payload + ':' + sig);
      return { ok: true, adminToken };
    }
  }
  throw new Error('Invalid admin credentials');
}

function adminGetOrders(adminToken) {
  verifyAdminToken(adminToken);
  const sh = sheet(SHEETS.CUSTOMER_ORDERS);
  return groupOrderRows(sh.getDataRange().getValues());
}

function adminUpdateOrderStatus(body) {
  verifyAdminToken(body.adminToken);
  const allowed = ['Order Placed', 'Dispatch', 'Out for Delivery', 'Delivered'];
  const nextStatus = String(body.orderStatus || '').trim();
  const ok = allowed.some(function (s) {
    return s.toLowerCase() === nextStatus.toLowerCase();
  });
  if (!ok) throw new Error('Invalid order status');
  const sh = sheet(SHEETS.CUSTOMER_ORDERS);
  const data = sh.getDataRange().getValues();
  const cols = customerOrderColumnIndices(data[0]);
  const orderNumber = body.orderNumber || body.orderId;
  const target = normalizeOrderRef(orderNumber);
  let updated = false;
  for (let i = 1; i < data.length; i++) {
    const on = normalizeOrderRef(customerOrderCellText(data[i][cols.orderNumber]));
    if (on === target || customerOrderCellText(data[i][cols.orderNumber]) === String(orderNumber)) {
      sh.getRange(i + 1, cols.orderStatus + 1).setValue(nextStatus);
      updated = true;
    }
  }
  if (!updated) throw new Error('Order not found');
}

function adminUpdateInventory(body) {
  verifyAdminToken(body.adminToken);
  const sh = sheet(SHEETS.STOCK);
  const header = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const cols = stockColumnIndices(header);
  const rows = body.rows || [];
  rows.forEach(function (row) {
    let found = row.sheetId ? findStockRowById(row.sheetId) : null;
    if (!found) {
      const lookupName = row.originalProductName || row.productName;
      found = findStockRow(lookupName);
    }
    if (found) {
      writeStockRow(sh, found.sheetRow, found.cols || cols, row, found.row);
    } else {
      const id = nextAutoId(sh);
      sh.appendRow(stockAppendValues(cols, id, row));
    }
  });
}

function getRetailOrders() {
  const sh = sheet(SHEETS.RETAIL_OFFLINE);
  const data = sh.getDataRange().getValues();
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    if (!data[i][0] && !data[i][1] && !data[i][2]) continue;
    rows.push({
      sheetId: String(data[i][0]),
      billNo: String(data[i][1] || ''),
      shopNameCustomer: String(data[i][2] || ''),
      mobile: String(data[i][3] || ''),
      whatsApp: String(data[i][4] || ''),
      area: String(data[i][5] || ''),
      address: String(data[i][6] || ''),
      shopType: String(data[i][7] || ''),
      visitDate: String(data[i][8] || ''),
      status: String(data[i][9] || ''),
      productName: String(data[i][10] || ''),
      qty: String(data[i][11] || ''),
      alFree: String(data[i][12] || ''),
      caFree: String(data[i][13] || ''),
      orderAmount: String(data[i][14] || ''),
      payment: String(data[i][15] || ''),
      paymentStatus: String(data[i][16] || ''),
      paymentDueDate: String(data[i][17] || ''),
      lastFollowUp: String(data[i][18] || ''),
      remarks1: String(data[i][19] || ''),
      remarks2: String(data[i][20] || ''),
    });
  }
  return rows;
}

function getCustomerOrdersOffline() {
  const sh = sheet(SHEETS.CUSTOMER_OFFLINE);
  const data = sh.getDataRange().getValues();
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    if (!data[i][0] && !data[i][1]) continue;
    rows.push({
      sheetId: String(data[i][0]),
      customerName: String(data[i][1] || ''),
      mobileNumber: String(data[i][2] || ''),
      address: String(data[i][3] || ''),
      emailId: String(data[i][4] || ''),
      orderNumber: String(data[i][5] || ''),
      billNumber: String(data[i][6] || ''),
      productDescription: String(data[i][7] || ''),
      quantity: String(data[i][8] || ''),
      orderAmount: String(data[i][9] || ''),
      shippingCharges: String(data[i][10] || ''),
      totalAmount: String(data[i][11] || ''),
      paymentStatus: String(data[i][12] || ''),
      orderStatus: String(data[i][13] || ''),
    });
  }
  return rows;
}

function retailRowToSheetValues(row) {
  return [
    row.billNo || '',
    row.shopNameCustomer || '',
    row.mobile || '',
    row.whatsApp || '',
    row.area || '',
    row.address || '',
    row.shopType || '',
    row.visitDate || '',
    row.status || '',
    row.productName || '',
    row.qty || '',
    row.alFree || '',
    row.caFree || '',
    row.orderAmount || '',
    row.payment || '',
    row.paymentStatus || '',
    row.paymentDueDate || '',
    row.lastFollowUp || '',
    row.remarks1 || '',
    row.remarks2 || '',
  ];
}

function customerOfflineRowToSheetValues(row) {
  return [
    row.customerName || '',
    row.mobileNumber || '',
    row.address || '',
    row.emailId || '',
    row.orderNumber || '',
    row.billNumber || '',
    row.productDescription || '',
    row.quantity || '',
    row.orderAmount || '',
    row.shippingCharges || '',
    row.totalAmount || '',
    row.paymentStatus || '',
    row.orderStatus || '',
  ];
}

function adminSaveRetailOrder(body) {
  verifyAdminToken(body.adminToken);
  const sh = sheet(SHEETS.RETAIL_OFFLINE);
  const row = body.row || {};
  const values = retailRowToSheetValues(row);
  if (row.sheetId) {
    const found = findRowBySheetId(sh, row.sheetId);
    if (!found) throw new Error('Retail order not found (ID ' + row.sheetId + ')');
    sh.getRange(found.sheetRow, 2, found.sheetRow, values.length + 1).setValues([values]);
  } else {
    const id = nextAutoId(sh);
    sh.appendRow([id].concat(values));
  }
}

function adminSaveCustomerOrderOffline(body) {
  verifyAdminToken(body.adminToken);
  const sh = sheet(SHEETS.CUSTOMER_OFFLINE);
  const row = body.row || {};
  const values = customerOfflineRowToSheetValues(row);
  if (row.sheetId) {
    const found = findRowBySheetId(sh, row.sheetId);
    if (!found) throw new Error('Customer order not found (ID ' + row.sheetId + ')');
    sh.getRange(found.sheetRow, 2, found.sheetRow, values.length + 1).setValues([values]);
  } else {
    const id = nextAutoId(sh);
    sh.appendRow([id].concat(values));
  }
}

/** Production image upload → Google Drive (public view link). Local dev uses Vite → public/media/products. */
function uploadProductImage(body) {
  verifyAdminToken(body.adminToken);
  if (!body.data || !body.fileName) throw new Error('Missing image data');
  const props = PropertiesService.getScriptProperties();
  let folderId = props.getProperty('PRODUCT_IMAGES_FOLDER_ID');
  let folder;
  if (folderId) {
    try {
      folder = DriveApp.getFolderById(folderId);
    } catch (e) {
      folder = null;
    }
  }
  if (!folder) {
    folder = DriveApp.createFolder('DailyDry Product Images');
    props.setProperty('PRODUCT_IMAGES_FOLDER_ID', folder.getId());
  }
  const bytes = Utilities.base64Decode(body.data);
  const mime = body.mimeType || 'image/jpeg';
  const safeName = String(body.fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
  const blob = Utilities.newBlob(bytes, mime, safeName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const path = 'https://drive.google.com/uc?export=view&id=' + file.getId();
  return { ok: true, path: path, fileName: safeName };
}

/**
 * Run once from Apps Script editor: creates tabs + header row (safe to re-run).
 */
function setupAllSheetsOnce() {
  const ss = getSpreadsheet();
  const specs = [
    [
      SHEETS.CONTACT,
      ['ID', 'Customer Name', 'Mobile Number', 'Email ID', 'Address', 'Remarks'],
    ],
    [
      SHEETS.USER_SIGNUP,
      ['ID', 'User Name', 'Password', 'Mobile Number', 'Email ID', 'Address'],
    ],
    [
      SHEETS.CUSTOMER_ORDERS,
      [
        'ID',
        'Customer Name',
        'Mobile Number',
        'Address',
        'EmailID',
        'Order Number',
        'Bill Number',
        'Product Description',
        'Quantity',
        'Order Amount',
        'Shipping Charges',
        'Total Amount',
        'Payment Status',
        'Order Status',
      ],
    ],
    [SHEETS.REVIEWS, ['ID', 'FullName', 'Rating', 'You Reviews']],
    [SHEETS.ADMIN_SIGNUP, ['ID', 'User Name', 'Password']],
    [
      SHEETS.STOCK,
      [
        'ID',
        'Category',
        'SellerType',
        'ProductName',
        'MRP',
        'Total Stock Remaning',
        'ImagePath',
        'Weight',
        'Remarks1',
        'Remarks2',
      ],
    ],
    [
      SHEETS.STORE_SETTINGS,
      ['ID', 'ShippingFee', 'FreeShippingMin'],
    ],
    [
      SHEETS.RETAIL_OFFLINE,
      [
        'ID',
        'BillNo',
        'ShopName/Customer',
        'Mobile',
        'WhatsApp',
        'Area',
        'Address',
        'ShopType',
        'VisitDate',
        'Status',
        'ProductName',
        'Qty',
        'ALFree',
        'CAFree',
        'OrderAmount',
        'Payment',
        'PaymentStatus',
        'PaymentDueDate',
        'LastFollowUp',
        'Remarks1',
        'Remarks2',
      ],
    ],
    [
      SHEETS.CUSTOMER_OFFLINE,
      [
        'ID',
        'CustomerName',
        'MobileNumber',
        'Address',
        'EmailID',
        'OrderNumber',
        'BillNumber',
        'ProductDescription',
        'Quantity',
        'OrderAmount',
        'ShippingCharges',
        'TotalAmount',
        'PaymentStatus',
        'OrderStatus',
      ],
    ],
  ];

  specs.forEach(function (spec) {
    const name = spec[0];
    const headers = spec[1];
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  });
  seedStoreSettingsIfEmpty();
  Logger.log('All sheet tabs and headers are ready.');
}

/** Run once after setupAllSheetsOnce — change username/password before running. */
function setupAdminOnce() {
  const sh = sheet(SHEETS.ADMIN_SIGNUP);
  const id = nextAutoId(sh);
  sh.appendRow([id, 'admin', encodePasswordCell('ChangeThisPassword123')]);
  Logger.log('Admin created — User Name: admin / Password: ChangeThisPassword123');
}

/**
 * Run once from the editor to reset an admin password (writes hash to AdminLogin sheet).
 * 1. Set userName + newPassword below, Save, Run changeAdminPassword, Authorize if asked.
 * 2. Log in on the site with the new password. Comment out or delete this run afterward.
 */
function changeAdminPassword() {
  const userName = 'admin';
  const newPassword = 'PUT_NEW_PASSWORD_HERE';
  const sh = sheet(SHEETS.ADMIN_SIGNUP);
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === userName) {
      sh.getRange(i + 1, 3).setValue(encodePasswordCell(newPassword));
      Logger.log('Password updated for: ' + userName);
      return;
    }
  }
  throw new Error('User not found: ' + userName);
}
