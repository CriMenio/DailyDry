import type { PolicySection } from '../components/PolicyPage';
import {
  DEFAULT_STORE_SHIPPING,
  STORE_ADDRESS,
  STORE_EMAIL,
  STORE_PHONE_DISPLAY,
} from '../config/commerce';

const business = 'Daily Dry';
const website = 'https://dailydry.in';

export const termsSections: PolicySection[] = [
  {
    heading: '1. Introduction',
    body: [
      `These Terms and Conditions ("Terms") govern your use of ${website} and purchase of products from ${business}. By placing an order or using our website, you agree to these Terms.`,
      `If you do not agree, please do not use the website or complete a purchase.`,
    ],
  },
  {
    heading: '2. Products & pricing',
    body: [
      `We sell premium dry fruits, nuts, and related food products. Product descriptions, images, weights, and prices are shown on our Shop page. Prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.`,
      `We may correct pricing or listing errors before accepting an order. Available stock is shown at checkout; we reserve the right to cancel orders if an item is unavailable.`,
    ],
  },
  {
    heading: '3. Orders & payment',
    body: [
      `An order is confirmed when you receive an order confirmation (on screen, email, or WhatsApp as applicable). We accept Cash on Delivery (COD) and online payments via Razorpay (UPI, cards, and other methods shown at checkout).`,
      `You must provide accurate name, mobile number, and delivery address. We are not responsible for failed delivery due to incorrect contact or address details.`,
    ],
  },
  {
    heading: '4. Delivery',
    body: [
      `Delivery timelines depend on your location and order volume. Shipping charges and free-shipping thresholds are described in our Shipping Policy.`,
      `Risk of loss passes to you upon delivery to the address you provide.`,
    ],
  },
  {
    heading: '5. Returns, refunds & cancellations',
    body: [
      `Eligible returns, cancellations, and refunds are described in our Cancellation & Refund Policy. Food products may have limited return eligibility once opened or consumed.`,
    ],
  },
  {
    heading: '6. Accounts',
    body: [
      `You may register an account to track orders. You are responsible for keeping your login credentials confidential and for activity under your account.`,
    ],
  },
  {
    heading: '7. Limitation of liability',
    body: [
      `To the extent permitted by law, ${business} is not liable for indirect or consequential damages arising from use of the website or products. Our liability for any order is limited to the amount you paid for that order.`,
    ],
  },
  {
    heading: '8. Governing law',
    body: [
      `These Terms are governed by the laws of India. Disputes are subject to the courts at Mumbai, Maharashtra, unless mandatory consumer protection law provides otherwise.`,
    ],
  },
  {
    heading: '9. Contact',
    body: [
      `${business}, ${STORE_ADDRESS}. Phone: ${STORE_PHONE_DISPLAY}. Email: ${STORE_EMAIL}.`,
    ],
  },
];

export const privacySections: PolicySection[] = [
  {
    heading: '1. Who we are',
    body: [
      `${business} operates ${website} and processes personal data to fulfil orders and provide customer support.`,
    ],
  },
  {
    heading: '2. Information we collect',
    body: [
      `When you register, checkout, or contact us, we may collect your name, mobile number, email (if provided), delivery address, order details, and messages you send us.`,
      `For online payments, payment processing is handled by Razorpay. We do not store your full card or UPI credentials on our servers. We may receive payment status, transaction references, and amounts from Razorpay to verify and record orders.`,
      `We may collect basic technical data such as browser type and pages visited to keep the site secure and improve performance.`,
    ],
  },
  {
    heading: '3. How we use your information',
    body: [
      `We use your information to process orders, arrange delivery, communicate order updates, respond to enquiries, prevent fraud, and comply with legal obligations.`,
      `With your consent where required, we may send promotional messages about new products or offers. You can opt out by contacting us.`,
    ],
  },
  {
    heading: '4. Sharing of information',
    body: [
      `We share data only as needed with delivery partners, payment providers (Razorpay), and service providers that help us run the website and backend systems. We do not sell your personal data.`,
      `We may disclose information if required by law or to protect our rights, customers, or the public.`,
    ],
  },
  {
    heading: '5. Data retention & security',
    body: [
      `We retain order and account information as long as needed for business, accounting, and legal purposes. We use reasonable technical and organisational measures to protect your data.`,
    ],
  },
  {
    heading: '6. Your rights',
    body: [
      `You may request access, correction, or deletion of your personal data where applicable under Indian law. Contact us using the details below. We may need to verify your identity before acting on a request.`,
    ],
  },
  {
    heading: '7. Cookies',
    body: [
      `The website may use local storage or cookies for login sessions, cart contents, and preferences. You can control cookies through your browser settings; some features may not work if cookies are disabled.`,
    ],
  },
  {
    heading: '8. Contact',
    body: [
      `For privacy-related questions: ${STORE_EMAIL}, ${STORE_PHONE_DISPLAY}, ${STORE_ADDRESS}.`,
    ],
  },
];

