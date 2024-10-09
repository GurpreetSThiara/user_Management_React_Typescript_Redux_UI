import React, { useEffect, useState } from 'react';
import {
  useGetModelsQuery,
  useCreateModelMutation,
  useAddFieldMutation,
  useAddRelationshipMutation,
  useGetRecordsQuery,
  IModel,
} from '../../redux/api/adminModelSclice'; // Adjust with your actual slice path

const AdminRecordsInterface: React.FC = () => {
  const { data: models, error: modelsError, isLoading: modelsLoading } = useGetModelsQuery();
  const [createModel] = useCreateModelMutation();
  const [addField] = useAddFieldMutation();
  const [addRelationship] = useAddRelationshipMutation();

  const [newModel, setNewModel] = useState<Partial<IModel>>({ name: '', fields: {}, relationships: {} });
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'models' | 'records'>('models');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const {
    data: modelRecords,
    error: recordsError,
    isLoading: recordsLoading,
    refetch: refetchRecords,
  } = useGetRecordsQuery({name:selectedModel , page:currentPage ,limit}, {
    skip: !selectedModel,
  });

  useEffect(() => {
    if (selectedModel) {
      refetchRecords();
    }
  }, [selectedModel, currentPage, refetchRecords]);

  const handleCreateModel = async () => {
    if (!newModel.name) {
      alert('Model name is required.');
      return;
    }
    try {
      await createModel(newModel).unwrap();
      setNewModel({ name: '', fields: {}, relationships: {} });
    } catch (err) {
      console.error('Failed to create model:', err);
    }
  };

  const handleAddField = async () => {
    if (!selectedModel) return;
    const fieldName = prompt('Enter field name:');
    const fieldType = prompt('Enter field type (String, Number, Date, Boolean):');
    if (fieldName && fieldType) {
      try {
        await addField({ modelName: selectedModel, field: { name: fieldName, type: fieldType } }).unwrap();
      } catch (err) {
        console.error('Failed to add field:', err);
      }
    }
  };

  const handleAddRelationship = async () => {
    if (!selectedModel) return;
    const relationshipName = prompt('Enter relationship name:');
    const relatedModel = prompt('Enter related model name:');
    if (relationshipName && relatedModel) {
      try {
        await addRelationship({
          modelName: selectedModel,
          relationship: { name: relationshipName, model: relatedModel },
        }).unwrap();
      } catch (err) {
        console.error('Failed to add relationship:', err);
      }
    }
  };

  const handleModelSelect = (modelName: string) => {
    setSelectedModel(modelName);
    setActiveTab('records');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4 flex">
      {/* Sidebar for Models */}
      <aside className="w-1/4 border-r pr-4">
        <h2 className="text-xl font-semibold mb-2">Models</h2>
        {modelsLoading && <p>Loading models...</p>}
        {modelsError && <p>Error loading models.</p>}
        {models && (
          <ul className="space-y-2">
            {models.map((model) => (
              <li key={model.name}>
                <button
                  className={`w-full text-left p-2 rounded ${
                    selectedModel === model.name ? 'bg-blue-100 font-bold' : 'hover:bg-gray-200'
                  }`}
                  onClick={() => handleModelSelect(model.name)}
                >
                  {model.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Main Interface */}
      <main className="flex-1 pl-4">
        <h1 className="text-2xl font-bold mb-4">Admin Interface</h1>

        {/* Tab Navigation */}
        <div className="flex mb-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'models' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'}`}
            onClick={() => setActiveTab('models')}
          >
            Manage Models
          </button>
          <button
            className={`ml-2 px-4 py-2 rounded ${activeTab === 'records' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'}`}
            onClick={() => setActiveTab('records')}
            disabled={!selectedModel}
          >
            Manage Records
          </button>
        </div>

        {/* Manage Models Section */}
        {activeTab === 'models' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Create New Model</h2>
            <input
              type="text"
              value={newModel.name}
              onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
              placeholder="Model Name"
              className="border p-2 mr-2"
            />
            <button
              onClick={handleCreateModel}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Create Model
            </button>

            <h2 className="text-xl font-semibold mt-8">Manage Existing Models</h2>
            <select
              value={selectedModel}
              onChange={(e) => handleModelSelect(e.target.value)}
              className="border p-2 mr-2"
            >
              <option value="">Select a model</option>
              {models?.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddField}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              disabled={!selectedModel}
            >
              Add Field
            </button>
            <button
              onClick={handleAddRelationship}
              className="bg-purple-500 text-white px-4 py-2 rounded"
              disabled={!selectedModel}
            >
              Add Relationship
            </button>
          </div>
        )}

        {/* Manage Records Section */}
        {activeTab === 'records' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Records for {selectedModel}</h2>
            {recordsLoading && <p>Loading records...</p>}
            {recordsError && <p>Error loading records.</p>}
            {modelRecords && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      {Object.keys(modelRecords.data[0]).map((key) => (
                        <th key={key} className="py-2 px-4 border-b">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modelRecords.data.map((record: any) => (
                      <tr key={record._id} className="hover:bg-gray-100">
                        {Object.values(record).map((value, index) => (
                          <td key={index} className="py-2 px-4 border-b">{JSON.stringify(value)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {Math.ceil(modelRecords.total / limit)}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage * limit >= modelRecords.total}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminRecordsInterface;
