import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Home from "@/components/pages/Home";
import Courses from "@/components/pages/Courses";
import CourseDetailPage from "@/components/pages/CourseDetailPage";
import LearningPage from "@/components/pages/LearningPage";
import Dashboard from "@/components/pages/Dashboard";
import ProgressPage from "@/components/pages/Progress";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/courses/:courseId/learn" element={<LearningPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </main>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;