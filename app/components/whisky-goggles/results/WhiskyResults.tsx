"use client";

import Image from "next/image";
import { FiCheckCircle, FiDollarSign } from "react-icons/fi";
import { useWhisky } from "../../../context/WhiskyContext";

export default function WhiskyResults() {
  const { 
    preview, 
    results, 
    priceInfo, 
    handlePriceUpdate, 
    savePrice, 
    resetRecognition 
  } = useWhisky();

  if (!results || !results.results || results.results.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg p-4 mb-6">
        <h3 className="text-amber-800 dark:text-amber-300 font-medium flex items-center">
          <FiCheckCircle className="mr-2" />
          Bottle Identified!
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden">
          {preview && (
            <Image
              src={preview}
              alt="Analyzed bottle"
              width={400}
              height={500}
              className="object-contain bg-gray-100 dark:bg-gray-900 rounded-lg"
              priority
            />
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Top Matches:</h3>
          <div className="space-y-4">
            {results.results.map((result: any, idx: number) =>
              result.matches.map((match: any, matchIdx: number) => (
                <div
                  key={`${idx}-${matchIdx}`}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {match.name || "Unknown"}
                    </h4>
                    <div className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 text-sm font-medium px-2 py-1 rounded">
                      {match.confidence ? `${match.confidence.toFixed(1)}%` : "N/A"}
                    </div>
                  </div>

                  {/* Price Recording */}
                  <div className="mt-4 flex items-center">
                    <div className="mr-2 text-gray-500 dark:text-gray-400">
                      <FiDollarSign />
                    </div>
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
