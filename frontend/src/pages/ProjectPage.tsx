// src/pages/ProjectPage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import ManagerNavbar from './ManagerNavabar';

interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  requiredSkills: string[];
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'planning',
    requiredSkills: '',
    teamSize: 0,
    managerId: '', // Will be filled from localStorage or context
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get('http://localhost:5000/api/projects');
    setProjects(res.data);
  };

  const handleCreate = async () => {
    const start = new Date(newProject.startDate);
    const end = new Date(newProject.endDate);

    if (end < start) {
      alert("Project end date must be after the start date.");
      return;
    }
    try {
      const payload = {
        ...newProject,
        requiredSkills: newProject.requiredSkills.split(',').map((s) => s.trim()),
        managerId: JSON.parse(localStorage.getItem('user') || '{}')._id,
      };
      await axios.post('http://localhost:5000/api/projects', payload);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      alert('Failed to create project');
    }
  };



  return (
    <>
      <ManagerNavbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Project Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Project
          </button>
        </div>

        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project._id} className="p-4 border rounded bg-white shadow">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold text-blue-700">{project.name}</h3>
                <span className={`text-sm px-2 py-1 rounded ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{project.description}</p>
              <p className="text-sm text-gray-500">
                📅 {new Date(project.startDate).toLocaleDateString()} –{' '}
                {new Date(project.endDate).toLocaleDateString()}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {project.requiredSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
              <h3 className="text-xl font-bold mb-4">Create New Project</h3>
              <div className="space-y-3">
                <input
                  placeholder="Project Name"
                  className="w-full border p-2 rounded"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
                <input
                  placeholder="Description"
                  className="w-full border p-2 rounded"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                />
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                />
                <select
                  className="w-full border p-2 rounded"
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
                <input
                  placeholder="Required Skills (comma separated)"
                  className="w-full border p-2 rounded"
                  value={newProject.requiredSkills}
                  onChange={(e) => setNewProject({ ...newProject, requiredSkills: e.target.value })}
                />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-gray-200 text-gray-800';
    case 'planning':
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
}
