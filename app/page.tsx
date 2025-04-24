"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiCamera, FiUpload, FiCheckCircle, FiAlertCircle, FiDatabase, FiDollarSign, FiInfo, FiImage, FiBarChart2 } from "react-icons/fi";
import Webcam from "react-webcam";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Configuration
const API_URL = "http://13.61.196.104:5000/api"; // Replace with your EC2 IP

import WhiskyRecognition from "./components/WhiskyRecognition";

export default function Home() {
  return (
    <main>
      <WhiskyRecognition />
    </main>
  );
}
