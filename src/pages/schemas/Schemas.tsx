// src/components/AdminInterface.tsx

import React, { useState } from 'react';
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
      <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
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
        <h2 className="text-xl font-semibold mb-4">Create New Model</h2>
        <div className="mb-4">
          <label className="block mb-2">Model Name</label>
          <input
            type="text"
            value={newModel.name}
            onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
            placeholder="Model Name"
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          onClick={handleCreateModel}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Model
        </button>
      </div>
    );
  };

  // ManageModelsTab Component
  const ManageModelsTab: React.FC = () => {
    const { data: models, error, isLoading, refetch } = useGetModelsQuery();
 

    console.log("schemas");

    
    const [addField] = useAddFieldMutation();
    const [addRelationship] = useAddRelationshipMutation();
    const [selectedModel, setSelectedModel] = useState<string>('');

    const handleAddField = async () => {
      if (!selectedModel) {
        toast.error('Please select a model first.');
        return;
      }

      const fieldName = prompt('Enter field name:');
      if (!fieldName) {
        toast.error('Field name is required.');
        return;
      }

      const fieldType = prompt('Enter field type (String, Number, Date, Boolean):');
      if (!fieldType) {
        toast.error('Field type is required.');
        return;
      }

      try {
        await addField({
          modelName: selectedModel,
          field: { name: fieldName, type: fieldType ,},
        }).unwrap();
        toast.success('Field added successfully!');
      } catch (err) {
        console.error('Failed to add field:', err);
        toast.error('Error adding field.');
      }
    };

    const handleAddRelationship = async () => {
      if (!selectedModel) {
        toast.error('Please select a model first.');
        return;
      }

      const relationshipName = prompt('Enter relationship name:');
      if (!relationshipName) {
        toast.error('Relationship name is required.');
        return;
      }

      const relatedModel = prompt('Enter related model name:');
      if (!relatedModel) {
        toast.error('Related model name is required.');
        return;
      }

      try {
        await addRelationship({
          modelName: selectedModel,
          relationship: { name: relationshipName, model: relatedModel },
        }).unwrap();
        toast.success('Relationship added successfully!');
      } catch (err) {
        console.error('Failed to add relationship:', err);
        toast.error('Error adding relationship.');
      }
    };

    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Existing Models</h2>
        <div className="mb-4">
          <label className="block mb-2">Select Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select a model --</option>
            {models?.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleAddField}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={!selectedModel}
          >
            Add Field
          </button>
          <button
            onClick={handleAddRelationship}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            disabled={!selectedModel}
          >
            Add Relationship
          </button>
        </div>
        {/* Optionally, display model details or provide more management features */}
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
          <h2 className="text-xl font-semibold mb-4">All Models</h2>
          {models.length > 0 ? (
            <div className="space-y-6">
              {models.map((model) => (
                <div key={model.name} className="p-4 border rounded shadow bg-white">
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
                                {field.required ? 'Yes' : 'No'}
                              </td>
                              <td className="px-4 py-2 border">
                                {field.unique ? 'Yes' : 'No'}
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