import React, { useState } from 'react';
import { 
  X, 
  User, 
  UserPlus, 
  Check, 
  Trash2, 
  ArrowRight, 
  Sparkles,
  Target,
  FileText
} from 'lucide-react';
import { 
  getAllUsers, 
  setCurrentUserId, 
  loginOrCreateUser, 
  deleteUser 
} from '../services/userService';

export default function UserSwitcherModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onUserChanged 
}) {
  const [users, setUsers] = useState(() => getAllUsers());
  const [newName, setNewName] = useState("");
  const [selectedInitialBand, setSelectedInitialBand] = useState("7.0");
  const [selectedInitialTask, setSelectedInitialTask] = useState("task2");

  if (!isOpen) return null;

  const refreshList = () => {
    setUsers(getAllUsers());
  };

  const handleSelectUser = (userId) => {
    const updated = setCurrentUserId(userId);
    if (updated) {
      onUserChanged(updated);
      onClose();
    }
  };

  const handleCreateOrLogin = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const user = loginOrCreateUser(newName.trim(), selectedInitialBand, selectedInitialTask);
    refreshList();
    onUserChanged(user);
    setNewName("");
    onClose();
  };

  const handleDelete = (e, userId) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn xóa học viên này khỏi danh sách thiết lập?")) {
      deleteUser(userId);
      refreshList();
      // If current user was deleted, refresh active user
      if (currentUser?.id === userId) {
        const remaining = getAllUsers();
        onUserChanged(remaining[0]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Quản Lý Tài Khoản Học Viên
              </h2>
              <p className="text-xs text-slate-400">
                Lưu trữ độc lập mục tiêu Band &amp; Task cho từng người học
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User list */}
        <div className="py-4 overflow-y-auto space-y-2.5 flex-1 pr-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Chọn học viên đang đăng nhập:
          </label>
          
          {users.map((u) => {
            const isCurrent = u.id === currentUser?.id;
            return (
              <div
                key={u.id}
                onClick={() => handleSelectUser(u.id)}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer group ${
                  isCurrent 
                    ? "bg-indigo-950/60 border-indigo-500/60 shadow-lg shadow-indigo-950/40" 
                    : "bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${u.avatarColor || "from-indigo-500 to-purple-600"} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {u.name?.slice(0, 2).toUpperCase() || "HV"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{u.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Đang hoạt động
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-indigo-400" />
                        Band {u.targetBand || "7.0"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-pink-400" />
                        {u.selectedTask === "task1" ? "Task 1 (Report)" : "Task 2 (Essay)"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {users.length > 1 && (
                    <button
                      onClick={(e) => handleDelete(e, u.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition cursor-pointer"
                      title="Xóa học viên này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {isCurrent ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 group-hover:text-indigo-400 font-medium">
                      Chọn →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add / Login New User Form */}
        <form onSubmit={handleCreateOrLogin} className="pt-4 border-t border-slate-800 space-y-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Đăng nhập / Thêm học viên mới:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nhập tên học viên (VD: Lan Chi, Đức Anh...)"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm / Chọn</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
