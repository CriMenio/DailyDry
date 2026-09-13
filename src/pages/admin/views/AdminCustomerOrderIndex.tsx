import AdminRecordIndex from '../AdminRecordIndex';
import type { CustomerOrderOfflineRow } from '../../../types/api';

type Props = {
  rows: CustomerOrderOfflineRow[];
  loading: boolean;
  onRefresh: () => void;
  onNew: () => void;
  onEdit: (row: CustomerOrderOfflineRow) => void;
};

export default function AdminCustomerOrderIndex({
  rows,
  loading,
  onRefresh,
  onNew,
  onEdit,
}: Props) {
  return (
    <AdminRecordIndex<CustomerOrderOfflineRow>
      title="CustomerOrder (offline)"
      description="Manual phone and walk-in orders from CustomerOrder(Offline)."
      loading={loading}
      onRefresh={onRefresh}
      onNew={onNew}
      rows={rows}
      rowKey={(r) => r.sheetId}
      onOpen={onEdit}
      emptyTitle="No offline customer orders yet"
      emptyHint="Create orders taken by phone or in person — saved with an auto ID."
      columns={[
        { key: 'id', label: 'ID', render: (r) => r.sheetId },
        { key: 'name', label: 'Customer', render: (r) => r.customerName || '—' },
        { key: 'mobile', label: 'Mobile', render: (r) => r.mobileNumber || '—' },
        { key: 'order', label: 'Order #', render: (r) => r.orderNumber || '—' },
        { key: 'total', label: 'Total', render: (r) => (r.totalAmount ? `₹${r.totalAmount}` : '—') },
        { key: 'status', label: 'Order status', render: (r) => r.orderStatus || '—' },
      ]}
    />
  );
}
