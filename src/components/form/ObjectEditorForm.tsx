
import { useState } from "react"

interface ObjectEditorProps {
  initialObject: Record<string, any>
  onSave: (updatedObject: Record<string, any>) => void
}

function ObjectEditor({ initialObject, onSave }: ObjectEditorProps) {
  const [editedObject, setEditedObject] = useState(initialObject)

  const handleInputChange = (path: string[], value: any) => {
    setEditedObject((prev) => {
      const newObj = { ...prev }
      let current = newObj
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return newObj
    })
  }

  const renderField = (key: string, value: any, path: string[] = []) => {
    const currentPath = [...path, key]

    if (typeof value === "object" && value !== null) {
      return (
        <div key={key} className="mt-4">
          <details className="bg-gray-100 p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">{key}</summary>
            <div className="mt-2 pl-4">
              {Object.entries(value).map(([nestedKey, nestedValue]) =>
                renderField(nestedKey, nestedValue, currentPath)
              )}
            </div>
          </details>
        </div>
      )
    }

    return (
      <div key={key} className="mt-4">
        <label htmlFor={currentPath.join(".")} className="block text-sm font-medium text-gray-700">
          {key}
        </label>
        <input
          type={typeof value === "number" ? "number" : "text"}
          id={currentPath.join(".")}
          value={value}
          onChange={(e) => handleInputChange(currentPath, e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
    )
  }

  const handleSave = () => {
    onSave(editedObject)
    alert("Changes saved successfully!")
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <div className="max-h-[70vh] overflow-y-auto pr-4">
        {Object.entries(editedObject).map(([key, value]) => renderField(key, value))}
      </div>
      <button
        onClick={handleSave}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Save Changes
      </button>
    </div>
  )
}

export default ObjectEditor