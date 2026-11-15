import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { StoreCustomizerSection, StoreFAQ, StoreThemePreset, StoreButtonConfig } from '../../types';
import { BannerImageUploader } from '../common/BannerImageUploader';
import { ButtonCustomizerPanel } from './ButtonCustomizerPanel';
import { ThemePresetsGallery } from './ThemePresetsGallery';
import { LivePreviewStudio } from './LivePreviewStudio';
import { DEFAULT_BUTTON_CONFIG } from '../../data/mockThemePresets';
import {
  getButtonRadiusClass,
  getButtonShadowClass,
  getButtonHoverClass,
  getButtonPaddingClass,
  getButtonFontSizeClass,
  getButtonFontWeightClass,
  getPrimaryButtonStyles,
  getSecondaryButtonStyles,
} from '../../utils/buttonStyles';
import {
  Palette,
  Image as ImageIcon,
  LayoutTemplate,
  PhoneCall,
  HelpCircle,
  Info,
  ShoppingCart,
  Check,
  Eye,
  Plus,
  Trash2,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  Upload,
  Globe,
  Sliders,
  Type,
  ExternalLink,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  MousePointerClick,
  Monitor,
  ShoppingBag,
  Zap,
  Flame,
  Star
} from 'lucide-react';

const COLOR_PRESETS = [
  { name: 'زمردي راقي', hex: '#059669', bgClass: 'bg-emerald-600' },
  { name: 'أزرق احترافي', hex: '#2563eb', bgClass: 'bg-blue-600' },
  { name: 'بنفسجي فاخر', hex: '#7c3aed', bgClass: 'bg-violet-600' },
  { name: 'ذهبي كهرماني', hex: '#d97706', bgClass: 'bg-amber-600' },
  { name: 'وردي جريء', hex: '#e11d48', bgClass: 'bg-rose-600' },
  { name: 'برتقالي ناري', hex: '#ea580c', bgClass: 'bg-orange-600' },
  { name: 'فحمي عصري', hex: '#0f172a', bgClass: 'bg-slate-900' },
  { name: 'عنابي جزائري', hex: '#881337', bgClass: 'bg-rose-950' },
];

const FONTS = [
  { id: 'Cairo', name: 'خط كايرو (Cairo) - موصى به للتجارة' },
  { id: 'Tajawal', name: 'خط تجوال (Tajawal) - حديث وعصري' },
  { id: 'Almarai', name: 'خط المراعي (Almarai) - أنيق ومقروء' },
  { id: 'Readex Pro', name: 'خط ريديكس برو (Readex Pro) - مينيمال تقني' },
];

