const StatsPanel = ({ stats }) => {
  return (
    <div className="bg-white border-4 border-black shadow-neo p-6 max-w-2xl w-full">
      <h3 className="text-2xl font-black text-black mb-4 uppercase italic">Recruitment Intel</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border-3 border-black p-2 text-center shadow-neo-hover">
          <div className="text-4xl font-black text-black">{stats.total}</div>
          <div className="text-[10px] font-black uppercase text-black">Sourced</div>
        </div>
        <div className="bg-neo-green border-3 border-black p-2 text-center shadow-neo-hover">
          <div className="text-4xl font-black text-black">{stats.accepted}</div>
          <div className="text-[10px] font-black uppercase text-black">Accepted</div>
        </div>
        <div className="bg-neo-pink border-3 border-black p-2 text-center shadow-neo-hover">
          <div className="text-4xl font-black text-black">{stats.rejected}</div>
          <div className="text-[10px] font-black uppercase text-black">Rejected</div>
        </div>
        <div className="bg-neo-blue border-3 border-black p-2 text-center shadow-neo-hover">
          <div className="text-4xl font-black text-black">{stats.contacted}</div>
          <div className="text-[10px] font-black uppercase text-black">Contacted</div>
        </div>
        <div className="bg-neo-yellow border-3 border-black p-2 text-center shadow-neo-hover">
          <div className="text-4xl font-black text-black">{stats.pending}</div>
          <div className="text-[10px] font-black uppercase text-black">Queue</div>
        </div>
        <div className="bg-white border-3 border-black p-2 text-center shadow-neo-hover">
          <div className="text-4xl font-black text-black">{stats.viewed}</div>
          <div className="text-[10px] font-black uppercase text-black">Viewed</div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;