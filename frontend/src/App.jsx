import "./App.css";
import {Routes, Route} from "react-router-dom"
import  Home  from "./components/Home"
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/manager" element={ <ManagerDashboard /> } />
      </Routes>
    </div>
  );
}

export default App;
