import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import { calcShipping, FREE_SHIPPING_MIN } from '../config/commerce';
import { useInventory } from '../context/InventoryContext';

function CartPageHero({ itemCount }: { itemCount: number }) {
  return (
    <div className="page-hero-compact page-hero-cart">
      <div className="container page-hero-compact-inner">
        <div className="page-hero-compact-main page-hero-reveal">
          <ShoppingBag size={22} className="page-hero-compact-icon" aria-hidden />
          <div>
            <span className="page-hero-eyebrow">Your bag</span>
            <h1>Shopping Cart</h1>
          </div>
        </div>
        {itemCount > 0 && (
          <span className="page-hero-chip page-hero-reveal page-hero-reveal-delay">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const { getStock } = useInventory();
  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <>
        <CartPageHero itemCount={0} />
        <div className="page-content page-content-compact">
          <div className="container">
            <div className="empty-state empty-state-animate">
              <ShoppingBag size={56} strokeWidth={1.25} />
              <h2>Your cart is empty</h2>
              <p>Looks like you haven&apos;t added anything to your cart yet.</p>
              <Link to="/shop" className="btn btn-primary btn-lift">
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CartPageHero itemCount={totalItems} />

      <div className="page-content page-content-compact">
        <div className="container cart-layout cart-layout-animate">
          <div className="cart-items">
            {items.map(({ product, quantity }, index) => (
              <div
                key={product.id}
                className="cart-item"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} className="cart-item-img" />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/product/${product.id}`}>
                    <h3>{product.name}</h3>
                  </Link>
                  <p>
                    {product.weight} · {formatPrice(product.price)} each
                  </p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)}>−</button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, Math.min(getStock(product.id), quantity + 1))}
                      disabled={quantity >= getStock(product.id)}
                    >
                      +
                    </button>
                  </div>
                  <strong>{formatPrice(product.price * quantity)}</strong>
                  <button className="remove-btn" onClick={() => removeFromCart(product.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary page-hero-reveal page-hero-reveal-delay">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Free shipping on orders above ₹{FREE_SHIPPING_MIN}
              </p>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            {isAuthenticated ? (
              <Link to="/checkout" className="btn btn-primary btn-block" style={{ marginTop: '1.25rem' }}>
                Proceed to Checkout
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary btn-block" style={{ marginTop: '1.25rem' }}>
                Sign up to checkout
              </Link>
            )}
            <p className="checkout-note">
              Orders are saved to your Google Sheet backend when API is configured.
            </p>
            <Link to="/shop" className="btn btn-outline btn-block" style={{ marginTop: '0.75rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