const { shippingFee, freeShippingMin } = DEFAULT_STORE_SHIPPING;

export const shippingSections: PolicySection[] = [
  {
    heading: '1. Delivery areas',
    body: [
      `${business} delivers across India to addresses you provide at checkout. Delivery availability may vary for remote or restricted locations; we will contact you if we cannot service your pin code.`,
    ],
  },
  {
    heading: '2. Shipping charges',
    body: [
      `A flat delivery charge of ₹${shippingFee} applies to orders with a product subtotal of ₹${freeShippingMin} or below.`,
      `Orders with a product subtotal above ₹${freeShippingMin} qualify for free shipping (₹0 delivery charge). Shipping fees shown at checkout are final for that order.`,
    ],
  },
  {
    heading: '3. Processing & delivery time',
    body: [
      `Orders are typically processed within 1–2 business days after confirmation. Delivery usually takes 3–7 business days depending on location and courier capacity. Delays may occur during holidays, weather events, or high demand.`,
    ],
  },
  {
    heading: '4. Order tracking',
    body: [
      `You can track order status on our Track Order page using your order details. We may also share updates via phone or WhatsApp.`,
    ],
  },
  {
    heading: '5. Damaged or missing items',
    body: [
      `If your package arrives damaged or items are missing, contact us within 48 hours of delivery with photos of the package and products. We will review and offer replacement or refund as per our Refund Policy.`,
    ],
  },
  {
    heading: '6. Contact',
    body: [
      `Shipping enquiries: ${STORE_EMAIL}, ${STORE_PHONE_DISPLAY}.`,
    ],
  },
];

export const refundSections: PolicySection[] = [
  {
    heading: '1. Cancellation before dispatch',
    body: [
      `You may request cancellation before the order is dispatched by contacting us with your order number. If payment was collected online, an approved cancellation will be refunded to the original payment method within 5–10 business days, subject to bank or Razorpay processing times.`,
      `Cash on Delivery orders cancelled before dispatch incur no charge.`,
    ],
  },
  {
    heading: '2. Cancellation after dispatch',
    body: [
      `Once an order is out for delivery, cancellation may not be possible. If you refuse delivery, return shipping and handling costs may apply and refunds may be reduced accordingly.`,
    ],
  },
  {
    heading: '3. Returns & refunds (eligible cases)',
    body: [
      `Because we sell food products, we accept returns or refunds only for: (a) wrong item shipped, (b) significantly damaged or defective sealed products reported within 48 hours of delivery with proof, or (c) expired products delivered (if applicable batch/date is shown).`,
      `Opened, partially consumed, or improperly stored products are not eligible for return unless required by applicable consumer law.`,
    ],
  },
  {
    heading: '4. Refund method & timeline',
    body: [
      `Approved refunds for online payments are processed to the original payment method via Razorpay. COD refunds, where applicable, may be issued via UPI or bank transfer after verification. Refunds typically reflect within 5–10 business days after approval.`,
    ],
  },
  {
    heading: '5. Bulk & custom orders',
    body: [
      `Bulk or custom orders may have separate terms agreed at the time of quotation. Contact us before payment for bulk order cancellation rules.`,
    ],
  },
  {
    heading: '6. How to request cancellation or refund',
    body: [
      `Email ${STORE_EMAIL} or call ${STORE_PHONE_DISPLAY} with your order number, reason, and photos if the product is damaged. We will confirm eligibility and next steps within 2 business days.`,
    ],
  },
];
