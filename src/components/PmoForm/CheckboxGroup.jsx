// src/components/PmoForm/CheckboxGroup.jsx
import React from 'react';

function CheckboxGroup({ 
  title, 
  options, 
  selectedString, 
  onSelectionChange, 
  otherOption, 
  otherValue, 
  onOtherChange,
  otherName,
  otherPlaceholder = "Por favor, especifique..."
}) {
  
  // ================== INÍCIO DA CORREÇÃO DEFINITIVA ==================
  // GARANTIA FINAL: Força a conversão para String, tratando null/undefined.
  // O operador '??' trata null/undefined, e String() converte qualquer outra coisa.
  const guaranteedString = String(selectedString ?? '');
  const selectedOptions = guaranteedString.split('; ').filter(Boolean);
  // =================== FIM DA CORREÇÃO DEFINITIVA ====================
  
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let newSelected = [...selectedOptions];

    if (checked && !newSelected.includes(value)) {
      newSelected.push(value);
    } else {
      newSelected = newSelected.filter(option => option !== value);
    }
    
    onSelectionChange(newSelected.join('; '));
  };

  const isOtherSelected = otherOption && selectedOptions.includes(otherOption);

  return (
    <div className="form-group mb-4">
      <h5 className="card-title">{title}</h5>
      <div className="row">
        {options.map((option, index) => (
          <div className="col-md-6" key={index}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`${title}-${index}`}
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor={`${title}-${index}`}>
                {option}
              </label>
            </div>
          </div>
        ))}
      </div>
      
      {isOtherSelected && (
        <div className="mt-2">
          <textarea 
            name={otherName}
            value={otherValue || ''} 
            onChange={onOtherChange} 
            className="form-control" 
            rows="2"
            placeholder={otherPlaceholder}
          />
        </div>
      )}
    </div>
  );
}

export default CheckboxGroup;