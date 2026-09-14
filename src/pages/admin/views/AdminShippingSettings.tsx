import { FormEvent, useEffect, useState } from 'react';
import { adminFetchStoreSettings, adminUpdateStoreSettings } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { useInventory } from '../../../context/InventoryContext';
import { shippingPolicySummary } from '../../../config/commerce';
import { AdminField, AdminFormSection, AdminPageHeader } from '../AdminFormUi';

export default function AdminShippingSettings() {
  const { refresh, storeSettings } = useInventory();
  const { showToast } = useToast();
  const [shippingFee, setShippingFee] = useState(String(storeSettings.shippingFee));
  const [freeShippingMin, setFreeShippingMin] = useState(String(storeSettings.freeShippingMin));
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setShippingFee(String(storeSettings.shippingFee));
    setFreeShippingMin(String(storeSettings.freeShippingMin));
  }, [storeSettings.shippingFee, storeSettings.freeShippingMin]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const settings = await adminFetchStoreSettings();
        if (cancelled) return;
        setShippingFee(String(settings.shippingFee));
        setFreeShippingMin(String(settings.freeShippingMin));
      } catch {
        /* keep values from inventory context */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fee = Number(shippingFee);
    const min = Number(freeShippingMin);
    if (!Number.isFinite(fee) || fee < 0 || !Number.isFinite(min) || min < 0) {
      showToast('Enter valid non-negative numbers', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await adminUpdateStoreSettings({ shippingFee: fee, freeShippingMin: min });
      await refresh();
      showToast('Shipping settings saved', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not save settings', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const preview = shippingPolicySummary({
    shippingFee: Number(shippingFee) || 0,
    freeShippingMin: Number(freeShippingMin) || 0,
  });

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Shipping settings"
        description="Controls delivery charge and free-shipping threshold on the website checkout."
      />

      <form className="admin-form-layout" onSubmit={handleSubmit}>
        <AdminFormSection
          title="Website checkout"
          description="Free shipping when subtotal is strictly above the threshold (e.g. ₹999 → free from ₹1000)."
        >
          <AdminField
            label="Delivery charge (₹)"
            type="number"
            min={0}
            step={1}
            value={shippingFee}
            onChange={(e) => setShippingFee(e.target.value)}
            disabled={loading}
          />
          <AdminField
            label="Free shipping above subtotal (₹)"
            type="number"
            min={0}
            step={1}
            value={freeShippingMin}
            onChange={(e) => setFreeShippingMin(e.target.value)}
            disabled={loading}
            hint={preview}
          />
        </AdminFormSection>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting || loading}>
            {submitting ? 'Saving…' : 'Save shipping settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
