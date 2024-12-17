import React from 'react';
import { PhotoshopPicker } from 'react-color';
import { useSnapshot } from 'valtio';

import state from '../store';

const ColorPicker = () => {
  const snap = useSnapshot(state);

  return (
    <div className="absolute left-full ml-3">
      <PhotoshopPicker
        color={snap.color}
        onChange={(color) => (state.color = color.hex)}
        onAccept={() => console.log('Color accepted')} // Optional: handle color acceptance
        onCancel={() => console.log('Color selection canceled')} // Optional: handle color cancellation
      />
    </div>
  );
};

export default ColorPicker;
