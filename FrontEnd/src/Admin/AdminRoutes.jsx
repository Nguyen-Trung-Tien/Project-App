import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import AdminLayout from "../Admin/AdminLayout";
import Dashboard from "./pages/Dashboard";
import OrderManage from "./pages/OrderManage";
import ProductManage from "./pages/ProductManage";
import UserManage from "./pages/UserManage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
