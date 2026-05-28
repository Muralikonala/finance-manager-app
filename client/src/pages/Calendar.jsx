import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; 

export default function CalendarView() {
  const [loans, setLoans] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const loansOnSelectedDate = loans.filter(loan => {
    const loanDate = new Date(loan.dueDate);
    return loanDate.getDate() === selectedDate.getDate() &&
           loanDate.getMonth() === selectedDate.getMonth() &&
           loanDate.getFullYear() === selectedDate.getFullYear();
  });

  const dueDatesArray = loans.map(loan => new Date(loan.dueDate));

  return (
    <div className="max-w-6xl mx-auto space-y-6 mt-4">
      <div className="p-6 border border-gray-100 bg-white rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Loan Calendar</h2>
        <p className="text-sm text-gray-500">View loan payment due dates at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex justify-center">
          <DayPicker 
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{ due: dueDatesArray }}
            modifiersStyles={{
              due: { fontWeight: '900', border: '2px solid #9333ea', color: '#9333ea', borderRadius: '100%' }
            }}
            className="font-sans"
          />
        </div>

        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-purple-900 text-lg mb-4 border-b border-purple-200/50 pb-3">
              {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Select a date'}
            </h3>
            {loansOnSelectedDate.length === 0 ? (
              <p className="text-purple-600/80 text-sm">No payments scheduled for this date.</p>
            ) : (
              <div className="space-y-3">
                {loansOnSelectedDate.map(loan => (
                  <div key={loan._id} className="bg-white p-4 rounded-xl flex justify-between shadow-sm border border-purple-100/50 items-center">
                    <span className="font-medium text-gray-900">{loan.borrowerName}</span>
                    <span className="font-bold text-purple-700 text-lg">₹{(loan.totalAmount || loan.amount).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="bg-emerald-50/50 p-5 border-b border-emerald-100">
              <h3 className="font-bold text-emerald-900">All Upcoming Payments</h3>
            </div>
            <div className="p-2">
              {loans.slice(0, 4).map(loan => (
                <div key={loan._id} className="flex justify-between items-center text-sm border-b border-gray-50 p-4 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <span className="font-medium text-gray-700">{loan.borrowerName}</span>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 block">₹{(loan.totalAmount || loan.amount).toLocaleString('en-IN')}</span>
                    <span className="text-xs text-gray-400 mt-1 block">{new Date(loan.dueDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}