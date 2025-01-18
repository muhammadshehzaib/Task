const renderComponent = (component) => {
    switch (component.type) {
      case 'heading':
        return (
          <h2
            style={{ color: component.color }}
            className="text-2xl font-bold mb-4"
          >
            {component.text || 'Heading'}
          </h2>
        );
      case 'input':
        return (
          <input
            type="text"
            placeholder={component.placeholder || 'Enter text'}
            className="border p-2 rounded w-full mb-4"
          />
        );
      case 'dropdown':
        return (
          <select className="border p-2 rounded w-full mb-4">
            {(component.options || ['Option 1', 'Option 2']).map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        );
      case 'button':
        return (
          <button
            style={{ backgroundColor: component.color }}
            className="px-4 py-2 rounded text-white mb-4"
          >
            {component.text || 'Button'}
          </button>
        );
      default:
        return null;
    }
  };

  export default renderComponent