import React, { useState } from 'react';

interface TodoFilterProps {
  filters: {
    search: string;
    tags: string[];
    completed?: boolean;
  };
  onChange: (filters: TodoFilterProps['filters']) => void;
}

function TodoFilter({ filters, onChange }: TodoFilterProps) {
  const [tagInput, setTagInput] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleCompletedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange({
      ...filters,
      completed: value === '' ? undefined : value === 'true',
    });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!filters.tags.includes(tagInput.trim())) {
        onChange({
          ...filters,
          tags: [...filters.tags, tagInput.trim()],
        });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange({
      ...filters,
      tags: filters.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleClearFilters = () => {
    onChange({
      search: '',
      tags: [],
      completed: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
          Search
        </label>
        <input
          type="text"
          id="search"
          value={filters.search}
          onChange={handleSearchChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Search todos..."
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          value={filters.completed?.toString() ?? ''}
          onChange={handleCompletedChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All</option>
          <option value="true">Completed</option>
          <option value="false">Incomplete</option>
        </select>
      </div>

      <div>
        <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700">
          Filter by Tags
        </label>
        <input
          type="text"
          id="tag-filter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Add tag filter (press Enter)"
        />
        {filters.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {filters.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {(filters.search || filters.tags.length > 0 || filters.completed !== undefined) && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default TodoFilter;
