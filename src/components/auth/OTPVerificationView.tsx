import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface OTPVerificationViewProps {
  onBack?: () => void;
  onSuccess?: () => void;
  autoFillCode?: string;
}

export const OTPVerificationView: React.FC<OTPVerificationViewProps> = ({
  onBack,
  onSuccess,
  autoFillCode,
}) => {
  const { currentOTP, verifyOTP, resendOTP, cancelOTP, showNotification } = useStore();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Calculate remaining seconds based on currentOTP.expiresAt
  useEffect(() => {
    if (!currentOTP) return;

    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((currentOTP.expiresAt - Date.now()) / 1000));
      setTimeLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentOTP]);

  // Handle external autoFillCode (from simulation banner or demo click)
  useEffect(() => {
    if (autoFillCode && autoFillCode.length === 6) {
      const newDigits = autoFillCode.split('');
      setDigits(newDigits);
      setErrorMsg(null);
      // Auto trigger verify after slight delay
      setTimeout(() => {
        handleVerify(autoFillCode);
      }, 300);
    }
  }, [autoFillCode]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  if (!currentOTP) {
    return (
      <div className="p-8 text-center space-y-4" dir="rtl">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <p className="text-base font-semibold text-slate-700">لا توجد عملية تحقق جارية حالياً.</p>
        <button
          onClick={onBack || cancelOTP}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
        >
          العودة للتسجيل
        </button>
      </div>
    );
  }

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numbers
    const cleanVal = value.replace(/[^0-9]/g, '');
    if (!cleanVal && value !== '') return;

    const newDigits = [...digits];

    if (cleanVal.length > 1) {
      // User pasted multiple numbers in one box
      const pastedChars = cleanVal.slice(0, 6).split('');
      pastedChars.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setDigits(newDigits);
      const nextIdx = Math.min(pastedChars.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    newDigits[index] = cleanVal;
    setDigits(newDigits);
    setErrorMsg(null);

    // Auto advance focus to next box
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pasteData) {
      const newDigits = [...digits];
      pasteData.slice(0, 6).split('').forEach((char, i) => {
        newDigits[i] = char;
      });
      setDigits(newDigits);
      const focusIndex = Math.min(pasteData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerify = (customCode?: string) => {
    const fullCode = customCode || digits.join('');
    if (fullCode.length < 6) {
      setErrorMsg('يرجى إدخال رمز التحقق كاملاً المكون من 6 أرقام');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    setTimeout(() => {
      const res = verifyOTP(fullCode);
      setIsVerifying(false);

      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        if (onSuccess) onSuccess();
      }
    }, 400);
  };

  const handleResend = () => {
    setErrorMsg(null);
    const res = resendOTP();
    if (res.success) {
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const formatTargetDisplay = (target: string, type: 'phone' | 'email') => {
    if (type === 'phone') {
      if (target.length >= 8) {
        return `${target.slice(0, 4)} ••• •• ${target.slice(-2)}`;
      }
      return target;
    } else {
      const parts = target.split('@');
      if (parts.length === 2) {
        const namePart = parts[0];
        const masked = namePart.length > 2 ? `${namePart.slice(0, 2)}•••` : namePart;
        return `${masked}@${parts[1]}`;
      }
      return target;
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm ring-8 ring-indigo-50/50">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-black text-slate-900">
          {currentOTP.purpose === 'signup' ? 'تأكيد الحساب ورمز الأمان' : 'التحقق من الهوية وتسجيل الدخول'}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          تم إرسال رمز تحقق مؤقت (OTP) يتكون من 6 أرقام إلى{' '}
          <span className="font-bold text-slate-800 inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
            {currentOTP.type === 'phone' ? <Phone className="w-3 h-3 text-emerald-600" /> : <Mail className="w-3 h-3 text-blue-600" />}
            {formatTargetDisplay(currentOTP.target, currentOTP.type)}
          </span>
        </p>
      </div>

      {/* Demo helper banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-emerald-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            الرمز المولد حالياً: <strong className="font-mono text-sm tracking-wider text-emerald-900">{currentOTP.code}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setDigits(currentOTP.code.split(''));
            handleVerify(currentOTP.code);
          }}
          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition flex items-center gap-1 shadow-sm"
          id="quick-fill-otp-btn"
        >
          <span>تعبئة وتأكيد</span>
        </button>
      </div>

      {/* OTP Inputs */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-700 text-center">
          أدخل رمز التحقق المكون من 6 أرقام:
        </label>
        <div className="flex items-center justify-center gap-2 sm:gap-3" dir="ltr">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={idx === 0 ? handlePaste : undefined}
              className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black font-mono rounded-xl border transition-all shadow-sm outline-none ${
                errorMsg
                  ? 'border-red-400 bg-red-50/30 text-red-700 focus:ring-2 focus:ring-red-500'
                  : digit
                  ? 'border-indigo-600 bg-indigo-50/20 text-indigo-900 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              }`}
              autoComplete="one-time-code"
              id={`otp-input-${idx}`}
            />
          ))}
        </div>

        {errorMsg && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-red-600 font-medium pt-1 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Countdown and Resend */}
      <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>صلاحية الرمز:</span>
          <span className={`font-mono font-bold ${timeLeft < 30 ? 'text-red-500' : 'text-slate-800'}`}>
            {timeFormatted}
          </span>
        </div>

        <button
          type="button"
          onClick={handleResend}
          disabled={timeLeft > 90}
          className={`flex items-center gap-1 font-semibold transition ${
            timeLeft > 90
              ? 'text-slate-400 cursor-not-allowed'
              : 'text-indigo-600 hover:text-indigo-700 hover:underline'
          }`}
          id="resend-otp-btn"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${timeLeft <= 90 ? 'hover:rotate-180 transition-transform duration-500' : ''}`} />
          <span>إعادة إرسال الرمز</span>
        </button>
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={() => handleVerify()}
          disabled={isVerifying || digits.join('').length < 6}
          className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 ${
            isVerifying || digits.join('').length < 6
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-indigo-600/20'
          }`}
          id="submit-verify-otp-btn"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>جاري التحقق وتفعيل الحساب...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>تأكيد والولوج إلى الحساب</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBack || cancelOTP}
          className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs transition flex items-center justify-center gap-1.5"
          id="cancel-otp-btn"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          <span>تغيير رقم الهاتف أو البريد الإلكتروني</span>
        </button>
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
        <Lock className="w-3 h-3 text-slate-400" />
        <span>جميع عمليات التحقق مشفرة وتتم وفق بروتوكولات الأمان القياسية</span>
      </div>
    </div>
  );
};
