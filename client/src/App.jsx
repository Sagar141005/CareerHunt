import React, { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Loader from "./components/Loader";
import ToastProvider from "./components/ToastProvider";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import OAuthCallback from "./pages/OAuthCallback";

const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/(auth)/Signup"));
const Login = lazy(() => import("./pages/(auth)/Login"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Setting = lazy(() => import("./pages/Setting"));
const EditProfile = lazy(() => import("./pages/EditProfile"));

const PostJob = lazy(() => import("./pages/(recruiter)/PostJob"));
const EditJobPost = lazy(() => import("./pages/(recruiter)/EditJobPost"));
const JobPosts = lazy(() => import("./pages/(recruiter)/JobPosts"));
const Applications = lazy(() => import("./pages/(recruiter)/Applications"));
const Applicants = lazy(() => import("./pages/(recruiter)/Applicants"));
const ApplicantDetail = lazy(() =>
  import("./pages/(recruiter)/ApplicantDetail")
);

const FindJob = lazy(() => import("./pages/(job-seeker)/FindJob"));
const Saved = lazy(() => import("./pages/(job-seeker)/Saved"));
const MyApplications = lazy(() =>
  import("./pages/(job-seeker)/MyApplications")
);
const JobDetails = lazy(() => import("./pages/(job-seeker)/JobDetails"));
const Apply = lazy(() => import("./pages/(job-seeker)/Apply"));
const Resumes = lazy(() => import("./pages/(job-seeker)/Resumes"));
const ResumeBuilder = lazy(() => import("./pages/(job-seeker)/ResumeBuilder"));

const ProtectedLayout = () => {
  return (
    <RequireAuth>
      <Outlet />
    </RequireAuth>
  );
};

const RecruiterLayout = () => {
  return (
    <RequireRole role="recruiter">
      <Outlet />
    </RequireRole>
  );
};

function App() {
  return (
    <>
      <ErrorBoundary>
        <ToastProvider />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />

            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/setting" element={<Setting />} />

              <Route path="/jobs" element={<FindJob />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/my-applications" element={<MyApplications />} />
              <Route path="/apply/:jobId" element={<Apply />} />

              <Route path="/resume" element={<Resumes />} />
              <Route path="/resume/builder/:id" element={<ResumeBuilder />} />

              <Route element={<RecruiterLayout />}>
                <Route path="/post/job" element={<PostJob />} />
                <Route path="/post/job/edit/:jobId" element={<EditJobPost />} />
                <Route path="/job/posts" element={<JobPosts />} />
                <Route path="/applications" element={<Applications />} />
                <Route
                  path="/applications/applicants/:jobId"
                  element={<Applicants />}
                />
                <Route
                  path="/applications/applicant/:jobPostId/:userId"
                  element={<ApplicantDetail />}
                />
              </Route>
            </Route>

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
