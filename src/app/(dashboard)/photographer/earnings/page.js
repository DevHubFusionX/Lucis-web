export default function EarningsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">This Month</h3>
          <p className="text-2xl font-bold text-green-600">$3,240</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
          <p className="text-2xl font-bold text-blue-600">$12,450</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">$850</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>
        <div className="divide-y">
          {[1,2,3,4].map(i => (
            <div key={i} className="p-6 flex justify-between items-center">
              <div>
                <h3 className="font-medium">Wedding Session Payment</h3>
                <p className="text-gray-600">Dec 10, 2024</p>
              </div>
              <span className="text-lg font-semibold text-green-600">+$800</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}