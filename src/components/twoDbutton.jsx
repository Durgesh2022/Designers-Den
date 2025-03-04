import React from 'react';

const TwoDButton = ({ onClick }) => {
  return (
    <button
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      Show 2D View
    </button>
  );
};

export default TwoDButton;
