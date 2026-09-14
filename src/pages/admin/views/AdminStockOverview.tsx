import { useMemo } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Ban,
  RefreshCw,
  TrendingUp,
  ShoppingBag,
  Truck,
  PackageCheck,
} from 'lucide-react';
import { formatPrice, inventoryRowToProduct } from '../../../data/products';
import { useInventory } from '../../../context/InventoryContext';
import ProductImage from '../../../components/ProductImage';
import { lowStockMessage } from '../../../config/commerce';
import { countOnlineOrdersByStatus } from '../../../config/orderStatus';
import type { OrderRecord } from '../../../types/api';
import { AdminPageHeader } from '../AdminFormUi';

type Props = {
  onRefresh: () => void;
  loading: boolean;
  orders: OrderRecord[];
  ordersLoading: boolean;
};

export default function AdminStockOverview({ onRefresh, loading, orders, ordersLoading }: Props) {
  const { stockRows } = useInventory();

  const rows = useMemo(() => {
    return stockRows.map((row) => {
      const product = inventoryRowToProduct(row);
      const listed = row.enabled && row.stock > 0;
      return {
        product,
        stock: row.stock,
        mrp: row.mrp,
        listed,
        low: row.stock > 0 && row.stock < 10,
        out: row.stock <= 0 || !row.enabled,
      };
    });
  }, [stockRows]);

  const stats = useMemo(() => {
    const total = rows.length;
    const inStock = rows.filter((r) => r.listed).length;
    const low = rows.filter((r) => r.low && r.listed).length;
    const out = rows.filter((r) => r.out).length;
    const units = rows.reduce((sum, r) => sum + Math.max(0, r.stock), 0);
    return { total, inStock, low, out, units };
  }, [rows]);

  const orderStats = useMemo(() => countOnlineOrdersByStatus(orders), [orders]);

  const maxStock = Math.max(10, ...rows.map((r) => r.stock));
  const busy = loading || ordersLoading;

  return (
    <div className="admin-dashboard">
      <div className="admin-card admin-card-flush">
        <div className="admin-overview-toolbar">
          <AdminPageHeader
            title="Stock dashboard"
            description="Products from StockInventory and online order counts from website checkout (Customer&Orders)."
          />
          <button type="button" className="btn btn-outline btn-sm" onClick={onRefresh} disabled={busy}>
            <RefreshCw size={16} className={busy ? 'spin-icon' : ''} />
            Refresh data
          </button>
        </div>
      </div>

      <div className="admin-card admin-card-flush admin-overview-orders-section">
        <h3 className="admin-card-title admin-overview-section-title">Online orders (website)</h3>
        <p className="admin-overview-section-hint">
          One row per checkout order. Update status under <strong>Online orders</strong> in the menu.
        </p>
        <div className="admin-stat-grid admin-stat-grid-orders">
          <div className="admin-stat-card admin-stat-accent">
            <ShoppingBag size={22} />
            <div>
              <strong>{ordersLoading ? '…' : orderStats.total}</strong>
              <span>Total orders</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <Package size={22} />
            <div>
              <strong>{ordersLoading ? '…' : orderStats.placed}</strong>
              <span>Order placed</span>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-warn">
            <Truck size={22} />
            <div>
              <strong>{ordersLoading ? '…' : orderStats.dispatch}</strong>
              <span>Dispatch</span>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-warn">
            <Truck size={22} />
            <div>
              <strong>{ordersLoading ? '…' : orderStats.outForDelivery}</strong>
              <span>Out for delivery</span>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-ok">
            <PackageCheck size={22} />
            <div>
              <strong>{ordersLoading ? '…' : orderStats.delivered}</strong>
              <span>Delivered</span>
            </div>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="admin-card empty-state">
          <h3>No products in StockInventory yet</h3>
          <p>Use the StockInventory tab to add your first product — it will appear here and on the shop.</p>
        </div>
      ) : (
        <>
          <div className="admin-stat-grid">
            <div className="admin-stat-card">
              <Package size={22} />
              <div>
                <strong>{stats.total}</strong>
                <span>Sheet products</span>
              </div>
            </div>
            <div className="admin-stat-card admin-stat-ok">
              <CheckCircle size={22} />
              <div>
                <strong>{stats.inStock}</strong>
                <span>Live on shop</span>
              </div>
            </div>
            <div className="admin-stat-card admin-stat-warn">
              <AlertTriangle size={22} />
              <div>
                <strong>{stats.low}</strong>
                <span>Low stock</span>
              </div>
            </div>
            <div className="admin-stat-card admin-stat-muted">
              <Ban size={22} />
              <div>
                <strong>{stats.out}</strong>
                <span>Hidden / out</span>
              </div>
            </div>
            <div className="admin-stat-card admin-stat-accent">
              <TrendingUp size={22} />
              <div>
                <strong>{stats.units}</strong>
                <span>Total units</span>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="admin-card-title">Product inventory</h3>
            <div className="admin-product-grid">
              {rows.map(({ product, stock, mrp, listed, low, out }) => {
                const hint = lowStockMessage(stock);
                const barPct = Math.min(100, Math.round((stock / maxStock) * 100));
                return (
                  <article
                    key={product.id}
                    className={`admin-product-card ${out ? 'is-out' : ''} ${low ? 'is-low' : ''}`}
                  >
                    <div className="admin-product-card-img">
                      <ProductImage src={product.image} alt={product.name} />
                    </div>
                    <div className="admin-product-card-body">
                      <h4>{product.name}</h4>
                      <p className="admin-product-meta">MRP {formatPrice(mrp)}</p>
                      <div className="admin-stock-bar-wrap">
                        <div className="admin-stock-bar" style={{ width: `${barPct}%` }} />
                      </div>
                      <div className="admin-product-foot">
                        <span className="admin-stock-qty">{stock} units</span>
                        <span className={`admin-stock-pill ${listed ? 'pill-ok' : out ? 'pill-out' : 'pill-warn'}`}>
                          {listed ? 'Live' : 'Off'}
                        </span>
                      </div>
                      {hint && <p className="admin-stock-hint">{hint}</p>}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
