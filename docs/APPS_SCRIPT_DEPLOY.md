# Paste Apps Script & get the `/exec` link for Daily Dry

This matches **`DailyDryDB`** (8 tabs: UserSignUp, Customer&Orders, Contact, Reviews, AdminLogin, StockInventory, RetailsOrder(Offline), CustomerOrder(Offline)).

---

## Part 1 — Google Sheet

1. If your data is only in **`DailyDryDB.xlsx`**:  
   [Google Drive](https://drive.google.com) → **New → File upload** → upload the xlsx → **Open with Google Sheets** (or right‑click → **Open with → Google Sheets**).
2. Rename the file to **DailyDryDB** if you like.
3. Confirm **row 1 headers** on each tab match your Excel (especially **Contact**: Email ID before Address).
4. Copy the **Spreadsheet ID** from the browser URL:  
   `https://docs.google.com/spreadsheets/d/`**`THIS_LONG_ID`**`/edit`

---

## Part 2 — Open Apps Script from the sheet

1. With the spreadsheet open: **Extensions → Apps Script**.
2. If you see default `function myFunction() {}`, **select all** and delete it.
3. On your PC, open the project file:  
   **`google-apps-script/Code.gs`** (in the DailyDry repo).
4. **Select all** (Ctrl+A) → **Copy** → paste into the Apps Script editor.
5. Click **Save** (disk icon). Rename the project (e.g. **Daily Dry API**).

---

## Part 3 — Script properties (required)

1. Left sidebar → **Project settings** (gear).
2. Scroll to **Script properties** → **Add script property**.

Add these three:

| Property | Value |
|----------|--------|
| `SPREADSHEET_ID` | Paste the ID from Part 1 |
| `SESSION_SECRET` | Any long random string (e.g. 32+ characters) |
| `ADMIN_SESSION_SECRET` | Another different random string |

3. **Save** each property.

> If the sheet is already created from Excel, you **do not** need to run `setupAllSheetsOnce` (that would overwrite headers).

---

## Part 4 — Create admin login (run once)

1. In the Apps Script toolbar, open the function dropdown (starts as `doPost`).
2. Choose **`setupAdminOnce`**.
3. Click **Run** ▶.
4. First time: **Review permissions** → Google account → **Advanced** → **Allow**.
5. Check tab **AdminLogin** — new row with hashed password.  
   Default website admin: **User Name** `admin`, **Password** `ChangeThisPassword123`.

---

## Part 5 — Stock (before testing shop)

On tab **StockInventory**, row 1 headers should include **Category**. Recommended order (matches most sheets):

| ID | Category | ProductName | MRP | Total Stock Remaning | ImagePath | Remarks1 | Remarks2 |

- **Category:** shop filter slug — `almonds`, `cashews`, `raisins`, `muesli`, `dry-fruit-mix`, `walnuts` (admin form normalizes labels).
- **ProductName:** name shown on the website.
- **Remarks1** = `DISABLED` to hide from the shop.

Example row:

| ID | Category | ProductName | MRP | Total Stock Remaning | ImagePath | Remarks1 | Remarks2 |
|----|----------|-------------|-----|----------------------|-----------|----------|----------|
| 1 | almonds | Premium Almonds 250g | 399 | 50 | /media/products/... | | |

The script reads your **header row** automatically, so Category before or after ProductName both work after you deploy the latest `Code.gs`.

---

## Part 6 — Deploy → get the link for `.env`

1. Top right: **Deploy → New deployment**.
2. Click the **gear** next to “Select type” → choose **Web app**.
3. Set:
   - **Description:** e.g. `Daily Dry API v1`
   - **Execute as:** Me (`your@gmail.com`)
   - **Who has access:** **Anyone**
4. Click **Deploy**.
5. **Authorize** if asked again.
6. Copy the **Web app URL**. It must end with **`/exec`**, for example:  
   `https://script.google.com/macros/s/AKfycbx.../exec`

**Test:** paste that URL in a new browser tab. You should see:

```json
{"ok":true,"message":"Daily Dry API is running"}
```

**After you change `Code.gs` later:**  
**Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy** (same URL keeps working).

### Switch to a **new** Google Sheet (same Web app URL)

The **`/exec` link does not change** when you change spreadsheets. Only Apps Script **Script properties** change.

1. Upload or create your new workbook in Google Drive → **Open with Google Sheets**.
2. Copy the new **Spreadsheet ID** from the URL:  
   `https://docs.google.com/spreadsheets/d/`**`NEW_ID_HERE`**`/edit`
3. Apps Script (same project as your Web app) → **Project settings** → **Script properties** → edit **`SPREADSHEET_ID`** → paste the **new** ID → Save.
4. On the new sheet, either:
   - Run **`setupAllSheetsOnce`** once (creates all 8 tabs + headers), then **`setupAdminOnce`** for admin login, **or**
   - Import from Excel and confirm tab names match `Code.gs` (see `docs/GOOGLE_SHEETS_SETUP.md`).
5. Add **StockInventory** rows and (if needed) re-import old **Customer&Orders** / **UserSignUp** data.
6. **Deploy → Manage deployments → New version → Deploy** (after pasting latest `Code.gs`).
7. **`.env`** — keep the same `VITE_APPS_SCRIPT_URL` (your `/exec` URL). No change unless you created a **new** Apps Script deployment.

Your site URL for the API:  
`https://script.google.com/macros/s/AKfycbxrzEPVUjv3NCYJNd7IAcPS2NQc3c0LP7VBErkr06YDviFwqzsCYASRAlsQxAtXftbX/exec`  
Opening it in a browser should show `{"ok":true,"message":"Daily Dry API is running"}`.

---

## Part 7 — Configure the Daily Dry project

### Local development

1. In `f:\PersonalRepo\DailyDry`, copy:

   ```bash
   copy .env.example .env
   ```

2. Edit **`.env`**:

   ```env
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

   Paste your real URL from Part 6.

3. Restart the dev server:

   ```bash
   npm run dev
   ```

4. Test: **Register**, **Contact**, **Admin** at `/admin/login`.

The site sends requests to **`http://localhost:5173/api`**; Vite proxies them to your Apps Script URL.

### Production (Netlify + custom domain)

In **Netlify → Site settings → Environment variables**, add:

```env
APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

(Same URL as above; variable name is **`APPS_SCRIPT_URL`**, not `VITE_…`.)

---

## Which tab the website uses

| Website feature | Sheet tab |
|-----------------|-----------|
| Contact form | Contact |
| Register / login | UserSignUp |
| Checkout & admin orders | Customer&Orders |
| Track order (guest lookup) | Customer&Orders — needs `trackOrder` in deployed `Code.gs` |
| Reviews | Reviews |
| Admin login | AdminLogin |
| Stock | StockInventory |
| *(manual only)* | RetailsOrder(Offline), CustomerOrder(Offline) |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Missing sheet tab: …` | Tab name must match exactly (e.g. `Customer&Orders`, `AdminLogin`). |
| `Set SPREADSHEET_ID` | Add script property from Part 3. |
| Invalid response on register | Redeploy web app (new version); check `.env` URL ends with `/exec`. |
| `Unknown action: trackOrder` (or `getFeaturedReviews`) | Saving in the editor is not enough — **Deploy → Manage deployments → Edit → New version → Deploy** after pasting latest `Code.gs`. |
| Product unavailable | Add row in **StockInventory** with exact **ProductName**. |
