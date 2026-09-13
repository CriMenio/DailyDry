import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../data/products';

function WishlistPageHero({ count }: { count: number }) {
  return (
    <div className="page-hero-compact page-hero-wishlist">
      <div className="container page-hero-compact-inner">
        <div className="page-hero-compact-main page-hero-reveal">
          <Heart size={22} className="page-hero-compact-icon" aria-hidden />
          <div>
            <span className="page-hero-eyebrow">Saved for later</span>
            <h1>My Wishlist</h1>
          </div>
        </div>
        {count > 0 && (
          <span className="page-hero-chip page-hero-reveal page-hero-reveal-delay">
            {count} item{count !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (product: (typeof items)[0]) => {
    addToCart(product);
    showToast(`${product.name} added to cart`);
  };

  if (items.length === 0) {
    return (
      <>
        <WishlistPageHero count={0} />
        <div className="page-content page-content-compact">
          <div className="container">
            <div className="empty-state empty-state-animate">
              <Heart size={56} strokeWidth={1.25} />
              <h2>Your wishlist is empty</h2>
              <p>Save your favorite products here for later.</p>
              <Link to="/shop" className="btn btn-primary btn-lift">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <WishlistPageHero count={items.length} />

      <div className="page-content page-content-compact">
        <div className="container">
          <div className="product-grid wishlist-grid-animate">
            {items.map((product, index) => (
              <article
                key={product.id}
                className="product-card product-card-pro"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <button
                  className="wishlist-btn active"
                  onClick={() => {
                    removeFromWishlist(product.id);
                    showToast(`${product.name} removed from wishlist`, 'info');
                  }}
                  aria-label="Remove from wishlist"
                >
                  <Heart size={18} fill="currentColor" />
                </button>
                <Link to={`/product/${product.id}`} className="product-image-link">
                  <img src={product.image} alt={product.name} className="product-image" />
                </Link>
                <div className="product-info">
                  <Link to={`/product/${product.id}`} className="product-name">
                    {product.name}
                  </Link>
                  <div className="product-price">
                    <span className="price-current">{formatPrice(product.price)}</span>
                  </div>
                  <button className="add-cart-btn" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
