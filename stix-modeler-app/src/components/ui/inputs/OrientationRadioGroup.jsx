import React, { useState, useEffect } from 'react';

const OrientationRadioGroup = ({ defaultOrientation, onOrientationChange }) => {
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (defaultOrientation) {
      setSelectedOption(defaultOrientation);
    }
  }, [defaultOrientation]);

  const handleOptionChange = (event) => {
    const newOrientation = event.target.value;
    setSelectedOption(newOrientation);
    if (onOrientationChange) {
      onOrientationChange(newOrientation);
    } else {
      console.error("onOrientationChange function is missing!");
    }
  };
  
  return (
    <div>
      <p>Choose Orientation</p>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input 
          type="radio" 
          id="rowView" 
          name="orientation" 
          value="Row View" 
          checked={selectedOption === 'Row View'} 
          onChange={handleOptionChange} 
        />
        <label htmlFor="rowView">Row View</label>

        <input 
          type="radio" 
          id="columnView" 
          name="orientation" 
          value="Column View" 
          checked={selectedOption === 'Column View'} 
          onChange={handleOptionChange} 
        />
        <label htmlFor="columnView">Column View</label>
      </div>
    </div>
  );
};

export default OrientationRadioGroup;
