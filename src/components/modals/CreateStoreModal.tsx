import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Store,
  Sparkles,
  Plus,
  Globe,
  Coins,
  Palette,
  CheckCircle2,
  Layers,
  Shirt,
  Smartphone,
  Home,
  Heart,
  PackageCheck,
  ChevronRight,
  Crown,
  Zap,
} from 'lucide-react';

const NICHES = [
  {
    id: 'electronics',
    name: 'إلكترونيات وأجهزة ذكية',
    desc: 'كتالوج جاهز: سماعات، ساعات ذكية، ملحقات الهواتف',
    icon: Smartphone,
    color: 'emerald',
    badge: 'الأكثر ربحية 🔥',
    defaultColor: '#10b981',
  },
  {
    id: 'fashion',
    name: 'أزياء، فساتين وعطور',
    desc: 'كتالوج جاهز: فساتين سهرة، عطور فاخرة، حقائب جلدية',
    icon: Shirt,
    color: 'indigo',
    badge: 'طلب عالي ⭐',
    defaultColor: '#6366f1',
  },
  {
    id: 'home_decor',
    name: 'أواني وديكور منزلي',
    desc: 'كتالوج جاهز: قدور جرانيت، أجهزة طبخ، إضاءات ذكية',
    icon: Home,
    color: 'amber',
    badge: 'مبيعات يومية 🏡',
    defaultColor: '#f59e0b',
  },
  {
    id: 'beauty',
    name: 'تجميل وعناية بالبشرة',
    desc: 'كتالوج جاهز: عطور راقية، بكجات العناية بالبشرة',
    icon: Heart,
    color: 'rose',
    badge: 'هامش ربح ممتاز 💖',
    defaultColor: '#ec4899',
  },
  {
    id: 'empty',
    name: 'متجر فارغ (مخصص)',
    desc: 'ابدأ بمتجر نظيف وأضف منتجاتك وأقسامك بنفسك من الصفر',
    icon: PackageCheck,
    color: 'slate',
    badge: 'تخصيص كامل 🛠️',
    defaultColor: '#0f172a',
  },
];

const PRESET_COLORS = [
  { name: 'زمردي أخضر', value: '#10b981' },
  { name: 'نيلي ملكي', value: '#6366f1' },
  { name: 'كهرماني ذهبي', value: '#f59e0b' },
  { name: 'وردي أنيق', value: '#ec4899' },
  { name: 'أزرق سماوي', value: '#0284c7' },
  { name: 'كحلي داكن', value: '#1e293b' },
];

