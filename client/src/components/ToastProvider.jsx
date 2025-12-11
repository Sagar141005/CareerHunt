import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  const darkMode = localStorage.getItem("theme") === "dark";

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: darkMode ? "#171717" : "#ffffff",
          color: darkMode ? "#fafafa" : "#111",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "14px",
        },

        success: {
          duration: 2500,
          style: {
            background: darkMode ? "#1d4022" : "#e7f9ed",
            color: darkMode ? "#b8f3c2" : "#256d3a",
          },
        },

        error: {
          duration: 3000,
          style: {
            background: darkMode ? "#40201d" : "#ffe8e6",
            color: darkMode ? "#f3b8b8" : "#a12623",
          },
        },
      }}
      containerStyle={{
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "calc(100% - 20px)",
        padding: "0 10px",
      }}
    />
  );
};

export default ToastProvider;
