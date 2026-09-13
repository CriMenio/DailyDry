import type { ReactNode } from 'react';
import { Plus, RefreshCw, ChevronRight } from 'lucide-react';
import { AdminPageHeader } from './AdminFormUi';

export type AdminIndexColumn<T> = {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  className?: string;
};

type AdminRecordIndexProps<T> = {
  title: string;
  description: string;
  loading: boolean;
  onRefresh: () => void;
  onNew: () => void;
  rows: T[];
  rowKey: (row: T) => string;
  columns: AdminIndexColumn<T>[];
  onOpen: (row: T) => void;
  emptyTitle: string;
  emptyHint: string;
};

export default function AdminRecordIndex<T>({
  title,
  description,
  loading,
  onRefresh,
  onNew,
  rows,
  rowKey,
  columns,
  onOpen,
  emptyTitle,
  emptyHint,
}: AdminRecordIndexProps<T>) {
  return (
    <div className="admin-card admin-card-flush">
      <div className="admin-index-toolbar">
        <AdminPageHeader title={title} description={description} />
        <div className="admin-index-actions">
          <button type="button" className="btn btn-outline btn-sm" onClick={onRefresh} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin-icon' : ''} />
            Refresh
          </button>
          <button type="button" className="btn btn-primary btn-sm btn-lift" onClick={onNew}>
            <Plus size={16} />
            New
          </button>
        </div>
      </div>

      {rows.length === 0 && loading ? (
        <p className="admin-index-loading admin-index-loading-block">Loading records…</p>
      ) : rows.length === 0 ? (
        <div className="admin-index-empty">
          <h3>{emptyTitle}</h3>
          <p>{emptyHint}</p>
          <button type="button" className="btn btn-primary btn-lift" onClick={onNew}>
            <Plus size={16} />
            Create first record
          </button>
        </div>
      ) : (
        <div className="admin-index-table-wrap">
          <table className="admin-index-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={col.className}>
                    {col.label}
                  </th>
                ))}
                <th aria-label="Open" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={rowKey(row)}>
                  {columns.map((col) => (
                    <td key={col.key} className={col.className}>
                      {col.render(row)}
                    </td>
                  ))}
                  <td className="admin-index-open-cell">
                    <button type="button" className="admin-index-open-btn" onClick={() => onOpen(row)}>
                      Edit
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
