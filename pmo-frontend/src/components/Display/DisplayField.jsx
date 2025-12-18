// src/components/Display/DisplayField.jsx

import React from 'react';

function DisplayField({ label, value }) {
  // Se o valor não existir ou for vazio, não renderiza nada para manter a interface limpa
  if (!value) {
    return null;
  }

  return (
    <div className="mb-3">
      <p className="mb-0"><strong>{label}</strong></p>
      <p style={{ whiteSpace: 'pre-wrap' }}>{value}</p>
    </div>
  );
}

export default DisplayField;