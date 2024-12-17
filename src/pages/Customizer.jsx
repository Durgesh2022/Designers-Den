import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, TextPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Home = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState('');
  const [textInput, setTextInput] = useState('');
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  // Generate the content for the active editor tab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "textpicker":
        return <TextPicker textInput={textInput} setTextInput={setTextInput} applyText={() => handleTextDecal('logo')} />;
      default:
        return null;
    }
  };

  // Handle updating the decal types
  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type] || {};

    if (type === 'backLogo') {
      state.backLogoDecal = result;
    } else if (type === 'pocketLogo') {
      state.pocketLogoDecal = result;
    } else {
      state[decalType.stateProperty] = result;
    }

    // Ensure the correct filter tab is active
    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  // Toggle active filter tab based on the type of shirt
  const handleActiveFilterTab = (tabName) => {
    const updatedFilterTab = { ...activeFilterTab, [tabName]: !activeFilterTab[tabName] };

    // Update the state for logo and full textures based on the filter tab
    if (tabName === "logoShirt") {
      state.isLogoTexture = !updatedFilterTab[tabName];
      state.logoDecal = updatedFilterTab[tabName] ? null : state.logoDecal;
    } else if (tabName === "stylishShirt") {
      state.isFullTexture = !updatedFilterTab[tabName];
    }

    setActiveFilterTab(updatedFilterTab);
  };

  // Read file and handle decals
  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  // Handle text decals and validate input
  const handleTextDecal = (type) => {
    if (textInput.trim()) {
      handleDecals(type, textInput);
      setActiveEditorTab("");
    } else {
      console.error('Text input is empty.');
    }
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="flex flex-col items-center min-h-screen">
              <div className="tabs-container flex flex-col gap-4">
                <div className="editortabs-container">
                  {/* Editor tabs */}
                  {EditorTabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      tab={tab}
                      handleClick={() => setActiveEditorTab(tab.name)}
                    />
                  ))}
                  {generateTabContent()}

                  {/* Filter tabs */}
                  {FilterTabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      tab={tab}
                      isFilterTab
                      isActiveTab={activeFilterTab[tab.name]}
                      handleClick={() => handleActiveFilterTab(tab.name)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Go Back Button */}
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Home;
