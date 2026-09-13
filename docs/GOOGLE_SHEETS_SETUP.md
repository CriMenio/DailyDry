# Google Sheets backend — setup (custom domain)

Daily Dry uses **8 tabs** in one Google Spreadsheet. The site calls **`/api`** on your domain (Netlify proxy) → **Google Apps Script**.

---

## 1. Create or reset the spreadsheet

**Option A — automatic headers (recommended)**

1. Create a **blank** Google Sheet (delete old tabs if you are migrating).
2. Copy the spreadsheet **ID** from the URL: `/d/`**`THIS_PART`**`/edit`
3. Apps Script → paste `google-apps-script/Code.gs` → set **`SPREADSHEET_ID`** in Script properties.
4. Run **`setupAllSheetsOnce`** once (authorize when prompted).  
   This creates all tabs and row‑1 headers exactly as below.

**Option B — manual**  
Create tabs with these **exact names** and headers (row 1):

### `Contact`

| ID | Customer Name | Mobile Number | Address | Email ID | Remarks |

### `UserSignUp`

| ID | User Name | Password | Mobile Number | Address | Email ID |

*(Password column stores `hash|salt` — do not type plain passwords by hand.)*

### `Customer&Orders` *(online website orders)*

| ID | Customer Name | Mobile Number | Address | EmailID | Order Number | Bill Number | Product Description | Quantity | Order Amount | Shipping Charges | Total Amount | Payment Status | Order Status |

One **row per product line**; same **Order Number** / **Bill Number** for all lines in one checkout.  
**ID** auto-increments per row.

### `Reviews`

| ID | FullName | Rating in stars | You Reviews |

- Customers can submit from the **home page** (“Share your experience”) or **product page** — no login required (name required for guests).
- **You Reviews**: general text, or `[[product:Exact Product Name]]` prefix when tied to a product (added automatically from the product form / optional product dropdown).
- Home carousel loads from this tab via `getFeaturedReviews` (newest first); falls back to sample quotes if the sheet is empty.

Product link: reviews store `[[product:Exact Product Name]]` prefix in **You Reviews** (handled by the API).

### `AdminSingup`

| ID | User Name | Password |

### `StockInventory`

| ID | Category | SellerType | ProductName | MRP | Total Stock Remaning | ImagePath | Weight | Remarks1 | Remarks2 |

- **Category**: shop filter slug — use `almonds`, `cashews`, `raisins`, `muesli`, `dry-fruit-mix`, or `walnuts` (same as **Shop** sidebar in the app). Plain labels like “Cashews” are normalized when saved from the admin form.
- **SellerType**: `Best Seller` or `New Arrival` (or leave blank). Controls which home page section shows the product when it is listed and in stock.
- **Weight**: pack size shown on the shop (e.g. `250g`). Header may be `Weight` or `Weigh` — the script detects it.
- **Remarks1** / **Remarks2**: free-text notes in admin. When “Show on shop” is off, **Remarks1** is set to `DISABLED` (listing flag).

### `RetailsOrder(Offline)` *(manual / field sales — not used by website yet)*

| ID | BillNo | ShopName/Customer | Mobile | Whatsapp (yes/no) | Area | Address | Shop type | Visit Date | Status | ProductName | Qty | ALFree | CAFree | OrderAmount | Payment | PaymentStatus | PaymentDueDate | LastFollowUp | Remarks1 | Remarks2 |

### `CustomerOrder(Offline)` *(manual offline copy — not used by website yet)*

| ID | CustomerName | MobileNumber | Address | EmailID | OrderNumber | BillNumber | ProductDescription | Quantity | OrderAmount | ShippingCharges | TotalAmount | PaymentStatus | OrderStatus |

---

## 2. Apps Script

1. **Extensions → Apps Script** → paste `google-apps-script/Code.gs` → Save.
2. **Project Settings → Script properties**:

| Property | Value |
|----------|--------|
| `SPREADSHEET_ID` | Sheet ID from URL |
| `SESSION_SECRET` | Long random string |
| `ADMIN_SESSION_SECRET` | Another random string |

3. Run **`setupAllSheetsOnce`** (if you did not run it yet).
4. Run **`setupAdminOnce`** once (edit username/password in `Code.gs` first if you want).
   - Default after run: **User Name** `admin`, **Password** `ChangeThisPassword123`
5. Add **StockInvetory** rows for your products (ID can start at `1`, `2`, …).
6. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Copy the **`.../exec`** URL

Test in browser: open the URL → `{"ok":true,"message":"Daily Dry API is running"}`

After code changes: **Deploy → Manage deployments → Edit → New version**.

---

## 3. Connect the React app

### Local (`.env`)

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

Restart `npm run dev`. The app posts to **`/api`**; Vite proxies to Apps Script.

### Production (Netlify)

Environment variable:

```env
APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

---

## 4. Website ↔ sheet mapping

| Feature | Sheet |
|---------|--------|
| Contact form | `Contact` |
| Register / login | `UserSignUp` |
| Checkout | `Customer&Orders` |
| Stock / shop visibility | `StockInvetory` |
| Product reviews | `Reviews` |
| Admin login | `AdminSingup` |
| Admin orders / status | `Customer&Orders` |
| Admin stock edit | `StockInvetory` |

**Admin UI:** `/admin/login` (User Name + Password)  
**Customer:** `/register` → `/checkout`

**Order status** (admin): `Order Placed`, `Out For Delivery`, `Arrived`, `Delivered`  
**Payment:** `Pending` until Razorpay (P2).

---

## 5. Auto ID

Every append uses **`nextAutoId`**: reads column **ID**, takes the max numeric ID in that tab, adds 1.  
Keep row 1 as headers only; do not merge ID cells.

---

## 6. Costs

Google Sheets + Apps Script + Netlify free tier are enough for low traffic. Offline tabs are for your manual workflow in Excel/Sheets.
