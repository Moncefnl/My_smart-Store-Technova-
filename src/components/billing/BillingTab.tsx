import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SubscriptionPlanId, BillingCycle, SubscriptionInvoice } from '../../types';
import { SubscriptionModal } from './SubscriptionModal';
import { InvoiceModal } from './InvoiceModal';
import { PaymentReceiptsManagement } from './PaymentReceiptsManagement';
import {
  Crown,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  CreditCard,
  Building2,
  Store,
  Users,
  Package,
  Globe,
  ShieldCheck,
  FileText,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
  Layers,
  Flame,
  Check,
  Landmark,
  HelpCircle,
} from 'lucide-react';

export const BillingTab: React.FC = () => {
  const {
    subscription,
    subscriptionPlans,
    subscriptionInvoices,
    renewSubscription,
    cancelSubscription,
    getActivePlan,
    stores,
    products,
    staff,
    landingPages,
    isSubscriptionModalOpen,
    setIsSubscriptionModalOpen,
    pendingReceiptsCount,
    showNotification,
    isTrialActive,
    isTrialExpired,
    trialTimeRemaining,
    resetTrialTimer,
    simulateTrialExpiry,
    startFreeTrial,
  } = useStore();

  const [activeBillingSubTab, setActiveBillingSubTab] = useState<'plans' | 'receipts'>('plans');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(subscription.billingCycle || 'monthly');
  const [selectedInvoice, setSelectedInvoice] = useState<SubscriptionInvoice | null>(null);
  const [targetUpgradePlanId, setTargetUpgradePlanId] = useState<SubscriptionPlanId | undefined>(undefined);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const activePlan = getActivePlan();

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!subscription.expiryDate) return 30;
    const now = new Date();
    const expiry = new Date(subscription.expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysRemaining = calculateDaysRemaining();
  const totalDaysInPeriod = subscription.billingCycle === 'yearly' ? 365 : 30;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((totalDaysInPeriod - daysRemaining) / totalDaysInPeriod) * 100)));

  const handleOpenUpgrade = (planId?: SubscriptionPlanId) => {
    setTargetUpgradePlanId(planId);
    setIsSubscriptionModalOpen(true);
  };

  const filteredInvoices = subscriptionInvoices.filter((inv) => {
    if (invoiceFilter === 'paid') return inv.status === 'paid';
    if (invoiceFilter === 'pending') return inv.status === 'pending';
    return true;
  });

  const faqs = [
    {
      q: 'كيف تتم عملية الترقية وتفعيل الباقة؟',
      a: 'تتم عملية الترقية بكل بساطة عبر تحويل المبلغ لحساب بريدي موب (BaridiMob RIP) أو الحساب الجاري البريدي (CCP) ثم رفع صورة الوصل لتأكيد وتفعيل الباقة فوراً.',
    },
    {
      q: 'هل أحتاج لسجل تجاري أو حساب بنكي معقد للاشتراك؟',
      a: 'إطلاقاً! لقد قمنا بتبسيط نظام الدفع في تكنوفا ليعتمد حصرياً على بريدي موب و CCP دون الحاجة لبوابات SATIM/CIB أو متطلبات مصرفية معقدة.',
    },
    {
      q: 'ما هي الحسابات الرسمية المعتمدة لدفع الاشتراكات؟',
      a: 'الحسابات الرسمية هي: حساب بريدي موب RIP رقم 00799999002419082341 وحساب CCP رقم 24190823 المفتاح 41 باسم شركة تكنوفا، وتظهر بياناتها وتفاصيلها المحدثة في نافذة الدفع.',
    },
    {
      q: 'ماذا يحدث إذا انتهت فترة اشتراكي؟',
      a: 'تبقى بياناتك ومنتجاتك وطلبياتك محفوظة بالكامل وبأمان. ستتحول الباقة تلقائياً إلى الباقة الأساسية مع إمكانية تجديد اشتراكك في أي وقت واستعادة كافة الصلاحيات المتقدمة فوراً.',
    },
    {
      q: 'هل يمكنني تغيير الباقة من شهرية إلى سنوية؟',
      a: 'نعم، يمكنك الترقية إلى الاشتراك السنوي في أي وقت للاستفادة من خصم 20% (شهرين مجاناً) ويتم احتساب الأيام المتبقية من اشتراكك السابق تلقائياً.',
    },
  ];

  return (
    <div id="billing-tab-container" className="space-y-8 animate-in fade-in duration-300 pb-12" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">الاشتراكات والفواتير (Billing & Plans)</h1>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>{activePlan.name}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            إدارة اشتراكك في منصة تكنوفا، ترقية الباقة لفتح متاجر إضافية، والاطلاع على الفواتير والمدفوعات
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="upgrade-plan-header-btn"
            onClick={() => handleOpenUpgrade('enterprise')}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>ترقية الباقة الآن</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          id="subtab-plans-btn"
          onClick={() => setActiveBillingSubTab('plans')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeBillingSubTab === 'plans'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>الباقات والاشتراك الحالي</span>
        </button>

        <button
          type="button"
          id="subtab-receipts-btn"
          onClick={() => setActiveBillingSubTab('receipts')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeBillingSubTab === 'receipts'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Landmark className="w-4 h-4 text-emerald-300" />
          <span>مراجعة إيصالات التجار والحسابات البريدية (CCP / RIP)</span>
          {pendingReceiptsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black animate-pulse">
              {pendingReceiptsCount} طلب معلق
            </span>
          )}
        </button>
      </div>

      {activeBillingSubTab === 'receipts' ? (
        <PaymentReceiptsManagement />
      ) : (
        <>
          {/* Active Subscription Overview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Status Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
              {/* Subtle Background Circles */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-amber-400">
                      <Crown className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-indigo-200 font-semibold">نوع الاشتراك الحالي</span>
                      <h2 className="text-xl sm:text-2xl font-black text-white">{activePlan.name}</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {subscription.status === 'trial' || subscription.isTrial ? (
                      isTrialExpired ? (
                        <span className="px-3 py-1 rounded-xl bg-rose-500/30 text-rose-300 border border-rose-500/50 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-rose-400" />
                          <span>انتهت الفترة التجريبية (24 ساعة)</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          <span>حساب تجريبي (1-Day Free Trial)</span>
                        </span>
                      )
                    ) : (
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>اشتراك نشط ({subscription.status === 'active' ? 'Active' : 'معلق'})</span>
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-xl bg-white/10 text-slate-200 text-xs font-semibold">
                      {subscription.status === 'trial' || subscription.isTrial
                        ? 'مقيد بمميزات الباقة المبتدئة'
                        : subscription.billingCycle === 'yearly'
                        ? 'اشتراك سنوي (وفرت 20%)'
                        : 'اشتراك شهري'}
                    </span>
                  </div>
                </div>

                {/* Expiry & Progress Bar / Trial Countdown */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-6">
                  {subscription.status === 'trial' || subscription.isTrial ? (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-amber-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>
                            الوقت المتبقي لانتهاء الـ 24 ساعة:{' '}
                            <strong className="text-white font-mono text-sm tracking-wider">
                              {isTrialExpired ? '00:00:00 (انتهت المهلة)' : trialTimeRemaining.formatted}
                            </strong>
                          </span>
                        </span>
                        <span className="text-slate-300">
                          حالة المتجر:{' '}
                          <strong className={isTrialExpired ? 'text-rose-400 font-bold' : 'text-amber-300 font-bold'}>
                            {isTrialExpired ? 'مقيد مؤقتاً (يتطلب الترقية)' : 'نشط تجريبياً'}
                          </strong>
                        </span>
                      </div>

                      {/* Progress track */}
                      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isTrialExpired
                              ? 'bg-rose-500 w-full'
                              : 'bg-gradient-to-r from-emerald-400 via-amber-400 to-orange-400'
                          }`}
                          style={{
                            width: isTrialExpired ? '100%' : `${Math.max(4, trialTimeRemaining.percentElapsed)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-indigo-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>
                            المدة المتبقية:{' '}
                            <strong className="text-white font-mono text-sm">{daysRemaining} يوماً</strong>
                          </span>
                        </span>
                        <span className="text-slate-300">
                          تاريخ التجديد:{' '}
                          <strong className="text-white font-mono">{subscription.expiryDate || '2026-09-30'}</strong>
                        </span>
                      </div>

                      {/* Progress track */}
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-400 to-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${100 - (daysRemaining / totalDaysInPeriod) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Key stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-0.5">طريقة الدفع المسجلة</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {subscription.paymentMethod === 'baridimob'
                          ? 'بريدي موب (BaridiMob RIP)'
                          : subscription.paymentMethod === 'ccp'
                          ? 'تحويل بريدي CCP'
                          : 'تحويل بريدي معتمد'}
                      </span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-0.5">التجديد التلقائي</span>
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        subscription.autoRenew ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{subscription.autoRenew ? 'مُفعّل تلقائياً' : 'متوقف'}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-slate-400 block mb-0.5">قيمة التجديد القادم</span>
                    <span className="font-bold text-white font-mono">
                      {subscription.billingCycle === 'yearly'
                        ? `${activePlan.yearlyPrice.toLocaleString()} ${activePlan.currency}`
                        : `${activePlan.monthlyPrice.toLocaleString()} ${activePlan.currency}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  {subscription.status === 'trial' || subscription.isTrial ? (
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        id="billing-simulate-expiry-btn"
                        onClick={simulateTrialExpiry}
                        className="text-xs text-rose-300 hover:text-rose-200 underline transition-colors"
                      >
                        محاكاة انتهاء الوقت فوراً
                      </button>
                      <span className="text-white/30">•</span>
                      <button
                        type="button"
                        id="billing-reset-trial-btn"
                        onClick={resetTrialTimer}
                        className="text-xs text-emerald-300 hover:text-emerald-200 underline transition-colors"
                      >
                        إعادة ضبط الـ 24 ساعة
                      </button>
                    </div>
                  ) : subscription.autoRenew ? (
                    <button
                      type="button"
                      onClick={cancelSubscription}
                      className="text-xs text-slate-400 hover:text-rose-300 transition-colors underline"
                    >
                      إيقاف التجديد التلقائي
                    </button>
                  ) : (
                    <span className="text-xs text-amber-300">⚠️ التجديد التلقائي متوقف</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="upgrade-sub-main-btn"
                    onClick={() => handleOpenUpgrade()}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 ${
                      isTrialExpired
                        ? 'bg-rose-500 hover:bg-rose-600 text-white animate-bounce'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {subscription.status === 'trial' || subscription.isTrial
                        ? 'ترقية الحساب وسداد الاشتراك (BaridiMob / CCP) 🚀'
                        : 'تغيير / ترقية الباقة'}
                    </span>
                  </button>
                </div>
              </div>
        </div>

        {/* Quotas & Limits Progress Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>استهلاك الموارد وحدود الباقة</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                مباشر
              </span>
            </div>

            <div className="space-y-4">
              {/* Stores Quota */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-indigo-600" />
                    <span>المتاجر المنشأة:</span>
                  </span>
                  <span className="font-black text-slate-900 font-mono">
                    {stores.length} / {activePlan.limits.maxStores === -1 ? '∞ غير محدود' : activePlan.limits.maxStores}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      activePlan.limits.maxStores !== -1 && stores.length >= activePlan.limits.maxStores
                        ? 'bg-rose-500'
                        : 'bg-indigo-600'
                    }`}
                    style={{
                      width:
                        activePlan.limits.maxStores === -1
                          ? '30%'
                          : `${Math.min(100, (stores.length / activePlan.limits.maxStores) * 100)}%`,
                    }}
                  />
                </div>
                {activePlan.limits.maxStores !== -1 && stores.length >= activePlan.limits.maxStores && (
                  <p className="text-[10px] text-rose-600 mt-1 font-semibold">
                    وصلت للحد الأقصى للمتاجر. قم بالترقية لفتح متاجر أخرى.
                  </p>
                )}
              </div>

              {/* Products Quota */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-indigo-600" />
                    <span>المنتجات المسجلة:</span>
                  </span>
                  <span className="font-black text-slate-900 font-mono">
                    {products.length} / {activePlan.limits.maxProducts === -1 ? '∞ غير محدود' : activePlan.limits.maxProducts}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width:
                        activePlan.limits.maxProducts === -1
                          ? '25%'
                          : `${Math.min(100, (products.length / activePlan.limits.maxProducts) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Staff Quota */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>فريق العمل والموظفين:</span>
                  </span>
                  <span className="font-black text-slate-900 font-mono">
                    {staff.length} / {activePlan.limits.maxStaff === -1 ? '∞ غير محدود' : activePlan.limits.maxStaff}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width:
                        activePlan.limits.maxStaff === -1
                          ? '35%'
                          : `${Math.min(100, (staff.length / activePlan.limits.maxStaff) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Features badges */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    <span>النطاق المخصص (.com / .dz):</span>
                  </span>
                  {activePlan.limits.customDomainAllowed ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> متاح
                    </span>
                  ) : (
                    <span className="text-slate-400 font-bold text-[11px]">غير متاح</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>نظام كشف الاحتيال وAnti-Bot:</span>
                  </span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> نشط 100%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleOpenUpgrade('enterprise')}
              className="w-full py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>زيادة السعة والموارد</span>
              <Crown className="w-3.5 h-3.5 text-amber-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Plans & Pricing Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>باقات شفافة مصممة للتجار ورواد الأعمال في الجزائر</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            اختر الباقة التي تناسب حجم وطموح تجارتك 💎
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            ابدأ مجاناً أو قم بالترقية للباقات الاحترافية للحصول على عدد غير محدود من المتاجر والمبيعات
          </p>

          {/* Billing Cycle Switcher */}
          <div className="flex items-center justify-center gap-2 mt-6 bg-slate-100 p-1.5 rounded-2xl max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              دفع شهري
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>دفع سنوي</span>
              <span className="bg-amber-400 text-slate-900 text-[9px] px-1.5 py-0.5 rounded-md font-black">
                وفر 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => {
            const isCurrent = subscription.planId === plan.id;
            const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 transition-all ${
                  plan.isPopular
                    ? 'border-indigo-600 bg-gradient-to-b from-indigo-50/40 via-white to-white shadow-lg ring-2 ring-indigo-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-black shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>الباقة الأكثر طلباً للتجار</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                    {isCurrent && (
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        باقتك الحالية ✓
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mb-6 leading-relaxed min-h-[36px]">{plan.description}</p>

                  {/* Pricing Box */}
                  <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                        {price === 0 ? '0' : price.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{plan.currency}</span>
                      {price > 0 && (
                        <span className="text-xs text-slate-400 font-normal">
                          / {billingCycle === 'yearly' ? 'سنة' : 'شهر'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'yearly' && price > 0 && (
                      <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        وفرت {(plan.monthlyPrice * 12 - plan.yearlyPrice).toLocaleString()} د.ج سنوياً
                      </span>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8 text-xs text-slate-700">
                    <div className="font-bold text-slate-900 text-xs mb-1">المميزات المضمنة:</div>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action CTA */}
                <div>
                  {isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-2xl bg-slate-100 text-slate-500 font-bold text-xs cursor-default flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>باقتك النشطة حالياً</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenUpgrade(plan.id)}
                      className={`w-full py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xs ${
                        plan.isPopular
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>{plan.monthlyPrice === 0 ? 'الرجوع للمجانية' : `ترقية إلى ${plan.name}`}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoices & Payment History */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>سجل الفواتير والمدفوعات الإلكترونية (Invoices & Receipts)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              يمكنك معاينة وطباعة وصولات الدفع وفواتير اشتراكك الرسمية في أي وقت
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setInvoiceFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                invoiceFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              الكل ({subscriptionInvoices.length})
            </button>
            <button
              type="button"
              onClick={() => setInvoiceFilter('paid')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                invoiceFilter === 'paid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              مدفوعة
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">رقم الفاتورة</th>
                <th className="py-3 px-4 font-bold">الباقة والبيان</th>
                <th className="py-3 px-4 font-bold">تاريخ الدفع</th>
                <th className="py-3 px-4 font-bold">طريقة الدفع</th>
                <th className="py-3 px-4 font-bold">المبلغ</th>
                <th className="py-3 px-4 font-bold text-center">الحالة</th>
                <th className="py-3 px-4 font-bold text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    لا توجد فواتير مطابقة لهذا التصفية
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{inv.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{inv.planName}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">{inv.date}</td>
                    <td className="py-3.5 px-4 text-slate-700">{inv.paymentMethod}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                      {inv.amount.toLocaleString()} {inv.currency}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>مدفوعة</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 text-slate-700 text-xs font-bold transition-all inline-flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>معاينة وطباعة</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span>الأسئلة الشائعة حول الاشتراكات وطرق الدفع في الجزائر</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-right font-bold text-xs sm:text-sm text-slate-800 hover:bg-slate-50 flex items-center justify-between gap-3"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      </>
      )}

      {/* Subscription Upgrade Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        initialPlanId={targetUpgradePlanId}
      />

      {/* Invoice Receipt Modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
};
