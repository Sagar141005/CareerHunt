import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/404.json";
import { RiArrowLeftLine } from "@remixicon/react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen relative flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto">
        <Link
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <RiArrowLeftLine size={20} /> Back to Home
        </Link>

        <Lottie animationData={animationData} loop style={{ height: 300 }} />

        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white text-center px-4">
          The page you're looking for doesn't exist.
        </h1>
      </div>
    </div>
  );
}
