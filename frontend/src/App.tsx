import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import EngineerDashboard from './pages/EngineerDashboard';
import ProjectPage from './pages/ProjectPage';
import AssignmentPage from './pages/AssignmentPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { token, user } = useAuthStore();

  return (
    <Router>
      <Routes>
        {!token ? (
          <Route path="*" element={<Login />} />
        ) : user?.role === 'manager' ? (
          <>
            <Route path="/" element={<Navigate to="/managerdashboard" replace />} />
            <Route path="/managerdashboard" element={<ManagerDashboard />} />
            <Route path="/projects" element={<ProjectPage />} />
            <Route path="/assignments" element={<AssignmentPage />} />
            <Route path="*" element={<Navigate to="/managerdashboard" replace />} />
          </>
        ) : user?.role === 'engineer' ? (
          <>
            <Route path="/" element={<Navigate to="/engineerdashboard" replace />} />
            <Route path="/engineerdashboard" element={<EngineerDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/engineerdashboard" replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
