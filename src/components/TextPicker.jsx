import React from 'react';
import CustomButton from './CustomButton';
import state from '../store';

const TextPicker = ({ prompt, setPrompt }) => {
  const handleApplyText = (field) => {
    state[field] = prompt;  // Set the text to the specified field
    state[`${field}Decal`] = ''; // Clear the corresponding decal
  };

  const handleClearText = (field) => {
    state[field] = '';  // Clear the text
    state[`${field}Decal`] = ''; // Remove the corresponding decal
  };

  return (
    <div className="filepicker-container">
      <div className="flex-1 flex flex-col">
        <textarea
          placeholder="Enter text for the logo"
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}  // Update prompt state as the user types
          className="filepicker-textarea"
        />
        <label htmlFor="file-upload" className="filepicker-label">
          Enter Logo Text
        </label>

        <p className="mt-2 text-gray-500 text-xs truncate">
          {prompt === '' ? "No text entered" : prompt}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton 
          type="outline"
          title="Apply to Front Logo"
          handleClick={() => handleApplyText('logoText')}
          customStyles="text-xs"
        />
        <CustomButton 
          type="outline"
          title="Apply to Back Logo"
          handleClick={() => handleApplyText('backLogoText')}
          customStyles="text-xs"
        />
        <CustomButton 
          type="outline"
          title="Apply to Pocket Logo"
          handleClick={() => handleApplyText('pocketLogoText')}
          customStyles="text-xs"
        />

        <CustomButton 
          type="outline"
          title="Clear Front Logo"
          handleClick={() => handleClearText('logoText')}
          customStyles="text-xs"
        />
        <CustomButton 
          type="outline"
          title="Clear Back Logo"
          handleClick={() => handleClearText('backLogoText')}
          customStyles="text-xs"
        />
        <CustomButton 
          type="outline"
          title="Clear Pocket Logo"
          handleClick={() => handleClearText('pocketLogoText')}
          customStyles="text-xs"
        />
      </div>
    </div>
  );
};

export default TextPicker;
