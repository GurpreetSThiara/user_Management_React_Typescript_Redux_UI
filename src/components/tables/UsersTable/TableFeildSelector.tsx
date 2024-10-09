import React from 'react';

interface TableField {
  key: string;
  label: string;
}

interface TableFieldSelectorProps {
  availableFields: TableField[]; // List of available fields to select from
  selectedFields: { [key: string]: boolean }; // Currently selected fields as an object
  setFields: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>; // Function to update selected fields
}

export const TableFieldSelector: React.FC<TableFieldSelectorProps> = ({ availableFields, selectedFields, setFields }) => {
  
  const handleCheckboxChange = (fieldKey: string) => {
    setFields(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey], // Toggle the selected field's boolean value
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Table Fields</h3>
      <div className="space-y-2">
        {availableFields.map(field => (
          <div key={field.key} className="flex items-center">
            <input
              type="checkbox"
              id={`field-${field.key}`}
              checked={selectedFields[field.key]}
              onChange={() => handleCheckboxChange(field.key)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor={`field-${field.key}`}
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              {field.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