export const CreateStoreModal: React.FC = () => {
  const {
    isCreateStoreModalOpen,
    setIsCreateStoreModalOpen,
    createStore,
    merchantStores,
    currentUser,
    getActivePlan,
    setIsSubscriptionModalOpen,
    t
  } = useStore();

  const activePlan = getActivePlan();
  const isLimitReached = activePlan.limits.maxStores !== -1 && merchantStores.length >= activePlan.limits.maxStores;

  const [name, setName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [domain, setDomain] = useState('');
  const [currency, setCurrency] = useState('د.ج');
  const [selectedNiche, setSelectedNiche] = useState<'electronics' | 'fashion' | 'home_decor' | 'beauty' | 'empty'>('electronics');
  const [primaryColor, setPrimaryColor] = useState('#10b981');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCreateStoreModalOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!domain || domain.includes('.matjari.dz')) {
      const generatedSlug = val
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
        .replace(/(^-|-$)/g, '');
      // Fallback simple latin slug
      const latinSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `store-${Date.now().toString().slice(-4)}`;
      setDomain(`${latinSlug}.matjari.dz`);
    }
  };

  const handleSelectNiche = (niche: (typeof NICHES)[0]) => {
    setSelectedNiche(niche.id as any);
    setPrimaryColor(niche.defaultColor);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      createStore({
        name: name.trim(),
        ownerId: currentUser?.id,
        slogan: slogan.trim() || undefined,
        domain: domain.trim() || undefined,
        currency,
        category: selectedNiche === 'empty' ? 'general' : selectedNiche,
        templateNiche: selectedNiche,
        primaryColor,
      });
      setIsSubmitting(false);
      setIsCreateStoreModalOpen(false);
      // Reset form
      setName('');
      setSlogan('');
      setDomain('');
    }, 400);
  };

  return (
    <div
      id="create-store-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="create-store-modal-card"
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 text-right animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 text-white p-6 relative">
          <button
            id="close-create-store-modal"
            onClick={() => setIsCreateStoreModalOpen(false)}
            className="absolute left-5 top-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">إنشاء متجر إلكتروني جديد</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-bold">
                  متعدد المتاجر Multi-Store
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                أنشئ متجراً جديداً في ثوانٍ مع قاعدة منتجات وإحصائيات مستقلة تماماً
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Plan Limits Banner */}
          <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
            isLimitReached
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-indigo-50 border-indigo-200 text-indigo-900'
          }`}>
            <div className="flex items-center gap-2.5">
              <Crown className={`w-4 h-4 shrink-0 ${isLimitReached ? 'text-rose-600' : 'text-indigo-600'}`} />
              <div>
                <span className="font-bold">باقتك الحالية ({activePlan.name}): </span>
                <span>
                  {merchantStores.length} من {activePlan.limits.maxStores === -1 ? 'متاجر غير محدودة' : `${activePlan.limits.maxStores} متاجر مستخدمة`}
                </span>
                {isLimitReached && (
                  <p className="text-[11px] text-rose-600 mt-0.5 font-bold">
                    لقد استنفذت الحد الأقصى للمتاجر المتاحة في باقتك الحالية.
                  </p>
                )}
              </div>
            </div>

            {isLimitReached ? (
              <button
                type="button"
                onClick={() => {
                  setIsCreateStoreModalOpen(false);
                  setIsSubscriptionModalOpen(true);
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-[11px] shrink-0 transition-colors shadow-xs flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                <span>ترقية الباقة لفتح متجر جديد</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsCreateStoreModalOpen(false);
                  setIsSubscriptionModalOpen(true);
                }}
                className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px] shrink-0 underline"
              >
                ترقية الباقة
              </button>
            )}
          </div>

          {/* Store Basic Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>البيانات الأساسية للمتجر</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم المتجر الجديد <span className="text-red-500">*</span>
                </label>
                <input
                  id="new-store-name-input"
                  type="text"
                  required
                  placeholder="مثال: متجر دار الهدايا DZ"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  العملة المعتمدة
                </label>
                <div className="relative">
                  <select
                    id="new-store-currency-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-white font-bold"
                  >
                    <option value="د.ج">د.ج (دينار جزائري - DZD)</option>
                    <option value="SAR">SAR (ريال سعودي)</option>
                    <option value="USD">USD ($ دولار أمريكي)</option>
                    <option value="EUR">EUR (€ يورو)</option>
                    <option value="AED">AED (درهم إماراتي)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  شعار / وصف مختصر (Slogan)
                </label>
                <input
                  id="new-store-slogan-input"
                  type="text"
                  placeholder="مثال: وجهتكم الأولى لأرقى الهدايا في الجزائر"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رابط النطاق المخصص / الفرعي
                </label>
                <div className="relative">
                  <input
                    id="new-store-domain-input"
                    type="text"
                    placeholder="dar-alhadaya.matjari.dz"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ltr text-left font-mono"
                  />
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Niche & Template Selection */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>اختر نوع المتجر ونموذج المنتجات الجاهزة</span>
              </h3>
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                تجهيز فوري ⚡
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {NICHES.map((niche) => {
                const Icon = niche.icon;
                const isSelected = selectedNiche === niche.id;
                return (
                  <div
                    key={niche.id}
                    id={`niche-option-${niche.id}`}
                    onClick={() => handleSelectNiche(niche)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl text-white ${
                        niche.id === 'electronics'
                          ? 'bg-emerald-600'
                          : niche.id === 'fashion'
                          ? 'bg-indigo-600'
                          : niche.id === 'home_decor'
                          ? 'bg-amber-600'
                          : niche.id === 'beauty'
                          ? 'bg-rose-600'
                          : 'bg-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-black text-slate-800">{niche.name}</span>
                        <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                          {niche.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{niche.desc}</p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2.5 left-2.5 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Scheme Picker */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-emerald-600" />
              <span>لون وهوية المتجر الأساسية</span>
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setPrimaryColor(c.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    primaryColor === c.value
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: c.value }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              id="cancel-create-store-btn"
              onClick={() => setIsCreateStoreModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all"
            >
              إلغاء
            </button>

            <button
              type="submit"
              id="confirm-create-store-btn"
              disabled={isSubmitting || !name.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري إنشاء المتجر والتهيئة...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>إنشاء المتجر وبدء الاستخدام الآن</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
