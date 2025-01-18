const ComponentLibrary = ({ onDragStart }) => {
  const components = [
    { type: 'heading', label: 'Heading' },
    { type: 'input', label: 'Input Field' },
    { type: 'dropdown', label: 'Dropdown' },
    { type: 'button', label: 'Button' }
  ];

  return (
    <div className="w-64 bg-gray-100 p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Components</h2>
      {components.map((component) => (
        <div
          key={component.type}
          draggable
          onDragStart={(e) => onDragStart(e, component.type, true)}
          className="bg-white p-3 mb-2 rounded cursor-move hover:bg-gray-50 border border-gray-200"
        >
          {component.label}
        </div>
      ))}
    </div>
  );
};


export default ComponentLibrary