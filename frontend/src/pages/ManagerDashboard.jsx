import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Eye, MessageSquare, TrendingUp, Users, DollarSign } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Mock data for preview
const mockPendingApprovals = [
  {
    _id: "1",
    employee: { name: "Sarah Johnson", email: "sarah@company.com" },
    description: "Client Meeting Lunch",
    category: "Food",
    amount: 3500,
    currency: "INR",
    convertedAmount: 3500,
    date: "2025-10-02",
    status: "Submitted",
    remarks: "Important client discussion"
  },
  {
    _id: "2",
    employee: { name: "John Smith", email: "john@company.com" },
    description: "Flight Tickets - Mumbai Conference",
    category: "Travel",
    amount: 12500,
    currency: "INR",
    convertedAmount: 12500,
    date: "2025-10-01",
    status: "Submitted",
    remarks: "Annual tech conference"
  },
  {
    _id: "3",
    employee: { name: "Priya Sharma", email: "priya@company.com" },
    description: "Hotel Stay - 3 Nights",
    category: "Accommodation",
    amount: 9800,
    currency: "INR",
    convertedAmount: 9800,
    date: "2025-09-30",
    status: "Submitted",
    remarks: "Business trip accommodation"
  },
  {
    _id: "4",
    employee: { name: "Mike Wilson", email: "mike@company.com" },
    description: "Office Supplies - Printer Paper",
    category: "Office Supplies",
    amount: 850,
    currency: "INR",
    convertedAmount: 850,
    date: "2025-09-29",
    status: "Submitted",
    remarks: "Monthly stock"
  },
  {
    _id: "5",
    employee: { name: "Anita Desai", email: "anita@company.com" },
    description: "Team Dinner - Project Completion",
    category: "Entertainment",
    amount: 5200,
    currency: "INR",
    convertedAmount: 5200,
    date: "2025-09-28",
    status: "Submitted",
    remarks: "Team celebration"
  }
];

