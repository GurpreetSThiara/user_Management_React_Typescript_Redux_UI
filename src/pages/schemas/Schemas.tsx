// src/components/AdminInterface.tsx

import React, { useState , useEffect, useMemo } from 'react';
import {
  useGetModelsQuery,
  useCreateModelMutation,
  useAddFieldMutation,
  useAddRelationshipMutation,
  IModel,
} from '../../redux/api/adminModelSclice'; // Ensure the path is correct
import { FaPlus, FaList, FaCog } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetAllSchemasQuery, useLazyGetAllSchemasQuery } from '../../redux/api/schemaSlice';
import { PlusIcon, XIcon, SearchIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { ChevronDown, ChevronRight, Hash, Calendar, Type, List, Check, X } from 'lucide-react'

const Schemas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('create');

  // Sidebar Component
  const Sidebar: React.FC = () => {
    const menuItems = [
      { name: 'Create Model', icon: <FaPlus />, key: 'create' },
      { name: 'Manage Models', icon: <FaList />, key: 'manage' },
      { name: 'View Models', icon: <FaCog />, key: 'view' },
    ];

    return (
      <div className="flex flex-col w-64 h-screen text-white bg-gray-800">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">Admin Panel</div>
        <nav className="flex-1">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center p-4 hover:bg-gray-700 ${
                activeTab === item.key ? 'bg-gray-700' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    );
  };

  // CreateModelTab Component
  const CreateModelTab: React.FC = () => {
    const [createModel] = useCreateModelMutation();
    const [newModel, setNewModel] = useState<Partial<IModel>>({
      name: '',
      fields: {},
      relationships: {},
    });

    const handleCreateModel = async () => {
      if (!newModel.name) {
        toast.error('Model name is required.');
        return;
      }
      try {
        await createModel(newModel).unwrap();
        setNewModel({ name: '', fields: {}, relationships: {} });
        toast.success('Model created successfully!');
      } catch (err) {
        console.error('Failed to create model:', err);
        toast.error('Error creating model.');
      }
    };

    return (
      <div className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Create New Model</h2>
        <div className="mb-4">
          <label className="block mb-2">Model Name</label>
          <input
            type="text"
            value={newModel.name}
            onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
            placeholder="Model Name"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleCreateModel}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Create Model
        </button>
      </div>
    );
  };

  // ManageModelsTab Component

  
 

  

  
 

  type FieldType = 'String' | 'Number' | 'Date' | 'Boolean' | 'ObjectId';
  
  interface FieldOptions {
    required?: boolean;
    unique?: boolean;
    enum?: string[];
    default?: any;
  }
  
  interface Field {
    type: string;
    ref?: string;
    options?: FieldOptions;
  }
  
  interface Model {
    _id: string;
    name: string;
    fields: { [key: string]: Field };
  }
  
  type ViewType = 'relational' | 'json' | 'er';
  
  const ManageModelsTab: React.FC = () => {
    const { data: models, error, isLoading } = useGetModelsQuery();
    const [addField] = useAddFieldMutation();
  
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [isAddingField, setIsAddingField] = useState(false);
    const [newField, setNewField] = useState({
      name: '',
      type: 'String' as FieldType,
      options: {} as FieldOptions,
      ref: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [viewType, setViewType] = useState<ViewType>('relational');
    const [expandedFields, setExpandedFields] = useState<{ [key: string]: boolean }>({});
  
    const filteredModels = useMemo(() => {
      return models?.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];
    }, [models, searchTerm]);
  
    const validateField = () => {
      const newErrors: { [key: string]: string } = {};
      if (!newField.name.trim()) {
        newErrors.name = 'Field name is required';
      }
      if (newField.type === 'ObjectId' && !newField.ref) {
        newErrors.ref = 'Reference model is required for ObjectId type';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleAddField = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedModel) {
        toast.error('Please select a model first.');
        return;
      }
  
      if (!validateField()) {
        return;
      }
  
      try {
        const fieldData = {
          name: newField.name,
          type: newField.type,
          ...newField.options,
          ...(newField.type === 'ObjectId' ? { ref: newField.ref } : {}),
        };
        await addField({
          modelName: selectedModel,
          field: fieldData,
        }).unwrap();
        toast.success('Field added successfully!');
        setIsAddingField(false);
        setNewField({ name: '', type: 'String', options: {}, ref: '' });
      } catch (err) {
        console.error('Failed to add field:', err);
        toast.error('Error adding field.');
      }
    };
  
    const handleOptionChange = (key: keyof FieldOptions, value: any) => {
      setNewField(prev => ({
        ...prev,
        options: { ...prev.options, [key]: value },
      }));
    };
  
    const toggleFieldExpansion = (modelName: string, fieldName: string) => {
      setExpandedFields(prev => ({
        ...prev,
        [`${modelName}-${fieldName}`]: !prev[`${modelName}-${fieldName}`],
      }));
    };
  
    const renderRelationalView = () => {
      if (!models) return null;

      console.log(models)
  
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <div key={model._id} className="p-4 bg-white rounded-lg shadow" onClick={()=>setSelectedModel(model.name)}>
              <h3 className="mb-2 text-lg font-semibold">{model.name}</h3>
              <ul className="space-y-2">
                {Object.entries(model.fields).map(([fieldName, field]) => (
                  <li key={fieldName} className="pb-2 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{fieldName}</span>
                      <button
                        onClick={() => toggleFieldExpansion(model.name, fieldName)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {expandedFields[`${model.name}-${fieldName}`] ? (
                          <ChevronDownIcon size={16} />
                        ) : (
                          <ChevronRightIcon size={16} />
                        )}
                      </button>
                    </div>
                    {expandedFields[`${model.name}-${fieldName}`] && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Type: {field.type}</p>
                        {field.ref && <p>Ref: {field.ref}</p>}
                        {field.options?.required && <p>Required: Yes</p>}
                        {field.options?.unique && <p>Unique: Yes</p>}
                        {field.options?.enum && (
                          <p>Enum: {field.options.enum.join(', ')}</p>
                        )}
                        {field.options?.default !== undefined && (
                          <p>Default: {JSON.stringify(field.options.default)}</p>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    };
  
interface Field {
  type: string
  required: boolean
  unique: boolean
  enum?: string[]
  default?: any
  createdAt: string
  updatedAt: string
}

interface Model {
  _id: string
  name: string
  fields: Record<string, Field>
  relationships: Record<string, any>
  createdAt: string
  updatedAt: string
  __v: number
}

interface JsonTreeViewerProps {
  data: Model[]
}

 function JsonTreeViewer(data) {
  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-gray-900 to-gray-800">
      <h1 className="mb-8 text-4xl font-bold text-center">Model Viewer</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.map((model) => (
          <ModelCard key={model._id} model={model} />
        ))}
      </div>
    </div>
  )
}

function ModelCard({ model }: { model: Model }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="overflow-hidden transition-all duration-300 transform bg-gray-800 rounded-lg shadow-lg hover:scale-105">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-2xl font-semibold">{model.name}</h2>
        {expanded ? (
          <ChevronDown className="w-6 h-6 text-gray-400" />
        ) : (
          <ChevronRight className="w-6 h-6 text-gray-400" />
        )}
      </div>
      {expanded && (
        <div className="p-4 border-t border-gray-700 animate-fadeIn">
          <h3 className="mb-2 text-xl font-semibold">Fields</h3>
          <div className="space-y-2">
            {Object.entries(model.fields).map(([fieldName, field]) => (
              <FieldItem key={fieldName} name={fieldName} field={field} />
            ))}
          </div>
          <div className="mt-4">
            <h3 className="mb-2 text-xl font-semibold">Metadata</h3>
            <p className="text-gray-400">
              <Calendar className="inline-block mr-2" />
              Created: {new Date(model.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-400">
              <Calendar className="inline-block mr-2" />
              Updated: {new Date(model.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function FieldItem({ name, field }: { name: string; field: Field }) {
  const [expanded, setExpanded] = useState(false)

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'String':
        return 'text-green-400'
      case 'Boolean':
        return 'text-yellow-400'
      default:
        return 'text-blue-400'
    }
  }

  return (
    <div className="p-2 bg-gray-700 rounded-md">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <Type className={`w-4 h-4 ${getTypeColor(field.type)}`} />
          <span className="font-medium">{name}</span>
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </div>
      {expanded && (
        <div className="pl-6 mt-2 space-y-1 animate-fadeIn">
          <p className={`${getTypeColor(field.type)}`}>Type: {field.type}</p>
          <p>
            Required:{' '}
            {field.required ? (
              <Check className="inline-block w-4 h-4 text-green-400" />
            ) : (
              <X className="inline-block w-4 h-4 text-red-400" />
            )}
          </p>
          <p>
            Unique:{' '}
            {field.unique ? (
              <Check className="inline-block w-4 h-4 text-green-400" />
            ) : (
              <X className="inline-block w-4 h-4 text-red-400" />
            )}
          </p>
          {field.enum && (
            <div>
              <p className="flex items-center">
                <List className="inline-block w-4 h-4 mr-1" />
                Enum:
              </p>
              <ul className="pl-4 list-disc list-inside">
                {field.enum.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          )}
          {field.default !== undefined && <p>Default: {String(field.default)}</p>}
        </div>
      )}
    </div>
  )
}

  
    const renderERDiagram = () => {
      if (!models) return null;
  
      const modelMap = new Map(models.map(model => [model.name, model]));
      const edges: [string, string, string][] = [];
  
      models.forEach(model => {
        Object.entries(model.fields).forEach(([fieldName, field]) => {
          if (field.type === 'ObjectId' && field.ref && modelMap.has(field.ref)) {
            edges.push([model.name, field.ref, fieldName]);
          }
        });
      });
  
      return (
        <div className="p-4 overflow-auto border border-gray-300 rounded-lg">
          <svg width="1000" height="600" className="max-w-full">
            {models.map((model, index) => (
              <g key={model._id} transform={`translate(${(index % 3) * 300 + 50}, ${Math.floor(index / 3) * 200 + 50})`}>
                <rect width="250" height="150" fill="white" stroke="black" rx="5" ry="5" />
                <text x="125" y="30" textAnchor="middle" fontWeight="bold">{model.name}</text>
                {Object.entries(model.fields).map(([fieldName, field], fieldIndex) => (
                  <text key={fieldName} x="10" y={50 + fieldIndex * 20} fontSize="12">
                    {fieldName}: {field.type}
                  </text>
                ))}
              </g>
            ))}
            {edges.map(([from, to, fieldName], index) => {
              const fromIndex = models.findIndex(m => m.name === from);
              const toIndex = models.findIndex(m => m.name === to);
              const fromX = (fromIndex % 3) * 300 + 300;
              const fromY = Math.floor(fromIndex / 3) * 200 + 125;
              const toX = (toIndex % 3) * 300 + 50;
              const toY = Math.floor(toIndex / 3) * 200 + 125;
              const midX = (fromX + toX) / 2;
              const midY = (fromY + toY) / 2;
  
              return (
                <g key={`${from}-${to}-${index}`}>
                  <line
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="black"
                    strokeWidth="1"
                    markerEnd="url(#arrowhead)"
                  />
                  <text x={midX} y={midY} textAnchor="middle" fontSize="12" fill="blue">
                    {fieldName}
                  </text>
                </g>
              );
            })}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="black" />
              </marker>
            </defs>
          </svg>
        </div>
      );
    };
  
    if (isLoading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6">Error loading models</div>;
  
    return (
      <div className="min-h-screen p-6 bg-gray-100">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Manage Existing Models</h2>
        
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setViewType('relational')}
              className={`px-4 py-2 rounded-md ${viewType === 'relational' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Relational
            </button>
            <button
              onClick={() => setViewType('json')}
              className={`px-4 py-2 rounded-md ${viewType === 'json' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              JSON
            </button>
            <button
              onClick={() => setViewType('er')}
              className={`px-4 py-2 rounded-md ${viewType === 'er' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              ER Diagram
            </button>
          </div>
        </div>
  
        {viewType === 'relational' && renderRelationalView()}
        {viewType === 'json' && JsonTreeViewer(models)}
        {viewType === 'er' && renderERDiagram()}
  
        {selectedModel && (
          <div className="mt-6">
            <h3 className="mb-4 text-xl font-semibold">Selected Model: {selectedModel}</h3>
            <button
              onClick={() => setIsAddingField(true)}
              className="flex items-center px-4 py-2 text-white transition-colors duration-200 bg-green-500 rounded-md hover:bg-green-600"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Field
            </button>
          </div>
        )}
  
        {isAddingField && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Add New Field</h3>
                <button onClick={() => setIsAddingField(false)} className="text-gray-500 hover:text-gray-700">
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddField} className="space-y-4">
                <div>
                  <label htmlFor="fieldName" className="block mb-1 text-sm font-medium text-gray-700">Field Name</label>
                  <input
                    id="fieldName"
                    type="text"
                    value={newField.name}
                    onChange={(e) => {
                      setNewField(prev => ({ ...prev, name: e.target.value }));
                      setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="fieldType" className="block mb-1 text-sm font-medium text-gray-700">Field Type</label>
                  <select
                    id="fieldType"
                    value={newField.type}
                    onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value as FieldType }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="String">String</option>
                    <option value="Number">Number</option>
                    <option value="Date">Date</option>
                    <option value="Boolean">Boolean</option>
                    <option value="ObjectId">ObjectId (Reference)</option>
                  </select>
                </div>
                {newField.type === 'ObjectId' && (
                  <div>
                    <label htmlFor="refModel" className="block mb-1 text-sm font-medium text-gray-700">Reference Model</label>
                    <select
                      id="refModel"
                      value={newField.ref}
                      onChange={(e) => {
                        setNewField(prev => ({ ...prev, ref: e.target.value }));
                        setErrors(prev => ({ ...prev, ref: '' }));
                      }}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.ref ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a model</option>
                      {models?.map((model) => (
                        <option key={model._id} value={model.name}>{model.name}</option>
                      ))}
                    </select>
                    {errors.ref && <p className="mt-1 text-sm text-red-500">{errors.ref}</p>}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newField.options.required}
                      onChange={(e) => handleOptionChange('required', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Required</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newField.options.unique}
                      onChange={(e) => handleOptionChange('unique', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Unique</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white transition-colors duration-200 bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Add Field
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };
  
 


  // ViewModelsTab Component
  const ViewModelsTab: React.FC = () => {
    const { data,isLoading,error} = useGetAllSchemasQuery({});

    if (isLoading)
      return (
        <div className="p-6">
          <p>Loading models...</p>
        </div>
      );
    if (error)
      return (
        <div className="p-6">
          <p className="text-red-500">Error loading models.</p>
        </div>
      );

      const models = data?.data || [];

      return (
        <div className="p-6 overflow-auto">
          <h2 className="mb-4 text-xl font-semibold">All Models</h2>
          {models.length > 0 ? (
            <div className="space-y-6">
              {models.map((model) => (
                <div key={model.name} className="p-4 bg-white border rounded shadow">
                  <h3 className="text-lg font-semibold">{model.name}</h3>
                  <div className="mt-2">
                    <h4 className="font-semibold">Fields:</h4>
                    {model.fields.length > 0 ? (
                      <table className="min-w-full mt-2">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Type</th>
                            <th className="px-4 py-2 border">Required</th>
                            <th className="px-4 py-2 border">Unique</th>
                            <th className="px-4 py-2 border">Relationship</th>
                          </tr>
                        </thead>
                        <tbody>
                          {model.fields.map((field, index) => (
                            <tr key={index} className="text-center">
                              <td className="px-4 py-2 border">{field.name}</td>
                              <td className="px-4 py-2 border">{field.type}</td>
                              <td className="px-4 py-2 border">
                                {field.required ? <p className="text-green-500">Yes</p> : 'No'}
                              </td>
                              <td className="px-4 py-2 border">
                                {field.unique ? <p className="text-green-500">Yes</p>  : 'No'}
                              </td>
                              <td className="px-4 py-2 border">
                                {field.ref ? (
                                  <span className="text-green-500">Yes ({field.ref})</span>
                                ) : (
                                  'No'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No fields defined.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No models available.</p>
          )}
        </div>
      );
    };
  
    // Function to Render Active Tab
    const renderActiveTab = () => {
      switch (activeTab) {
        case 'create':
          return <CreateModelTab />;
        case 'manage':
          return <ManageModelsTab />;
        case 'view':
          return <ViewModelsTab />;
        default:
          return <CreateModelTab />;
      }
    };
  
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {renderActiveTab()}
          <ToastContainer position="top-right" autoClose={5000} />
        </main>
      </div>
    );
  };
  
  export default Schemas;