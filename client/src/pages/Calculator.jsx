import { useState } from 'react';
import { Calculator as CalcIcon, IndianRupee, RefreshCw } from 'lucide-react';

export default function Calculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [months, setMonths] = useState('');
  const [results, setResults] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault(); 
    
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(months);

    if (p > 0 && r > 0 && t > 0) {
      const totalInterest = Math.round((p * r * t) / 100);
      const totalAmount = p + totalInterest;

      setResults({
        interest: totalInterest,
        total: totalAmount
      });
    }
  };

  const handleReset = () => {
    setPrincipal('');
    setRate('');
    setMonths('');
    setResults(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 mt-4">
      
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
          <CalcIcon size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interest Calculator</h2>
          <p className="text-gray-500 text-sm">Forecast returns for potential new loans.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          
          <form onSubmit={handleCalculate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Principal Amount (₹)</label>
              <input 
                type="number" 
                required
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g., 50000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (% per month)</label>
                <input 
                  type="number" 
                  step="0.1"
                  required
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g., 2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Months)</label>
                <input 
                  type="number" 
                  required
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g., 6"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button 
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-colors flex justify-center items-center"
              >
                Calculate Returns
              </button>
              <button 
                type="button"
                onClick={handleReset}
                className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-medium transition-colors flex justify-center items-center"
                title="Reset Form"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </form>

        </div>

        {results && (
          <div className="bg-indigo-50 border-t border-indigo-100 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-indigo-900 mb-4">Calculation Results</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100/50">
                <p className="text-sm text-gray-500 mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-emerald-600 flex items-center">
                  <IndianRupee size={20} className="mr-1" />
                  {results.interest.toLocaleString('en-IN')}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100/50">
                <p className="text-sm text-gray-500 mb-1">Total Amount (Principal + Interest)</p>
                <p className="text-2xl font-bold text-indigo-700 flex items-center">
                  <IndianRupee size={20} className="mr-1" />
                  {results.total.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}