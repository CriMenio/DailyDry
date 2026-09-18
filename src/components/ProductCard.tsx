import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import type { Product } from '../data/products';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductImage from './ProductImage';
import { useInventory } from '../context/InventoryContext';
import { lowStockMessage } from '../config/commerce';

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: 'default' | 'classic';
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product, index = 0, variant = 'default' }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { getStock, isEnabled } = useInventory();
  const stock = getStock(product.id);
  const enabled = isEnabled(product.id);
  const stockLabel = lowStockMessage(stock);
  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);
  const outOfStock = !enabled || stock <= 0;
  const wishlistLocked = outOfStock && !inWishlist;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!enabled || stock <= 0) {
      showToast('This product is currently unavailable', 'error');
      return;
    }
    addToCart(product, 1);
    showToast(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock && !inWishlist) {
      showToast('Out of stock items cannot be added to wishlist', 'error');
      return;
    }
    toggleWishlist(product);
    showToast(
      inWishlist ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`,
      'info'
    );
  };

  return (
    <article
      className={`product-card ${variant === 'classic' ? 'product-card-classic' : 'product-card-pro'}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {product.badge && variant !== 'classic' && <span className="product-badge">{product.badge}</span>}
      <button
        type="button"
        className={`wishlist-btn ${inWishlist ? 'active' : ''} ${wishlistLocked ? 'wishlist-btn-frozen' : ''}`}
        onClick={handleWishlist}
        disabled={wishlistLocked}
        aria-label={
          wishlistLocked
            ? 'Wishlist unavailable — out of stock'
            : inWishlist
              ? 'Remove from wishlist'
              : 'Add to wishlist'
        }
      >
        <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} strokeWidth={1.5} />
      </button>
      <Link to={`/product/${product.id}`} className="product-image-link">
        <ProductImage src={product.image} alt={product.name} />
        {variant !== 'classic' && <div className="product-quick-view">Quick View</div>}
      </Link>
      <div className={`product-info ${variant === 'classic' ? 'product-info-classic' : ''}`}>
        {variant !== 'classic' && <span className="product-weight">{product.weight}</span>}
        <Link to={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <div className="product-rating">
          <StarRating rating={product.rating} />
          <span>({product.reviews})</span>
        </div>
        <div className="product-price">
          <span className="price-current">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="price-original">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        {stockLabel && <p className="product-stock-hint">{stockLabel}</p>}
        <button
          className={`add-cart-btn ${inCart ? 'in-cart' : ''}`}
          onClick={handleAddToCart}
          disabled={!enabled || stock <= 0}
        >
          {variant !== 'classic' && <ShoppingCart size={16} />}
          {inCart ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}
