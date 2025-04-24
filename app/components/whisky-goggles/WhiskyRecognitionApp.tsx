"use client";

import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { WhiskyProvider, useWhisky } from "../../context/WhiskyContext";

// Import components
import Header from "./layout/Header";
import TabNavigation from "./layout/TabNavigation";
import ImageUploader from "./image-input/ImageUploader";
import CameraCapture from "./image-input/CameraCapture";
import WhiskyResults from "./results/WhiskyResults";
import ErrorMessage from "./results/ErrorMessage";
import PriceHistory from "./results/PriceHistory";

// Main content component
function WhiskyRecognitionContent() {
  const [activeTab, setActiveTab] = useState("upload");
  const { file, preview, results, loading, analyzeImage, resetRecognition } = useWhisky();
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    resetRecognition();
  };
  
  const handleAnalyzeImage = async () => {
    if (file) {
      // If we have a file from upload, use that
      await analyzeImage(file);
    } else if (preview) {
      // If we have a preview from webcam, use that
      await analyzeImage(preview);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* App Header */}
      <Header />

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        {/* Tabs */}
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Input Area */}
        <div className="mb-6">
          {activeTab === "upload" && <ImageUploader />}
          {activeTab === "camera" && <CameraCapture />}
        </div>

        {/* Action Buttons */}
        {preview && !results && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleAnalyzeImage}
              disabled={loading}
              className={`flex items-center py-2 px-6 rounded-lg font-medium ${
                loading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              } transition-colors`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  Identify Whisky <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Error Message */}
        <ErrorMessage />

        {/* Results Display */}
        <WhiskyResults />
      </div>

      {/* Price History */}
      <PriceHistory />
    </div>
  );
}

// Wrapped with provider
export default function WhiskyRecognitionApp() {
  return (
    <WhiskyProvider>
      <WhiskyRecognitionContent />
    </WhiskyProvider>
  );
}
