import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Store } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { categories, getShopProducts } from '../data/products';
import { useInventory } from '../context/InventoryContext';

type SortOption = 'popular' | 'price-low' | 'price-high' | 'rating';

function ShopPageHero({ productCount }: { productCount: number }) {
  const countLabel =
    productCount === 1 ? '1 product' : `${productCount} products`;

  return (
    <div className="page-hero-compact page-hero-shop">
      <div className="container page-hero-compact-inner">
        <div className="page-hero-compact-main page-hero-reveal">
          <Store size={22} className="page-hero-compact-icon" aria-hidden />
          <div>
            <span className="page-hero-eyebrow">Premium dry fruits &amp; nuts</span>
            <h1>Shop All Products</h1>
          </div>
        </div>
        <span className="page-hero-chip page-hero-reveal page-hero-reveal-delay">
          {countLabel}
        </span>
      </div>
    </div>
  );
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortOption>('popular');
  const { isEnabled, getStock } = useInventory();

  const categoryFilter = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';

  const filteredProducts = useMemo(() => {
    let result = [...getShopProducts()].filter((p) => isEnabled(p.id) && getStock(p.id) > 0);

    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [categoryFilter, searchQuery, sort, isEnabled, getStock]);

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    setSearchParams(params);
  };

  return (
    <>
      <ShopPageHero productCount={filteredProducts.length} />

      <div className="page-content page-content-compact">
        <div className="container shop-layout">
          <aside className="shop-filters" aria-label="Product filters">
            <h3 className="shop-filters-title">Filters</h3>
            <div className="filter-group">
              <span className="filter-group-label" id="shop-category-label">
                Category
              </span>
              <div
                className="category-filter-toggle"
                role="group"
                aria-labelledby="shop-category-label"
              >
                <button
                  type="button"
                  className={`category-toggle-btn${categoryFilter === 'all' ? ' active' : ''}`}
                  aria-pressed={categoryFilter === 'all'}
                  onClick={() => setCategory('all')}
                >
                  All Products
                </button>
                {categories.map((cat) => {
                  const active = categoryFilter === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`category-toggle-btn${active ? ' active' : ''}`}
                      aria-pressed={active}
                      onClick={() => setCategory(cat.slug)}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div>
            <div className="shop-toolbar">
              <p>{filteredProducts.length} products found</p>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            {filteredProducts.length > 0 ? (
              <div className="product-grid wishlist-grid-animate">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="empty-state empty-state-animate">
                <h2>No products found</h2>
                <p>Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
