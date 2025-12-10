import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDashboard from "../components/job-seeker/UserDashboard";
import RecruiterDashboard from "../components/recruiter/RecruiterDashboard";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <p>Loading...</p>;
  }

  if (user.role === "jobseeker") {
    return <UserDashboard />;
  }

  if (user.role === "recruiter") {
    return <RecruiterDashboard />;
  }

  return <p>Invalid user role</p>;
};

export default Dashboard;
