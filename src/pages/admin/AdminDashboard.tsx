import { useCallback, useEffect, useState } from 'react';
import { RequireAdmin } from '../../components/RequireAuth';
import { useInventory } from '../../context/InventoryContext';
import AdminShell from './AdminShell';
import type { AdminScreen } from './adminScreens';
import AdminStockOverview from './views/AdminStockOverview';
import AdminStockInventoryIndex from './views/AdminStockInventoryIndex';
import AdminStockInventoryForm from './views/AdminStockInventoryForm';
import AdminRetailsOrderIndex from './views/AdminRetailsOrderIndex';
import AdminRetailsOrderForm from './views/AdminRetailsOrderForm';
import AdminCustomerOrderIndex from './views/AdminCustomerOrderIndex';
import AdminCustomerOrderForm from './views/AdminCustomerOrderForm';
import AdminOnlineOrdersIndex from './views/AdminOnlineOrdersIndex';
import AdminShippingSettings from './views/AdminShippingSettings';
import {
  adminFetchCustomerOrdersOffline,
  adminFetchOrders,
  adminFetchRetailOrders,
} from '../../services/api';
import type { CustomerOrderOfflineRow, OrderRecord, RetailOrderRow } from '../../types/api';

type SubView = 'list' | 'form';

function AdminDashboardContent() {
  const { refresh, loading } = useInventory();
  const [screen, setScreen] = useState<AdminScreen>('overview');

  const [stockView, setStockView] = useState<SubView>('list');
  const [stockEditId, setStockEditId] = useState<string | null>(null);

  const [retailView, setRetailView] = useState<SubView>('list');
  const [retailEditId, setRetailEditId] = useState<string | null>(null);
  const [retailRows, setRetailRows] = useState<RetailOrderRow[]>([]);
  const [retailLoading, setRetailLoading] = useState(false);

  const [customerView, setCustomerView] = useState<SubView>('list');
  const [customerEditId, setCustomerEditId] = useState<string | null>(null);
  const [customerRows, setCustomerRows] = useState<CustomerOrderOfflineRow[]>([]);
  const [customerLoading, setCustomerLoading] = useState(false);

  const [onlineOrders, setOnlineOrders] = useState<OrderRecord[]>([]);
  const [onlineLoading, setOnlineLoading] = useState(false);

  const loadRetail = useCallback(async () => {
    setRetailLoading(true);
    try {
      setRetailRows(await adminFetchRetailOrders());
    } catch {
      setRetailRows([]);
    } finally {
      setRetailLoading(false);
    }
  }, []);

  const loadCustomer = useCallback(async () => {
    setCustomerLoading(true);
    try {
      setCustomerRows(await adminFetchCustomerOrdersOffline());
    } catch {
      setCustomerRows([]);
    } finally {
      setCustomerLoading(false);
    }
  }, []);

  const loadOnlineOrders = useCallback(async () => {
    setOnlineLoading(true);
    try {
      setOnlineOrders(await adminFetchOrders());
    } catch {
      setOnlineOrders([]);
    } finally {
      setOnlineLoading(false);
    }
  }, []);

  useEffect(() => {
    if (screen === 'retail' && retailView === 'list') loadRetail();
  }, [screen, retailView, loadRetail]);

  useEffect(() => {
    if (screen === 'customer' && customerView === 'list') loadCustomer();
  }, [screen, customerView, loadCustomer]);

  useEffect(() => {
    if (screen === 'onlineOrders') loadOnlineOrders();
  }, [screen, loadOnlineOrders]);

  const handleScreenChange = (next: AdminScreen) => {
    setScreen(next);
    setStockView('list');
    setStockEditId(null);
    setRetailView('list');
    setRetailEditId(null);
    setCustomerView('list');
    setCustomerEditId(null);
  };

  const signOut = () => {
    localStorage.removeItem('dailydry-admin-token');
    window.location.href = '/admin/login';
  };

  const retailEditRow = retailEditId ? retailRows.find((r) => r.sheetId === retailEditId) ?? null : null;
  const customerEditRow = customerEditId
    ? customerRows.find((r) => r.sheetId === customerEditId) ?? null
    : null;

  return (
    <AdminShell screen={screen} onScreenChange={handleScreenChange} onSignOut={signOut}>
      {screen === 'overview' && <AdminStockOverview onRefresh={refresh} loading={loading} />}

      {screen === 'stock' && stockView === 'list' && (
        <AdminStockInventoryIndex
          loading={loading}
          onRefresh={refresh}
          onNew={() => {
            setStockEditId(null);
            setStockView('form');
          }}
          onEdit={(row) => {
            setStockEditId(row.sheetId);
            setStockView('form');
          }}
        />
      )}
      {screen === 'stock' && stockView === 'form' && (
        <AdminStockInventoryForm
          editSheetId={stockEditId}
          onBack={() => setStockView('list')}
          onSaved={() => {
            setStockView('list');
            setStockEditId(null);
          }}
        />
      )}

      {screen === 'onlineOrders' && (
        <AdminOnlineOrdersIndex
          orders={onlineOrders}
          loading={onlineLoading}
          onRefresh={loadOnlineOrders}
        />
      )}

      {screen === 'shipping' && <AdminShippingSettings />}

      {screen === 'retail' && retailView === 'list' && (
        <AdminRetailsOrderIndex
          rows={retailRows}
          loading={retailLoading}
          onRefresh={loadRetail}
          onNew={() => {
            setRetailEditId(null);
            setRetailView('form');
          }}
          onEdit={(row) => {
            setRetailEditId(row.sheetId);
            setRetailView('form');
          }}
        />
      )}
      {screen === 'retail' && retailView === 'form' && (
        <AdminRetailsOrderForm
          editSheetId={retailEditId}
          initialRow={retailEditRow}
          onBack={() => setRetailView('list')}
          onSaved={() => {
            setRetailView('list');
            setRetailEditId(null);
            loadRetail();
          }}
        />
      )}

      {screen === 'customer' && customerView === 'list' && (
        <AdminCustomerOrderIndex
          rows={customerRows}
          loading={customerLoading}
          onRefresh={loadCustomer}
          onNew={() => {
            setCustomerEditId(null);
            setCustomerView('form');
          }}
          onEdit={(row) => {
            setCustomerEditId(row.sheetId);
            setCustomerView('form');
          }}
        />
      )}
      {screen === 'customer' && customerView === 'form' && (
        <AdminCustomerOrderForm
          editSheetId={customerEditId}
          initialRow={customerEditRow}
          onBack={() => setCustomerView('list')}
          onSaved={() => {
            setCustomerView('list');
            setCustomerEditId(null);
            loadCustomer();
          }}
        />
      )}
    </AdminShell>
  );
}

export default function AdminDashboard() {
  return (
    <RequireAdmin>
      <AdminDashboardContent />
    </RequireAdmin>
  );
}
