import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SupportedLanguage } from '../../i18n/types';
import { BannerImageUploader } from '../common/BannerImageUploader';
import {
  Settings,
  Store,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Save,
  CheckCircle2,
  Sparkles,
  Shield,
  Layers,
  Crown,
  Globe,
  Languages,
  Image as ImageIcon,
  Database
} from 'lucide-react';
import { XamppDatabaseManager } from '../database/XamppDatabaseManager';

export const SettingsTab: React.FC = () => {
  const {
    settings,
    updateSettings,
    showNotification,
    language,
    setLanguage,
    subscription,
    getActivePlan,
    setCurrentTab,
    setIsSubscriptionModalOpen,
    t
  } = useStore();

  const activePlan = getActivePlan();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [storeDescription, setStoreDescription] = useState(settings.storeDescription);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [currency, setCurrency] = useState(settings.currency);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold);
  const [checkoutNotice, setCheckoutNotice] = useState(settings.checkoutNotice);
  const [defaultLanguage, setDefaultLanguage] = useState<SupportedLanguage>((settings.defaultLanguage as SupportedLanguage) || 'ar');
  const [enableLanguageSwitcher, setEnableLanguageSwitcher] = useState(settings.enableLanguageSwitcher ?? true);
  const [bannerImage, setBannerImage] = useState(
    settings.homepage?.heroBannerImage || settings.bannerImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  );

  const [settingsSubTab, setSettingsSubTab] = useState<'general' | 'database'>('general');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      storeDescription,
      phone,
      email,
      address,
      currency,
      freeShippingThreshold: Number(freeShippingThreshold),
      checkoutNotice,
      defaultLanguage,
      enableLanguageSwitcher,
      bannerImage,
      homepage: {
        ...(settings.homepage || {
          heroBadge: '🔥 عروض حصرية ومميزة',
          heroTitle: storeName,
          heroSubtitle: settings.slogan,
          heroCtaText: 'تصفح كل المنتجات الآن',
          showFeaturesBar: true,
          showCategories: true,
          showReviews: true,
        }),
        heroBannerImage: bannerImage,
      },
    });
    showNotification(t('notification.settings_saved', 'تم حفظ الإعدادات العامة وصورة الواجهة بنجاح'), 'success');
  };

  return (
    <div id="settings-tab-content" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">إعدادات المتجر وقاعدة البيانات</h3>
          <p className="text-xs text-slate-500">
            تخصيص البيانات العامة، تفاصيل التواصل، ربط قاعدة بيانات XAMPP (MySQL / PDO)، وإدارة باقة اشتراكك.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {settingsSubTab === 'general' && (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التغييرات</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 rounded-2xl max-w-fit">
        <button
          type="button"
          onClick={() => setSettingsSubTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            settingsSubTab === 'general'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 text-emerald-600" />
          <span>إعدادات المتجر العامة</span>
        </button>

        <button
          type="button"
          onClick={() => setSettingsSubTab('database')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            settingsSubTab === 'database'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-600" />
          <span>قاعدة بيانات XAMPP (MySQL)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            PDO جاهز
          </span>
        </button>
      </div>

      {settingsSubTab === 'database' ? (
        <XamppDatabaseManager />
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Store Profile Information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>بيانات المتجر والعملة</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم المتجر الرسمي</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">العملة المعتمدة</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="د.ج">الدينار الجزائري (د.ج / DZD)</option>
                <option value="USD">$ دولار أمريكي (USD)</option>
                <option value="EUR">€ يورو (EUR)</option>
              </select>
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1">وصف المتجر (SEO وسوشيال ميديا)</label>
            <textarea
              rows={2}
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">رقم هاتف خدمة العملاء / واتساب</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني الرسمي</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">العنوان أو المقر</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Hero Banner Image Upload & Configuration Section */}
        <BannerImageUploader
          value={bannerImage}
          onChange={(newUrl) => setBannerImage(newUrl)}
          title="تغيير صورة الواجهة الرئيسية (Hero Banner Image Upload)"
          subtitle="تحكم بالصورة البارزة في واجهة المتجر (بدلاً من صورة السماعات الصفراء) برفع صورة أو إدخال رابط أو اختيار من المعرض"
        />

        {/* Shipping & Checkout Rules */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>{t('settings.policies_title', 'سياسات الشراء والشحن المجاني')}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('settings.free_shipping_threshold', 'حد الشحن المجاني التلقائي (بالدينار)')}
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {t('settings.free_shipping_hint', 'عند وصول مجموع سلة الزبون إلى هذا المبلغ، يُصبح الشحن مجانياً تلقائياً.')}
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('settings.checkout_note', 'ملاحظة أسفل نموذج الطلب السريع')}</label>
              <input
                type="text"
                value={checkoutNotice}
                onChange={(e) => setCheckoutNotice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Language & Localization Settings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Languages className="w-4 h-4 text-emerald-600" />
            <span>{t('settings.lang_localization', 'إعدادات اللغة والترجمة (i18n)')}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('settings.default_store_lang', 'اللغة الافتراضية للمتجر')}
              </label>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value as SupportedLanguage)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="ar">العربية (RTL - من اليمين لليسار) 🇩🇿</option>
                <option value="en">English (LTR - Left to Right) 🇬🇧</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {t('settings.default_lang_hint', 'اللغة التي تظهر تلقائياً للزائر عند دخوله لأول مرة.')}
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('settings.enable_lang_switcher', 'إتاحة مبدل اللغات للزوار')}
              </label>
              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableLanguageSwitcher}
                    onChange={(e) => setEnableLanguageSwitcher(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
                <span className="text-slate-600 font-medium">
                  {enableLanguageSwitcher ? t('common.active', 'مفعل (يمكن للزائر التبديل بين العربية والإنجليزية)') : t('common.inactive', 'معطل')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plan Overview */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {activePlan.name} ({subscription.status === 'active' ? 'اشتراك نشط' : 'معلق'})
              </span>
            </div>
            <h4 className="text-xl font-black">
              {activePlan.limits.maxStores === -1
                ? 'خطة غير محدودة لجميع المتاجر والطلبات'
                : `تتيح باقتك إدارة ${activePlan.limits.maxStores} متاجر و${activePlan.limits.maxStaff === -1 ? 'موظفين غير محدودين' : `${activePlan.limits.maxStaff} موظفين`}`}
            </h4>
            <p className="text-xs text-slate-300 max-w-xl">
              تاريخ الانتهاء: <strong className="text-white font-mono">{subscription.expiryDate || '2026-09-30'}</strong> • الدورة:{' '}
              {subscription.billingCycle === 'yearly' ? 'اشتراك سنوي (وفرت 20%)' : 'اشتراك شهري'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setCurrentTab('billing')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors"
            >
              لوحة الاشتراكات والفواتير
            </button>
            <button
              type="button"
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-colors shadow-sm"
            >
              ترقية الباقة الآن 🚀
            </button>
          </div>
        </div>
      </form>
      )}
    </div>
  );
};
