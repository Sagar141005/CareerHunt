import JobCard from "./components/JobCard"
import Navbar from "./components/UserNavbar"
import Home from "./pages/Home"
import Review from "./components/Review"
import Footer from "./components/Footer"
import UserDashboard from "./components/UserDashboard"
import RecruiterDashboard from "./components/RecruiterDashboard"
import JobPost from "./components/JobPost"
import Signup from "./pages/signup"
import Login from "./pages/Login"
import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import PostJob from "./pages/PostJob"
import JobPosts from "./pages/JobPosts"
import Applications from "./pages/Applications"
import Applicants from "./pages/Applicants"
import Profile from "./pages/Profile"
import Setting from "./pages/Setting"
import FindJob from "./pages/FindJob"
import Saved from "./pages/Saved"
import MyApplications from "./pages/MyApplications"
import JobDetails from "./pages/JobDetails"


function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/setting" element={<Setting/>} />
      <Route path="/post/job" element={<PostJob />} />
      <Route path="/job/posts" element={<JobPosts />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/applications/applicants/:jobId" element={<Applicants />} />

      <Route path="/jobs" element={<FindJob />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/my-applications" element={<MyApplications />} />
      <Route path="/jobs/:jobId" element={<JobDetails />} />
    </Routes>
    
  )
}


export default App
