import React, { useState } from 'react';

const ComponentEditor = ({ component, onUpdate }) => {
  const [color, setColor] = useState(component.color || '#000000');
  const [text, setText] = useState(component.text || 'Text');
  const [placeholder, setPlaceholder] = useState(component.placeholder || 'Placeholder');
  const [options, setOptions] = useState(component.options || ['Option 1', 'Option 2']);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    onUpdate({ ...component, options: newOptions });
  };

  const updateComponent = (updates) => {
    onUpdate({ ...component, ...updates });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="font-bold mb-2">Edit {component.type}</h3>
      {component.type === 'heading' && (
        <>
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              updateComponent({ text: e.target.value });
            }}
            placeholder="Heading text"
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              updateComponent({ color: e.target.value });
            }}
            className="mb-2"
          />
        </>
      )}
      {component.type === 'input' && (
        <input
          type="text"
          value={placeholder}
          onChange={(e) => {
            setPlaceholder(e.target.value);
            updateComponent({ placeholder: e.target.value });
          }}
          placeholder="Input placeholder"
          className="border p-2 rounded w-full"
        />
      )}
      {component.type === 'dropdown' && (
        <div>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
          ))}
        </div>
      )}
      {component.type === 'button' && (
        <>
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              updateComponent({ text: e.target.value });
            }}
            placeholder="Button text"
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              updateComponent({ color: e.target.value });
            }}
            className="mb-2"
          />
        </>
      )}
    </div>
  );
};

export default ComponentEditor