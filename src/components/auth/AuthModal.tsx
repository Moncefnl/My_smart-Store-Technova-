import React, { useState, useEffect } from 'react';
import {
  X,
  Store,
  User,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Building2,
  MapPin,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AuthMethod, AccountType } from '../../types';
import { OTPVerificationView } from './OTPVerificationView';
import { WILAYAS_LIST } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  initialAccountType?: AccountType;
  initialAuthMethod?: AuthMethod;
  autoFillCode?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialAuthMethod = 'phone',
  autoFillCode,
}) => {
  const {
    currentOTP,
    authModalConfig,
    sendOTP,
    loginWithCredentials,
    registerNewUser,
    cancelOTP,
    openAuthPortal,
  } = useStore();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const accountType: AccountType = 'customer';
  const [authMethod, setAuthMethod] = useState<AuthMethod>(initialAuthMethod);

  // Form Fields
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // phone or email
  const [password, setPassword] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('16 - الجزائر');
  const [loginMethodType, setLoginMethodType] = useState<'otp' | 'password'>('otp');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Synchronize when opened with config
  useEffect(() => {
    if (isOpen) {
      setMode(authModalConfig.mode || initialMode);
      if (authModalConfig.defaultMethod) setAuthMethod(authModalConfig.defaultMethod);
      setErrorMsg(null);
    }
  }, [isOpen, authModalConfig, initialMode]);

  if (!isOpen) return null;

  // Validation
  const validatePhone = (p: string) => {
    const cleaned = p.replace(/\s+/g, '');
    return /^(0)(5|6|7)[0-9]{8}$/.test(cleaned) || /^(0)(2)[0-9]{7,8}$/.test(cleaned);
  };

  const validateEmail = (e: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMsg(
        authMethod === 'phone'
          ? 'يرجى إدخال رقم الهاتف الجزائري (مثال: 0550112233)'
          : 'يرجى إدخال عنوان البريد الإلكتروني'
      );
      return;
    }

    if (authMethod === 'phone' && !validatePhone(cleanId)) {
      setErrorMsg('صيغة رقم الهاتف غير صحيحة. يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام');
      return;
    }

    if (authMethod === 'email' && !validateEmail(cleanId)) {
      setErrorMsg('صيغة البريد الإلكتروني غير صحيحة');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('يرجى كتابة الاسم الكامل');
        return;
      }

      setIsLoading(true);
      const res = registerNewUser({
        name: name.trim(),
        target: cleanId,
        method: authMethod,
        password: password || 'password123',
        accountType: 'customer',
        wilaya: selectedWilaya,
      });
      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.message);
      }
    } else {
      // Login mode
      if (loginMethodType === 'otp') {
        // Send OTP for instant login verification
        setIsLoading(true);
        const res = sendOTP(cleanId, authMethod, 'login', accountType);
        setIsLoading(false);
        if (!res.success) {
          setErrorMsg(res.message);
        }
      } else {
        // Password login
        if (!password) {
          setErrorMsg('يرجى إدخال كلمة المرور');
          return;
        }

        setIsLoading(true);
        const res = loginWithCredentials(cleanId, password, accountType);
        setIsLoading(false);
        if (!res.success) {
          setErrorMsg(res.message);
        } else {
          onClose();
        }
      }
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        id="auth-modal-content"
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={() => {
              cancelOTP();
              onClose();
            }}
            className="absolute top-4 left-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
            id="close-auth-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {currentOTP
                  ? 'التحقق من رمز الأمان OTP'
                  : mode === 'signup'
                  ? 'إنشاء حساب زبون جديد'
                  : 'دخول الزبون وتتبع الطلبات'}
              </h2>
              <p className="text-xs text-indigo-200">
                سجّل دخولك لتسريع الشراء وتتبع حالة طلبياتك بسهولة
              </p>
            </div>
          </div>

          {/* Mode Tabs (Sign in / Sign up) - Hidden during OTP */}
          {!currentOTP && (
            <div className="flex bg-slate-800/80 p-1 rounded-2xl mt-4 border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  mode === 'login'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
                id="tab-login-btn"
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  mode === 'signup'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
                id="tab-signup-btn"
              >
                إنشاء حساب جديد
              </button>
            </div>
          )}
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 space-y-5">
          {currentOTP ? (
            /* OTP Verification Stage */
            <OTPVerificationView
              autoFillCode={autoFillCode}
              onBack={() => {
                cancelOTP();
                setErrorMsg(null);
              }}
              onSuccess={() => {
                onClose();
              }}
            />
          ) : (
            /* Form Stage */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer Account Scope Badge */}
              <div className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex items-center gap-2.5 text-emerald-900">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black">حساب زبون / متسوق</div>
                  <div className="text-[11px] text-emerald-700">تصفح المتجر، الشراء السريع، وتتبع طلبياتك</div>
                </div>
              </div>

              {/* Authentication Method Selector (Phone / Email) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  طريقة المصادقة والتسجيل:
                </label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('phone');
                      setErrorMsg(null);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      authMethod === 'phone'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    id="method-phone-btn"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>رقم الهاتف (SMS)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('email');
                      setErrorMsg(null);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      authMethod === 'email'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    id="method-email-btn"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>البريد الإلكتروني</span>
                  </button>
                </div>
              </div>

              {/* Signup Extra Fields */}
              {mode === 'signup' && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      الاسم الكامل:
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: محمد العمراوي"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none"
                      required
                      id="signup-name-input"
                    />
                  </div>



                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      الولاية:
                    </label>
                    <div className="relative">
                      <select
                        value={selectedWilaya}
                        onChange={(e) => setSelectedWilaya(e.target.value)}
                        className="w-full pr-9 pl-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none appearance-none"
                        id="signup-wilaya-select"
                      >
                        {WILAYAS_LIST.map((w) => (
                          <option key={w.code} value={w.nameAr}>
                            {w.nameAr} ({w.nameEn})
                          </option>
                        ))}
                      </select>
                      <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Identifier Input (Phone or Email) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {authMethod === 'phone' ? 'رقم الهاتف الجزائري:' : 'عنوان البريد الإلكتروني:'}
                </label>
                <div className="relative" dir="ltr">
                  <input
                    type={authMethod === 'phone' ? 'tel' : 'email'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      authMethod === 'phone' ? '0550112233' : 'user@example.com'
                    }
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none"
                    required
                    id="auth-identifier-input"
                  />
                  <div className="absolute right-3 top-2.5 text-slate-400 flex items-center gap-1">
                    {authMethod === 'phone' ? (
                      <span className="text-xs font-bold text-slate-500">🇩🇿</span>
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </div>
                </div>
                {authMethod === 'phone' && (
                  <p className="text-[11px] text-slate-500 mt-1 text-right">
                    يدعم أرقام متعاملي الهاتف بالجزائر: موبيليس (06)، جيزي (07)، أوريدو (05)
                  </p>
                )}
              </div>

              {/* Login Method Option (OTP vs Password) */}
              {mode === 'login' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">طريقة الدخول:</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setLoginMethodType('otp')}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                          loginMethodType === 'otp'
                            ? 'bg-indigo-100 text-indigo-700 font-bold'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        id="login-via-otp-choice"
                      >
                        رمز تحقق OTP (بدون كلمة سر)
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginMethodType('password')}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                          loginMethodType === 'password'
                            ? 'bg-indigo-100 text-indigo-700 font-bold'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        id="login-via-password-choice"
                      >
                        كلمة المرور
                      </button>
                    </div>
                  </div>

                  {loginMethodType === 'password' && (
                    <div>
                      <div className="relative">
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="أدخل كلمة المرور"
                          className="w-full pr-9 pl-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none"
                          required
                          id="login-password-input"
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Password for Signup */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    كلمة المرور (اختياري، للولوج السريع لاحقاً):
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="كلمة مرور مؤمنة مكونة من 6 أحرف على الأقل"
                      className="w-full pr-9 pl-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none"
                      id="signup-password-input"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2 active:scale-[0.99]"
                id="auth-submit-btn"
              >
                {isLoading ? (
                  <span>جاري المعالجة...</span>
                ) : mode === 'signup' || (mode === 'login' && loginMethodType === 'otp') ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>إرسال رمز التحقق OTP والمتابعة</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تسجيل الدخول ومتابعة الطلبات</span>
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    cancelOTP();
                    onClose();
                    openAuthPortal('login');
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
                >
                  هل أنت تاجر وتريد إدارة متجرك؟ <span className="font-bold underline">انتقل إلى بوابة التجار</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
