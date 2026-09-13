import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Banknote, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { calcShipping } from '../config/commerce';
import { PAYMENT_METHOD_COD } from '../config/orderStatus';
import { formatPrice } from '../data/products';
import { placeOrder } from '../services/api';
import { RequireAuth } from '../components/RequireAuth';
import { useInventory } from '../context/InventoryContext';

function CheckoutContent() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { getStock } = useInventory();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;

  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<typeof PAYMENT_METHOD_COD>(PAYMENT_METHOD_COD);
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container page-content">
        <p>Your cart is empty. <Link to="/shop">Continue shopping</Link></p>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    for (const { product, quantity } of items) {
      const stock = getStock(product.id);
      if (quantity > stock) {
        showToast(`Only ${stock} of ${product.name} available`, 'error');
        return;
      }
    }

    setSubmitting(true);
    try {
      const { order } = await placeOrder({
        address: address.trim(),
        paymentMethod,
        orderAmount: subtotal,
        shippingCharges: shipping,
        totalAmount: total,
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          name: product.name,
          quantity,
          unitPrice: product.price,
        })),
      });
      clearCart();
      showToast(`Order placed! Bill ${order.billNumber}`);
      navigate(`/track-order?order=${encodeURIComponent(order.orderNumber)}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="checkout-page">
      <div className="container checkout-grid">
        <form className="auth-card checkout-form" onSubmit={handleSubmit}>
          <h1>Checkout</h1>
          <p className="auth-sub">Confirm your details. Bill number is assigned when the order is saved.</p>

          <div className="contact-field">
            <label>Customer Name</label>
            <input type="text" value={user?.name || ''} readOnly />
          </div>
          <div className="contact-field">
            <label>Mobile Number</label>
            <input type="text" value={user?.mobile || ''} readOnly />
          </div>
          <div className="contact-field">
            <label>Email ID</label>
            <input type="text" value={user?.email || ''} readOnly />
          </div>
          <div className="contact-field">
            <label htmlFor="address">Delivery Address</label>
            <textarea
              id="address"
              rows={3}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <fieldset className="checkout-payment">
            <legend className="checkout-payment-legend">Payment method</legend>
            <div className="checkout-payment-options">
              <label
                className={`checkout-payment-option ${paymentMethod === PAYMENT_METHOD_COD ? 'is-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={PAYMENT_METHOD_COD}
                  checked={paymentMethod === PAYMENT_METHOD_COD}
                  onChange={() => setPaymentMethod(PAYMENT_METHOD_COD)}
                />
                <span className="checkout-payment-icon" aria-hidden>
                  <Banknote size={22} />
                </span>
                <span className="checkout-payment-copy">
                  <strong>Cash on delivery (COD)</strong>
                  <small>Pay when your order arrives</small>
                </span>
              </label>

              <div className="checkout-payment-option is-disabled" aria-disabled="true">
                <span className="checkout-payment-icon" aria-hidden>
                  <Smartphone size={22} />
                </span>
                <span className="checkout-payment-copy">
                  <strong>UPI</strong>
                  <small>Coming soon — not available yet</small>
                </span>
                <span className="checkout-payment-soon">Soon</span>
              </div>
            </div>
          </fieldset>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Placing order…' : 'Place order (COD)'}
          </button>
        </form>

        <aside className="cart-summary checkout-summary">
          <h3>Order summary</h3>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="summary-row">
              <span>
                {product.name} × {quantity}
              </span>
              <span>{formatPrice(product.price * quantity)}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="shipping-note">Free shipping on orders above ₹999</p>
        </aside>
      </div>
    </section>
  );
}

export default function Checkout() {
  return (
    <RequireAuth>
      <CheckoutContent />
    </RequireAuth>
  );
}
