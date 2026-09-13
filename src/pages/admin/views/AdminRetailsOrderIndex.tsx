import AdminRecordIndex from '../AdminRecordIndex';
import type { RetailOrderRow } from '../../../types/api';

type Props = {
  rows: RetailOrderRow[];
  loading: boolean;
  onRefresh: () => void;
  onNew: () => void;
  onEdit: (row: RetailOrderRow) => void;
};

export default function AdminRetailsOrderIndex({ rows, loading, onRefresh, onNew, onEdit }: Props) {
  return (
    <AdminRecordIndex<RetailOrderRow>
      title="RetailsOrder (offline)"
      description="Field visits and shop orders from the RetailsOrder(Offline) sheet."
      loading={loading}
      onRefresh={onRefresh}
      onNew={onNew}
      rows={rows}
      rowKey={(r) => r.sheetId}
      onOpen={onEdit}
      emptyTitle="No retail orders yet"
      emptyHint="Log offline retail visits and shop orders — each row gets an auto ID in the sheet."
      columns={[
        { key: 'id', label: 'ID', render: (r) => r.sheetId },
        { key: 'shop', label: 'Shop / customer', render: (r) => r.shopNameCustomer || '—' },
        { key: 'mobile', label: 'Mobile', render: (r) => r.mobile || '—' },
        { key: 'product', label: 'Product', render: (r) => r.productName || '—' },
        { key: 'visit', label: 'Visit date', render: (r) => r.visitDate || '—' },
        { key: 'status', label: 'Status', render: (r) => r.status || '—' },
      ]}
    />
  );
}
