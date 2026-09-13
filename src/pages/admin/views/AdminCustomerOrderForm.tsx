import { FormEvent, useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { adminSaveCustomerOrderOffline } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { AdminField, AdminFormSection, AdminPageHeader, AdminTextarea } from '../AdminFormUi';
import type { CustomerOrderOfflineRow } from '../../../types/api';

const emptyForm = {
  customerName: '',
  mobileNumber: '',
  address: '',
  emailId: '',
  orderNumber: '',
  billNumber: '',
  productDescription: '',
  quantity: '',
  orderAmount: '',
  shippingCharges: '',
  totalAmount: '',
  paymentStatus: '',
  orderStatus: '',
};

type Props = {
  editSheetId: string | null;
  initialRow: CustomerOrderOfflineRow | null;
  onBack: () => void;
  onSaved: () => void;
};

export default function AdminCustomerOrderForm({ editSheetId, initialRow, onBack, onSaved }: Props) {
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(editSheetId);
  const set = (key: keyof typeof emptyForm, value: string) => setForm({ ...form, [key]: value });

  useEffect(() => {
    if (initialRow && editSheetId) {
      setForm({
        customerName: initialRow.customerName,
        mobileNumber: initialRow.mobileNumber,
        address: initialRow.address,
        emailId: initialRow.emailId,
        orderNumber: initialRow.orderNumber,
        billNumber: initialRow.billNumber,
        productDescription: initialRow.productDescription,
        quantity: initialRow.quantity,
        orderAmount: initialRow.orderAmount,
        shippingCharges: initialRow.shippingCharges,
        totalAmount: initialRow.totalAmount,
        paymentStatus: initialRow.paymentStatus,
        orderStatus: initialRow.orderStatus,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editSheetId, initialRow]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminSaveCustomerOrderOffline({
        ...(editSheetId ? { sheetId: editSheetId } : {}),
        ...form,
      });
      showToast(isEdit ? `Updated CustomerOrder ID ${editSheetId}` : 'Row added to CustomerOrder(Offline)');
      onSaved();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-card admin-card-form">
      <div className="admin-form-back-row">
        <button type="button" className="btn btn-outline btn-sm admin-back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to list
        </button>
      </div>
      <AdminPageHeader
        title={isEdit ? `Edit customer order — ID ${editSheetId}` : 'New customer order'}
        description="Manual phone / walk-in orders — CustomerOrder(Offline) tab."
      />

      <form className="admin-pro-form" onSubmit={handleSubmit}>
        <AdminFormSection title="Customer">
          <div className="admin-field-grid">
            <AdminField label="Customer name" value={form.customerName} onChange={(e) => set('customerName', e.target.value)} />
            <AdminField label="Mobile number" value={form.mobileNumber} onChange={(e) => set('mobileNumber', e.target.value)} />
            <AdminField label="Email ID" type="email" value={form.emailId} onChange={(e) => set('emailId', e.target.value)} />
          </div>
          <AdminTextarea label="Address" rows={2} value={form.address} onChange={(e) => set('address', e.target.value)} />
        </AdminFormSection>

        <AdminFormSection title="Order details">
          <div className="admin-field-grid">
            <AdminField label="Order number" value={form.orderNumber} onChange={(e) => set('orderNumber', e.target.value)} />
            <AdminField label="Bill number" value={form.billNumber} onChange={(e) => set('billNumber', e.target.value)} />
            <AdminField
              label="Product description"
              value={form.productDescription}
              onChange={(e) => set('productDescription', e.target.value)}
            />
            <AdminField label="Quantity" value={form.quantity} onChange={(e) => set('quantity', e.target.value)} />
          </div>
        </AdminFormSection>

        <AdminFormSection title="Amounts & status">
          <div className="admin-field-grid">
            <AdminField label="Order amount (₹)" type="number" min={0} value={form.orderAmount} onChange={(e) => set('orderAmount', e.target.value)} />
            <AdminField label="Shipping (₹)" type="number" min={0} value={form.shippingCharges} onChange={(e) => set('shippingCharges', e.target.value)} />
            <AdminField label="Total (₹)" type="number" min={0} value={form.totalAmount} onChange={(e) => set('totalAmount', e.target.value)} />
            <AdminField label="Payment status" value={form.paymentStatus} onChange={(e) => set('paymentStatus', e.target.value)} placeholder="Pending / Paid" />
            <AdminField label="Order status" value={form.orderStatus} onChange={(e) => set('orderStatus', e.target.value)} placeholder="Order Placed" />
          </div>
        </AdminFormSection>

        <div className="admin-form-actions">
          <button type="button" className="btn btn-outline" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-lift" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Update row' : 'Add to CustomerOrder sheet'}
          </button>
        </div>
      </form>
    </div>
  );
}
