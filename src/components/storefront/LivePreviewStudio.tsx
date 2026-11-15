import React, { useState } from 'react';
import { StoreSettings, Product } from '../../types';
import {
  getButtonRadiusClass,
  getButtonShadowClass,
  getButtonHoverClass,
  getButtonPaddingClass,
  getButtonFontSizeClass,
  getButtonFontWeightClass,
  getPrimaryButtonStyles,
  getSecondaryButtonStyles
} from '../../utils/buttonStyles';
import {
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  ShoppingBag,
  ShoppingCart,
  Check,
  Star,
  Flame,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Zap,
  Phone,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

interface LivePreviewStudioProps {
  settings: StoreSettings;
  products: Product[];
  onOpenFullStorefront?: () => void;
  onSave?: () => void;
}

export const LivePreviewStudio: React.FC<LivePreviewStudioProps> = ({
  settings,
  products,
  onOpenFullStorefront,
  onSave,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activePreviewSection, setActivePreviewSection] = useState<'all' | 'card' | 'checkout' | 'hero'>('all');
  const [sampleQty, setSampleQty] = useState(1);
  const [sampleAdded, setSampleAdded] = useState(false);
  const [testOrderSubmitted, setTestOrderSubmitted] = useState(false);

  const sampleProduct = products[0] || {
    id: 'prod-sample',
    name: 'سماعات بلوتوث لاسلكية عازلة للضوضاء Pro Max',
    price: 4900,
    compareAtPrice: 6500,
    category: 'إلكترونيات',
    badge: 'الأكثر مبيعاً 🔥',
    rating: 4.9,
    reviewsCount: 84,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
    isPublished: true,
  };

  const buttonConfig = settings.buttonConfig;
  const primaryBtnStyles = getPrimaryButtonStyles(buttonConfig, settings.primaryColor);
  const secondaryBtnStyles = getSecondaryButtonStyles(buttonConfig);
  const radiusClass = getButtonRadiusClass(buttonConfig?.shape);
  const shadowClass = getButtonShadowClass(buttonConfig?.shadow);
  const hoverClass = getButtonHoverClass(buttonConfig?.hoverEffect);
  const paddingClass = getButtonPaddingClass(buttonConfig?.padding);
  const fontSizeClass = getButtonFontSizeClass(buttonConfig?.fontSize);
  const fontWeightClass = getButtonFontWeightClass(buttonConfig?.fontWeight);

  const handleSampleAdd = () => {
    setSampleAdded(true);
    setTimeout(() => setSampleAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Viewport & Device Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              deviceMode === 'desktop'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">كمبيوتر (Desktop)</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              deviceMode === 'tablet'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تابلت (Tablet)</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              deviceMode === 'mobile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">هاتف (Mobile)</span>
          </button>
        </div>

        {/* Section Focus Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 pl-1 hidden md:inline">التركيز على:</span>
          {[
            { id: 'all', label: 'المتجر كاملاً' },
            { id: 'card', label: 'بطاقة المنتج والأزرار' },
            { id: 'hero', label: 'البانر والواجهة' },
            { id: 'checkout', label: 'استمارة COD' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActivePreviewSection(sec.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activePreviewSection === sec.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Quick External Preview Button */}
        {onOpenFullStorefront && (
          <button
            type="button"
            onClick={onOpenFullStorefront}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200/80 transition-all ml-auto"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>عرض المتجر الكامل في نافذة حية</span>
          </button>
        )}
      </div>

      {/* 2. Realistic Canvas Container */}
      <div className="flex justify-center bg-slate-100 p-4 sm:p-8 rounded-3xl border border-slate-200/80 shadow-inner overflow-hidden min-h-[500px]">
        <div
          className={`transition-all duration-300 bg-white shadow-2xl overflow-hidden ${
            deviceMode === 'mobile'
              ? 'w-[375px] rounded-[40px] border-[8px] border-slate-900 ring-1 ring-slate-800'
              : deviceMode === 'tablet'
              ? 'w-[768px] rounded-3xl border-[6px] border-slate-800'
              : 'w-full max-w-5xl rounded-2xl border border-slate-200'
          }`}
          style={{ fontFamily: settings.fontFamily || 'Cairo' }}
        >
          {/* Mobile Notch Bar if in mobile mode */}
          {deviceMode === 'mobile' && (
            <div className="bg-slate-900 text-white text-[10px] px-6 py-1 flex items-center justify-between">
              <span>09:41</span>
              <div className="w-16 h-3 bg-black rounded-full mx-auto" />
              <span className="font-mono">5G 100%</span>
            </div>
          )}

          {/* Mini Announcement Bar */}
          {settings.announcementActive && (
            <div
              className="px-4 py-2 text-xs font-bold text-white text-center truncate shadow-xs"
              style={{ backgroundColor: settings.primaryColor }}
            >
              {settings.announcementBarText}
            </div>
          )}

          {/* Storefront Header */}
          <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 shadow-xs">
            <div className="flex items-center gap-2.5">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-7 w-auto object-contain" />
              ) : (
                <div
                  className="w-8 h-8 rounded-xl text-white font-black text-sm flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  {settings.storeName?.charAt(0) || 'M'}
                </div>
              )}
              <div>
                <h4 className="font-black text-sm text-slate-900 leading-none">{settings.storeName}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">{settings.slogan}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-100 cursor-pointer">
                <ShoppingCart className="w-4 h-4" />
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  {sampleAdded ? '1' : '0'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-8 max-h-[650px] overflow-y-auto custom-scrollbar">
            {/* HERO SECTION */}
            {(activePreviewSection === 'all' || activePreviewSection === 'hero') && (
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                <div className="space-y-3 flex-1 text-right">
                  {settings.homepage?.heroBadge && (
                    <span className="inline-block text-[10px] font-black px-3 py-1 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                      {settings.homepage.heroBadge}
                    </span>
                  )}
                  <h3 className="font-black text-base sm:text-xl text-white leading-tight">
                    {settings.homepage?.heroTitle || settings.slogan}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {settings.homepage?.heroSubtitle || 'توصيل سريع لباب منزلك في 58 ولاية • ضمان واستبدال مجاني • الدفع عند الاستلام'}
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      style={primaryBtnStyles}
                      className={`flex items-center gap-2 cursor-pointer ${radiusClass} ${shadowClass} ${hoverClass} ${paddingClass} ${fontSizeClass} ${fontWeightClass}`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{settings.homepage?.heroCtaText || 'تصفح كافة العروض الآن'}</span>
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-48 h-36 rounded-xl overflow-hidden border border-white/20 bg-slate-800 shrink-0 shadow-lg">
                  <img
                    src={settings.homepage?.heroBannerImage || settings.bannerImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'}
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}

            {/* PRODUCT CARD AND CTA BUTTONS SHOWCASE */}
            {(activePreviewSection === 'all' || activePreviewSection === 'card') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-black text-xs text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>معاينة تفاعلية لبطاقة المنتج والأزرار المخصصة</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">انقر للتجربة الحية</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Single Interactive Product Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      {/* Product Image & Badges */}
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        <img
                          src={sampleProduct.images[0]}
                          alt={sampleProduct.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2.5 right-2.5 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-400" />
                          <span>عرض خاص</span>
                        </span>
                        <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-xs">
                          -25%
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-4 space-y-2 text-right">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-600">
                            {sampleProduct.category}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>4.9</span>
                          </div>
                        </div>

                        <h5 className="font-black text-xs text-slate-900 leading-snug line-clamp-2">
                          {sampleProduct.name}
                        </h5>

                        <div className="pt-1 flex items-baseline gap-2">
                          <span className="text-sm font-black text-slate-900 font-mono">
                            {sampleProduct.price.toLocaleString()} {settings.currency}
                          </span>
                          <span className="text-[11px] text-slate-400 line-through font-mono">
                            {sampleProduct.compareAtPrice?.toLocaleString()} {settings.currency}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Button Action Bar */}
                    <div className="p-4 pt-0 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Interactive Add to Cart */}
                        <button
                          type="button"
                          onClick={handleSampleAdd}
                          style={secondaryBtnStyles}
                          className={`w-full flex items-center justify-center gap-1.5 cursor-pointer transition-all ${radiusClass} ${shadowClass} ${hoverClass} ${paddingClass} ${fontSizeClass} ${fontWeightClass}`}
                        >
                          {sampleAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                              <span>تمت الإضافة!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>{buttonConfig?.ctaAddToCartText || '+ أضف للسلة'}</span>
                            </>
                          )}
                        </button>

                        {/* Direct COD Order */}
                        <button
                          type="button"
                          onClick={() => setTestOrderSubmitted(true)}
                          style={primaryBtnStyles}
                          className={`w-full flex items-center justify-center gap-1.5 cursor-pointer transition-all ${radiusClass} ${shadowClass} ${hoverClass} ${paddingClass} ${fontSizeClass} ${fontWeightClass}`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span className="truncate">{buttonConfig?.ctaDirectOrderText || 'اطلب فوراً'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* COD Quick Order Form Preview */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-3 text-right flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>استمارة الشراء السريع COD</span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          الدفع عند الاستلام
                        </span>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          readOnly
                          value="محمد أمين (مثال تجريبي)"
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                        />
                        <input
                          type="text"
                          readOnly
                          value="0550 12 34 56"
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700">
                            16 - الجزائر
                          </div>
                          <div className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700">
                            الجزائر الوسطى
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setTestOrderSubmitted(true);
                          setTimeout(() => setTestOrderSubmitted(false), 3000);
                        }}
                        style={primaryBtnStyles}
                        className={`w-full flex items-center justify-center gap-2 cursor-pointer transition-all ${radiusClass} ${shadowClass} ${hoverClass} ${paddingClass} ${fontSizeClass} ${fontWeightClass}`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{settings.checkoutConfig?.submitButtonText || 'اضغط هنا لتأكيد طلبك الآن'}</span>
                      </button>

                      {testOrderSubmitted && (
                        <div className="mt-2 text-center text-[10px] font-bold text-emerald-600 animate-in fade-in">
                          🎉 تم اختبار نقر زر الطلب بنجاح وتفعيل المؤثرات!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TRUST BADGES BAR */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-800 text-[11px]">توصيل 58 ولاية</span>
                <span className="text-[9px] text-slate-400">سريع لباب المنزل</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-800 text-[11px]">معاينة قبل الدفع</span>
                <span className="text-[9px] text-slate-400">ضمان وأمان كامل</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-slate-800 text-[11px]">استبدال مجاني</span>
                <span className="text-[9px] text-slate-400">خلال 7 أيام</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
