import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lỗi giao diện ứng dụng (Caught by ErrorBoundary):', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.href = window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl shadow-blue-950/30">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">Đã xảy ra sự cố hiển thị</h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ứng dụng gặp một trục trặc bất ngờ khi dựng giao diện. Bạn hãy thử tải lại trang hoặc làm mới bộ nhớ đệm.
              </p>
            </div>
            {this.state.error && (
              <div className="text-[11px] font-mono text-rose-300 bg-rose-950/40 border border-rose-900/40 p-3 rounded-xl text-left overflow-x-auto max-h-28">
                {this.state.error.toString()}
              </div>
            )}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-blue-600/30"
              >
                Tải lại trang web
              </button>
              <button
                type="button"
                onClick={this.handleResetStorage}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition cursor-pointer"
              >
                Xóa bộ nhớ đệm &amp; Vào lại từ đầu
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
