// src/pages/ManagerDashboard.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import CapacityBar from '../components/CapacityBar';
import SkillTags from '../components/SkillTags';
import ManagerNavbar from './ManagerNavabar';

export default function ManagerDashboard() {
  const [engineers, setEngineers] = useState([]);

  useEffect(() => {
    const fetchEngineers = async () => {
      const res = await axios.get('http://localhost:5000/api/engineers');
      const engineersWithCapacity: any = await Promise.all(
        res.data.map(async (eng: any) => {
          const capacityRes = await axios.get(`http://localhost:5000/api/engineers/${eng._id}/capacity`);
          return { ...eng, capacity: capacityRes.data };
        })
      );
      setEngineers(engineersWithCapacity);
    };

    fetchEngineers();
  }, []);

  return (
    <>
      <ManagerNavbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Team Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Seniority</th>
                <th className="py-3 px-4">Skills</th>
                <th className="py-3 px-4">Capacity</th>
              </tr>
            </thead>
            <tbody>
              {engineers.map((eng: any) => (
                <tr key={eng._id} className="border-t text-sm hover:bg-gray-50">
                  <td className="py-2 px-4">{eng.name}</td>
                  <td className="py-2 px-4">{eng.department}</td>
                  <td className="py-2 px-4">{eng.seniority}</td>
                  <td className="py-2 px-4">
                    <SkillTags skills={eng.skills} />
                  </td>
                  <td className="py-2 px-4">
                    <CapacityBar
                      allocated={eng.capacity.allocated}
                      available={eng.capacity.available}
                      max={eng.maxCapacity}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
