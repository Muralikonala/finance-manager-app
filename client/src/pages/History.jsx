import { useState, useEffect } from 'react';
import { CheckCircle, CalendarCheck, IndianRupee } from 'lucide-react';

export default function History() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetch('https://finance-manager-api-x4hh.onrender.com/api/loans', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setLoans(data))
      .catch((err) => console.error(err));
  }, []);

  const paidLoans = loans.filter(l => l.status === 'paid');
  const totalRecovered = paidLoans.reduce((sum, l) => sum + (l.totalAmount || l.amount), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
          <p className="text-sm text-gray-500">Permanent ledger of all successfully recovered loans</p>
        </div>
        <div className="bg-emerald-100 text-emerald-800 px-5 py-3 rounded-xl font-bold shadow-sm border border-emerald-200 flex items-center">
          <CalendarCheck className="mr-2" size={20} /> 
          Total Recovered: ₹{totalRecovered.toLocaleString('en-IN')}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-emerald-50/30">
          <h2 className="text-lg font-bold text-emerald-900 flex items-center">
            <CheckCircle className="mr-2" size={20} /> Completed Ledger
          </h2>
        </div>
        
        <div className="divide-y divide-gray-50">
          {paidLoans.length === 0 ? (
            <p className="p-8 text-center text-gray-500 font-medium">No completed loans yet. Time to collect!</p>
          ) : (
            paidLoans.map((loan) => (
              <div key={loan._id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    {loan.borrowerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{loan.borrowerName}</h3>
                    <p className="text-sm text-gray-500">
                      Recovered: ₹{(loan.totalAmount || loan.amount).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    Fully Paid
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}