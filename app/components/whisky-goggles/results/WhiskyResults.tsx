"use client";

import { FiCheckCircle, FiDollarSign } from "react-icons/fi";
import { useWhisky } from "../../../context/WhiskyContext";

// Define proper types for the whisky results
interface WhiskyMatch {
  name: string;
  confidence: number;
  vintage?: string;
  price?: number;
  description?: string;
  image_url?: string;
}

interface WhiskyResultItem {
  label: string;
  matches: WhiskyMatch[];
}

export default function WhiskyResults() {
  const { 
    results, 
    priceInfo, 
    handlePriceUpdate, 
    savePrice, 
    resetRecognition
  } = useWhisky();

  if (!results || !results.results || results.results.length === 0) {
    return (
      <div className="text-center p-6">
        <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12 flex items-center justify-center">
            <FiCheckCircle className="text-gray-400 dark:text-gray-500" size={24} />
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.bottle_detected ? (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-lg flex items-center">
          <FiCheckCircle className="mr-2 flex-shrink-0" />
          <p>Whisky bottle detected! Here are the matches.</p>
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-4 rounded-lg">
          <p>No bottle clearly detected. Results may be less accurate.</p>
        </div>
      )}

        <div>
          <h3 className="text-lg font-medium mb-2">Top Matches:</h3>
          <div className="space-y-4">
            {results.results.map((result: WhiskyResultItem, idx: number) =>
              result.matches.map((match: WhiskyMatch, matchIdx: number) => (
                <div
                  key={`${idx}-${matchIdx}`}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {match.name || "Unknown"}
                    </h4>
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs px-2 py-1 rounded-full">
                      {match.confidence > 1 ? match.confidence.toFixed(0) : Math.round(match.confidence * 100)}% Match
                    </span>
                  </div>
                  
                  {match.vintage && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Vintage: {match.vintage}
                    </p>
                  )}
                  
                  {match.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {match.description}
                    </p>
                  )}
                  
                  <div className="flex items-center mt-4">
                    <FiDollarSign className="text-gray-500 dark:text-gray-400 mr-1" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Record price"
                      value={priceInfo[match.name] || ""}
                      onChange={(e) => handlePriceUpdate(match.name, parseFloat(e.target.value))}
                      className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md p-2 w-24 text-sm"
                    />
                    <button
                      onClick={() => savePrice(match.name)}
                      disabled={!priceInfo[match.name]}
                      className={`ml-2 p-2 rounded-md text-sm ${
                        priceInfo[match.name]
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={resetRecognition}
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-6 rounded-lg font-medium transition-colors"
        >
          Scan Another Bottle
        </button>
      </div>
    </div>
  );
}
