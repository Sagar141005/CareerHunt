import JobCard from "./components/JobCard"
import Navbar from "./components/HomeNavbar"
import Home from "./pages/Home"
import Review from "./components/Review"
import Footer from "./components/Footer"
import UserDashboard from "./pages/UserDashboard"
import RecruiterDashboard from "./pages/RecruiterDashboard"
import JobPost from "./components/JobPost"
import Signup from "./pages/signup"
import Login from "./pages/Login"
import { Route, Routes } from "react-router-dom"



function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />

    </Routes>
  )
}

export default App
