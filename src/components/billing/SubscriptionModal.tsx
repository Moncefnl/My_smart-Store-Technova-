import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SubscriptionPlanId, BillingCycle } from '../../types';
import {
  X,
  CheckCircle2,
  Crown,
  Sparkles,
  ShieldCheck,
  Upload,
  Copy,
  Check,
  Zap,
  Tag,
  Smartphone,
  Landmark,
  FileCheck,
  AlertCircle,
  Clock,
  Eye,
} from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: SubscriptionPlanId;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  initialPlanId,
}) => {
  const {
    subscription,
    subscriptionPlans,
    showNotification,
    platformPaymentConfig,
    submitReceiptRequest,
  } = useStore();

  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>(
    initialPlanId || (subscription.planId === 'starter' ? 'pro' : subscription.planId)
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(subscription.billingCycle || 'monthly');
  const [paymentMethod, setPaymentMethod] = useState<'baridimob' | 'ccp'>('baridimob');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [senderName, setSenderName] = useState('');
  const [notes, setNotes] = useState('');
  const [instantActivateMode, setInstantActivateMode] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceiptPreviewModal, setShowReceiptPreviewModal] = useState(false);

  if (!isOpen) return null;

  const targetPlan = subscriptionPlans.find((p) => p.id === selectedPlanId) || subscriptionPlans[1];
  const basePrice = billingCycle === 'yearly' ? targetPlan.yearlyPrice : targetPlan.monthlyPrice;
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'TECHNOVA20' || code === 'PROMO20') {
      setDiscountPercent(20);
      setCouponApplied(true);
      showNotification('تم تطبيق خصم 20% بنجاح! 🎁', 'success');
    } else if (code === 'VIP50') {
      setDiscountPercent(50);
      setCouponApplied(true);
      showNotification('تم تطبيق كود خصم VIP بنسبة 50%! 🚀', 'success');
    } else if (code === 'FREE100' && selectedPlanId !== 'enterprise') {
      setDiscountPercent(100);
      setCouponApplied(true);
      showNotification('تم تطبيق كود ترقية مجاني 100%! 🎉', 'success');
    } else {
      setCouponError('رمز القسيمة غير صالح أو منتهي الصلاحية');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setReceiptFile(uploadEvent.target?.result as string);
        showNotification('تم إرفاق إيصال الدفع بنجاح 📄', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSampleReceipt = () => {
    // Generate a clean mock receipt SVG data URL
    const svgSample = paymentMethod === 'baridimob'
      ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="380" height="500" viewBox="0 0 380 500" style="background:%23047857;font-family:sans-serif;">
          <rect width="380" height="500" fill="%23047857" rx="16"/>
          <circle cx="190" cy="60" r="28" fill="white"/>
          <path d="M182 60 L188 66 L200 52" stroke="%23047857" stroke-width="3.5" fill="none"/>
          <text x="190" y="115" fill="white" font-size="18" font-weight="bold" text-anchor="middle">BaridiMob - إشعار تحويل</text>
          <rect x="20" y="140" width="340" height="320" fill="white" rx="12"/>
          <text x="190" y="180" fill="%23111827" font-size="22" font-weight="bold" text-anchor="middle">${finalPrice.toLocaleString()} DZD</text>
          <text x="190" y="205" fill="%23059669" font-size="12" font-weight="bold" text-anchor="middle">تم التحويل بنجاح لحساب RIP</text>
          <line x1="40" y1="225" x2="340" y2="225" stroke="%23e5e7eb" stroke-width="1"/>
          <text x="40" y="255" fill="%236b7280" font-size="11">الحساب المستلم (RIP):</text>
          <text x="40" y="275" fill="%23111827" font-size="12" font-weight="bold">${platformPaymentConfig.baridiMobRip}</text>
          <text x="40" y="305" fill="%236b7280" font-size="11">المستفيد:</text>
          <text x="40" y="325" fill="%23111827" font-size="12" font-weight="bold">${platformPaymentConfig.baridiMobHolderName}</text>
          <text x="40" y="355" fill="%236b7280" font-size="11">رقم المعاملة:</text>
          <text x="40" y="375" fill="%234f46e5" font-size="12" font-weight="bold">BM-${Date.now().toString(36).toUpperCase()}</text>
        </svg>`
      : `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="460" height="320" viewBox="0 0 460 320" style="background:%23fef3c7;border:2px solid %23f59e0b;font-family:sans-serif;">
          <rect width="460" height="320" fill="%23fef3c7" rx="12"/>
          <rect x="15" y="15" width="430" height="35" fill="%231e3a8a" rx="6"/>
          <text x="230" y="38" fill="white" font-size="13" font-weight="bold" text-anchor="middle">بريد الجزائر - وصل دفع بحساب جاري بريدي (CCP)</text>
          <rect x="20" y="60" width="420" height="240" fill="white" rx="8" stroke="%23e5e7eb"/>
          <text x="410" y="90" fill="%23111827" font-size="11" font-weight="bold" text-anchor="end">رقم حساب المستفيد (CCP):</text>
          <text x="410" y="112" fill="%231e40af" font-size="15" font-weight="900" font-family="monospace" text-anchor="end">${platformPaymentConfig.ccpAccount} Clé ${platformPaymentConfig.ccpKey}</text>
          <text x="410" y="140" fill="%234b5563" font-size="10" text-anchor="end">صاحب الحساب: ${platformPaymentConfig.ccpHolderName}</text>
          <text x="410" y="175" fill="%23111827" font-size="11" font-weight="bold" text-anchor="end">المبلغ المودع:</text>
          <text x="410" y="200" fill="%23047857" font-size="16" font-weight="900" font-family="monospace" text-anchor="end">${finalPrice.toLocaleString()} د.ج</text>
          <text x="30" y="270" fill="%23b45309" font-size="10">ختم المكتب: مركز البريد المركزي - Ref: CCP-${Date.now().toString(36).toUpperCase()}</text>
        </svg>`;

    setReceiptFile(svgSample);
    setTransactionRef(`${paymentMethod === 'baridimob' ? 'BM' : 'CCP'}-${Date.now().toString().slice(-6)}`);
    showNotification('تم إرفاق نموذج وصل دفع تلقائياً للتجربة السريعة!', 'success');
  };

  const handleConfirmSubscription = () => {
    if (finalPrice > 0 && !receiptFile) {
      showNotification('يرجى إرفاق صورة إيصال التحويل (BaridiMob أو CCP) للمتابعة', 'error');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      submitReceiptRequest({
        planId: selectedPlanId,
        billingCycle,
        paymentMethod,
        receiptUrl: receiptFile || '',
        transactionRef: transactionRef.trim() || undefined,
        senderName: senderName.trim() || undefined,
        notes: notes.trim() || undefined,
        instantActivate: instantActivateMode || finalPrice === 0,
      });

      setIsProcessing(false);
      onClose();
    }, 900);
  };

  return (
    <div
      id="subscription-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto"
      dir="rtl"
    >
      <div
        id="subscription-modal-container"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 transition-all"
      >
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide text-white">
                  باقات اشتراك منصة تكنوفا (Technova DZ)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  دفع بريدي مباشر (CCP / RIP)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                نظام دفع مبسط بدون تعقيدات بنكية أو بوابات SATIM - اختر باقتك وحوّل عبر بريدي موب أو CCP
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Bar: Direct Post System */}
        <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">
              تم اعتماد الدفع المباشر: حوّل المبلغ المحدد عبر <strong>بريدي موب (BaridiMob RIP)</strong> أو <strong>حساب CCP</strong> وأرفق الوصل لتفعيل المتجر فوراً.
            </span>
          </div>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-emerald-200/70 text-emerald-800 text-[11px] font-bold">
            دون شروط تجارية معقدة
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Billing Cycle Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 px-3">اختر دورة الفوترة المناسبة:</span>
            <div className="inline-flex rounded-xl p-1 bg-white border border-slate-200 shadow-sm w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                اشتراك شهري
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>اشتراك سنوي</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-900 text-[10px] font-black">
                  وفر شهرين 🎁
                </span>
              </button>
            </div>
          </div>

          {/* Subscription Plans Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {subscriptionPlans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const isCurrent = subscription.planId === plan.id;
              const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/20 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {plan.badge && (
                    <span
                      className={`absolute -top-3 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-sm ${plan.badgeColor}`}
                    >
                      {plan.badge}
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-black text-sm text-slate-900">{plan.name}</h4>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          باقتك الحالية
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="mb-3">
                      <span className="text-xl font-black text-slate-900 font-mono">
                        {price === 0 ? '0' : price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-600 mr-1">{plan.currency}</span>
                      <span className="text-[11px] text-slate-400 mr-1">
                        /{billingCycle === 'yearly' ? 'سنوياً' : 'شهرياً'}
                      </span>
                    </div>

                    <ul className="space-y-1.5 border-t border-slate-100 pt-3 mb-4">
                      {plan.features.slice(0, 4).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? 'الباقة المحددة ✓' : 'اختيار هذه الباقة'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Payment Method Section: BaridiMob & CCP */}
          <div className="border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-600" />
                <span>طرق الدفع والتحويل المعتمدة:</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                تحويل مباشر لحساب المنصة مع تأكيد سريع للإيصالات
              </span>
            </div>

            {/* Payment Method Selector (2 Clean Tabs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* BaridiMob */}
              <button
                type="button"
                onClick={() => setPaymentMethod('baridimob')}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex items-start justify-between gap-3 ${
                  paymentMethod === 'baridimob'
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-500/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      paymentMethod === 'baridimob'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">
                        تطبيق بريدي موب (BaridiMob RIP)
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        الأسرع والأسهل
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      تحويل فوري من هاتفك برقم الـ RIP وإرفاق لقطة شاشة الوصل
                    </p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1 ${
                    paymentMethod === 'baridimob'
                      ? 'border-emerald-600 bg-emerald-600'
                      : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'baridimob' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* CCP Manual Deposit */}
              <button
                type="button"
                onClick={() => setPaymentMethod('ccp')}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex items-start justify-between gap-3 ${
                  paymentMethod === 'ccp'
                    ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-1 ring-blue-500/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      paymentMethod === 'ccp' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">
                        التحويل البريدي المباشر (حساب CCP)
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                        أي مكتب بريد
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      دفع عبر مكاتب بريد الجزائر أو الصك البريدي مع رفع صورة الوصل الأصفر
                    </p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1 ${
                    paymentMethod === 'ccp' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'ccp' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            </div>

            {/* Payment Details & Account Instructions Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-5 space-y-4">
              {paymentMethod === 'baridimob' ? (
                /* BaridiMob Details */
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500">
                          رقم الحساب البريدي الموحد (RIP):
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-base sm:text-lg font-black text-slate-900 tracking-wider">
                            {platformPaymentConfig.baridiMobRip}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(platformPaymentConfig.baridiMobRip, 'rip')}
                        className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-emerald-200"
                      >
                        {copiedField === 'rip' ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>تم نسخ الـ RIP!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>نسخ رقم الـ RIP</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs">
                      <div>
                        <span className="text-slate-500 text-[11px]">اسم صاحب الحساب المستفيد:</span>
                        <p className="font-bold text-slate-900 mt-0.5">
                          {platformPaymentConfig.baridiMobHolderName}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px]">المبلغ المطلوب تحويله:</span>
                        <p className="font-mono font-black text-emerald-700 text-sm mt-0.5">
                          {finalPrice.toLocaleString()} د.ج ({targetPlan.name})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="text-xs text-slate-600 space-y-1.5 bg-slate-100/70 p-3 rounded-xl">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>خطوات التحويل عبر تطبيق BaridiMob:</span>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pr-1">
                      <li>افتح تطبيق <strong>BaridiMob</strong> على هاتفك وتوجه لخيار <strong>تحويل (Virement)</strong>.</li>
                      <li>ألصق رقم الـ <strong>RIP</strong> الموضح أعلاه وحدد المبلغ: <strong>{finalPrice.toLocaleString()} د.ج</strong>.</li>
                      <li>قم بتأكيد التحويل والتقط صورة شاشة (Screenshot) لوصل التحويل الناجح.</li>
                      <li>ارفع صورة الوصل في الحقل أدناه لإتمام طلب الاشتراك.</li>
                    </ol>
                  </div>
                </div>
              ) : (
                /* CCP Details */
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500">
                          رقم الحساب البريدي الجاري (CCP) والمفتاح:
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-base sm:text-lg font-black text-slate-900">
                            {platformPaymentConfig.ccpAccount}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                            مفتاح (Clé): {platformPaymentConfig.ccpKey}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            `${platformPaymentConfig.ccpAccount} ${platformPaymentConfig.ccpKey}`,
                            'ccp'
                          )
                        }
                        className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-blue-200"
                      >
                        {copiedField === 'ccp' ? (
                          <>
                            <Check className="w-4 h-4 text-blue-600" />
                            <span>تم نسخ الحساب البريدي!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>نسخ رقم الحساب والمفتاح</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs">
                      <div>
                        <span className="text-slate-500 text-[11px]">اسم صاحب الحساب المستفيد:</span>
                        <p className="font-bold text-slate-900 mt-0.5">
                          {platformPaymentConfig.ccpHolderName}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px]">المبلغ المطلوب إيداعه:</span>
                        <p className="font-mono font-black text-blue-700 text-sm mt-0.5">
                          {finalPrice.toLocaleString()} د.ج ({targetPlan.name})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="text-xs text-slate-600 space-y-1.5 bg-slate-100/70 p-3 rounded-xl">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
                      <Landmark className="w-3.5 h-3.5 text-blue-600" />
                      <span>خطوات التحويل عبر مكاتب بريد الجزائر (Algérie Poste):</span>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pr-1">
                      <li>توجه لأي مكتب بريد واملأ حوالة بريدية صفراء (Versement CCP) برقم الحساب أعلاه.</li>
                      <li>سلّم المبلغ المطلوب للموظف واحتفظ بالوصل المختوم.</li>
                      <li>التقط صورة واضحة للوصل بهاتفك وارفعها في الحقل أدناه لتأكيد الاشتراك.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Receipt Upload & Details Input Form */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>إرفاق صورة إيصال الدفع / لقطة الشاشة (مطلوب للتأكيد):</span>
                  </label>
                  {receiptFile && (
                    <button
                      type="button"
                      onClick={() => setShowReceiptPreviewModal(true)}
                      className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>معاينة الوصل المرفق</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all text-slate-600">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-semibold">
                      {receiptFile ? '✓ تم اختيار إيصال الدفع (اضغط لتغييره)' : 'اضغط لاختيار صورة الوصل (JPG, PNG)'}
                    </span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={handleUseSampleReceipt}
                    className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition-all flex items-center justify-center gap-1"
                    title="استخدم نموذج وصل تجريبي لاختبار التفعيل فوراً"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>إرفاق وصل تجريبي سريع</span>
                  </button>
                </div>

                {/* Additional Info: Transaction Ref & Sender Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      رقم العملية أو المرجع (Reference - اختياري)
                    </label>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="مثال: BM-88231 أو رقم الوصل"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      اسم المُرسل أو رقم الهاتف المستخدم في التحويل
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="مثال: محمد بن علي (0550 12 34 56)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                {/* Instant Test Activation Toggle */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between bg-amber-50/60 p-2.5 rounded-xl border border-amber-200 text-xs">
                  <div className="flex items-center gap-2 text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-amber-950">وضع التفعيل الفوري التجريبي:</p>
                      <p className="text-[10px] text-amber-800">
                        {instantActivateMode
                          ? 'سيتم تفعيل مميزات الباقة فور إرسال الوصل تلقائياً وتوثيق الطلب في لوحة التحكم.'
                          : 'سيتم إرسال الوصل لحالة (قيد الانتظار) للمراجعة والتأكيد اليدوي من لوحة تحكم المنصة.'}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={instantActivateMode}
                      onChange={(e) => setInstantActivateMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Coupon Code & Total Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-5">
              {/* Coupon Code Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  هل لديك كود خصم أو قسيمة اشتراك؟
                </label>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="جرّب: TECHNOVA20"
                      disabled={couponApplied}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white uppercase font-mono"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={couponApplied || !couponCode.trim()}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition-all"
                  >
                    {couponApplied ? 'مُطبّق ✓' : 'تطبيق'}
                  </button>
                </form>
                {couponError && <p className="text-[10px] text-rose-600 mt-1 font-semibold">{couponError}</p>}
                {couponApplied && (
                  <p className="text-[10px] text-emerald-600 mt-1 font-bold">
                    ✓ تم تطبيق خصم {discountPercent}% على إجمالي الباقة
                  </p>
                )}
              </div>

              {/* Total Price Summary */}
              <div className="text-left bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>سعر الباقة ({billingCycle === 'yearly' ? 'سنوي' : 'شهري'}):</span>
                  <span className="font-mono font-semibold">{basePrice.toLocaleString()} د.ج</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-600 mb-1 font-bold">
                    <span>الخصم المطبق ({discountPercent}%):</span>
                    <span className="font-mono">-{discountAmount.toLocaleString()} د.ج</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-1.5">
                  <span>المبلغ النهائي المطلوب:</span>
                  <span className="text-base text-emerald-700 font-mono font-black">
                    {finalPrice === 0 ? 'مجاناً 0 د.ج' : `${finalPrice.toLocaleString()} د.ج`}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>دفع مضمون مع إمكانية مراجعة وتأكيد الإيصالات مباشرة من لوحة التحكم</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  id="confirm-subscription-upgrade-btn"
                  onClick={handleConfirmSubscription}
                  disabled={isProcessing}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>جارٍ تأكيد وإرسال الوصل...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>
                        {instantActivateMode ? 'تأكيد الوصل وتفعيل الباقة فوراً' : 'إرسال الوصل للمراجعة والتفعيل'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Preview Submodal */}
      {showReceiptPreviewModal && receiptFile && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-4 max-w-md w-full shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">معاينة وصل التحويل المرفق</h3>
              <button
                type="button"
                onClick={() => setShowReceiptPreviewModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-96 flex items-center justify-center bg-slate-50 p-2">
              <img src={receiptFile} alt="إيصال الدفع" className="max-h-80 object-contain rounded-lg shadow-sm" />
            </div>
            <button
              type="button"
              onClick={() => setShowReceiptPreviewModal(false)}
              className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              إغلاق المعاينة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
