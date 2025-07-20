// src/components/EngineerNavbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const EngineerNavbar = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleLogout = () => {
    setAuth('', null);
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">Engineer Panel</h1>
      <div className="space-x-6">
        <Link to="/engineerdashboard" className="hover:underline">
          My Assignments
        </Link>
        <Link to="/profile" className="hover:underline">
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default EngineerNavbar;
