import { FormEvent, useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { adminUpdateInventory } from '../../../services/api';
import { uploadProductImageFile } from '../../../services/uploadProductImage';
import { useInventory } from '../../../context/InventoryContext';
import { useToast } from '../../../context/ToastContext';
import { AdminField, AdminFormSection, AdminPageHeader, AdminSelect, AdminTextarea } from '../AdminFormUi';
import ProductImage from '../../../components/ProductImage';
import {
  categories,
  normalizeCategorySlug,
  SELLER_TYPE_FORM_OPTIONS,
  sellerTypeFormValue,
  sellerTypeSheetValue,
} from '../../../data/products';
import type { InventoryRow } from '../../../types/api';

const emptyForm = {
  productName: '',
  category: 'almonds',
  sellerType: '',
  mrp: '',
  stock: '',
  weight: '',
  imagePath: '',
  remarks1: '',
  remarks2: '',
  listed: true,
};

function rowToForm(row: InventoryRow) {
  return {
    productName: row.productName,
    category: row.category || 'almonds',
    sellerType: sellerTypeFormValue(row.sellerType),
    mrp: String(row.mrp || ''),
    stock: String(row.stock),
    weight: row.weight || '',
    imagePath: row.imagePath,
    remarks1: row.remarks1,
    remarks2: row.remarks2,
    listed: row.enabled,
  };
}

type Props = {
  editSheetId: string | null;
  onBack: () => void;
  onSaved: () => void;
};

export default function AdminStockInventoryForm({ editSheetId, onBack, onSaved }: Props) {
  const { refresh, stockRows } = useInventory();
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(editSheetId);

  useEffect(() => {
    if (!editSheetId) {
      setForm(emptyForm);
      return;
    }
    const row = stockRows.find((r) => r.sheetId === editSheetId);
    if (row) setForm(rowToForm(row));
  }, [editSheetId, stockRows]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = await uploadProductImageFile(file);
      setForm((prev) => ({ ...prev, imagePath: path }));
      showToast('Image saved — path filled in Image path');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.productName.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await adminUpdateInventory([
        {
          sheetId: editSheetId || undefined,
          productName: form.productName.trim(),
          category: normalizeCategorySlug(form.category),
          sellerType: sellerTypeSheetValue(form.sellerType),
          stock: Number(form.stock) || 0,
          mrp: Number(form.mrp) || undefined,
          imagePath: form.imagePath.trim(),
          weight: form.weight.trim(),
          enabled: form.listed,
          remarks1: form.listed ? form.remarks1.trim() : 'DISABLED',
          remarks2: form.remarks2.trim(),
        },
      ]);
      await refresh();
      showToast(isEdit ? `Updated StockInventory ID ${editSheetId}` : 'Product added to StockInventory');
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
        title={isEdit ? `Edit stock — ID ${editSheetId}` : 'New stock product'}
        description={
          isEdit
            ? 'Changes update this row in StockInventory (same ID).'
            : 'Adds a new row with auto ID in StockInventory.'
        }
      />

      <form className="admin-pro-form" onSubmit={handleSubmit}>
        <div className="admin-form-layout">
          <div className="admin-form-main">
            <AdminFormSection title="Product & pricing">
              <div className="admin-field-grid">
                <AdminField
                  label="Product name"
                  required
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  placeholder="Shown on website"
                />
                <AdminSelect
                  label="Category"
                  required
                  hint="Used for Shop filters (almonds, cashews, …)"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </AdminSelect>
                <AdminSelect
                  label="Seller type"
                  hint="Best Seller → home Best Sellers block; New Arrival → New Arrivals block"
                  value={form.sellerType}
                  onChange={(e) => setForm({ ...form, sellerType: e.target.value })}
                >
                  {SELLER_TYPE_FORM_OPTIONS.map((opt) => (
                    <option key={opt.value || 'none'} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </AdminSelect>
                <AdminField
                  label="MRP (₹)"
                  type="number"
                  min={0}
                  value={form.mrp}
                  onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                />
                <AdminField
                  label="Weight / pack"
                  hint="Saved in Weight column (shown on product cards)"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  placeholder="e.g. 250g"
                />
                <AdminField
                  label="Image path"
                  hint="Auto-filled after upload, or paste a path / URL"
                  value={form.imagePath}
                  onChange={(e) => setForm({ ...form, imagePath: e.target.value })}
                  placeholder="/media/products/..."
                />
                <div className="admin-field admin-field-span-2">
                  <span className="admin-field-label">Upload image</span>
                  <p className="admin-field-hint">
                    Saves to <code>public/media/products</code> on local dev. Large photos are auto-resized (max{' '}
                    {1600}px).
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="admin-file-input-hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm admin-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload size={16} />
                    {uploading ? 'Uploading…' : 'Choose image from computer'}
                  </button>
                </div>
              </div>
            </AdminFormSection>

            <AdminFormSection title="Stock & visibility">
              <div className="admin-field-grid">
                <AdminField
                  label="Total stock remaining"
                  type="number"
                  min={0}
                  required
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
                <div className="admin-field">
                  <span className="admin-field-label">Website listing</span>
                  <label className="admin-toggle-row">
                    <input
                      type="checkbox"
                      checked={form.listed}
                      onChange={(e) => setForm({ ...form, listed: e.target.checked })}
                    />
                    <span>Show on shop (off writes DISABLED in Remarks1)</span>
                  </label>
                </div>
              </div>
            </AdminFormSection>

            <AdminFormSection title="Remarks" description="Optional notes — saved in Remarks1 and Remarks2 on the sheet.">
              <AdminTextarea
                label="Remarks 1"
                rows={3}
                value={form.remarks1}
                onChange={(e) => setForm({ ...form, remarks1: e.target.value })}
                placeholder="Internal or product notes"
              />
              <AdminTextarea
                label="Remarks 2"
                rows={3}
                value={form.remarks2}
                onChange={(e) => setForm({ ...form, remarks2: e.target.value })}
                placeholder="Additional notes"
              />
            </AdminFormSection>
          </div>

          <aside className="admin-form-aside">
            <div className="admin-preview-card">
              <h4>Preview</h4>
              <div className="admin-preview-img">
                {form.imagePath ? (
                  <ProductImage src={form.imagePath} alt="" />
                ) : (
                  <div className="admin-preview-placeholder">No image</div>
                )}
              </div>
              <p className="admin-preview-name">{form.productName || 'Product name'}</p>
              <ul className="admin-preview-meta">
                <li>
                  <span>Weight</span>
                  <strong>{form.weight || '—'}</strong>
                </li>
                <li>
                  <span>MRP</span>
                  <strong>{form.mrp ? `₹${form.mrp}` : '—'}</strong>
                </li>
                <li>
                  <span>Stock</span>
                  <strong>{form.stock || '0'}</strong>
                </li>
                <li>
                  <span>Status</span>
                  <strong>{form.listed ? 'Listed' : 'Hidden'}</strong>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <div className="admin-form-actions">
          <button type="button" className="btn btn-outline" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-lift" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Update row' : 'Add to StockInventory'}
          </button>
        </div>
      </form>
    </div>
  );
}
