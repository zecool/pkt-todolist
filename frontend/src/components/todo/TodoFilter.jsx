import React from 'react';
import { Search, Filter, Calendar, CheckCircle, Circle } from 'lucide-react';
import { TODO_STATUS, TODO_STATUS_LABELS } from '../../constants/todoStatus';

const TodoFilter = ({ 
  filters, 
  onFiltersChange,
  showStatusFilter = true,
  showSearch = true,
  showSort = true
}) => {
  const handleStatusChange = (status) => {
    const newStatus = filters.status === status ? null : status;
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handleSearchChange = (e) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleSortChange = (sortBy) => {
    const newOrder = filters.sortBy === sortBy && filters.order === 'asc' ? 'desc' : 'asc';
    onFiltersChange({ ...filters, sortBy, order: newOrder });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Filters */}
        {showStatusFilter && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              상태
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(TODO_STATUS).map(([key, value]) => (
                <button
                  key={`${key}-${value}`}
                  type="button"
                  onClick={() => handleStatusChange(value)}
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full ${
                    filters.status === value
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filters.status === value ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <Circle className="h-3 w-3 mr-1" />
                  )}
                  {TODO_STATUS_LABELS[value]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Search */}
          {showSearch && (
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                검색
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="제목 또는 내용 검색"
                  value={filters.search || ''}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          )}

          {/* Sort */}
          {showSort && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                정렬
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleSortChange('dueDate')}
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded ${
                    filters.sortBy === 'dueDate'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  {filters.sortBy === 'dueDate' && (filters.order === 'asc' ? '↑' : '↓')}
                  날짜
                </button>
                <button
                  type="button"
                  onClick={() => handleSortChange('createdAt')}
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded ${
                    filters.sortBy === 'createdAt'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filters.sortBy === 'createdAt' && (filters.order === 'asc' ? '↑' : '↓')}
                  생성일
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoFilter;