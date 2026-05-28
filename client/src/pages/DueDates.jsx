import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function DueDates() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/loans', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setLoans(data.filter(l => l.status === 'active')))
      .catch((err) => console.error(err));
  }, []);

  const getDaysBadge = (dueDate) => {
    const today = new Date();
    const targetDate = new Date(dueDate);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays < 0) {
      return <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-100 shadow-sm">{Math.abs(diffDays)} days overdue</span>;
    }
    return <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100 shadow-sm">{diffDays} days left</span>;
  };

  const generateWhatsAppLink = (loan) => {
    const amount = loan.totalAmount || loan.amount;
    const message = `Hello ${loan.borrowerName}, reminder: your payment of ₹${amount} (Principal + Interest) is due on ${new Date(loan.dueDate).toLocaleDateString()}.`;
    return `https://wa.me/${loan.phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-5xl mx-auto mt-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-purple-50/30">
          <h2 className="text-xl font-bold text-purple-900">Due Dates</h2>
          <p className="text-sm text-gray-500 mt-1">Payment deadlines and messaging for active loans</p>
        </div>
        
        <div className="divide-y divide-gray-50">
          {loans.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No active due dates.</p>
          ) : (
            loans.map((loan) => (
              <div key={loan._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{loan.borrowerName}</h3>
                  <p className="text-sm text-gray-500 mt-1">Due: {new Date(loan.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right flex items-center space-x-4">
                    <p className="font-bold text-gray-900 text-lg w-28">₹{(loan.totalAmount || loan.amount).toLocaleString('en-IN')}</p>
                    <div className="w-28 text-right">{getDaysBadge(loan.dueDate)}</div>
                  </div>
                  
                  <a href={generateWhatsAppLink(loan)} target="_blank" rel="noreferrer" className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                    <MessageCircle size={18} />
                    <span className="hidden sm:inline">Reminder</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}