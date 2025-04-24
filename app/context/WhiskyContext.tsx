"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// Configure API endpoint
const API_ENDPOINT = "/api";  // Using local proxy to avoid CORS issues

// Define our context types
interface WhiskyContextType {
  // State
  file: File | null;
  preview: string | null;
  results: any | null;
  loading: boolean;
  error: string | null;
  priceInfo: Record<string, number>;
  databaseInfo: { database_size: number } | null;
  savedPrices: Array<{ name: string, price: number, timestamp: number }>;
  darkMode: boolean;
  
  // Actions
  setFile: (file: File | null) => void;
  setPreview: (preview: string | null) => void;
  setResults: (results: any | null) => void;
  setError: (error: string | null) => void;
  analyzeImage: (imageData: string | File) => Promise<void>;
  handlePriceUpdate: (whiskyName: string, price: number) => void;
  savePrice: (whiskyName: string) => void;
  resetRecognition: () => void;
  toggleDarkMode: () => void;
}

// Create the context
const WhiskyContext = createContext<WhiskyContextType | undefined>(undefined);

// Provider component
export function WhiskyProvider({ children }: { children: ReactNode }) {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceInfo, setPriceInfo] = useState<Record<string, number>>({});
  const [databaseInfo, setDatabaseInfo] = useState<{ database_size: number } | null>(null);
  const [savedPrices, setSavedPrices] = useState<Array<{ name: string, price: number, timestamp: number }>>([]);
  const [darkMode, setDarkMode] = useState(false);
  
  // Initialize dark mode and load saved prices
  useEffect(() => {
    // Check for dark mode preference
    if (typeof window !== 'undefined') {
      const darkModePreference = localStorage.getItem("darkMode") === "true";
      setDarkMode(darkModePreference);
      if (darkModePreference) {
        document.documentElement.classList.add('dark');
      }
    }
    
    // Load saved prices from localStorage
    const savedPricesData = localStorage.getItem("savedPrices");
    if (savedPricesData) {
      try {
        setSavedPrices(JSON.parse(savedPricesData));
      } catch (e) {
        console.error("Error parsing saved prices:", e);
      }
    }
    
    // Fetch database info
    fetchDatabaseInfo();
  }, []);
  
  // Fetch database info
  const fetchDatabaseInfo = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/database_info`);
      if (response.data.success) {
        setDatabaseInfo(response.data);
      }
    } catch (err) {
      console.error("Error fetching database info:", err);
    }
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Update price information
  const handlePriceUpdate = (whiskyName: string, price: number) => {
    const newPriceInfo = { ...priceInfo, [whiskyName]: price };
    setPriceInfo(newPriceInfo);
  };
  
  // Save price to localStorage
  const savePrice = (whiskyName: string) => {
    const price = priceInfo[whiskyName];
    if (price) {
      const newSavedPrices = [...savedPrices.filter(p => p.name !== whiskyName), { name: whiskyName, price, timestamp: Date.now() }];
      setSavedPrices(newSavedPrices);
      localStorage.setItem("savedPrices", JSON.stringify(newSavedPrices));
    }
  };
  
  // Reset recognition state
  const resetRecognition = () => {
    setFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
  };
  
  // Analyze image - API call
  const analyzeImage = async (imageData: string | File) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData
      const formData = new FormData();
      
      if (file instanceof File) {
        // If we have a file object, use it directly
        formData.append("image", file);
      } else if (typeof imageData === 'string') {
        // For webcam captures or base64 strings
        // Strip any data URL prefix if present
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        
        // Create a blob from the base64 data
        const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
        
        // Create a file from the blob
        const imageFile = new File([blob], "webcam-capture.jpeg", { type: "image/jpeg" });
        
        // Append file to form data
        formData.append("image", imageFile);
      }
      
      // Send to backend API
      const response = await axios.post(`${API_ENDPOINT}/recognize`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("API Response:", response.data);
      if (response.data.success) {
        setResults(response.data);
      } else {
        setError(response.data.error || "Failed to analyze image. Please try again.");
      }
    } catch (err: any) {
      console.error("Error analyzing image:", err);
      if (err.response && err.response.data) {
        console.error("Server error details:", err.response.data);
        setError(`Server error: ${err.response.data.error || "Unknown error"}`);
      } else {
        setError(`Error: ${err.message || "Something went wrong"}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Provide context value
  const value = {
    file,
    preview, 
    results,
    loading,
    error,
    priceInfo,
    databaseInfo,
    savedPrices,
    darkMode,
    setFile,
    setPreview,
    setResults,
    setError,
    analyzeImage,
    handlePriceUpdate,
    savePrice,
    resetRecognition,
    toggleDarkMode
  };
  
  return (
    <WhiskyContext.Provider value={value}>
      {children}
    </WhiskyContext.Provider>
  );
}

// Custom hook to use the context
export function useWhisky() {
  const context = useContext(WhiskyContext);
  if (context === undefined) {
    throw new Error("useWhisky must be used within a WhiskyProvider");
  }
  return context;
}
