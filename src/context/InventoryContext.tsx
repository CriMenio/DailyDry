import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { InventoryRow } from '../types/api';
import { fetchInventory } from '../services/api';
import type { Product } from '../data/products';
import { getProductById, inventoryRowToProduct, setShopCatalogFromSheet } from '../data/products';

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

interface InventoryContextType {
  inventory: Record<string, InventoryRow>;
  stockRows: InventoryRow[];
  loading: boolean;
  refresh: () => Promise<void>;
  getStock: (productId: string) => number;
  isEnabled: (productId: string) => boolean;
  getRowByProductId: (productId: string) => InventoryRow | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<Record<string, InventoryRow>>({});
  const [stockRows, setStockRows] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await fetchInventory();
      const map: Record<string, InventoryRow> = {};
      rows.forEach((r) => {
        map[normalizeName(r.productName)] = r;
      });
      setInventory(map);
      setStockRows(rows);
      const catalog = rows.map(inventoryRowToProduct);
      setShopCatalogFromSheet(catalog);
    } catch {
      setInventory({});
      setStockRows([]);
      setShopCatalogFromSheet(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const rowForProduct = (productId: string) => {
    const product = getProductById(productId);
    if (!product) return undefined;
    return inventory[normalizeName(product.name)];
  };

  const getStock = (productId: string) => rowForProduct(productId)?.stock ?? 999;
  const isEnabled = (productId: string) => rowForProduct(productId)?.enabled ?? true;

  const getRowByProductId = (productId: string) => rowForProduct(productId);

  return (
    <InventoryContext.Provider
      value={{ inventory, stockRows, loading, refresh, getStock, isEnabled, getRowByProductId }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}

/** Resolve stock by product record (works for sheet-backed catalog). */
export function stockForProduct(product: Product, inventory: Record<string, InventoryRow>) {
  const row = inventory[normalizeName(product.name)];
  return {
    stock: row?.stock ?? 999,
    enabled: row?.enabled ?? true,
  };
}
