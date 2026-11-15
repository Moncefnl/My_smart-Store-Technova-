import React from 'react';
import {
  X,
  Shield,
  Smartphone,
  Laptop,
  Globe,
  Clock,
  Trash2,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Key,
  MapPin,
  ShieldAlert,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SessionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionManagerModal: React.FC<SessionManagerModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    activeSessions,
    terminateSession,
    terminateAllOtherSessions,
    logoutUser,
  } = useStore();

  if (!isOpen) return null;

  const currentSession = activeSessions.find((s) => s.isCurrent) || activeSessions[0];
  const otherSessions = activeSessions.filter((s) => !s.isCurrent && s.id !== currentSession?.id);

  return (
    <div
      id="session-manager-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        id="session-manager-modal-content"
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
            id="close-session-manager-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">إدارة جلسات المستخدمين والأجهزة</h2>
              <p className="text-xs text-indigo-200">
                مراقبة الجلسات المفتوحة والتحكم في صلاحيات الوصول الآمن لحساب ({currentUser.name})
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Security Status Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  الحساب محمي بنظام التحقق السريع (OTP Verification)
                </h4>
                <p className="text-[11px] text-slate-500">
                  تم تأكيد هويتك عبر {currentUser.verificationMethod === 'phone' ? 'رسالة نصية SMS (الهاتف)' : 'البريد الإلكتروني'}.
                </p>
              </div>
            </div>

            <div className="text-left w-full sm:w-auto">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
                جلسة مشفرة وآمنة
              </span>
            </div>
          </div>

          {/* Current Session */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>الجلسة الحالية (هذا الجهاز):</span>
              </h3>
            </div>

            {currentSession && (
              <div className="p-4 rounded-2xl border-2 border-indigo-500/40 bg-indigo-50/20 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      {currentSession.device.includes('Mobile') ? (
                        <Smartphone className="w-5 h-5" />
                      ) : (
                        <Laptop className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">{currentSession.device}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-sm">
                          الجلسة الحالية
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {currentSession.browser} • {currentSession.location} ({currentSession.ipAddress})
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logoutUser();
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    id="terminate-current-session-btn"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-indigo-100/60 pt-2 font-mono">
                  <span className="flex items-center gap-1">
                    <Key className="w-3 h-3 text-indigo-400" />
                    رمز الجلسة: {currentSession.token ? `${currentSession.token.slice(0, 14)}••••` : 'ACTIVE_SECURE'}
                  </span>
                  <span className="text-emerald-700 font-bold">نشط الآن</span>
                </div>
              </div>
            )}
          </div>

          {/* Other Active Sessions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>جلسات أخرى مسجلة ({otherSessions.length}):</span>
              </h3>

              {otherSessions.length > 0 && (
                <button
                  type="button"
                  onClick={terminateAllOtherSessions}
                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
                  id="terminate-all-other-sessions-btn"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>إنهاء جميع الجلسات الأخرى</span>
                </button>
              )}
            </div>

            {otherSessions.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 border border-slate-100">
                لا توجد أجهزة أخرى مسجلة الدخول بحسابك حالياً.
              </div>
            ) : (
              <div className="space-y-2">
                {otherSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                        {session.device.includes('Mobile') ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Laptop className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{session.device}</div>
                        <div className="text-[10px] text-slate-400">
                          {session.browser} • {session.location} ({session.ipAddress})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">{session.lastActiveAt}</span>
                      <button
                        type="button"
                        onClick={() => terminateSession(session.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="إنهاء هذه الجلسة"
                        id={`terminate-session-${session.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>إذا لاحظت أي نشاط غير معتاد، يمكنك إنهاء كافة الجلسات فوراً.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition"
            id="close-session-manager-footer-btn"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
