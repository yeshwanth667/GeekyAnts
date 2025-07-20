import { useEffect, useState } from 'react';
import axios from 'axios';
import EngineerNavbar from './EngineerNavbar';
import { useAuthStore } from '../store/useAuthStore';

interface Assignment {
  _id: string;
  projectId: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  };
  role: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
}

const EngineerDashboard = () => {
  const { user, token } = useAuthStore();
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/assignments');
      const allAssignments = res.data;

      // Filter only current user's assignments
      const filtered = allAssignments.filter((a: any) => a.engineerId === user._id);

      // Fetch related project data
      const enriched = await Promise.all(
        filtered.map(async (a: any) => {
          const project = await axios.get(`http://localhost:5000/api/projects/${a.projectId}`);
          return {
            ...a,
            projectId: project.data,
          };
        })
      );

      setAssignments(enriched);
    } catch (err) {
      console.error('Failed to fetch assignments', err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <>
      <EngineerNavbar />
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">My Assignments</h2>

        {assignments.length === 0 ? (
          <p className="text-gray-600">No assignments found.</p>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="border rounded p-4 shadow bg-white"
              >
                <h3 className="text-lg font-semibold">{assignment.projectId.name}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {assignment.projectId.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-800">
                  <div><strong>Role:</strong> {assignment.role}</div>
                  <div><strong>Allocation:</strong> {assignment.allocationPercentage}%</div>
                  <div><strong>Start:</strong> {new Date(assignment.startDate).toLocaleDateString()}</div>
                  <div><strong>End:</strong> {new Date(assignment.endDate).toLocaleDateString()}</div>
                </div>

                {/* <div className="mt-3">
                  <div className="text-xs mb-1 text-gray-600">Time Progress</div>
                  <div className="h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-blue-500 rounded"
                      style={{ width: `${getTimeProgress(assignment.startDate, assignment.endDate)}%` }}
                    />
                  </div>
                </div> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

// Helper to calculate timeline progress
const getTimeProgress = (start: string, end: string) => {
  const now = new Date().getTime();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (now <= s) return 0;
  if (now >= e) return 100;
  return Math.floor(((now - s) / (e - s)) * 100);
};

export default EngineerDashboard;
