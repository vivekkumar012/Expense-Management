import "./App.css";
import {Routes, Route} from "react-router-dom"
import  Home  from "./components/Home"
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
<<<<<<< HEAD
import AdminApprovalRules from "./pages/adminDashboard";
import EmployeeExpenses from "./pages/employeeDashBoard";

=======
import ManagerDashboard from "./pages/ManagerDashboard";
>>>>>>> ef6130720a27205a3de93c00a3f4fe783d415ab0

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
<<<<<<< HEAD

        <Route path="/admin/dashboard" element={<AdminApprovalRules />} />
        <Route path="/employee/dashboard" element={<EmployeeExpenses />} />
=======
        <Route path="/manager" element={ <ManagerDashboard /> } />
>>>>>>> ef6130720a27205a3de93c00a3f4fe783d415ab0
      </Routes>
    </div>
  );
}

export default App;
