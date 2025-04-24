"use client";

import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiX } from "react-icons/fi";
import { useWhisky } from "../../../context/WhiskyContext";

export default function ImageUploader() {
  const { 
    file, 
    setFile, 
    preview, 
    setPreview, 
    setResults, 
    error,  
    setError  
  } = useWhisky();

  // Dropzone configuration
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        const previewUrl = URL.createObjectURL(acceptedFiles[0]);
        setPreview(previewUrl);
        setResults(null);
        setError(null);
      }
    }
  });

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        preview
          ? "border-gray-300 dark:border-gray-600"
          : "border-amber-300 dark:border-amber-700 hover:border-amber-500 dark:hover:border-amber-500"
      }`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg">
          <Image
            src={preview}
            alt="Preview"
            width={300}
            height={300}
            className="object-contain w-auto h-auto" 
            priority
          />
          <button
            onClick={handleReset}
            className="absolute top-2 right-2 bg-gray-800/70 text-white p-1 rounded-full hover:bg-gray-900/70"
          >
            <FiX size={16} />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <FiUpload className="mx-auto text-amber-500 dark:text-amber-400" size={48} />
          <p className="text-gray-600 dark:text-gray-300">
            Drag & drop an image here, or click to select
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Supports JPG, PNG, WEBP
          </p>
        </div>
      )}
    </div>
  );
}
