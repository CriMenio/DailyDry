# Razorpay (test mode) setup

Online checkout uses **Razorpay test keys** on Netlify and the same secret in **Google Apps Script** so paid orders cannot be faked.

## 1. Netlify environment variables

| Variable | Notes |
|----------|--------|
| `RAZORPAY_KEY_ID` | Test Key Id (`rzp_test_…`) |
| `RAZORPAY_KEY_SECRET` | Test Key Secret — mark as secret; same value in each deploy context |
| `VITE_RAZORPAY_KEY_ID` | Same as Key Id (embedded in the frontend build) |
| `APPS_SCRIPT_URL` | Already set |

After adding or changing variables, **Trigger deploy** so the site and Functions rebuild.

## 2. Google Apps Script

1. Open your Apps Script project → **Project settings** → **Script properties**.
2. Add **`RAZORPAY_KEY_SECRET`** with the **same test Key Secret** as Netlify (not the Key Id).
3. Copy updated **`Code.gs`** from this repo into the cloud editor if you have not already.
4. **Deploy** → **Manage deployments** → edit Web app → **New version** → **Deploy**.

Without `RAZORPAY_KEY_SECRET` in Script properties, online orders fail with “Online payment is not configured”.

## 3. Local development

In `.env` (not committed):

```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/…/exec
```

Razorpay **create-order** and **verify** run on Netlify Functions (`/razorpay/create-order`, `/razorpay/verify`). They are **not** available through the Vite-only dev proxy.

- Test **COD** locally with `npm run dev`.
- Test **online payment** on the deployed Netlify site, or run **`netlify dev`** with the same env vars as production.

## 4. Test a payment

1. Checkout → **Pay online (UPI / card)** → **Pay online (test)**.
2. Razorpay test checkout opens. Use [Razorpay test cards/UPI](https://razorpay.com/docs/payments/payments/test-card-upi-details/).
3. After success, the order is saved with **Payment Status** = `Paid` in the sheet.

## 5. Go live (later)

Switch Razorpay dashboard to **Live mode**, replace all keys with `rzp_live_…`, update Netlify + Script properties, redeploy Apps Script and Netlify.
