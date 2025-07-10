import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Loader from "./components/Loader";
import ToastProvider from "./components/ToastProvider";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import OAuthCallback from "./pages/OAuthCallback";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/Signup"));
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
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />

          {/* Routes requiring user to be logged in */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            } />
          <Route
            path="/setting"
            element={
              <RequireAuth>
                <Setting />
              </RequireAuth>
            } />
          <Route
            path="/profile/edit"
            element={
              <RequireAuth>
                <EditProfile />
              </RequireAuth>
            } />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />

          {/* Job-Seeker routes */}
          <Route
            path="/jobs"
            element={
              <RequireAuth>
                <FindJob />
              </RequireAuth>
            }
          />
          <Route
            path="/saved"
            element={
              <RequireAuth>
                <Saved />
              </RequireAuth>
            }
          />
          <Route
            path="/my-applications"
            element={
              <RequireAuth>
                <MyApplications />
              </RequireAuth>
            }
          />
          <Route
            path="/resume"
            element={
              <RequireAuth>
                <ErrorBoundary>
                  <Resumes />
                </ErrorBoundary>
              </RequireAuth>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <RequireAuth>
                <JobDetails />
              </RequireAuth>
            }
          />
          <Route
            path="/apply/:jobId"
            element={
              <RequireAuth>
                <Apply />
              </RequireAuth>
            }
          />
         
          {/* Public routes */}
          <Route 
            path="/post/job" 
            element={
              <RequireRole role="recruiter">
                <PostJob />
              </RequireRole>
            } />
          <Route 
            path="/post/job/edit/:jobId" 
            element={
              <RequireRole role="recruiter">
                <EditJobPost />
              </RequireRole>
            } />
          <Route 
            path="/job/posts" 
            element={
              <RequireRole role="recruiter">
                <JobPosts />
              </RequireRole>
            } />
          <Route 
            path="/applications" 
            element={
              <RequireRole role="recruiter">
                <Applications />
              </RequireRole>
            } />
          <Route 
            path="/applications/applicants/:jobId" 
            element={
              <RequireRole role="recruiter">
                <Applicants />
              </RequireRole>
            } />
          <Route 
            path="/applications/applicant/:jobPostId/:userId" 
            element={
              <RequireRole role="recruiter">
                <ApplicantDetail />
              </RequireRole>
            } />          

        </Routes>
      </Suspense>
      <ToastProvider />
    </>
  );
}

export default App;
