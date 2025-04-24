"use client";

import { FiUpload, FiCamera } from "react-icons/fi";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
      <button
        className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
          activeTab === "upload"
            ? "border-amber-600 text-amber-600 dark:border-amber-500 dark:text-amber-500"
            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        onClick={() => onTabChange("upload")}
      >
        <FiUpload className="mr-2" />
        Upload
      </button>
      <button
        className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
          activeTab === "camera"
            ? "border-amber-600 text-amber-600 dark:border-amber-500 dark:text-amber-500"
            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        onClick={() => onTabChange("camera")}
      >
        <FiCamera className="mr-2" />
        Camera
      </button>
    </div>
  );
}
