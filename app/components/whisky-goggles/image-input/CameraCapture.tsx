"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiCamera, FiX, FiUpload, FiAlertCircle } from "react-icons/fi";
import Webcam from "react-webcam";
import { useWhisky } from "../../../context/WhiskyContext";

// Define interfaces to fix type errors
interface MediaDeviceWithVendor {
  userAgent?: string;
  vendor?: string;
  opera?: unknown;
}

export default function CameraCapture() {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isCameraSupported, setIsCameraSupported] = useState(true);
  const webcamRef = useRef<Webcam | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { preview, setPreview, setResults, setError, setFile } = useWhisky();

  // Check camera support and detect mobile devices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Detect mobile devices
      const userAgentString = navigator.userAgent || '';
      const vendorString = navigator.vendor || '';
      const operaString = ((window as unknown) as MediaDeviceWithVendor).opera || '';
      
      // Check if it's a mobile device
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        (userAgentString + vendorString + String(operaString)).toLowerCase()
      );
      
      setIsMobile(isMobileDevice);
      
      // Check camera support
      const isMediaDevicesSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setIsCameraSupported(isMediaDevicesSupported);
      
      if (!isMediaDevicesSupported) {
        setCameraError("Your browser doesn&apos;t support camera access. Please use the upload option instead.");
      }
    }
  }, []);

  const toggleCamera = async () => {
    if (cameraActive) {
      // Stop the camera if active
      resetImage();
    } else {
      // Start the camera
      setCameraError(null);
      
      try {
        // Check if camera is available - with browser compatibility check
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera access is not supported by your browser");
        }
        
        // Simply try to access the camera instead of checking devices first
        await navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            // Stop this test stream immediately - Webcam component will create its own
            stream.getTracks().forEach(track => track.stop());
            setCameraActive(true);
          })
          .catch(err => {
            throw err;
          });
        
      } catch (err) {
        console.error('Error accessing camera:', err);
        if (err instanceof Error) {
          setCameraError(`Camera error: ${err.message}`);
        } else {
          setCameraError('Failed to access camera. Please check your permissions.');
        }
      }
    }
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPreview(imageSrc);
    }
  };

  const resetImage = () => {
    setPreview(null);
    setResults(null);
    setError(null);
    if (webcamRef.current) {
      const stream = webcamRef.current.video?.srcObject as MediaStream;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
    setCameraActive(false);
    setCameraError(null);
  };
  
  // Handle file upload as alternative to camera
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      setResults(null);
      setError(null);
    }
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // If camera is not supported, just show the file upload option
  if (!isCameraSupported) {
    return (
      <div className="text-center p-4">
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <FiAlertCircle className="text-amber-500 mt-1 mr-2" />
            <div>
              <p className="text-amber-800 font-medium">Camera not available</p>
              <p className="text-amber-700 text-sm mt-1">
                Your browser doesn&apos;t support camera access or permissions were denied.
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={triggerFileUpload}
          className="mx-auto flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg transition-colors"
        >
          <FiUpload className="mr-2" />
          Upload a Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          capture="environment"
        />
        
        {preview && (
          <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg mt-4">
            <Image
              src={preview}
              alt="Preview"
              width={300}
              height={300}
              className="object-contain w-auto h-auto"
              priority
            />
            <button
              onClick={() => {
                setPreview(null);
                setFile(null);
              }}
              className="absolute top-2 right-2 bg-gray-800/70 text-white p-1 rounded-full hover:bg-gray-900/70"
            >
              <FiX size={16} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center">
      {cameraError && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          <p>{cameraError}</p>
          <p className="mt-2">Please try using the upload option instead:</p>
          <button
            onClick={triggerFileUpload}
            className="mt-3 flex items-center justify-center mx-auto bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <FiUpload className="mr-2" />
            Upload from device
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {!cameraActive && !cameraError ? (
        <div>
          <button
            onClick={toggleCamera}
            className="mx-auto flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg transition-colors"
          >
            <FiCamera className="mr-2" />
            {isMobile ? "Take Photo" : "Start Camera"}
          </button>
          
          <div className="mt-6 flex items-center justify-center">
            <hr className="w-16 border-gray-300" />
            <span className="mx-4 text-gray-500 text-sm">OR</span>
            <hr className="w-16 border-gray-300" />
          </div>
          
          <button
            onClick={triggerFileUpload}
            className="mt-6 mx-auto flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition-colors"
          >
            <FiUpload className="mr-2" />
            Upload a Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      ) : preview ? (
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
            onClick={resetImage}
            className="absolute top-2 right-2 bg-gray-800/70 text-white p-1 rounded-full hover:bg-gray-900/70"
          >
            <FiX size={16} />
          </button>
        </div>
      ) : (
        <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }}
            className="w-full h-[300px] object-cover"
            onUserMediaError={(error: string | DOMException) => {
              console.error('Webcam error:', error);
              const errorMessage = typeof error === 'string'
                ? error
                : error.name || 'Unknown camera error';
              setCameraError(`Camera access denied: ${errorMessage}. Please check your browser permissions or try a different device.`);
              setCameraActive(false);
            }}
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={captureImage}
              className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border-2 border-amber-500"
            >
              <FiCamera className="text-amber-600" size={24} />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
