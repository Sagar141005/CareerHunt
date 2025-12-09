import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import UserNavbar from "../../components/job-seeker/UserNavbar";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  RiAddLine,
  RiPencilLine,
  RiDeleteBin6Line,
  RiTimeLine,
} from "@remixicon/react";
import ConfirmModal from "../../components/ConfirmModal";

const Resumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/ai/resume/all");
      setResumes(response.data.resumes || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load resumes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleCreateNew = () => {
    navigate("/resume/builder/new");
  };

  const handleEdit = (id) => {
    navigate(`/resume/builder/${id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/ai/resume/${deleteId}`);
      toast.success("Resume deleted.");
      fetchResumes();
    } catch (error) {
      toast.error("Failed to delete resume.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col transition-colors duration-300">
      <UserNavbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 w-full py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
            My Resumes
          </h1>

          <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base max-w-xl">
            Create, manage, and tailor your resumes with AI.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-4 animate-pulse"
              >
                <div className="h-full bg-neutral-100 dark:bg-neutral-800 rounded-lg"></div>
                <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              onClick={handleCreateNew}
              className="group relative aspect-[3/4] flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900/50 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl cursor-pointer hover:border-[#0164FC] hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 shadow-sm group-hover:text-[#0164FC] group-hover:scale-110 transition-all duration-300">
                <RiAddLine size={32} />
              </div>
              <h3 className="mt-4 font-bold text-neutral-900 dark:text-white group-hover:text-[#0164FC] transition-colors">
                New Resume
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Start from scratch
              </p>
            </div>

            {resumes.map((resume) => (
              <div
                key={resume._id}
                onClick={() => handleEdit(resume._id)}
                className="group relative aspect-[3/4] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
              >
                <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 p-4 flex justify-center overflow-hidden relative">
                  <div className="w-full h-full bg-white shadow-sm px-3 py-4 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity transform origin-top hover:scale-[1.02] duration-500">
                    <div className="flex gap-2 items-center border-b border-gray-100 pb-2 mb-1">
                      <div className="h-6 w-6 bg-gray-100 rounded-full"></div>
                      <div className="space-y-1 flex-1">
                        <div className="h-1.5 w-1/2 bg-gray-800 rounded-full"></div>
                        <div className="h-1 w-1/3 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-gray-100 rounded-full"></div>
                      <div className="h-1 w-5/6 bg-gray-100 rounded-full"></div>
                      <div className="h-1 w-full bg-gray-100 rounded-full"></div>
                    </div>
                    <div className="mt-2 h-1.5 w-1/4 bg-blue-100 rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-gray-100 rounded-full"></div>
                      <div className="h-1 w-4/5 bg-gray-100 rounded-full"></div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/5 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <button className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 justify-center hover:scale-[1.02] transition-all duration-300">
                      Edit <RiPencilLine size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 relative">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 pr-2">
                      <h3
                        className="font-bold text-sm text-neutral-900 dark:text-white truncate"
                        title={resume.title}
                      >
                        {resume.title || "Untitled"}
                      </h3>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">
                        {resume.personal?.profession || "General Resume"}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleDeleteClick(e, resume._id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      title="Delete Resume"
                    >
                      <RiDeleteBin6Line size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-400 mt-3 pt-3 border-t border-neutral-50 dark:border-neutral-800/50">
                    <RiTimeLine size={12} />
                    <span>
                      Edited {new Date(resume.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <ConfirmModal
        show={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Resume?"
        message="Are you sure you want to delete this resume? This action is permanent and cannot be undone."
        confirmText="Delete"
        danger={true}
      />
    </div>
  );
};

export default Resumes;
