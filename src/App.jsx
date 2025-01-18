import React, { useState } from 'react';
import ComponentEditor from './components/ComponentEditor';
import ComponentLibrary from './components/ComponentLibrary';
import renderComponent from './components/renderComponent';

const DragDropBuilder = () => {
  const [droppedComponents, setDroppedComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

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
      // Handle new component drop
      const type = e.dataTransfer.getData('componentType');
      const newComponent = { id: Date.now(), type };
      setDroppedComponents([...droppedComponents, newComponent]);
    } else {
      // Handle reordering
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

  return (
    <div className="flex gap-4 h-screen p-4">
      <ComponentLibrary onDragStart={handleDragStart} />
      
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