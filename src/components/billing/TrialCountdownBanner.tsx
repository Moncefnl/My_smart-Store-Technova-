import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Lock,
  CheckCircle2,
  RefreshCw,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
  Timer,
  WalletCards,
  Building2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const TrialCountdownBanner: React.FC = () => {
  const {
    subscription,
    activePlan,
    isTrialActive,
    isTrialExpired,
    trialTimeRemaining,
    setIsSubscriptionModalOpen,
    resetTrialTimer,
    simulateTrialExpiry,
    stores,
    products,
    staff,
    landingPages,
  } = useStore();

  const [showLimitsDetail, setShowLimitsDetail] = useState(false);
  const [showTestingTools, setShowTestingTools] = useState(false);

  // If the user has an active paid subscription and is not in trial or expired trial, do not render
  const isTrialRelated =
    subscription.status === 'trial' ||
    subscription.isTrial === true ||
    (subscription.status === 'expired' && subscription.isTrial === true);

  if (!isTrialRelated) {
    return null;
  }

  const { hours, minutes, seconds, totalSeconds, percentElapsed } = trialTimeRemaining;
  const isUrgent = isTrialActive && totalSeconds < 4 * 3600; // Less than 4 hours remaining

  return (
    <div
      id="trial-countdown-banner"
      className={`relative mb-6 rounded-3xl overflow-hidden transition-all duration-300 ${
        isTrialExpired
          ? 'bg-gradient-to-br from-rose-950/95 via-slate-900 to-rose-950/90 border-2 border-rose-500/80 shadow-2xl shadow-rose-950/40 text-white'
          : isUrgent
          ? 'bg-gradient-to-br from-amber-950/95 via-slate-900 to-orange-950/90 border-2 border-orange-500/80 shadow-2xl shadow-orange-950/30 text-white'
          : 'bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-amber-500/40 shadow-xl text-white'
      }`}
    >
      {/* Ambient background glow */}
      <div
        className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isTrialExpired
            ? 'bg-rose-600/20'
            : isUrgent
            ? 'bg-orange-500/20'
            : 'bg-amber-500/15'
        }`}
      />
      <div
        className={`absolute -left-20 -bottom-20 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isTrialExpired
            ? 'bg-rose-700/15'
            : 'bg-indigo-600/15'
        }`}
      />

      <div className="relative p-5 sm:p-7">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2.5">
            {isTrialExpired ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>انتهت الفترة التجريبية (24 ساعة)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>حساب تجريبي مجاني (1-Day Free Trial)</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/10">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>مقيد بمميزات الباقة المبتدئة (Starter Plan)</span>
            </span>

            {isTrialExpired && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white animate-pulse">
                متجرك مقيد حالياً
              </span>
            )}
          </div>

          {/* Quick Sandbox / Simulation buttons toggle */}
          <div className="flex items-center gap-2">
            <button
              id="trial-test-toggle-btn"
              onClick={() => setShowTestingTools(!showTestingTools)}
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1"
              title="أدوات اختبار ومحاكاة انتهاء المهلة"
            >
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>أدوات تجربة المهلة</span>
              {showTestingTools ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Testing Tools Strip */}
        {showTestingTools && (
          <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-amber-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                أدوات الاختبار السريع: يمكنك محاكاة انتهاء مهلة الـ 24 ساعة لاختبار حظر الإجراءات، أو إعادة تعيين العداد ليوم كامل جديد.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="simulate-expiry-btn"
                onClick={simulateTrialExpiry}
                className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-medium transition-colors"
              >
                محاكاة انتهاء الوقت فوراً (Expire)
              </button>
              <button
                id="reset-timer-btn"
                onClick={resetTrialTimer}
                className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-medium transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>إعادة تعيين 24 ساعة (Reset)</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left / Text section */}
          <div className="lg:col-span-7">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
              {isTrialExpired ? (
                <>
                  <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                  <span>انتهت فترتك التجريبية (24 ساعة) - متجرك مقيد حالياً</span>
                </>
              ) : (
                <>
                  <Clock className="w-6 h-6 text-amber-400 flex-shrink-0" />
                  <span>
                    {isUrgent ? 'سارع بالترقية قبل تقييد المتجر!' : 'فترتك التجريبية المجانية نشطة (24 ساعة)'}
                  </span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {isTrialExpired ? (
                <>
                  لقد انتهت مهلة الـ 24 ساعة المجانية على الباقة المبتدئة. تم تقييد إضافة المنتجات، إنشاء صفحات الهبوط، وإدارة فريق العمل.
                  <strong className="text-white font-bold"> سارع بدفع الاشتراك عبر بريدي موب (BaridiMob RIP) أو CCP </strong>
                  لرفع التقييد فوراً ومتابعة مبيعاتك دون أي توقف!
                </>
              ) : (
                <>
                  أهلاً بك في منصة Technova! تم تفعيل اشتراك تجريبي مجاني لمتجرك لمدة 24 ساعة كاملة بمميزات الباقة المبتدئة. سارع بترقية حسابك وسداد الاشتراك قبل انتهاء الوقت لكي لا يتعرض متجرك للتقييد.
                </>
              )}
            </p>

            {/* Quick Badges: Payment methods accepted */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-amber-300">طرق الدفع المباشرة المتاحة:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                <WalletCards className="w-3.5 h-3.5" />
                <span>بريدي موب (BaridiMob RIP)</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                <Building2 className="w-3.5 h-3.5" />
                <span>حساب البريد الجاري (CCP)</span>
              </span>
              <span className="text-slate-400">مع تأكيد الإيصال فورياً</span>
            </div>
          </div>

          {/* Right / Countdown Timer Clock */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div
              className={`w-full p-4 rounded-2xl border text-center transition-all ${
                isTrialExpired
                  ? 'bg-rose-950/60 border-rose-500/50 shadow-inner'
                  : 'bg-black/40 border-amber-500/30 backdrop-blur-sm'
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-center gap-1.5">
                <Clock className={`w-3.5 h-3.5 ${isTrialExpired ? 'text-rose-400' : 'text-amber-400'}`} />
                <span>{isTrialExpired ? 'حالة العداد الزمني' : 'الوقت المتبقي لانتهاء الفترة التجريبية'}</span>
              </div>

              {/* Digital 3-Box Clock */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 my-2">
                {/* Hours Box */}
                <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                  <span
                    className={`font-mono text-2xl sm:text-4xl font-black tracking-tight ${
                      isTrialExpired ? 'text-rose-400' : 'text-amber-300'
                    }`}
                  >
                    {isTrialExpired ? '00' : String(hours).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] text-slate-300 mt-1 font-medium">ساعة</span>
                </div>

                {/* Minutes Box */}
                <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                  <span
                    className={`font-mono text-2xl sm:text-4xl font-black tracking-tight ${
                      isTrialExpired ? 'text-rose-400' : 'text-amber-300'
                    }`}
                  >
                    {isTrialExpired ? '00' : String(minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] text-slate-300 mt-1 font-medium">دقيقة</span>
                </div>

                {/* Seconds Box */}
                <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                  <span
                    className={`font-mono text-2xl sm:text-4xl font-black tracking-tight ${
                      isTrialExpired
                        ? 'text-rose-400'
                        : seconds % 2 === 0
                        ? 'text-white'
                        : 'text-amber-400'
                    }`}
                  >
                    {isTrialExpired ? '00' : String(seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] text-slate-300 mt-1 font-medium">ثانية</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>نسبة الوقت المنقضي من الـ 24 ساعة</span>
                  <span className="font-semibold text-slate-300">
                    {isTrialExpired ? '100%' : `${Math.round(percentElapsed)}%`}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      isTrialExpired
                        ? 'bg-rose-500 w-full'
                        : isUrgent
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                        : 'bg-gradient-to-r from-emerald-400 via-amber-400 to-orange-400'
                    }`}
                    style={{ width: isTrialExpired ? '100%' : `${Math.max(3, percentElapsed)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="trial-upgrade-cta-btn"
              onClick={() => setIsSubscriptionModalOpen(true)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all transform active:scale-95 ${
                isTrialExpired
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-900/40 animate-bounce'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-amber-900/30'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>ترقية الباقة ودفع الاشتراك الآن (CCP / BaridiMob)</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              id="trial-view-limits-btn"
              onClick={() => setShowLimitsDetail(!showLimitsDetail)}
              className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>حدود الباقة المبتدئة (Starter)</span>
              {showLimitsDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-xs text-slate-400">
            {isTrialExpired ? (
              <span className="text-rose-400 font-semibold">تنبيه: الترقية ترفع القيود وتفعل جميع المميزات فورياً</span>
            ) : (
              <span>دفع الاشتراك قبل انتهاء الوقت يضمن استمرارية متجرك 100%</span>
            )}
          </div>
        </div>

        {/* Collapsible Limits & Restrictions Drawer */}
        {showLimitsDetail && (
          <div className="mt-4 p-4 rounded-2xl bg-black/50 border border-white/15 text-xs text-slate-300">
            <h3 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>مميزات وقيود الباقة المبتدئة (Starter Plan) في الحساب التجريبي:</span>
            </h3>
            <p className="text-slate-400 mb-3">
              حسابك التجريبي المجاني لمدة 24 ساعة مقيّد حصرياً بالحدود التالية، ويمكنك رفع جميع هذه القيود بالترقية إلى الباقة الاحترافية (Pro) أو باقة المؤسسات:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {/* Limit 1: Stores */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-200">عدد المتاجر المسموحة</div>
                  <div className="text-[11px] text-slate-400">متجر واحد فقط (1 Store)</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                  {stores.length} / 1
                </span>
              </div>

              {/* Limit 2: Products */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-200">عدد المنتجات</div>
                  <div className="text-[11px] text-slate-400">حتى 25 منتج فقط</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                  {products.length} / 25
                </span>
              </div>

              {/* Limit 3: Staff */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-200">فريق العمل (Staff)</div>
                  <div className="text-[11px] text-slate-400">موظف واحد فقط</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                  {staff.length} / 1
                </span>
              </div>

              {/* Limit 4: Landing Pages */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-200">صفحات الهبوط</div>
                  <div className="text-[11px] text-slate-400">صفحتين هبوط فقط</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                  {landingPages.length} / 2
                </span>
              </div>

              {/* Limit 5: Custom Domain */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-200">ربط دومين مخصص (.com / .dz)</div>
                  <div className="text-[11px] text-slate-400">يعمل على الرابط المجاني فقط</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                  مقفل (يتطلب Pro)
                </span>
              </div>

              {/* Limit 6: Fraud Detection */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-200">درع حظر الاحتيال التلقائي</div>
                  <div className="text-[11px] text-slate-400">فحص فردي يدوي فقط</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                  مقفل (يتطلب Pro)
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>العمولة 0% مجانية تماماً في جميع الباقات وبدون اقتطاعات على المبيعات.</span>
              </span>
              <button
                id="trial-limits-upgrade-link"
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-bold underline transition-colors"
              >
                الترقية وفتح جميع القيود 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
