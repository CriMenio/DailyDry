import AdminRecordIndex from '../AdminRecordIndex';
import { useInventory } from '../../../context/InventoryContext';
import { categoryLabel, formatPrice } from '../../../data/products';
import type { InventoryRow } from '../../../types/api';

type Props = {
  onNew: () => void;
  onEdit: (row: InventoryRow) => void;
  onRefresh: () => void;
  loading: boolean;
};

export default function AdminStockInventoryIndex({ onNew, onEdit, onRefresh, loading }: Props) {
  const { stockRows } = useInventory();

  return (
    <AdminRecordIndex<InventoryRow>
      title="StockInventory"
      description="All products saved in your StockInventory sheet. Open a row to edit by ID, or create a new product."
      loading={loading}
      onRefresh={onRefresh}
      onNew={onNew}
      rows={stockRows}
      rowKey={(r) => r.sheetId}
      onOpen={onEdit}
      emptyTitle="No stock rows yet"
      emptyHint="Add products here — they sync to Google Sheets and appear on the shop when listed."
      columns={[
        { key: 'id', label: 'ID', render: (r) => r.sheetId },
        { key: 'name', label: 'Product', render: (r) => r.productName },
        { key: 'cat', label: 'Category', render: (r) => categoryLabel(r.category) },
        { key: 'seller', label: 'Seller type', render: (r) => r.sellerType || '—' },
        { key: 'mrp', label: 'MRP', render: (r) => (r.mrp ? formatPrice(r.mrp) : '—') },
        { key: 'stock', label: 'Stock', render: (r) => r.stock },
        {
          key: 'status',
          label: 'Shop',
          render: (r) => (
            <span className={r.enabled && r.stock > 0 ? 'pill-ok' : 'pill-out'}>
              {r.enabled ? (r.stock > 0 ? 'Listed' : 'Out of stock') : 'Hidden'}
            </span>
          ),
        },
      ]}
    />
  );
}
