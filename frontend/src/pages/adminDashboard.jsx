import React, { useState, useEffect } from "react";
import { Settings, Plus, Trash2, Save } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AdminApprovalRules = () => {
  const [formData, setFormData] = useState({
    ruleName: "",
    description: "",
    manager: "",
    isManagerApprover: false,
    approvers: [{ user: "", required: false }],
    approversSequence: false,
    minApprovalPercentage: "",
  });

  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch managers and users on component mount
  useEffect(() => {
    fetchManagersAndUsers();
    fetchApprovalRules();
  }, []);

  const fetchManagersAndUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const managersRes = await axios.get("http://localhost:3000/api/v1/user/managers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersRes = await axios.get("http://localhost:3000/api/v1/user/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setManagers(managersRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const fetchApprovalRules = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/approval-rules", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRules(res.data);
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleApproverChange = (index, field, value) => {
    const updatedApprovers = [...formData.approvers];
    updatedApprovers[index][field] = field === "required" ? value : value;
    setFormData({ ...formData, approvers: updatedApprovers });
  };

  const addApprover = () => {
    setFormData({
      ...formData,
      approvers: [...formData.approvers, { user: "", required: false }]
    });
  };

  const removeApprover = (index) => {
    const updatedApprovers = formData.approvers.filter((_, i) => i !== index);
    setFormData({ ...formData, approvers: updatedApprovers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/api/approval-rules",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert("Approval rule created successfully!");
      fetchApprovalRules();
      
      // Reset form
      setFormData({
        ruleName: "",
        description: "",
        manager: "",
        isManagerApprover: false,
        approvers: [{ user: "", required: false }],
        approversSequence: false,
        minApprovalPercentage: "",
      });
    } catch (error) {
      console.error("Error creating rule:", error);
      alert(error.response?.data?.message || "Failed to create rule");
    }
  };

  const deleteRule = async (ruleId) => {
    if (!window.confirm("Are you sure you want to delete this rule?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/approval-rules/${ruleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Rule deleted successfully!");
      fetchApprovalRules();
    } catch (error) {
      console.error("Error deleting rule:", error);
      alert("Failed to delete rule");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Approval Rules</h1>
          </div>
          <p className="text-white/60">Configure expense approval workflows and conditions</p>
        </div>

        {/* Main Form */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rule Name */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Rule Name
              </label>
              <input
                type="text"
                name="ruleName"
                value={formData.ruleName}
                onChange={handleChange}
                placeholder="e.g., Approval rule for miscellaneous expenses"
                required
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description about the rule"
                rows="3"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Manager Selection */}
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Manager
                  <span className="text-white/40 text-xs ml-2">
                    (Initially set on user record, admin can change if required)
                  </span>
                </label>
                <select
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                >
                  <option value="" className="bg-[#302b63]">Select Manager</option>
                  {managers.map((manager) => (
                    <option key={manager._id} value={manager._id} className="bg-[#302b63]">
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Is Manager Approver */}
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Manager Approval
                </label>
                <div className="flex items-center h-12 bg-white/5 border border-white/20 rounded-lg px-4">
                  <input
                    type="checkbox"
                    name="isManagerApprover"
                    checked={formData.isManagerApprover}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="ml-3 text-white/70 text-sm">
                    Expense goes to manager first before other approvers
                  </span>
                </div>
              </div>
            </div>

            {/* Approvers List */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-white/80 text-sm font-semibold">
                  Approvers
                </label>
                <button
                  type="button"
                  onClick={addApprover}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-all text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Approver
                </button>
              </div>

              <div className="space-y-3">
                {formData.approvers.map((approver, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <span className="text-white/60 font-semibold w-8">{index + 1}</span>
                    
                    <select
                      value={approver.user}
                      onChange={(e) => handleApproverChange(index, "user", e.target.value)}
                      className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                    >
                      <option value="" className="bg-[#302b63]">Select User</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id} className="bg-[#302b63]">
                          {user.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2 bg-white/5 border border-white/20 rounded-lg px-4 py-3">
                      <input
                        type="checkbox"
                        checked={approver.required}
                        onChange={(e) => handleApproverChange(index, "required", e.target.checked)}
                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-2 focus:ring-blue-400"
                      />
                      <span className="text-white/70 text-sm whitespace-nowrap">Required</span>
                    </div>

                    {formData.approvers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeApprover(index)}
                        className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Approvers Sequence */}
            <div>
              <div className="flex items-start gap-3 bg-white/5 border border-white/20 rounded-lg p-4">
                <input
                  type="checkbox"
                  name="approversSequence"
                  checked={formData.approversSequence}
                  onChange={handleChange}
                  className="w-5 h-5 mt-0.5 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-2 focus:ring-blue-400"
                />
                <div>
                  <span className="text-white/80 font-semibold block mb-1">Approvers Sequence</span>
                  <p className="text-white/50 text-sm leading-relaxed">
                    If checked: Request goes to approvers in sequence (1→2→3). If required approver rejects, expense is auto-rejected.
                    <br />
                    If not checked: Request goes to all approvers simultaneously.
                  </p>
                </div>
              </div>
            </div>

            {/* Minimum Approval Percentage */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Minimum Approval Percentage (%)
              </label>
              <input
                type="number"
                name="minApprovalPercentage"
                value={formData.minApprovalPercentage}
                onChange={handleChange}
                placeholder="e.g., 60"
                min="0"
                max="100"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              />
              <p className="text-white/40 text-xs mt-2">
                Specify the percentage of approvers required to approve the request
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-4 rounded-lg hover:shadow-[0_10px_30px_rgba(102,126,234,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <Save className="h-5 w-5" />
              Create Approval Rule
            </button>
          </form>
        </div>

        {/* Existing Rules */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Existing Rules</h2>
          
          {rules.length === 0 ? (
            <p className="text-white/50 text-center py-8">No approval rules created yet</p>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule._id} className="bg-white/5 border border-white/20 rounded-lg p-6 hover:bg-white/8 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{rule.ruleName}</h3>
                      <p className="text-white/60 text-sm">{rule.description}</p>
                    </div>
                    <button
                      onClick={() => deleteRule(rule._id)}
                      className="p-2 bg-red-500/20 border border-red-400/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/50">Manager: </span>
                      <span className="text-white/80">{rule.manager?.name || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-white/50">Approvers: </span>
                      <span className="text-white/80">{rule.approvers?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-white/50">Sequence: </span>
                      <span className="text-white/80">{rule.approversSequence ? "Yes" : "No"}</span>
                    </div>
                    <div>
                      <span className="text-white/50">Min Approval: </span>
                      <span className="text-white/80">{rule.minApprovalPercentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminApprovalRules;