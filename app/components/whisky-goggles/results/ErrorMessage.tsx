"use client";

import { FiAlertCircle } from "react-icons/fi";
import { useWhisky } from "../../../context/WhiskyContext";

export default function ErrorMessage() {
  const { error } = useWhisky();

  if (!error) return null;

  return (
    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400 flex items-start">
      <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
      <div>{error}</div>
    </div>
  );
}
