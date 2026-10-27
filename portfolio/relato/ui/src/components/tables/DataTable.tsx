import React from 'react';
import styled from 'styled-components';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell, Badge } from '../styled/CommonComponents';

const TableContainer = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const TableFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: between;
  background-color: #f9fafb;
`;

const PaginationInfo = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: white;
  color: #374151;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: #f3f4f6;
    border-color: #9ca3af;
  }

  &:disabled {
    background-color: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const ActionsCell = styled(TableCell)`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #3b82f6;
          color: white;
          &:hover { background-color: #2563eb; }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          color: white;
          &:hover { background-color: #dc2626; }
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #374151;
          &:hover { background-color: #e5e7eb; }
        `;
    }
  }}
`;

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  emptyMessage?: string;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination,
  onEdit,
  onDelete,
  onView,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  const renderCellContent = (column: Column<T>, item: T) => {
    const value = column.key.includes('.') 
      ? column.key.split('.').reduce((obj, key) => obj?.[key], item)
      : item[column.key as keyof T];

    if (column.render) {
      return column.render(value, item);
    }

    // Default rendering for common data types
    if (typeof value === 'boolean') {
      return <Badge variant={value ? 'success' : 'danger'}>
        {value ? 'Active' : 'Inactive'}
      </Badge>;
    }

    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }

    return value || '-';
  };

  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
      pagination.onPageChange(page);
    }
  };

  if (loading) {
    return (
      <TableContainer>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          Loading...
        </div>
      </TableContainer>
    );
  }

  if (data.length === 0) {
    return (
      <TableContainer>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          {emptyMessage}
        </div>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <TableWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHeaderCell key={index} style={{ width: column.width }}>
                  {column.title}
                </TableHeaderCell>
              ))}
              {(onEdit || onDelete || onView) && (
                <TableHeaderCell style={{ width: '120px' }}>Actions</TableHeaderCell>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {renderCellContent(column, item)}
                  </TableCell>
                ))}
                {(onEdit || onDelete || onView) && (
                  <ActionsCell>
                    {onView && (
                      <ActionButton onClick={() => onView(item)}>
                        View
                      </ActionButton>
                    )}
                    {onEdit && (
                      <ActionButton variant="primary" onClick={() => onEdit(item)}>
                        Edit
                      </ActionButton>
                    )}
                    {onDelete && (
                      <ActionButton variant="danger" onClick={() => onDelete(item)}>
                        Delete
                      </ActionButton>
                    )}
                  </ActionsCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>

      {pagination && (
        <TableFooter>
          <PaginationInfo>
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} results
          </PaginationInfo>
          <PaginationControls>
            <PaginationButton
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Previous
            </PaginationButton>
            <span style={{ padding: '0 0.5rem', color: '#6b7280' }}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <PaginationButton
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Next
            </PaginationButton>
          </PaginationControls>
        </TableFooter>
      )}
    </TableContainer>
  );
}

export default DataTable;
