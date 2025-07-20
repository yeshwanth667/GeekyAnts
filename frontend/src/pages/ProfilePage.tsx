import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import EngineerNavbar from './EngineerNavbar';

const ProfilePage = () => {
  const { user, token, setAuth } = useAuthStore();
  const [form, setForm] = useState({
    name: '',
    email: '',
    skills: '',
    seniority: '',
    department: '',
    maxCapacity: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        skills: user.skills?.join(', ') || '',
        seniority: user.seniority || '',
        department: user.department || '',
        maxCapacity: user.maxCapacity?.toString() || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const maxCapacityNum = parseInt(form.maxCapacity);

    if (isNaN(maxCapacityNum) || maxCapacityNum <= 0 || maxCapacityNum > 100) {
      alert('Max Capacity must be a number between 1 and 100');
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/engineers/${user._id}`, {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()),
        maxCapacity: maxCapacityNum,
      });

      alert('Profile updated successfully!');
      setAuth(token!, res.data); // update the user in store
    } catch (err) {
      alert('Update failed. Try again.');
      console.error(err);
    }
  };

  return (
    <>
      <EngineerNavbar />
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>

        <div className="bg-white shadow p-6 rounded space-y-4 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, Python"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Seniority</label>
              <select
                name="seniority"
                value={form.seniority}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <div>
              <label className="text-sm">Max Capacity (%)</label>
              <input
                type="number"
                name="maxCapacity"
                value={form.maxCapacity}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Department</label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="text-right">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
