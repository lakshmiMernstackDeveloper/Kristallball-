import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar'; // 1. Import the Navbar
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Purchases from './pages/Purchases';
import Transfers from './pages/Transfers';
import Assignments from './pages/Assignments';

const Layout = ({ children }) => {
  const { user } = useAuth();
  
  // Security Check: If no user session, redirect to Login
  if (!user) return <Navigate to="/login" />;
  
  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Fixed Sidebar - Width 64 (16rem) */}
      <Sidebar />
      
      {/* Content Area - ml-64 to offset the fixed sidebar */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Sticky Navbar at the top of the content area */}
        <Navbar />
        
        {/* Main page content with padding */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (No Layout/Sidebar/Navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Wrapped in Layout with Sidebar and Navbar) */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/purchases" element={<Layout><Purchases /></Layout>} />
        <Route path="/transfers" element={<Layout><Transfers /></Layout>} />
        <Route path="/assignments" element={<Layout><Assignments /></Layout>} />
        
        {/* Fallback - Redirect unknown paths to Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;