export const StoreCustomizerTab: React.FC = () => {
  const {
    settings,
    products,
    updateSettings,
    storeCustomizerSection,
    setStoreCustomizerSection,
    setViewMode,
  } = useStore();

  const [formData, setFormData] = useState({
    ...settings,
    buttonConfig: settings.buttonConfig || DEFAULT_BUTTON_CONFIG,
  });

  const [activeSubTab, setActiveSubTab] = useState<StoreCustomizerSection>(
    storeCustomizerSection || 'presets'
  );
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState('التوصيل والشحن');
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Sync with context sub-tab if changed from sidebar
  useEffect(() => {
    if (storeCustomizerSection) {
      setActiveSubTab(storeCustomizerSection);
    }
  }, [storeCustomizerSection]);

  const handleSubTabChange = (section: StoreCustomizerSection) => {
    setActiveSubTab(section);
    setStoreCustomizerSection(section);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSettings(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleApplyThemePreset = (preset: StoreThemePreset) => {
    const updated = {
      ...formData,
      activeThemeId: preset.id,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      fontFamily: preset.fontFamily,
      buttonConfig: preset.buttonConfig,
      cardBorderRadius: preset.cardBorderRadius,
      cardShadow: preset.cardShadow,
    };
    setFormData(updated);
    updateSettings(updated);
  };

  const handleButtonConfigChange = (newBtnConfig: StoreButtonConfig) => {
    const updated = {
      ...formData,
      buttonConfig: newBtnConfig,
      primaryColor: newBtnConfig.primaryColor || formData.primaryColor,
    };
    setFormData(updated);
    updateSettings(updated);
  };

  const handleResetButtonConfig = () => {
    const updated = {
      ...formData,
      buttonConfig: DEFAULT_BUTTON_CONFIG,
    };
    setFormData(updated);
    updateSettings(updated);
  };

  const handleAddFaq = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    const newFaq: StoreFAQ = {
      id: `faq-${Date.now()}`,
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim(),
      category: newFaqCategory,
      isActive: true,
      order: (formData.faqs?.length || 0) + 1,
    };
    const updatedFaqs = [...(formData.faqs || []), newFaq];
    const updated = { ...formData, faqs: updatedFaqs };
    setFormData(updated);
    updateSettings(updated);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
    setShowAddFaqModal(false);
  };

  const handleDeleteFaq = (id: string) => {
    const updatedFaqs = (formData.faqs || []).filter((f) => f.id !== id);
    const updated = { ...formData, faqs: updatedFaqs };
    setFormData(updated);
    updateSettings(updated);
  };

  const navSections: { id: StoreCustomizerSection; title: string; icon: any; desc: string; badge?: string }[] = [
    { id: 'presets', title: 'قوالب المتجر (Themes)', icon: Sparkles, desc: 'أنماط جاهزة بضغطة زر واحدة', badge: 'جديد' },
    { id: 'buttons', title: 'تخصيص الأزرار (Buttons)', icon: MousePointerClick, desc: 'حواف دائرية/مربعة، ألوان وتأثيرات Hover', badge: 'جديد' },
    { id: 'live_preview', title: 'المعاينة الحية التفاعلية', icon: Eye, desc: 'شاشة حية للهاتف والكمبيوتر', badge: 'Live' },
    { id: 'logo', title: 'الشعار والهوية', icon: ImageIcon, desc: 'شعار المتجر والأيقونة' },
    { id: 'template', title: 'الألوان والخطوط', icon: LayoutTemplate, desc: 'اللوحة اللونية ونوع الخط' },
    { id: 'homepage', title: 'الصفحة الرئيسية والبانر', icon: Sliders, desc: 'البانر الترويجي والعروض' },
    { id: 'checkout', title: 'استمارة الطلب والسلة', icon: ShoppingCart, desc: 'إعدادات الشراء السريع COD' },
    { id: 'contact', title: 'معلومات الاتصال', icon: PhoneCall, desc: 'الهاتف وروابط التواصل' },
    { id: 'faq', title: 'الأسئلة الشائعة', icon: HelpCircle, desc: 'إدارة الأسئلة وإجاباتها' },
    { id: 'about', title: 'حول المتجر والسياسات', icon: Info, desc: 'قصة المتجر والضمانات' },
  ];

  const currentBtnConfig = formData.buttonConfig || DEFAULT_BUTTON_CONFIG;
  const sidePrimaryBtnStyles = getPrimaryButtonStyles(currentBtnConfig, formData.primaryColor);
  const sideSecondaryBtnStyles = getSecondaryButtonStyles(currentBtnConfig);
  const sideRadiusClass = getButtonRadiusClass(currentBtnConfig.shape);
  const sideShadowClass = getButtonShadowClass(currentBtnConfig.shadow);
  const sideHoverClass = getButtonHoverClass(currentBtnConfig.hoverEffect);
  const sidePaddingClass = getButtonPaddingClass(currentBtnConfig.padding);
  const sideFontSizeClass = getButtonFontSizeClass(currentBtnConfig.fontSize);
  const sideFontWeightClass = getButtonFontWeightClass(currentBtnConfig.fontWeight);

  return (
    <div id="store-customizer-content" className="space-y-6">
      {/* 1. Top Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Palette className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>استوديو تخصيص وتصميم المتجر (Online Store Customizer)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  V2.5 Advanced
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تخصيص كامل للأزرار، القوالب الجاهزة، الألوان، الخطوط، واستمارة الطلب مع معاينة حية فورية.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setViewMode('storefront')}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span>معاينة واجهة المتجر</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Check className="w-4 h-4" />
            <span>حفظ ونشر التعديلات</span>
          </button>
        </div>
      </div>

      {/* Toast Save Alert */}
      {saveToast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-bold">تم حفظ وتطبيق كافة تعديلات المتجر بنجاح! 🚀</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-mono">Instant Sync</span>
        </div>
      )}

      {/* 2. Top Navigation Sub-Tabs Pills */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {navSections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSubTab === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => handleSubTabChange(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{sec.title}</span>
              {sec.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-md font-black ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {sec.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main Configuration Column (2 Spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* SUBTAB 1: THEME PRESETS */}
          {activeSubTab === 'presets' && (
            <ThemePresetsGallery
              activeThemeId={formData.activeThemeId}
              onApplyTheme={handleApplyThemePreset}
            />
          )}

          {/* SUBTAB 2: BUTTON CUSTOMIZER */}
          {activeSubTab === 'buttons' && (
            <ButtonCustomizerPanel
              buttonConfig={currentBtnConfig}
              onChange={handleButtonConfigChange}
              onReset={handleResetButtonConfig}
            />
          )}

          {/* SUBTAB 3: LIVE PREVIEW STUDIO */}
          {activeSubTab === 'live_preview' && (
            <LivePreviewStudio
              settings={formData}
              products={products}
              onOpenFullStorefront={() => setViewMode('storefront')}
              onSave={handleSave}
            />
          )}

          {/* SUBTAB 4: LOGO & IDENTITY */}
          {activeSubTab === 'logo' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>الشعار والهوية البصرية</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  تحديد اسم المتجر، الشعار الرسمي، الأيقونة وسلوجان المتجر
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    اسم المتجر (Store Name)
                  </label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الوصف المختصر / السلوجان
                  </label>
                  <input
                    type="text"
                    value={formData.slogan}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رابط الشعار الرسمي (Logo URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.logoUrl}
                      onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                      placeholder="https://..."
                    />
                  </div>
                  {formData.logoUrl && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                      <img
                        src={formData.logoUrl}
                        alt="Logo Preview"
                        className="h-10 w-auto object-contain"
                      />
                      <span className="text-[11px] text-slate-500 font-bold">معاينة الشعار الحالي</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 5: TEMPLATE COLORS & FONTS */}
          {activeSubTab === 'template' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-emerald-600" />
                  <span>لوحة الألوان ونوع الخط</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  تحكم دقيق في الألوان الأساسية ونمط الخطوط العربية
                </p>
              </div>

              {/* Color Palettes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  اللون الأساسي المميز (Primary Brand Color):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {COLOR_PRESETS.map((color) => {
                    const isSelected = formData.primaryColor === color.hex;
                    return (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, primaryColor: color.hex })}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-right transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full ${color.bgClass} shrink-0 flex items-center justify-center text-white text-[9px]`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate">{color.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 font-mono w-28"
                  />
                  <span className="text-[11px] text-slate-400">كود اللون المخصص (Hex Code)</span>
                </div>
              </div>

              {/* Arabic Font Selection */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  نوع الخط العربي (Typography):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FONTS.map((font) => {
                    const isSelected = (formData.fontFamily || 'Cairo') === font.id;
                    return (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, fontFamily: font.id })}
                        style={{ fontFamily: font.id }}
                        className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900">{font.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Announcement Bar */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">شريط الإعلانات العلوي (Announcement Bar)</div>
                    <div className="text-[11px] text-slate-400">شريط نصي في أعلى المتجر لإعلانات التوصيل والعروض</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.announcementActive}
                    onChange={(e) =>
                      setFormData({ ...formData, announcementActive: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-600 rounded-md"
                  />
                </div>

                {formData.announcementActive && (
                  <input
                    type="text"
                    value={formData.announcementBarText}
                    onChange={(e) =>
                      setFormData({ ...formData, announcementBarText: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    placeholder="شحن مجاني للطلبات الكبيرة والدفع عند الاستلام 🚚"
                  />
                )}
              </div>
            </div>
          )}

          {/* SUBTAB 6: HOMEPAGE & HERO BANNER */}
          {activeSubTab === 'homepage' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-600" />
                  <span>الصفحة الرئيسية والبانر الترويجي</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  تعديل نصوص وصور الواجهة الرئيسية لجذب المشترين فور دخول المتجر
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    شارة العرض الترويجي (Hero Badge)
                  </label>
                  <input
                    type="text"
                    value={formData.homepage?.heroBadge || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        homepage: {
                          ...(prev.homepage || {
                            heroBadge: '',
                            heroTitle: prev.storeName,
                            heroSubtitle: prev.slogan,
                            heroCtaText: 'تصفح العروض الآن',
                            heroBannerImage: prev.bannerImage || '',
                            showFeaturesBar: true,
                            showCategories: true,
                            showReviews: true,
                          }),
                          heroBadge: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    placeholder="🔥 عروض حصرية لفترة محدودة"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      العنوان الرئيسي للواجهة
                    </label>
                    <input
                      type="text"
                      value={formData.homepage?.heroTitle || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          homepage: {
                            ...(prev.homepage || {
                              heroBadge: '🔥 عروض حصرية',
                              heroTitle: '',
                              heroSubtitle: prev.slogan,
                              heroCtaText: 'تصفح العروض',
                              heroBannerImage: prev.bannerImage || '',
                              showFeaturesBar: true,
                              showCategories: true,
                              showReviews: true,
                            }),
                            heroTitle: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      نص زر الشراء الرئيسي (CTA Button Text)
                    </label>
                    <input
                      type="text"
                      value={formData.homepage?.heroCtaText || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          homepage: {
                            ...(prev.homepage || {
                              heroBadge: '🔥 عروض',
                              heroTitle: prev.storeName,
                              heroSubtitle: prev.slogan,
                              heroCtaText: '',
                              heroBannerImage: prev.bannerImage || '',
                              showFeaturesBar: true,
                              showCategories: true,
                              showReviews: true,
                            }),
                            heroCtaText: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <BannerImageUploader
                    value={formData.homepage?.heroBannerImage || formData.bannerImage}
                    onChange={(newUrl) => {
                      setFormData((prev) => ({
                        ...prev,
                        bannerImage: newUrl,
                        homepage: {
                          ...(prev.homepage || {
                            heroBadge: '🔥 عروض حصرية',
                            heroTitle: prev.storeName,
                            heroSubtitle: prev.slogan,
                            heroCtaText: 'تصفح كل المنتجات الآن',
                            showFeaturesBar: true,
                            showCategories: true,
                            showReviews: true,
                          }),
                          heroBannerImage: newUrl,
                        },
                      }));
                    }}
                    title="تغيير صورة البانر في واجهة المتجر"
                    subtitle="ارفع صورة أو اختر قالباً جاهزاً لتغيير صورة البانر فوراً"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 7: CHECKOUT & COD FORM */}
          {activeSubTab === 'checkout' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  <span>استمارة الشراء السريع COD وسلة التسوق</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  تخصيص نصوص وضمانات استمارة الدفع عند الاستلام لرفع معدل تأكيد الطلبات
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    نص زر تأكيد الطلب السريع (COD Submit Button CTA)
                  </label>
                  <input
                    type="text"
                    value={formData.checkoutConfig?.submitButtonText || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        checkoutConfig: {
                          ...(formData.checkoutConfig || {
                            mode: 'one_page_cod',
                            requireCustomerName: true,
                            requirePhone: true,
                            requireWilaya: true,
                            requireCommune: true,
                            requireAddress: true,
                            requireNotes: false,
                            showUrgencyTimer: true,
                            urgencyTimerMinutes: 15,
                            showFreeShippingBar: true,
                            guaranteeBadgeText: 'ضمان أصلي واستبدال مجاني',
                            submitButtonText: '',
                            whatsappOrderDirect: true,
                          }),
                          submitButtonText: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold"
                    placeholder="اضغط هنا لتأكيد طلبك الآن (الدفع عند الاستلام) 🚚"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    نص شارة الضمان والأمان
                  </label>
                  <input
                    type="text"
                    value={formData.checkoutConfig?.guaranteeBadgeText || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        checkoutConfig: {
                          ...(formData.checkoutConfig || {
                            mode: 'one_page_cod',
                            requireCustomerName: true,
                            requirePhone: true,
                            requireWilaya: true,
                            requireCommune: true,
                            requireAddress: true,
                            requireNotes: false,
                            showUrgencyTimer: true,
                            urgencyTimerMinutes: 15,
                            showFreeShippingBar: true,
                            guaranteeBadgeText: '',
                            submitButtonText: 'تأكيد الطلب الآن',
                            whatsappOrderDirect: true,
                          }),
                          guaranteeBadgeText: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    placeholder="ضمان أصلي 100% • معاينة الطرد قبل الدفع"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 8: CONTACT & SOCIAL */}
          {activeSubTab === 'contact' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>معلومات الاتصال وروابط التواصل الاجتماعي</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم الهاتف لخدمة الزبائن
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم الواتساب للطلبات المباشرة
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber || ''}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    البريد الإلكتروني الرسمي
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    العنوان والمقر
                  </label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 9: FAQ */}
          {activeSubTab === 'faq' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>إدارة الأسئلة الشائعة (FAQ)</span>
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddFaqModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة سؤال جديد</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.faqs || []).map((faq, index) => (
                  <div
                    key={faq.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900">{faq.question}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600">{faq.answer}</p>
                  </div>
                ))}
              </div>

              {showAddFaqModal && (
                <div className="p-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/20 space-y-3">
                  <input
                    type="text"
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    placeholder="السؤال..."
                  />
                  <textarea
                    rows={2}
                    value={newFaqAnswer}
                    onChange={(e) => setNewFaqAnswer(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    placeholder="الإجابة..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddFaqModal(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                    >
                      إضافة السؤال
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUBTAB 10: ABOUT */}
          {activeSubTab === 'about' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>حول المتجر والسياسات</span>
                </h4>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    قصة المتجر ورؤيتنا
                  </label>
                  <textarea
                    rows={3}
                    value={formData.aboutConfig?.storyContent || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aboutConfig: {
                          ...(formData.aboutConfig || {
                            storyTitle: 'قصتنا ورؤيتنا',
                            storyContent: '',
                            storyImage: '',
                            features: [],
                            returnPolicy: 'استبدال مجاني خلال 7 أيام',
                            shippingPolicy: 'توصيل 58 ولاية',
                          }),
                          storyContent: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    placeholder="نحن متجر جزائري نسعى لتوفير أجود المنتجات بأفضل الأسعار..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Action Button */}
          <button
            type="button"
            onClick={() => handleSave()}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Check className="w-4 h-4" />
            <span>حفظ وتطبيق كافة إعدادات القسم فوراً</span>
          </button>
        </div>

        {/* Right-Hand Live Interactive Preview Column (1 Span) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>المعاينة التفاعلية الفورية</span>
              </h4>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Live Sync ⚡
              </span>
            </div>

            {/* Quick Interactive Button Test Arena */}
            <div className="mb-4 p-3 bg-slate-900 text-white rounded-xl space-y-2 text-right">
              <div className="text-[10px] font-bold text-amber-300 flex items-center justify-between">
                <span>معاينة حية لشكل وتأثير الأزرار:</span>
                <span className="text-[9px] text-slate-400 font-mono">Hover & Click</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  style={sideSecondaryBtnStyles}
                  className={`w-full flex items-center justify-center gap-1 cursor-pointer ${sideRadiusClass} ${sideShadowClass} ${sideHoverClass} ${sidePaddingClass} ${sideFontSizeClass} ${sideFontWeightClass}`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span className="truncate">{currentBtnConfig.ctaAddToCartText || '+ أضف للسلة'}</span>
                </button>

                <button
                  type="button"
                  style={sidePrimaryBtnStyles}
                  className={`w-full flex items-center justify-center gap-1 cursor-pointer ${sideRadiusClass} ${sideShadowClass} ${sideHoverClass} ${sidePaddingClass} ${sideFontSizeClass} ${sideFontWeightClass}`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="truncate">{currentBtnConfig.ctaDirectOrderText || 'اطلب فوراً'}</span>
                </button>
              </div>
            </div>

            {/* Mock Storefront Header Preview */}
            <div
              className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-slate-50 text-slate-800"
              style={{ fontFamily: formData.fontFamily || 'Cairo' }}
            >
              {/* Announcement Bar */}
              {formData.announcementActive && (
                <div
                  className="px-2 py-1.5 text-[10px] font-medium text-white text-center truncate shadow-xs"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  {formData.announcementBarText}
                </div>
              )}

              {/* Navigation Bar */}
              <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" className="h-6 w-auto object-contain" />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      {formData.storeName?.charAt(0) || 'M'}
                    </div>
                  )}
                  <span className="text-xs font-black text-slate-800 truncate max-w-[120px]">
                    {formData.storeName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <ShoppingCart className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                </div>
              </div>

              {/* Mini Hero Card */}
              <div className="p-4 bg-gradient-to-b from-slate-100 to-white text-center space-y-2.5">
                {formData.homepage?.heroBadge && (
                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {formData.homepage.heroBadge}
                  </span>
                )}
                <h5 className="font-black text-xs text-slate-900 leading-snug">
                  {formData.homepage?.heroTitle || formData.slogan}
                </h5>

                {/* Hero Banner Preview Thumbnail */}
                <div className="w-full h-24 rounded-xl overflow-hidden shadow-xs border border-slate-200 bg-slate-900 my-1">
                  <img
                    src={
                      formData.homepage?.heroBannerImage ||
                      formData.bannerImage ||
                      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
                    }
                    alt="Hero Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    style={sidePrimaryBtnStyles}
                    className={`w-full flex items-center justify-center gap-1.5 cursor-pointer ${sideRadiusClass} ${sideShadowClass} ${sideHoverClass} ${sidePaddingClass} ${sideFontSizeClass} ${sideFontWeightClass}`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{formData.homepage?.heroCtaText || 'تصفح كل المنتجات'}</span>
                  </button>
                </div>
              </div>

              {/* Mini COD Checkout Preview */}
              <div className="p-3 bg-white border-t border-slate-200/80 space-y-2">
                <div className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>
                    {formData.checkoutConfig?.guaranteeBadgeText || 'ضمان أصلي والدفع عند الاستلام'}
                  </span>
                </div>
                <div className="h-4 bg-slate-100 rounded text-[8px] text-slate-400 px-2 flex items-center">
                  الاسم الكامل ورقم الهاتف (58 ولاية)...
                </div>
                <button
                  type="button"
                  style={sidePrimaryBtnStyles}
                  className={`w-full flex items-center justify-center gap-1.5 cursor-pointer ${sideRadiusClass} ${sideShadowClass} ${sideHoverClass} ${sidePaddingClass} ${sideFontSizeClass} ${sideFontWeightClass}`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{formData.checkoutConfig?.submitButtonText || 'اضغط هنا لتأكيد طلبك'}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-1 text-[9px] text-slate-600 text-center font-medium">
                <div className="flex flex-col items-center gap-0.5">
                  <Truck className="w-3 h-3 text-emerald-600" />
                  <span>58 ولاية</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>معاينة وفحص</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <RotateCcw className="w-3 h-3 text-emerald-600" />
                  <span>استبدال 7 أيام</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
