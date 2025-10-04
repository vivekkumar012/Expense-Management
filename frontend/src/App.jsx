import "./App.css";
import {Routes, Route} from "react-router-dom"
import  Home  from "./components/Home"
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import AdminApprovalRules from "./pages/adminDashboard";
import EmployeeExpenses from "./pages/employeeDashBoard";
import ManagerDashboard from "./pages/ManagerDashboard";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin/dashboard" element={<AdminApprovalRules />} />
        <Route path="/employee/dashboard" element={<EmployeeExpenses />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
