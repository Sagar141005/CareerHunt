import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/404.json";
import { RiArrowLeftLine } from "@remixicon/react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen relative flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="hidden sm:flex items-center justify-center h-12 w-12 rounded-full bg-white dark:bg-gray-800 top-4 left-4 shadow-lg cursor-pointer text-gray-400 hover:text-black dark:hover:text-white transition absolute"
      >
        <RiArrowLeftLine />
      </button>

      <Lottie animationData={animationData} loop style={{ height: 300 }} />

      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center px-4">
        The page you're looking for doesn't exist.
      </h1>
    </div>
  );
}
