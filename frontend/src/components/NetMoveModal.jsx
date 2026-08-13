const NetMoveModal = ({ metrics, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      <div className="p-6 border-b bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800 text-center">Net Movement Breakdown</h2>
      </div>
      <div className="p-8 space-y-4 text-lg">
        <div className="flex justify-between border-b pb-2">
          <span>Total Purchases</span>
          <span className="font-bold text-emerald-600">+{metrics.total_purchases}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span>Transfers In</span>
          <span className="font-bold text-blue-600">+{metrics.total_transfer_in}</span>
        </div>
        <div className="flex justify-between border-b pb-2 text-red-500">
          <span>Transfers Out</span>
          <span className="font-bold">-{metrics.total_transfer_out}</span>
        </div>
        <div className="flex justify-between pt-4 text-2xl font-black text-slate-900">
          <span>Net Result</span>
          <span>{metrics.net_movement}</span>
        </div>
      </div>
      <button onClick={onClose} className="w-full p-4 bg-slate-900 text-white font-bold hover:bg-slate-800">
        Dismiss Intelligence Report
      </button>
    </div>
  </div>
);
export default NetMoveModal;