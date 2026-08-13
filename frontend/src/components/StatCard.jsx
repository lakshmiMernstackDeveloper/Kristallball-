const StatCard = ({ title, value, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color} ${onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-all`}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
    </div>
  </div>
);
export default StatCard;