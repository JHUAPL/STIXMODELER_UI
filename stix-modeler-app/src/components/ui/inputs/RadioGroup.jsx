import React, { useState, useEffect } from 'react';

const RadioGroup = ({ defaultLayoutMethod, onLayoutChange }) => {
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (defaultLayoutMethod) {
      setSelectedOption(defaultLayoutMethod);
    }
  }, [defaultLayoutMethod]);

  const handleOptionChange = (event) => {
    const newLayout = event.target.value;
    setSelectedOption(newLayout);
    if (onLayoutChange) {  
      onLayoutChange(newLayout);
    } else {
      console.error("onLayoutChange function is missing!");
    }
  };
  
  return (
    <div>
      <p>Choose Layout Mode</p>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input 
          type="radio" 
          id="hierarchy" 
          name="layout" 
          value="Hierarchy" 
          checked={selectedOption === 'Hierarchy'} 
          onChange={handleOptionChange} 
        />
        <label htmlFor="hierarchy">Hierarchy</label>

        <input 
          type="radio" 
          id="grid" 
          name="layout" 
          value="Grid" 
          checked={selectedOption === 'Grid'} 
          onChange={handleOptionChange} 
        />
        <label htmlFor="grid">Grid</label>
      </div>
      {/* <div>
        <input 
          type="radio" 
          id="randomized" 
          name="layout" 
          value="Randomized" 
          checked={selectedOption === 'Randomized'} 
          onChange={handleOptionChange} 
        />
        <label htmlFor="randomized">Randomized</label>
      </div> */}
    </div>
  );
};

export default RadioGroup;