const ManagerDashboard = () => {
  const [pendingApprovals, setPendingApprovals] = useState(mockPendingApprovals);
  const [loading, setLoading] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState("");
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    if (!useMockData) {
      fetchPendingApprovals();
    }
  }, [useMockData]);

  const fetchPendingApprovals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/v1/expenses/pending-approval", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingApprovals(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching approvals:", error);
      setPendingApprovals(mockPendingApprovals);
      setUseMockData(true);
      setLoading(false);
    }
  };

  const handleReview = async (expenseId, status) => {
    if (useMockData) {
      // Remove from pending list in mock mode
      setPendingApprovals(prev => prev.filter(exp => exp._id !== expenseId));
      alert(`Expense ${status.toLowerCase()} successfully!`);
      setShowModal(false);
      setComments("");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/v1/expenses/${expenseId}/review`,
        { status, comments },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert(`Expense ${status.toLowerCase()} successfully!`);
      setShowModal(false);
      setComments("");
      fetchPendingApprovals();
    } catch (error) {
      console.error("Error reviewing expense:", error);
      alert(error.response?.data?.message || "Failed to review expense");
    }
  };

  const openReviewModal = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const getStats = () => {
    return {
      totalPending: pendingApprovals.length,
      totalAmount: pendingApprovals.reduce((sum, exp) => sum + exp.convertedAmount, 0),
      uniqueEmployees: new Set(pendingApprovals.map(exp => exp.employee.name)).size,
      avgAmount: pendingApprovals.length > 0 
        ? Math.round(pendingApprovals.reduce((sum, exp) => sum + exp.convertedAmount, 0) / pendingApprovals.length)
        : 0
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Manager Dashboard</h1>
          <p className="text-white/60">Review and approve pending expense requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border border-yellow-400/30 rounded-xl p-4 sm:p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-yellow-400" />
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-100">{stats.totalPending}</div>
                <div className="text-yellow-200 text-xs sm:text-sm">Pending</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-400/30 rounded-xl p-4 sm:p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8 text-green-400" />
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-green-100">₹{stats.totalAmount.toLocaleString()}</div>
                <div className="text-green-200 text-xs sm:text-sm">Total Amount</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg border border-blue-400/30 rounded-xl p-4 sm:p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-blue-400" />
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-blue-100">{stats.uniqueEmployees}</div>
                <div className="text-blue-200 text-xs sm:text-sm">Employees</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-400/30 rounded-xl p-4 sm:p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-purple-400" />
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-purple-100">₹{stats.avgAmount.toLocaleString()}</div>
                <div className="text-purple-200 text-xs sm:text-sm">Avg Amount</div>
              </div>
            </div>
          </div>
        </div>

        {/* Approvals Section Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Approvals to Review</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Request Owner</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Approval Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Total Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white/80">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-white/50">
                      Loading approvals...
                    </td>
                  </tr>
                ) : pendingApprovals.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-white/50">
                      <div className="flex flex-col items-center gap-3">
                        <CheckCircle className="h-12 w-12 text-green-400/50" />
                        <p className="text-lg font-semibold">All caught up!</p>
                        <p className="text-sm">No pending approvals at the moment</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pendingApprovals.map((expense) => (
                    <tr key={expense._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white/90 font-semibold">{expense.employee.name}</div>
                          <div className="text-white/50 text-xs">{expense.employee.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white/90 font-medium">{expense.description}</div>
                        {expense.remarks && (
                          <div className="text-white/50 text-xs mt-1">{expense.remarks}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/70 text-sm">
                        {new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white/90 font-bold text-lg">₹{expense.convertedAmount.toLocaleString()}</div>
                        <div className="text-white/50 text-xs">{expense.currency}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border bg-yellow-500/20 text-yellow-400 border-yellow-400/30">
                          <Clock className="h-3 w-3" />
                          {expense.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleReview(expense._id, 'Approved')}
                            className="px-4 py-2 bg-green-500/20 border border-green-400/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-all font-semibold text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openReviewModal(expense)}
                            className="px-4 py-2 bg-red-500/20 border border-red-400/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all font-semibold text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 text-center text-white/50">
              Loading approvals...
            </div>
          ) : pendingApprovals.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-400/50 mx-auto mb-3" />
              <p className="text-white text-lg font-semibold mb-1">All caught up!</p>
              <p className="text-white/50 text-sm">No pending approvals at the moment</p>
            </div>
          ) : (
            pendingApprovals.map((expense) => (
              <div key={expense._id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">{expense.employee.name}</h3>
                    <p className="text-white/50 text-xs">{expense.employee.email}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border bg-yellow-500/20 text-yellow-400 border-yellow-400/30">
                    <Clock className="h-3 w-3" />
                    Pending
                  </span>
                </div>

                {/* Expense Details */}
                <div className="mb-4 pb-4 border-b border-white/10">
                  <p className="text-white font-semibold mb-2">{expense.description}</p>
                  {expense.remarks && (
                    <p className="text-white/60 text-sm mb-3">{expense.remarks}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-white/50 text-xs mb-1">Category</p>
                      <span className="inline-block px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-semibold">
                        {expense.category}
                      </span>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs mb-1">Date</p>
                      <p className="text-white/90 text-sm font-medium">
                        {new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <p className="text-white/50 text-xs mb-1">Total Amount</p>
                  <p className="text-white font-bold text-2xl">₹{expense.convertedAmount.toLocaleString()}</p>
                  <p className="text-white/50 text-xs">{expense.currency}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReview(expense._id, 'Approved')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 border border-green-400/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-all font-semibold"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => openReviewModal(expense)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 border border-red-400/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all font-semibold"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reject Modal with Comments */}
      {showModal && selectedExpense && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] border border-white/20 rounded-2xl max-w-md w-full">
            <div className="bg-red-500/10 border-b border-red-400/20 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <XCircle className="h-6 w-6 text-red-400" />
                Reject Expense
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-white/70 text-sm mb-1">Employee</p>
                <p className="text-white font-semibold">{selectedExpense.employee.name}</p>
              </div>

              <div>
                <p className="text-white/70 text-sm mb-1">Description</p>
                <p className="text-white">{selectedExpense.description}</p>
              </div>

              <div>
                <p className="text-white/70 text-sm mb-1">Amount</p>
                <p className="text-white font-bold text-xl">₹{selectedExpense.convertedAmount.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  <MessageSquare className="inline h-4 w-4 mr-1" />
                  Rejection Comments
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  rows="4"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-red-400 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleReview(selectedExpense._id, 'Rejected')}
                  className="flex-1 px-6 py-3 bg-red-500/20 border border-red-400/30 text-red-400 font-semibold rounded-lg hover:bg-red-500/30 transition-all"
                >
                  Confirm Reject
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setComments("");
                  }}
                  className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default ManagerDashboard;