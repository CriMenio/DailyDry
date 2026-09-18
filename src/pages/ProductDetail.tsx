import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, Star, ShoppingBag, ChevronRight } from 'lucide-react';
import { getProductById, formatPrice, getShopProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductImage from '../components/ProductImage';
import ProductGrid from '../components/ProductGrid';
import { freeShippingThresholdLabel, lowStockMessage } from '../config/commerce';
import { useInventory } from '../context/InventoryContext';
import ProductReviews from '../components/ProductReviews';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { getStock, isEnabled, storeSettings } = useInventory();
  const stock = product ? getStock(product.id) : 0;
  const enabled = product ? isEnabled(product.id) : false;
  const stockLabel = product ? lowStockMessage(stock) : null;

  if (!product) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <h2>Product not found</h2>
          <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);
  const outOfStock = !enabled || stock <= 0;
  const wishlistLocked = outOfStock && !inWishlist;
  const related = getShopProducts().filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!enabled || stock <= 0) {
      showToast('This product is currently unavailable', 'error');
      return;
    }
    const qty = Math.min(quantity, stock);
    addToCart(product, qty);
    showToast(`${qty}x ${product.name} added to cart`);
  };

  const handleWishlist = () => {
    if (outOfStock && !inWishlist) {
      showToast('Out of stock items cannot be added to wishlist', 'error');
      return;
    }
    toggleWishlist(product);
    showToast(
      inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      'info'
    );
  };

  return (
    <>
      <div className="page-content">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <Link to="/shop">Shop</Link>
            <ChevronRight size={14} />
            <span>{product.name}</span>
          </nav>

          <div className="product-detail">
            <div className="product-detail-image">
              <ProductImage src={product.image} alt={product.name} loading="eager" />
            </div>

            <div className="product-detail-info">
              {product.badge && (
                <span className="product-badge" style={{ position: 'static', display: 'inline-block', marginBottom: '0.75rem' }}>
                  {product.badge}
                </span>
              )}
              <h1>{product.name}</h1>
              <div className="product-rating">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill={s <= Math.round(product.rating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span>{product.rating} ({product.reviews} reviews)</span>
              </div>
              <div className="product-price" style={{ marginTop: '1rem' }}>
                <span className="price-current" style={{ fontSize: '1.75rem' }}>
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="price-original">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.7 }}>
                {product.description}
              </p>

              <div className="detail-quantity" style={{ marginTop: '1.5rem' }}>
                <label>Quantity:</label>
                <div className="quantity-control">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(stock, quantity + 1))} disabled={quantity >= stock}>+</button>
                </div>
              </div>

              {stockLabel && <p className="product-stock-hint">{stockLabel}</p>}

              <div className="product-detail-actions">
                <button
                  className={`btn btn-primary ${inCart ? '' : ''}`}
                  onClick={handleAddToCart}
                  style={{ flex: 1, minWidth: '200px' }}
                  disabled={!enabled || stock <= 0}
                >
                  <ShoppingBag size={18} />
                  {inCart ? 'Add More to Cart' : 'Add to Cart'}
                </button>
                <button
                  type="button"
                  className={`btn btn-outline ${inWishlist ? 'active' : ''}`}
                  onClick={handleWishlist}
                  disabled={wishlistLocked}
                  style={{
                    color: inWishlist ? '#e74c3c' : undefined,
                    borderColor: inWishlist ? '#e74c3c' : undefined,
                    opacity: wishlistLocked ? 0.55 : undefined,
                    cursor: wishlistLocked ? 'not-allowed' : undefined,
                  }}
                >
                  <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
                  {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              <div className="product-meta">
                <span><strong>Weight:</strong> {product.weight}</span>
                <span><strong>Category:</strong> {product.category.replace('-', ' ')}</span>
                <span><strong>Availability:</strong> {!enabled || stock <= 0 ? 'Out of Stock' : 'In Stock'}</span>
                <span><strong>Free Shipping:</strong> On orders above ₹{freeShippingThresholdLabel(storeSettings)}</span>
              </div>
            </div>
          </div>

          <ProductReviews productId={product.id} />

          {related.length > 0 && (
            <div style={{ marginTop: '4rem' }}>
              <ProductGrid
                products={related}
                title="You May Also Like"
                subtitle=""
                showViewAll={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
