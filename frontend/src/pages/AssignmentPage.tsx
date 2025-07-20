import { useEffect, useState } from 'react';
import axios from 'axios';
import ManagerNavbar from './ManagerNavabar';

const AssignmentPage = () => {
  const [engineers, setEngineers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    engineerId: '',
    projectId: '',
    role: '',
    allocationPercentage: '',
    startDate: '',
    endDate: '',
  });

  const fetchData = async () => {
    const [engRes, projRes, assignRes] = await Promise.all([
      axios.get('http://localhost:5000/api/engineers'),
      axios.get('http://localhost:5000/api/projects'),
      axios.get('http://localhost:5000/api/assignments'),
    ]);
    setEngineers(engRes.data);
    setProjects(projRes.data);
    setAssignments(assignRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async () => {
  //   const start = new Date(form.startDate);
  //   const end = new Date(form.endDate);

  //   if (end < start) {
  //     alert("End date cannot be earlier than start date.");
  //     return;
  //   }
  //   try {
  //     if (isEditing && editId) {
  //       await axios.put(`http://localhost:5000/api/assignments/${editId}`, {
  //         ...form,
  //         allocationPercentage: parseInt(form.allocationPercentage),
  //       });
  //       alert('Assignment updated!');
  //     } else {
  //       await axios.post('http://localhost:5000/api/assignments', {
  //         ...form,
  //         allocationPercentage: parseInt(form.allocationPercentage),
  //       });
  //       alert('Engineer assigned!');
  //     }

  //     setForm({
  //       engineerId: '',
  //       projectId: '',
  //       role: '',
  //       allocationPercentage: '',
  //       startDate: '',
  //       endDate: '',
  //     });

  //     setShowModal(false);
  //     setIsEditing(false);
  //     setEditId(null);
  //     fetchData();
  //   } catch (err) {
  //     alert('Failed to save assignment.');
  //   }
  // };

  const handleSubmit = async () => {
  const start = new Date(form.startDate);
  const end = new Date(form.endDate);

  if (end < start) {
    alert("End date cannot be earlier than start date.");
    return;
  }

  const selectedEngineer = engineers.find((e: any) => e._id === form.engineerId);
  if (!selectedEngineer) {
    alert("Engineer not found.");
    return;
  }

  const engineerAssignments = assignments.filter(
    (a: any) =>
      a.engineerId === form.engineerId &&
      (!isEditing || a._id !== editId) // exclude the current editing record if editing
  );

  const totalAllocated = engineerAssignments.reduce(
    (sum, a) => sum + a.allocationPercentage,
    0
  );

  const newAllocation = parseInt(form.allocationPercentage);
  if (totalAllocated + newAllocation > selectedEngineer.maxCapacity) {
    alert(
      `Engineer ${selectedEngineer.name} has only ${
        selectedEngineer.maxCapacity - totalAllocated
      }% capacity left. Please reduce the allocation.`
    );
    return;
  }

  try {
    if (isEditing && editId) {
      await axios.put(`http://localhost:5000/api/assignments/${editId}`, {
        ...form,
        allocationPercentage: newAllocation,
      });
      alert('Assignment updated!');
    } else {
      await axios.post(`http://localhost:5000/api/assignments`, {
        ...form,
        allocationPercentage: newAllocation,
      });
      alert('Engineer assigned!');
    }

    // reset and reload
    setForm({
      engineerId: '',
      projectId: '',
      role: '',
      allocationPercentage: '',
      startDate: '',
      endDate: '',
    });

    setShowModal(false);
    setIsEditing(false);
    setEditId(null);
    fetchData();
  } catch (err) {
    alert('Failed to save assignment.');
  }
};


  const handleEdit = (assignment: any) => {
    setForm({
      engineerId: assignment.engineerId,
      projectId: assignment.projectId,
      role: assignment.role,
      allocationPercentage: assignment.allocationPercentage.toString(),
      startDate: assignment.startDate?.split('T')[0],
      endDate: assignment.endDate?.split('T')[0],
    });
    setIsEditing(true);
    setEditId(assignment._id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      await axios.delete(`http://localhost:5000/api/assignments/${id}`);
      fetchData();
    }
  };

  const getEngineerName = (id: string) => engineers.find((e: any) => e._id === id)?.name || 'Unknown';
  const getProjectName = (id: string) => projects.find((p: any) => p._id === id)?.name || 'Unknown';

  return (
    <>
      <ManagerNavbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Assignments</h2>
          <button
            onClick={() => {
              setShowModal(true);
              setIsEditing(false);
              setForm({
                engineerId: '',
                projectId: '',
                role: '',
                allocationPercentage: '',
                startDate: '',
                endDate: '',
              });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Assignment
          </button>
        </div>

        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Engineer</th>
              <th className="border px-4 py-2">Project</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Allocation (%)</th>
              <th className="border px-4 py-2">Start</th>
              <th className="border px-4 py-2">End</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a: any) => (
              <tr key={a._id} className="text-center">
                <td className="border px-4 py-2">{getEngineerName(a.engineerId)}</td>
                <td className="border px-4 py-2">{getProjectName(a.projectId)}</td>
                <td className="border px-4 py-2">{a.role}</td>
                <td className="border px-4 py-2">{a.allocationPercentage}%</td>
                <td className="border px-4 py-2">{a.startDate?.split('T')[0]}</td>
                <td className="border px-4 py-2">{a.endDate?.split('T')[0]}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(a)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative">
              <h3 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Assignment' : 'Create Project Assignment'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-4 text-gray-600 text-xl"
              >
                &times;
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm block mb-1">Engineer</label>
                  <select
                    name="engineerId"
                    value={form.engineerId}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Engineer</option>
                    {engineers.map((eng: any) => (
                      <option key={eng._id} value={eng._id}>
                        {eng.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm block mb-1">Project</label>
                  <select
                    name="projectId"
                    value={form.projectId}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Project</option>
                    {projects.map((proj: any) => (
                      <option key={proj._id} value={proj._id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm block mb-1">Role</label>
                  <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g. Backend Developer"
                  />
                </div>

                <div>
                  <label className="text-sm block mb-1">Allocation (%)</label>
                  <input
                    name="allocationPercentage"
                    type="number"
                    value={form.allocationPercentage}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm block mb-1">Start Date</label>
                  <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm block mb-1">End Date</label>
                  <input
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="mt-4 text-right">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  {isEditing ? 'Update' : 'Assign'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AssignmentPage;
