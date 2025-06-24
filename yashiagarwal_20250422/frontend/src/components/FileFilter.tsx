import React from 'react';

interface FileFilterProps {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const FileFilter: React.FC<FileFilterProps> = ({ filters, setFilters }) => {
  return (
    <div className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="Search by filename"
        className="input"
        value={filters.filename || ''}
        onChange={(e) => setFilters({ ...filters, filename: e.target.value })}
      />
      <input
        type="text"
        placeholder="Filter by file type"
        className="input"
        value={filters.file_type || ''}
        onChange={(e) => setFilters({ ...filters, file_type: e.target.value })}
      />
      <input
        type="number"
        placeholder="Size min (bytes)"
        className="input"
        value={filters.size_min || ''}
        onChange={(e) => setFilters({ ...filters, size_min: e.target.value })}
      />
      <input
        type="number"
        placeholder="Size max (bytes)"
        className="input"
        value={filters.size_max || ''}
        onChange={(e) => setFilters({ ...filters, size_max: e.target.value })}
      />
      <input
        type="date"
        placeholder="Uploaded after"
        className="input"
        onChange={(e) => setFilters({ ...filters, uploaded_after: e.target.value })}
      />
      <input
        type="date"
        placeholder="Uploaded before"
        className="input"
        onChange={(e) => setFilters({ ...filters, uploaded_before: e.target.value })}
      />
    </div>
  );
};

export default FileFilter;
