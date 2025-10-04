import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ManagerDashboard = () => {
  const [pending, setPending] = useState([]);
  const [teamExpenses, setTeamExpenses] = useState([]);
  const token = localStorage.getItem("token");

  const fetchPending = async () => {
    const { data } = await axios.get(
      "http://localhost:5000/api/v1/manager/pending",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setPending(data);
  };

  const fetchTeamExpenses = async () => {
    const { data } = await axios.get(
      "http://localhost:5000/api/v1/manager/team",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setTeamExpenses(data);
  };

  const handleAction = async (expenseId, action) => {
    await axios.post(
      "http://localhost:5000/api/v1/manager/review",
      { expenseId, action, remarks: `${action}d by Manager` },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchPending();
    fetchTeamExpenses();
  };

  useEffect(() => {
    fetchPending();
    fetchTeamExpenses();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Manager</h1>

        {/* Pending Approvals */}
        <section className="mb-10">
          <h2 className="text-2xl mb-3">Pending Approvals</h2>
          {pending.length === 0 ? (
            <p className="text-gray-400">No pending expenses.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-slate-800 rounded-lg shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Employee</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((exp) => (
                    <tr key={exp._id} className="border-t border-slate-700">
                      <td className="px-4 py-2">{exp.employee.name}</td>
                      <td className="px-4 py-2">{exp.category}</td>
                      <td className="px-4 py-2">
                        {exp.amount} {exp.currency}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleAction(exp._id, "Approve")}
                          className="bg-green-600 px-3 py-1 rounded mr-2 hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(exp._id, "Reject")}
                          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Team Expenses */}
        <section>
          <h2 className="text-2xl mb-3">Team Expense History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-slate-800 rounded-lg shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2">Employee</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {teamExpenses.map((exp) => (
                  <tr key={exp._id} className="border-t border-slate-700">
                    <td className="px-4 py-2">{exp.employee.name}</td>
                    <td className="px-4 py-2">{exp.category}</td>
                    <td className="px-4 py-2">
                      {exp.amount} {exp.currency}
                    </td>
                    <td
                      className={`px-4 py-2 ${
                        exp.status === "Approved"
                          ? "text-green-400"
                          : exp.status === "Rejected"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {exp.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ManagerDashboard;
