const StatsPanel = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Progress</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Candidates</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{stats.accepted}</div>
          <div className="text-sm text-gray-600">Accepted</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.contacted}</div>
          <div className="text-sm text-gray-600">Contacted</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.viewed}</div>
          <div className="text-sm text-gray-600">Viewed</div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
