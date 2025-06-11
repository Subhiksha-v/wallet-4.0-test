import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import styles from '../styles/DataTable.module.css';

const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      key = null;
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const getValue = (obj, path) => {
        return path.split('.').reduce((o, i) => (o ? o[i] : null), obj);
      };

      const aValue = getValue(a, sortConfig.key);
      const bValue = getValue(b, sortConfig.key);

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  };

  const getFilteredData = () => {
    if (!searchQuery) return getSortedData();

    const query = searchQuery.toLowerCase();
    return getSortedData().filter(item => {
      return columns.some(column => {
        if (column.key === 'actions') return false;

        const getValue = (obj, path) => {
          return path.split('.').reduce((o, i) => (o ? o[i] : null), obj);
        };

        const value = getValue(item, column.key);
        return String(value).toLowerCase().includes(query);
      });
    });
  };

  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const filteredData = getFilteredData();

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className={`table ${styles.table}`}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => column.key !== 'actions' && handleSort(column.key)}
                    style={{ cursor: column.key !== 'actions' ? 'pointer' : 'default' }}
                  >
                    {column.label}
                    {renderSortIndicator(column.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData && filteredData.map((item, index) => (
                <tr key={item._id || index}>
                  {columns.map((column) => (
                    <td key={`${item._id}-${column.key}`}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : (typeof item[column.key] === 'object' && item[column.key] !== null
                            ? JSON.stringify(item[column.key])
                            : item[column.key])
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData && filteredData.length === 0 && (
          <div className="text-center py-3">
            <p className="text-muted mb-0">No records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable; 