import React, { useState, useEffect } from "react";
import { Upload, Plus, FileText, Clock, CheckCircle, XCircle, Camera, Eye, Download } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Mock data for preview
const mockExpenses = [
  {
    _id: "1",
    description: "Team Lunch at The Grand Hotel",
    date: "2025-10-01",
    category: "Food",
    amount: 3500,
    currency: "INR",
    remarks: "Client meeting lunch",
    status: "Approved"
  },
  {
    _id: "2",
    description: "Uber to Airport",
    date: "2025-09-28",
    category: "Travel",
    amount: 850,
    currency: "INR",
    remarks: "Business trip",
    status: "Approved"
  },
  {
    _id: "3",
    description: "Office Supplies - Stationery",
    date: "2025-09-25",
    category: "Office Supplies",
    amount: 1200,
    currency: "INR",
    remarks: "Monthly supplies",
    status: "Submitted"
  },
  {
    _id: "4",
    description: "Hotel Stay - Business Conference",
    date: "2025-09-22",
    category: "Accommodation",
    amount: 8500,
    currency: "INR",
    remarks: "3 nights stay",
    status: "Submitted"
  },
  {
    _id: "5",
    description: "Coffee Meeting with Client",
    date: "2025-09-20",
    category: "Food",
    amount: 450,
    currency: "INR",
    remarks: "None",
    status: "Approved"
  },
  {
    _id: "6",
    description: "Taxi to Office",
    date: "2025-09-18",
    category: "Travel",
    amount: 280,
    currency: "INR",
    remarks: "Emergency travel",
    status: "Rejected"
  },
  {
    _id: "7",
    description: "Dinner with Team",
    date: "2025-09-15",
    category: "Entertainment",
    amount: 2800,
    currency: "INR",
    remarks: "Team building activity",
    status: "Draft"
  },
  {
    _id: "8",
    description: "Flight Tickets - Mumbai to Delhi",
    date: "2025-09-12",
    category: "Travel",
    amount: 6500,
    currency: "INR",
    remarks: "Business meeting",
    status: "Approved"
  },
  {
    _id: "9",
    description: "Printer Cartridges",
    date: "2025-09-10",
    category: "Office Supplies",
    amount: 950,
    currency: "INR",
    remarks: "None",
    status: "Draft"
  },
  {
    _id: "10",
    description: "Restaurant Bill - Client Dinner",
    date: "2025-09-08",
    category: "Food",
    amount: 4200,
    currency: "INR",
    remarks: "Important client meeting",
    status: "Submitted"
  }
];

