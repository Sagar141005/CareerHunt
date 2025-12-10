import mammoth from "mammoth";
import axios from "axios";

export const extractTextFromPDF = async (buffer) => {
  try {
    const pdf = (await import("pdf-parse")).default;
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw error;
  }
};

export const extractTextFromDOCX = async (buffer) => {
  const { value } = await mammoth.extractRawText({ buffer });
  return value;
};

export const fetchAndParseResume = async (url, filetype) => {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(res.data);

  if (filetype === "pdf") return extractTextFromPDF(buffer);
  if (filetype === "docx") return extractTextFromDOCX(buffer);

  throw new Error("Unsupported file type");
};
