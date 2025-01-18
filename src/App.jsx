import React, { useState, useEffect } from 'react';
import ComponentEditor from './components/ComponentEditor';
import ComponentLibrary from './components/ComponentLibrary';
import renderComponent from './components/renderComponent';

const DragDropBuilder = () => {
  const [droppedComponents, setDroppedComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Load components from session storage on initial render
  useEffect(() => {
    const savedComponents = sessionStorage.getItem('builderComponents');
    if (savedComponents) {
      setDroppedComponents(JSON.parse(savedComponents));
    }
  }, []);

  const handleDragStart = (e, type, isNew = false) => {
    if (isNew) {
      e.dataTransfer.setData('componentType', type);
      e.dataTransfer.setData('isNew', 'true');
    } else {
      const index = Number(e.currentTarget.dataset.index);
      setDraggedIndex(index);
      e.dataTransfer.setData('isNew', 'false');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const dragOverItem = e.target.closest('[data-index]');
    if (dragOverItem) {
      const rect = dragOverItem.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      dragOverItem.style.borderTop = e.clientY < midY ? '2px solid #4299e1' : 'none';
      dragOverItem.style.borderBottom = e.clientY >= midY ? '2px solid #4299e1' : 'none';
    }
  };

  const handleDragLeave = (e) => {
    const item = e.target.closest('[data-index]');
    if (item) {
      item.style.borderTop = 'none';
      item.style.borderBottom = 'none';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const isNew = e.dataTransfer.getData('isNew') === 'true';
    
    if (isNew) {
      const type = e.dataTransfer.getData('componentType');
      const newComponent = { id: Date.now(), type };
      setDroppedComponents([...droppedComponents, newComponent]);
    } else {
      const dropTarget = e.target.closest('[data-index]');
      if (dropTarget && draggedIndex !== null) {
        const dropIndex = Number(dropTarget.dataset.index);
        const rect = dropTarget.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const newIndex = e.clientY >= midY ? dropIndex + 1 : dropIndex;
        
        const newComponents = [...droppedComponents];
        const [draggedComponent] = newComponents.splice(draggedIndex, 1);
        newComponents.splice(newIndex > draggedIndex ? newIndex - 1 : newIndex, 0, draggedComponent);
        
        setDroppedComponents(newComponents);
      }
    }

    const items = document.querySelectorAll('[data-index]');
    items.forEach(item => {
      item.style.borderTop = 'none';
      item.style.borderBottom = 'none';
    });
  };

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
  };

  const updateComponent = (updatedComponent) => {
    const updatedComponents = droppedComponents.map((comp) =>
      comp.id === updatedComponent.id ? updatedComponent : comp
    );
    setDroppedComponents(updatedComponents);
  };

  const handleSave = () => {
    sessionStorage.setItem('builderComponents', JSON.stringify(droppedComponents));
    alert('Layout saved successfully!');
  };

  const handleReset = () => {
    sessionStorage.removeItem('builderComponents');
    setDroppedComponents([]);
    setSelectedComponent(null);
    alert('Layout reset successfully!');
  };

  return (
    <div className="flex gap-4 h-screen p-4 flex-col sm:flex-row">
      <div className="w-64">
        <ComponentLibrary onDragStart={handleDragStart} />
        <div className="mt-4 space-y-2">
          <button
            onClick={handleSave}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Layout
          </button>
          <button
            onClick={handleReset}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reset Layout
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex gap-4">
        <div
          className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {droppedComponents.map((component, index) => (
            <div
              key={component.id}
              data-index={index}
              draggable
              onDragStart={(e) => handleDragStart(e, component.type)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => handleComponentClick(component)}
              className="cursor-move relative hover:bg-gray-50 rounded p-2"
            >
              {renderComponent(component)}
            </div>
          ))}
        </div>

        {selectedComponent && (
          <div className="w-64">
            <ComponentEditor
              component={selectedComponent}
              onUpdate={updateComponent}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDropBuilder;