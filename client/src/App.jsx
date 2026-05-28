import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DueDates from './pages/DueDates';
import Calculator from './pages/Calculator';
import CalendarView from './pages/Calendar';
import Auth from './pages/Auth';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/auth" replace />;
  return children;
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8FAFC]">
        {token && <Navbar />}
        
        <main className={token ? "p-6" : ""}>
          <Routes>
            <Route path="/auth" element={token ? <Navigate to="/dashboard" replace /> : <Auth />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
            <Route path="/due-dates" element={<ProtectedRoute><DueDates /></ProtectedRoute>} />
            <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/auth"} replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;