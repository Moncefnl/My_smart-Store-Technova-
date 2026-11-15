import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { WILAYAS_LIST } from '../../data/mockData';
import {
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  LogIn,
  Store,
  AlertCircle,
  CheckCircle2,
  User,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Plus,
  LogOut,
  ShoppingBag,
  Clock,
  Globe,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

const STORE_CATEGORIES = [
  { id: 'electronics', label: 'إلكترونيات وأجهزة ذكية' },
  { id: 'fashion', label: 'أزياء، ملابس وعطور' },
  { id: 'home_decor', label: 'أواني وديكور منزلي' },
  { id: 'beauty', label: 'تجميل وعناية بالبشرة' },
  { id: 'general', label: 'متجر شامل / عام' },
];

const COLOR_SWATCHES = [
  { name: 'أخضر زمردي', value: '#10b981' },
  { name: 'نيلي', value: '#4f46e5' },
  { name: 'أزرق', value: '#0284c7' },
  { name: 'كهرماني', value: '#d97706' },
  { name: 'وردي', value: '#e11d48' },
  { name: 'داكن', value: '#0f172a' },
];

export const StaffLogin: React.FC = () => {
  const {
    isAuthenticated,
    currentUser,
    authPortalTab,
    setAuthPortalTab,
    merchantStores,
    currentStoreId,
    switchStore,
    deleteStore,
    setViewMode,
    loginWithCredentials,
    registerMerchantWithStore,
    resetUserPassword,
    sendOTP,
    cancelOTP,
    currentOTP,
    logoutUser,
    setIsCreateStoreModalOpen,
  } = useStore();

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forgot Password State
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Create Store (2-Step Registration) State
  const [regStep, setRegStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Step 2: Store Setup
  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [storeCategory, setStoreCategory] = useState('electronics');
  const [storeWilaya, setStoreWilaya] = useState('16 - الجزائر العاصمة');
  const [storeCurrency, setStoreCurrency] = useState('د.ج');
  const [storeColor, setStoreColor] = useState('#10b981');
  const [regError, setRegError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Inline Delete Confirmation for "متاجرك"
  const [confirmDeleteStoreId, setConfirmDeleteStoreId] = useState<string | null>(null);

  const isMerchantAuthenticated =
    isAuthenticated &&
    currentUser &&
    currentUser.accountType === 'merchant' &&
    currentUser.role !== 'customer';

  const validateAlgerianPhone = (phone: string) => {
    const cleaned = phone.replace(/\s+/g, '');
    return /^0(5|6|7)[0-9]{8}$/.test(cleaned);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  // Handle Merchant Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim()) {
      setLoginError('يرجى إدخال البريد الإلكتروني أو رقم الهاتف');
      return;
    }
    if (!loginPassword) {
      setLoginError('يرجى إدخال كلمة المرور');
      return;
    }

    setIsLoggingIn(true);
    setTimeout(() => {
      const res = loginWithCredentials(loginIdentifier.trim(), loginPassword, 'merchant', {
        stayOnPortal: true,
      });
      setIsLoggingIn(false);
      if (!res.success) {
        setLoginError(res.message);
      } else {
        setLoginPassword('');
      }
    }, 250);
  };

  // Forgot Password Step 1: Send OTP
  const handleForgotSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    const target = forgotIdentifier.trim();
    if (!target) {
      setForgotError('يرجى إدخال البريد الإلكتروني أو رقم الهاتف المرتبط بحسابك');
      return;
    }

    const isEmail = target.includes('@');
    const res = sendOTP(target, isEmail ? 'email' : 'phone', 'verify', 'merchant');
    if (!res.success) {
      setForgotError(res.message);
      return;
    }
    setForgotStep('reset');
  };

  // Forgot Password Step 2: Verify OTP & Update Password
  const handleForgotResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (!forgotOtp.trim()) {
      setForgotError('يرجى إدخال رمز التحقق المرسل إليك');
      return;
    }
    if (currentOTP && forgotOtp.trim() !== currentOTP.code) {
      setForgotError('رمز التحقق غير صحيح، يرجى التأكد من الرمز المرسل');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setForgotError('يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('كلمتا المرور غير متطابقتين');
      return;
    }

    const res = resetUserPassword(forgotIdentifier.trim(), forgotNewPassword);
    if (!res.success) {
      setForgotError(res.message);
      return;
    }

    cancelOTP();
    setForgotSuccess('تم تغيير كلمة المرور بنجاح، يمكنك الآن تسجيل الدخول بكلمتك الجديدة.');
    setLoginIdentifier(forgotIdentifier.trim());
    setIsForgotMode(false);
    setForgotStep('request');
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
  };

  // Registration Step 1 Validation -> Advance to Step 2
  const handleRegStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setRegError('يرجى إدخال الاسم واللقب');
      return;
    }
    if (!validateEmail(regEmail)) {
      setRegError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    if (!validateAlgerianPhone(regPhone)) {
      setRegError('يرجى إدخال رقم هاتف جزائري صحيح يبدأ بـ 05 أو 06 أو 07 ومكون من 10 أرقام');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('تأكيد كلمة المرور غير مطابق لكلمة المرور');
      return;
    }

    setRegStep(2);
  };

  // Registration Step 2 Submit -> Create Account + Store + 24h Free Trial
  const handleRegStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!storeName.trim()) {
      setRegError('يرجى إدخال اسم المتجر');
      return;
    }

    setIsRegistering(true);
    setTimeout(() => {
      const res = registerMerchantWithStore({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        storeName: storeName.trim(),
        slug: storeSlug.trim() || undefined,
        category: storeCategory,
        wilaya: storeWilaya,
        currency: storeCurrency,
        primaryColor: storeColor,
      });
      setIsRegistering(false);
      if (!res.success) {
        setRegError(res.message);
      }
    }, 300);
  };

  const handleStoreNameInput = (val: string) => {
    setStoreName(val);
    const latin = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    if (latin) {
      setStoreSlug(latin);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans" dir="rtl">
      {/* Site Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-xs">
              T
            </div>
            <div>
              <span className="text-sm sm:text-base font-black text-slate-900 block leading-none">
                Technova • متجري الذكي
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
                منصة التجارة الإلكترونية الجزائرية
              </span>
            </div>
          </div>

          {/* Primary Navbar Actions */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              id="navbar-browse-storefront-btn"
              onClick={() => setViewMode('storefront')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-slate-500" />
              <span>تصفح المتجر العام</span>
            </button>

            <button
              type="button"
              id="navbar-login-btn"
              onClick={() => {
                setIsForgotMode(false);
                setLoginError(null);
                setAuthPortalTab('login');
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                authPortalTab === 'login'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              تسجيل الدخول
            </button>

            <button
              type="button"
              id="navbar-create-store-btn"
              onClick={() => {
                setRegError(null);
                setRegStep(1);
                setAuthPortalTab('create_store');
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                authPortalTab === 'create_store'
                  ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>أنشئ متجرك الآن</span>
            </button>

            {isMerchantAuthenticated && (
              <button
                type="button"
                id="navbar-logout-btn"
                onClick={logoutUser}
                title="تسجيل الخروج"
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
        {authPortalTab === 'login' ? (
          <div
            className={`w-full mx-auto ${
              isMerchantAuthenticated
                ? 'max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'
                : 'max-w-md'
            }`}
          >
            {/* Login Form Card */}
            <section
              className={`${
                isMerchantAuthenticated ? 'lg:col-span-7' : ''
              } bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs`}
            >
              {!isForgotMode ? (
                <>
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold mb-3">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>بوابة دخول التجار</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                      تسجيل الدخول إلى متجرك
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                      أدخل بريدك الإلكتروني أو رقم هاتفك وكلمة المرور لإدارة متاجرك وطلباتك.
                    </p>
                  </div>

                  {forgotSuccess && (
                    <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{forgotSuccess}</span>
                    </div>
                  )}

                  {loginError && (
                    <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        البريد الإلكتروني أو رقم الهاتف
                      </label>
                      <div className="relative">
                        <input
                          id="merchant-login-identifier"
                          type="text"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          placeholder="name@example.com أو 0550112233"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all text-right"
                          required
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          كلمة المرور
                        </label>
                        <button
                          type="button"
                          id="forgot-password-btn"
                          onClick={() => {
                            setIsForgotMode(true);
                            setForgotStep('request');
                            setForgotError(null);
                            setForgotSuccess(null);
                            setForgotIdentifier(loginIdentifier);
                          }}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                        >
                          نسيت كلمة المرور؟
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          id="merchant-login-password"
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="أدخل كلمة المرور"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 pl-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all text-right"
                          required
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute left-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                          aria-label={showLoginPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      id="merchant-login-submit-btn"
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 text-sm transition-colors"
                    >
                      {isLoggingIn ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          <span>تسجيل الدخول</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Bottom Switch Link */}
                  <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-3">
                    <p className="text-xs text-slate-600">
                      ليس لديك متجر بعد؟{' '}
                      <button
                        type="button"
                        id="goto-create-store-link"
                        onClick={() => {
                          setRegError(null);
                          setRegStep(1);
                          setAuthPortalTab('create_store');
                        }}
                        className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        أنشئ متجرك الآن
                      </button>
                    </p>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setViewMode('storefront')}
                        className="text-[11px] text-slate-500 hover:text-slate-700 font-medium inline-flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>هل أنت زبون؟ تصفح واجهة المتجر العام وتتبع طلبياتك من هناك</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Forgot Password Flow */
                <div>
                  <div className="mb-5">
                    <button
                      type="button"
                      onClick={() => {
                        cancelOTP();
                        setIsForgotMode(false);
                        setForgotError(null);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-3"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>العودة لتسجيل الدخول</span>
                    </button>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-emerald-600" />
                      <span>استعادة كلمة المرور</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {forgotStep === 'request'
                        ? 'أدخل البريد الإلكتروني أو رقم الهاتف المسجل لإرسال رمز التحقق.'
                        : `أدخل رمز التحقق المرسل إلى ${forgotIdentifier} ثم اختر كلمة مرور جديدة.`}
                    </p>
                  </div>

                  {forgotError && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  {forgotStep === 'request' ? (
                    <form onSubmit={handleForgotSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          البريد الإلكتروني أو رقم الهاتف
                        </label>
                        <input
                          type="text"
                          value={forgotIdentifier}
                          onChange={(e) => setForgotIdentifier(e.target.value)}
                          placeholder="name@example.com أو 0550112233"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                      >
                        إرسال رمز التحقق
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleForgotResetSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          رمز التحقق (6 أرقام)
                        </label>
                        <input
                          type="text"
                          value={forgotOtp}
                          onChange={(e) => setForgotOtp(e.target.value)}
                          placeholder="أدخل رمز التحقق"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono text-center tracking-widest focus:outline-none focus:bg-white focus:border-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          كلمة المرور الجديدة
                        </label>
                        <input
                          type="password"
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          placeholder="6 أحرف على الأقل"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          تأكيد كلمة المرور الجديدة
                        </label>
                        <input
                          type="password"
                          value={forgotConfirmPassword}
                          onChange={(e) => setForgotConfirmPassword(e.target.value)}
                          placeholder="أعد كتابة كلمة المرور"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-emerald-500"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                      >
                        حفظ كلمة المرور الجديدة
                      </button>
                    </form>
                  )}
                </div>
              )}
            </section>

            {/* Conditional Side Card: "متاجرك" — Shown ONLY when merchant is logged in */}
            {isMerchantAuthenticated && (
              <aside
                id="merchant-stores-side-card"
                className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-base font-black text-slate-900">متاجرك</h2>
                        <p className="text-[11px] text-slate-500">
                          مرحباً {currentUser.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                      {merchantStores.length} {merchantStores.length === 1 ? 'متجر' : 'متاجر'}
                    </span>
                  </div>

                  {merchantStores.length === 0 ? (
                    <div className="text-center py-8 px-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                      <Store className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">
                        لا توجد متاجر نشطة في حسابك حالياً
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        أنشئ متجرك الأول الآن وابدأ في عرض منتجاتك واستقبال الطلبات.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsCreateStoreModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إنشاء متجر جديد</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[380px] overflow-y-auto">
                      {merchantStores.map((store) => {
                        const isActive = store.id === currentStoreId;
                        const isConfirmingDelete = confirmDeleteStoreId === store.id;

                        return (
                          <div
                            key={store.id}
                            id={`merchant-store-card-${store.id}`}
                            className={`p-3.5 rounded-xl border transition-all ${
                              isActive
                                ? 'border-emerald-300 bg-emerald-50/40'
                                : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                {store.logoUrl ? (
                                  <img
                                    src={store.logoUrl}
                                    alt={store.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                                  />
                                ) : (
                                  <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                                    style={{ backgroundColor: store.primaryColor || '#10b981' }}
                                  >
                                    {store.name.charAt(0)}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h3 className="text-xs font-black text-slate-900 truncate">
                                    {store.name}
                                  </h3>
                                  <p className="text-[11px] text-slate-500 font-mono truncate flex items-center gap-1 mt-0.5">
                                    <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="truncate">{store.domain || store.slug}</span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            {isConfirmingDelete ? (
                              <div className="mt-3 pt-3 border-t border-rose-200 flex items-center justify-between gap-2">
                                <span className="text-[11px] font-bold text-rose-700">
                                  تأكيد حذف المتجر نهائياً؟
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    id={`confirm-delete-store-${store.id}`}
                                    onClick={() => {
                                      deleteStore(store.id);
                                      setConfirmDeleteStoreId(null);
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-colors"
                                  >
                                    نعم، حذف
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteStoreId(null)}
                                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-bold transition-colors"
                                  >
                                    إلغاء
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center gap-2">
                                <button
                                  type="button"
                                  id={`enter-store-btn-${store.id}`}
                                  onClick={() => {
                                    switchStore(store.id);
                                    setViewMode('dashboard');
                                  }}
                                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <LogIn className="w-3.5 h-3.5" />
                                  <span>دخول</span>
                                </button>

                                <button
                                  type="button"
                                  id={`delete-store-btn-${store.id}`}
                                  onClick={() => setConfirmDeleteStoreId(store.id)}
                                  className="py-2 px-3 rounded-lg bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>حذف</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {merchantStores.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      id="sidecard-add-new-store-btn"
                      onClick={() => setIsCreateStoreModalOpen(true)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة متجر جديد</span>
                    </button>
                  </div>
                )}
              </aside>
            )}
          </div>
        ) : (
          /* "أنشئ متجرك الآن" — 2-Step Merchant Registration & Store Setup */
          <section className="w-full max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            {/* Step Progress Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    أنشئ متجرك الإلكتروني الآن
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    احصل فوراً على متجر متكامل مع فترة تجريبية مجانية لمدة 24 ساعة.
                  </p>
                </div>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg shrink-0">
                  الخطوة {regStep} من 2
                </span>
              </div>

              {/* Clean 2-Step Indicator */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2.5 ${
                    regStep === 1
                      ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900'
                      : 'border-emerald-200 bg-emerald-50/30 text-emerald-700'
                  }`}
                >
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                    {regStep > 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : '1'}
                  </span>
                  <span>بيانات التاجر الشخصية</span>
                </div>
                <div
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2.5 ${
                    regStep === 2
                      ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      regStep === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    2
                  </span>
                  <span>إعدادات المتجر</span>
                </div>
              </div>
            </div>

            {regError && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{regError}</span>
              </div>
            )}

            {regStep === 1 ? (
              <form onSubmit={handleRegStep1Next} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      الاسم <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="reg-first-name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="الاسم الأول"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                        required
                      />
                      <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      اللقب <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="reg-last-name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="اسم العائلة"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                        required
                      />
                      <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      البريد الإلكتروني <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="reg-email"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="merchant@example.com"
                        dir="ltr"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-10 text-sm text-left focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                        required
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      رقم الهاتف الجزائري <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="reg-phone"
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="0550112233"
                        dir="ltr"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-10 text-sm text-left font-mono focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                        required
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      يبدأ بـ 05 أو 06 أو 07 (10 أرقام)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      كلمة المرور <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="reg-password"
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="6 أحرف على الأقل"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 pl-10 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                        required
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute left-3.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      تأكيد كلمة المرور <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="reg-confirm-password"
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="أعد كتابة كلمة المرور"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 pl-10 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                        required
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute left-3.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  id="reg-step1-next-btn"
                  type="submit"
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  <span>التالي: إكمال إعداد المتجر</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegStep2Submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      اسم المتجر <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="reg-store-name"
                        type="text"
                        value={storeName}
                        onChange={(e) => handleStoreNameInput(e.target.value)}
                        placeholder="مثال: متجر النور للإلكترونيات"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                        required
                      />
                      <Store className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      الرابط المختصر للمتجر
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden" dir="ltr">
                      <input
                        id="reg-store-slug"
                        type="text"
                        value={storeSlug}
                        onChange={(e) => setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="my-store"
                        className="flex-1 bg-transparent px-3 py-2.5 text-sm font-mono focus:outline-none"
                      />
                      <span className="px-3 py-2.5 bg-slate-100 border-l border-slate-200 text-xs text-slate-500 font-mono">
                        .matjari.dz
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      نشاط المتجر
                    </label>
                    <select
                      id="reg-store-category"
                      value={storeCategory}
                      onChange={(e) => setStoreCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
                    >
                      {STORE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      الولاية
                    </label>
                    <select
                      id="reg-store-wilaya"
                      value={storeWilaya}
                      onChange={(e) => setStoreWilaya(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
                    >
                      {WILAYAS_LIST.map((w) => (
                        <option key={w.code} value={`${w.code} - ${w.nameAr}`}>
                          {w.code} - {w.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      العملة
                    </label>
                    <select
                      id="reg-store-currency"
                      value={storeCurrency}
                      onChange={(e) => setStoreCurrency(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
                    >
                      <option value="د.ج">د.ج (دينار جزائري)</option>
                      <option value="USD">USD ($ دولار)</option>
                      <option value="EUR">EUR (€ يورو)</option>
                      <option value="SAR">SAR (ريال سعودي)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    اللون الأساسي لمتجرك
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_SWATCHES.map((swatch) => (
                      <button
                        key={swatch.value}
                        type="button"
                        onClick={() => setStoreColor(swatch.value)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          storeColor === swatch.value
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: swatch.value }}
                        />
                        <span>{swatch.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 1-Day Trial Automatic Activation Notice */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <span className="font-bold block">فترة تجريبية مجانية لمدة 24 ساعة (الباقة المبتدئة - Starter Plan)</span>
                    <span className="text-amber-800">
                      سيتم تفعيل اشتراكك التجريبي تلقائياً بمجرد إنشاء المتجر، مع إمكانية الترقية لاحقاً عبر CCP أو بريدي موب.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRegError(null);
                      setRegStep(1);
                    }}
                    className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>رجوع</span>
                  </button>

                  <button
                    id="reg-step2-submit-btn"
                    type="submit"
                    disabled={isRegistering}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 text-sm transition-colors"
                  >
                    {isRegistering ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>إنشاء المتجر والبدء الآن</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Bottom Switch Link */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                هل لديك متجر؟{' '}
                <button
                  type="button"
                  id="goto-login-link"
                  onClick={() => {
                    setLoginError(null);
                    setIsForgotMode(false);
                    setAuthPortalTab('login');
                  }}
                  className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  سجّل الدخول وابدأ في إدارته
                </button>
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Technova • جميع الحقوق محفوظة</p>
          <button
            type="button"
            onClick={() => setViewMode('storefront')}
            className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
          >
            زيارة واجهة المتجر العام
          </button>
        </div>
      </footer>
    </div>
  );
};
