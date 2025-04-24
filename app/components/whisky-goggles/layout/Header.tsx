"use client";

import { useState } from "react";
import { 
  FiInfo, 
  FiAward, 
  FiMoon, 
  FiSun, 
  FiX 
} from "react-icons/fi";
import { useWhisky } from "../../../context/WhiskyContext";

export default function Header() {
  const [showInfo, setShowInfo] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const { darkMode, toggleDarkMode, databaseInfo } = useWhisky();

  return (
    <div className="bg-gradient-to-r from-amber-800 to-amber-600 rounded-t-lg p-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <FiAward className="text-amber-200 mr-2" />
          <span className="text-amber-100 text-sm font-medium">
            Whisky Goggles - Computer Vision Solution
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-amber-100 text-xs">
            {databaseInfo ? `${databaseInfo.database_size} whiskies` : "Loading database..."}
          </span>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 bg-amber-700 hover:bg-amber-600 rounded-full text-amber-200 transition-colors"
            aria-label="Information"
          >
            <FiInfo size={18} />
          </button>
          <button 
            onClick={toggleDarkMode}
            className="p-2 bg-amber-700 hover:bg-amber-600 rounded-full text-amber-200 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="mt-4 p-3 bg-amber-700/50 rounded-md text-amber-100 text-sm relative">
          <button 
            onClick={() => setShowInfo(false)}
            className="absolute top-2 right-2 text-amber-200 hover:text-white"
          >
            <FiX size={18} />
          </button>
          <h3 className="font-bold mb-2">Whisky Goggles</h3>
          <p>This AI-powered tool identifies whisky bottles from the BAXUS dataset of 470+ bottles. Simply upload an image or take a photo of a bottle to get instant matches.</p>
          <p className="mt-2">Built for the BAXATHON competition using OpenAI's GPT-4o vision model.</p>
          <button 
            onClick={() => setShowTechDetails(!showTechDetails)}
            className="mt-2 text-amber-200 hover:text-white"
          >
            {showTechDetails ? "Hide Technical Details" : "Show Technical Details"}
          </button>
          {showTechDetails && (
            <div className="mt-2">
              <p>✓ Computer Vision for Label Detection</p>
              <p>✓ Feature Matching with 500+ Bottle Database</p>
              <p>✓ High-Accuracy Recognition Engine (GPT-4o)</p>
              <p>✓ Works with Partial Labels &amp; Various Angles</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