const EmployeeExpenses = () => {
  const [expenses, setExpenses] = useState(mockExpenses); // Using mock data by default
  const [filteredExpenses, setFilteredExpenses] = useState(mockExpenses);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [useMockData, setUseMockData] = useState(true); // Toggle for mock data
  
  const [formData, setFormData] = useState({
    description: "",
    date: "",
    category: "",
    amount: "",
    currency: "INR",
    remarks: "",
    receipt: null,
  });

  const [receiptPreview, setReceiptPreview] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  const categories = [
    "Food",
    "Travel",
    "Accommodation",
    "Office Supplies",
    "Entertainment",
    "Miscellaneous"
  ];

  useEffect(() => {
    if (!useMockData) {
      fetchExpenses();
    }
  }, [useMockData]);

  useEffect(() => {
    filterExpenses();
  }, [statusFilter, expenses]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/v1/expenses/my-expenses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      // Fallback to mock data on error
      setExpenses(mockExpenses);
      setUseMockData(true);
      setLoading(false);
    }
  };

  const filterExpenses = () => {
    if (statusFilter === "all") {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(expenses.filter(exp => exp.status.toLowerCase() === statusFilter));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, receipt: file });
      
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // OCR Processing
      if (file.type.startsWith('image/')) {
        await processOCR(file);
      }
    }
  };

  const processOCR = async (file) => {
    setOcrLoading(true);
    try {
      const formDataOCR = new FormData();
      formDataOCR.append('receipt', file);

      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/v1/expenses/ocr",
        formDataOCR,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Auto-fill form with OCR data
      if (res.data.success) {
        const ocrData = res.data.data;
        setFormData(prev => ({
          ...prev,
          amount: ocrData.amount || prev.amount,
          date: ocrData.date || prev.date,
          description: ocrData.description || prev.description,
          category: ocrData.category || prev.category,
        }));
        alert("Receipt processed successfully! Fields auto-filled.");
      }
    } catch (error) {
      console.error("OCR Error:", error);
      alert("OCR processing failed. Please fill details manually.");
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    
    if (useMockData) {
      // Add to mock data
      const newExpense = {
        _id: Date.now().toString(),
        ...formData,
        status: isDraft ? 'Draft' : 'Submitted'
      };
      setExpenses([newExpense, ...expenses]);
      alert(isDraft ? "Expense saved as draft!" : "Expense submitted successfully!");
      setShowModal(false);
      resetForm();
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      
      submitData.append('status', isDraft ? 'Draft' : 'Submitted');

      const res = await axios.post(
        "http://localhost:5000/api/v1/expenses",
        submitData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert(isDraft ? "Expense saved as draft!" : "Expense submitted successfully!");
      setShowModal(false);
      resetForm();
      fetchExpenses();
    } catch (error) {
      console.error("Error submitting expense:", error);
      alert(error.response?.data?.message || "Failed to submit expense");
    }
  };

  const resetForm = () => {
    setFormData({
      description: "",
      date: "",
      category: "",
      amount: "",
      currency: "INR",
      remarks: "",
      receipt: null,
    });
    setReceiptPreview(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: "bg-gray-500/20 text-gray-400 border-gray-400/30", icon: FileText },
      submitted: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30", icon: Clock },
      approved: { color: "bg-green-500/20 text-green-400 border-green-400/30", icon: CheckCircle },
      rejected: { color: "bg-red-500/20 text-red-400 border-red-400/30", icon: XCircle },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const getStatusCounts = () => {
    return {
      total: expenses.length,
      draft: expenses.filter(e => e.status?.toLowerCase() === 'draft').length,
      submitted: expenses.filter(e => e.status?.toLowerCase() === 'submitted').length,
      approved: expenses.filter(e => e.status?.toLowerCase() === 'approved').length,
      totalAmount: expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Expenses</h1>
            <p className="text-white/60">Track and manage your expense submissions</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold rounded-lg hover:shadow-[0_10px_30px_rgba(102,126,234,0.5)] hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <Plus className="h-5 w-5" />
            New Expense
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/15 transition-all">
            <div className="text-white/60 text-xs sm:text-sm mb-1">Total Expenses</div>
            <div className="text-2xl sm:text-3xl font-bold text-white">{counts.total}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/15 transition-all">
            <div className="text-white/60 text-xs sm:text-sm mb-1">Draft</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-400">{counts.draft}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/15 transition-all">
            <div className="text-white/60 text-xs sm:text-sm mb-1">Pending</div>
            <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{counts.submitted}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/15 transition-all">
            <div className="text-white/60 text-xs sm:text-sm mb-1">Approved</div>
            <div className="text-2xl sm:text-3xl font-bold text-green-400">{counts.approved}</div>
          </div>
          <div className="col-span-2 lg:col-span-1 bg-gradient-to-r from-purple-500/20 to-purple-700/20 backdrop-blur-lg border border-purple-400/30 rounded-xl p-4 sm:p-6 hover:from-purple-500/30 hover:to-purple-700/30 transition-all">
            <div className="text-purple-200 text-xs sm:text-sm mb-1">Total Amount</div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-100">₹{counts.totalAmount.toLocaleString()}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'draft', 'submitted', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-sm ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Expenses Table - Desktop */}
        <div className="hidden lg:block bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Remarks</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-white/50">
                      Loading expenses...
                    </td>
                  </tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-white/50">
                      No expenses found
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr key={expense._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white/90 font-medium">{expense.description}</td>
                      <td className="px-6 py-4 text-white/70 text-sm">
                        {new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/90 font-bold">
                        ₹{expense.amount.toLocaleString()} 
                        <span className="text-white/50 text-xs ml-1">{expense.currency}</span>
                      </td>
                      <td className="px-6 py-4 text-white/60 text-sm">{expense.remarks || 'None'}</td>
                      <td className="px-6 py-4">{getStatusBadge(expense.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Cards - Mobile */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 text-center text-white/50">
              Loading expenses...
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 text-center text-white/50">
              No expenses found
            </div>
          ) : (
            filteredExpenses.map((expense) => (
              <div key={expense._id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{expense.description}</h3>
                    <p className="text-white/60 text-xs">
                      {new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  {getStatusBadge(expense.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-white/50 text-xs mb-1">Category</p>
                    <span className="inline-block px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-semibold">
                      {expense.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs mb-1">Amount</p>
                    <p className="text-white font-bold">₹{expense.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                {expense.remarks && expense.remarks !== 'None' && (
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-white/50 text-xs mb-1">Remarks</p>
                    <p className="text-white/70 text-sm">{expense.remarks}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for New Expense */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1a1a2e] border-b border-white/10 px-6 sm:px-8 py-6 z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Create New Expense</h2>
              <p className="text-white/60 text-sm mt-1">Upload receipt or fill details manually</p>
            </div>

            <form className="p-6 sm:p-8 space-y-6">
              {/* Receipt Upload */}
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-3">
                  <Upload className="inline h-4 w-4 mr-2" />
                  Upload Receipt
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label
                    htmlFor="receipt-upload"
                    className="flex items-center justify-center gap-3 w-full bg-white/5 border-2 border-dashed border-white/20 rounded-lg px-6 py-8 cursor-pointer hover:bg-white/10 hover:border-cyan-400/50 transition-all"
                  >
                    <Camera className="h-8 w-8 text-cyan-400" />
                    <div className="text-center sm:text-left">
                      <p className="text-white/90 font-semibold text-sm sm:text-base">Click to upload or take photo</p>
                      <p className="text-white/50 text-xs mt-1">OCR will auto-extract details</p>
                    </div>
                  </label>
                </div>
                {receiptPreview && (
                  <div className="mt-4">
                    <img src={receiptPreview} alt="Receipt" className="w-32 h-32 object-cover rounded-lg border border-white/20" />
                  </div>
                )}
                {ocrLoading && (
                  <p className="text-cyan-400 text-sm mt-2">Processing receipt with OCR...</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-white/80 text-sm font-semibold mb-2">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g., Restaurant bill"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                  >
                    <option value="" className="bg-[#302b63]">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-[#302b63]">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="5000"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">Currency</label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    placeholder="INR"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-white/80 text-sm font-semibold mb-2">Remarks</label>
                  <input
                    type="text"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-red-500/20 border border-red-400/30 text-red-400 font-semibold rounded-lg hover:bg-red-500/30 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default EmployeeExpenses;