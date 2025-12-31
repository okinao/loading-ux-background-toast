import React, { useState } from 'react';

// シンプルなトーストコンポーネント
const Toast = ({ message, status, onClose, action }) => {
  const statusStyles = {
    loading: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const icons = {
    loading: (
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    ),
    success: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  };

  return (
    <div className={`fixed top-4 right-4 max-w-md w-full border rounded-lg p-4 shadow-lg ${statusStyles[status]} animate-slide-in z-50`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icons[status]}</div>
        <div className="flex-1 min-w-0">
          <p className="font-medium">{message.title}</p>
          {message.description && (
            <p className="text-sm mt-1 opacity-90">{message.description}</p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [toasts, setToasts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // トーストを表示
  const showToast = (message, status, duration = 5000, action = null) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, status, action }]);

    // 自動で消す（loading以外）
    if (status !== 'loading' && duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  // トーストを削除
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // エクスポート処理をシミュレート
  const exportData = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    // 1. 開始トーストを表示
    const loadingToastId = showToast(
      {
        title: 'エクスポートを開始しました',
        description: '処理完了までしばらくお待ち下さい...',
      },
      'loading',
      0 // 自動で消さない
    );

    // 2. 重い処理をシミュレート（3秒）
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 3. 開始トーストを削除
    removeToast(loadingToastId);

    // 4. 完了トーストを表示
    showToast(
      {
        title: 'エクスポート完了',
        description: 'ダウンロード準備ができました',
      },
      'success',
      5000,
      {
        label: 'ダウンロード',
        onClick: () => alert('ファイルをダウンロードします'),
      }
    );

    setIsProcessing(false);
  };

  // エラーをシミュレート
  const simulateError = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    const loadingToastId = showToast(
      {
        title: 'データを送信中...',
      },
      'loading',
      0
    );

    await new Promise(resolve => setTimeout(resolve, 2000));

    removeToast(loadingToastId);

    showToast(
      {
        title: '送信に失敗しました',
        description: 'ネットワークエラーが発生しました。もう一度お試しください。',
      },
      'error',
      5000
    );

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-lg p-8 shadow-sm space-y-6">
          <div>
            <h2 className="font-bold text-lg mb-4">処理を実行</h2>
            <div className="space-y-3">
              <button
                onClick={exportData}
                disabled={isProcessing}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {isProcessing ? '処理中...' : 'CSVエクスポート（成功パターン）'}
              </button>
              <button
                onClick={simulateError}
                disabled={isProcessing}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {isProcessing ? '処理中...' : 'データ送信（エラーパターン）'}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-slate-700">
              ボタンをクリックすると、バックグラウンドで処理が実行されます。
              処理中もこのページで他の操作が可能です（モーダルに閉じ込められない）。
            </p>
          </div>
        </div>
      </div>

      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          status={toast.status}
          action={toast.action}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
