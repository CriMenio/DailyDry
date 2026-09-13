import { FormEvent, useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { adminSaveRetailOrder } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { AdminField, AdminFormSection, AdminPageHeader, AdminTextarea } from '../AdminFormUi';
import type { RetailOrderRow } from '../../../types/api';

const emptyForm = {
  billNo: '',
  shopNameCustomer: '',
  mobile: '',
  whatsApp: '',
  area: '',
  address: '',
  shopType: '',
  visitDate: '',
  status: '',
  productName: '',
  qty: '',
  alFree: '',
  caFree: '',
  orderAmount: '',
  payment: '',
  paymentStatus: '',
  paymentDueDate: '',
  lastFollowUp: '',
  remarks1: '',
  remarks2: '',
};

function rowToForm(row: RetailOrderRow) {
  return {
    billNo: row.billNo,
    shopNameCustomer: row.shopNameCustomer,
    mobile: row.mobile,
    whatsApp: row.whatsApp,
    area: row.area,
    address: row.address,
    shopType: row.shopType,
    visitDate: row.visitDate,
    status: row.status,
    productName: row.productName,
    qty: row.qty,
    alFree: row.alFree,
    caFree: row.caFree,
    orderAmount: row.orderAmount,
    payment: row.payment,
    paymentStatus: row.paymentStatus,
    paymentDueDate: row.paymentDueDate,
    lastFollowUp: row.lastFollowUp,
    remarks1: row.remarks1,
    remarks2: row.remarks2,
  };
}

type Props = {
  editSheetId: string | null;
  initialRow: RetailOrderRow | null;
  onBack: () => void;
  onSaved: () => void;
};

export default function AdminRetailsOrderForm({ editSheetId, initialRow, onBack, onSaved }: Props) {
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(editSheetId);
  const set = (key: keyof typeof emptyForm, value: string) => setForm({ ...form, [key]: value });

  useEffect(() => {
    if (initialRow && editSheetId) setForm(rowToForm(initialRow));
    else setForm(emptyForm);
  }, [editSheetId, initialRow]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminSaveRetailOrder({
        ...(editSheetId ? { sheetId: editSheetId } : {}),
        ...form,
      });
      showToast(isEdit ? `Updated RetailsOrder ID ${editSheetId}` : 'Row added to RetailsOrder(Offline)');
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
        title={isEdit ? `Edit retail order — ID ${editSheetId}` : 'New retail order'}
        description="Field visit / shop order — saved to RetailsOrder(Offline) with auto ID on create."
      />

      <form className="admin-pro-form" onSubmit={handleSubmit}>
        <AdminFormSection title="Visit & shop">
          <div className="admin-field-grid">
            <AdminField label="Bill no." value={form.billNo} onChange={(e) => set('billNo', e.target.value)} />
            <AdminField
              label="Shop / customer name"
              value={form.shopNameCustomer}
              onChange={(e) => set('shopNameCustomer', e.target.value)}
            />
            <AdminField label="Mobile" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} />
            <AdminField
              label="WhatsApp"
              hint="yes / no"
              value={form.whatsApp}
              onChange={(e) => set('whatsApp', e.target.value)}
            />
            <AdminField label="Area" value={form.area} onChange={(e) => set('area', e.target.value)} />
            <AdminField label="Shop type" value={form.shopType} onChange={(e) => set('shopType', e.target.value)} />
            <AdminField label="Visit date" type="date" value={form.visitDate} onChange={(e) => set('visitDate', e.target.value)} />
            <AdminField label="Status" value={form.status} onChange={(e) => set('status', e.target.value)} />
          </div>
          <AdminTextarea label="Address" rows={2} value={form.address} onChange={(e) => set('address', e.target.value)} />
        </AdminFormSection>

        <AdminFormSection title="Products">
          <div className="admin-field-grid">
            <AdminField label="Product name" value={form.productName} onChange={(e) => set('productName', e.target.value)} />
            <AdminField label="Qty" value={form.qty} onChange={(e) => set('qty', e.target.value)} />
            <AdminField label="AL free" value={form.alFree} onChange={(e) => set('alFree', e.target.value)} />
            <AdminField label="CA free" value={form.caFree} onChange={(e) => set('caFree', e.target.value)} />
          </div>
        </AdminFormSection>

        <AdminFormSection title="Payment">
          <div className="admin-field-grid">
            <AdminField label="Order amount" value={form.orderAmount} onChange={(e) => set('orderAmount', e.target.value)} />
            <AdminField label="Payment" value={form.payment} onChange={(e) => set('payment', e.target.value)} />
            <AdminField label="Payment status" value={form.paymentStatus} onChange={(e) => set('paymentStatus', e.target.value)} />
            <AdminField label="Payment due date" type="date" value={form.paymentDueDate} onChange={(e) => set('paymentDueDate', e.target.value)} />
            <AdminField label="Last follow-up" type="date" value={form.lastFollowUp} onChange={(e) => set('lastFollowUp', e.target.value)} />
          </div>
        </AdminFormSection>

        <AdminFormSection title="Notes">
          <div className="admin-field-grid">
            <AdminField label="Remarks 1" value={form.remarks1} onChange={(e) => set('remarks1', e.target.value)} />
            <AdminField label="Remarks 2" value={form.remarks2} onChange={(e) => set('remarks2', e.target.value)} />
          </div>
        </AdminFormSection>

        <div className="admin-form-actions">
          <button type="button" className="btn btn-outline" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-lift" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Update row' : 'Add to RetailsOrder sheet'}
          </button>
        </div>
      </form>
    </div>
  );
}
