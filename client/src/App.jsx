import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Loader from "./components/Loader";
import ToastProvider from "./components/ToastProvider";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/signup"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Setting = lazy(() => import("./pages/Setting"));
const PostJob = lazy(() => import("./pages/PostJob"));
const EditJobPost = lazy(() => import("./pages/EditJobPost"));
const JobPosts = lazy(() => import("./pages/JobPosts"));
const Applications = lazy(() => import("./pages/Applications"));
const Applicants = lazy(() => import("./pages/Applicants"));
const ApplicantDetail = lazy(() => import("./pages/ApplicantDetail"));
const FindJob = lazy(() => import("./pages/FindJob"));
const Saved = lazy(() => import("./pages/Saved"));
const MyApplications = lazy(() => import("./pages/MyApplications"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Apply = lazy(() => import("./pages/Apply"));
const Resumes = lazy(() => import("./pages/Resumes"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));

function App() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/post/job" element={<PostJob />} />
          <Route path="/post/job/edit/:jobId" element={<EditJobPost />} />
          <Route path="/job/posts" element={<JobPosts />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/applicants/:jobId" element={<Applicants />} />
          <Route path="/applications/applicant/:jobPostId/:userId" element={<ApplicantDetail />} />
          <Route path="/jobs" element={<FindJob />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/apply/:jobId" element={<Apply />} />
          <Route
            path="/resume"
            element={
              <ErrorBoundary>
                <Resumes />
              </ErrorBoundary>
            }
          />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
        </Routes>
      </Suspense>

      <ToastProvider />
    </>
  );
}

export default App;
