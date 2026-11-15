import React, { useEffect, useState } from 'react';
import { MessageSquare, Mail, Copy, Check, X, ShieldCheck, Zap } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SimulatedIncomingMessageBannerProps {
  onAutoFillCode?: (code: string) => void;
}

export const SimulatedIncomingMessageBanner: React.FC<SimulatedIncomingMessageBannerProps> = ({
  onAutoFillCode,
}) => {
  const { simulatedIncomingMessage, clearSimulatedMessage, showNotification } = useStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (simulatedIncomingMessage) {
      setCopied(false);
    }
  }, [simulatedIncomingMessage]);

  if (!simulatedIncomingMessage) return null;

  const isPhone = simulatedIncomingMessage.type === 'sms';

  const handleCopy = () => {
    navigator.clipboard.writeText(simulatedIncomingMessage.code);
    setCopied(true);
    showNotification(`تم نسخ رمز التحقق ${simulatedIncomingMessage.code} بنجاح 📋`, 'info');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleAutoFill = () => {
    handleCopy();
    if (onAutoFillCode) {
      onAutoFillCode(simulatedIncomingMessage.code);
    }
  };

  return (
    <div
      id="simulated-otp-banner"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
      dir="rtl"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/40 ring-4 ring-emerald-500/10">
        {/* Header line */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isPhone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
              }`}
            >
              {isPhone ? <MessageSquare className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
            </div>
            <div className="text-xs">
              <span className="font-bold text-slate-200">
                {isPhone ? 'رسالة SMS واردة (محاكاة حية)' : 'إشعار بريد إلكتروني وارد'}
              </span>
              <span className="text-slate-400 mx-1.5">•</span>
              <span className="text-slate-400">{simulatedIncomingMessage.timestamp}</span>
            </div>
          </div>

          <button
            onClick={clearSimulatedMessage}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            title="إغلاق الإشعار"
            id="close-simulated-otp-banner-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message body */}
        <div className="space-y-2">
          <div className="text-xs text-slate-300 leading-relaxed">
            {simulatedIncomingMessage.body}
          </div>

          {/* Code Highlight & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">الرمز السري:</span>
              <span className="font-mono text-base font-black tracking-widest text-emerald-300">
                {simulatedIncomingMessage.code}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition border border-slate-700"
                id="copy-simulated-otp-btn"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleAutoFill}
                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/30 transition transform active:scale-95"
                id="autofill-simulated-otp-btn"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>تعبئة تلقائية</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
