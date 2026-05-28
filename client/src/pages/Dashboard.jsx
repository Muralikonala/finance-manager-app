import { useState, useEffect } from 'react';
import { Plus, Users, TrendingUp, AlertCircle, X, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    borrowerName: '', phoneNumber: '', aadhaarNumber: '',
    amount: '', interestRate: '', duration: '', dueDate: ''
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/loans', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setLoans(data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddLoan = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/loans', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const savedLoan = await response.json();
        setLoans([...loans, savedLoan]); 
        setIsModalOpen(false);
        setFormData({ borrowerName: '', phoneNumber: '', aadhaarNumber: '', amount: '', interestRate: '', duration: '', dueDate: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLoan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this loan?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/loans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        setLoans(loans.filter(loan => loan._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete loan:", err);
    }
  };

  const activeLoans = loans.filter(l => l.status === 'active');
  const totalLent = activeLoans.reduce((sum, l) => sum + l.amount, 0); 
  const overdueCount = loans.filter(l => new Date(l.dueDate) < new Date() && l.status !== 'paid').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <div className="flex justify-between items-center mt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Automated Loan Tracking System</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center shadow-sm transition-colors">
          <Plus size={18} className="mr-2" /> Add New Loan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Loans Active</p>
            <p className="text-3xl font-bold text-gray-900">{activeLoans.length}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-xl text-blue-600"><Users size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Principal Lent</p>
            <p className="text-3xl font-bold text-gray-900">₹{totalLent.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600"><TrendingUp size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Overdue Payments</p>
            <p className="text-3xl font-bold text-gray-900">{overdueCount}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-xl text-red-600"><AlertCircle size={24} /></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Loans Given</h2>
          <p className="text-sm text-gray-500">Track all money you've lent and total returns expected</p>
        </div>
        <div className="divide-y divide-gray-50">
          {loans.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No loans active.</p>
          ) : (
            loans.map((loan) => (
              <div key={loan._id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    {loan.borrowerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{loan.borrowerName}</h3>
                    <p className="text-sm text-gray-500">Principal: ₹{loan.amount.toLocaleString('en-IN')} • {loan.interestRate}% Interest</p>
                  </div>
                </div>
                
                <div className="text-right flex items-center justify-end space-x-4">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Total Due: ₹{(loan.totalAmount || loan.amount).toLocaleString('en-IN')}</p>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      new Date(loan.dueDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {new Date(loan.dueDate) < new Date() ? 'Overdue' : 'Active'}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteLoan(loan._id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete Loan"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-purple-900 flex items-center">
                <Users className="mr-2" size={20}/> Add New Loan Borrower
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddLoan} className="p-6 space-y-6">
              <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100/50 space-y-4">
                <h3 className="font-semibold text-purple-900 flex items-center text-sm"><Users size={16} className="mr-1"/> Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                    <input required type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500" value={formData.borrowerName} onChange={e => setFormData({...formData, borrowerName: e.target.value})} placeholder="Enter full name" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input required type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} placeholder="919876543210" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Aadhaar Number (Masked) *</label>
                    <input type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500" value={formData.aadhaarNumber} onChange={e => setFormData({...formData, aadhaarNumber: e.target.value})} placeholder="Enter 12-digit Aadhaar" />
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100/50 space-y-4">
                <h3 className="font-semibold text-emerald-900 flex items-center text-sm">Loan Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Loan Amount (₹) *</label>
                    <input required type="number" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="50000" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Interest Rate (% per month) *</label>
                    <input required type="number" step="0.1" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" value={formData.interestRate} onChange={e => setFormData({...formData, interestRate: e.target.value})} placeholder="2" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Duration (Months) *</label>
                    <input required type="number" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="6" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Due Date *</label>
                    <input required type="date" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors">Add Loan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}