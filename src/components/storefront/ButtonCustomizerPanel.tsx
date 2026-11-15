import React, { useState } from 'react';
import { StoreButtonConfig, ButtonShape, ButtonStyleType, ButtonShadow, ButtonHoverEffect, ButtonFontSize, ButtonFontWeight, ButtonPadding } from '../../types';
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
  MousePointerClick,
  Sparkles,
  Palette,
  Type,
  Maximize2,
  Sliders,
  Check,
  RotateCcw,
  Zap,
  ShoppingBag,
  ShoppingCart,
  CheckCircle2,
  Layers,
  Flame,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface ButtonCustomizerPanelProps {
  buttonConfig: StoreButtonConfig;
  onChange: (updated: StoreButtonConfig) => void;
  onReset: () => void;
}

const SHAPES: { id: ButtonShape; label: string; desc: string; previewRadius: string }[] = [
  { id: 'pill', label: 'دائري كامل (Pill)', desc: 'حواف بيضاوية دائرية ناعمة جداً', previewRadius: 'rounded-full' },
  { id: 'squircle', label: 'عصري منحنٍ (Squircle)', desc: 'حواف منحنية ناعمة 16px', previewRadius: 'rounded-2xl' },
  { id: 'rounded_lg', label: 'دائري متوسط (Rounded LG)', desc: 'الحواف القياسية الموصى بها 12px', previewRadius: 'rounded-xl' },
  { id: 'rounded_md', label: 'دائري خفيف (Rounded MD)', desc: 'حواف خفيفة أنيقة 8px', previewRadius: 'rounded-lg' },
  { id: 'square', label: 'حواف حادة مربعة (Sharp)', desc: 'زوايا مستقيمة 0px للمتاجر الكلاسيكية', previewRadius: 'rounded-none' },
];

const STYLE_TYPES: { id: ButtonStyleType; label: string; desc: string }[] = [
  { id: 'solid', label: 'لون مصمت (Solid)', desc: 'لون موحد عالي التباين والوضوح' },
  { id: 'gradient', label: 'تدرج لوني (Gradient)', desc: 'تدرج جذاب بين لونين لزيادة النقر' },
  { id: 'outline', label: 'إطار مفرغ (Outline)', desc: 'خلفية شفافة مع إطار ملون' },
  { id: 'soft', label: 'لون ناعم (Soft Pastel)', desc: 'خلفية ناعمة بشفافية خفيفة' },
  { id: 'glass', label: 'تأثير زجاجي (Glassmorphism)', desc: 'شفافية ضبابية مع لمعة' },
];

const HOVER_EFFECTS: { id: ButtonHoverEffect; label: string; desc: string; icon: string }[] = [
  { id: 'lift', label: 'ارتفاع للأعلى وظل (Lift Up)', desc: 'يرتفع الزر برفق مع زيادة الظل عند التمرير', icon: '🚀' },
  { id: 'scale', label: 'تكبير وتوسيع (Scale 105%)', desc: 'يتوسع حجم الزر بشكل تفاعلي', icon: '🔍' },
  { id: 'glow', label: 'توهج ضوئي ساطع (Neon Glow)', desc: 'إشعاع ضوئي ملفت بلون الزر', icon: '✨' },
  { id: 'pulse', label: 'نبض مستمر (Pulse Animation)', desc: 'حركة نبض تجذب العين فوراً', icon: '💓' },
  { id: 'shimmer', label: 'لمعان متألق (Shimmer)', desc: 'سطوع إضافي يبرز زر الشراء', icon: '💎' },
  { id: 'invert', label: 'انعكاس خفيف (Invert/Fade)', desc: 'تغيير خفيف في الشفافية', icon: '🌗' },
  { id: 'none', label: 'بدون تأثير (Static)', desc: 'ثابت بدون تأثيرات تمرير', icon: '⏹️' },
];

const SHADOWS: { id: ButtonShadow; label: string; desc: string }[] = [
  { id: 'none', label: 'بدون ظل (Flat)', desc: 'تصميم مسطح ونظيف' },
  { id: 'soft', label: 'ظل ناعم (Soft)', desc: 'ظل خفيف جداً وطبيعي' },
  { id: 'medium', label: 'ظل متوسط (Medium)', desc: 'عمق بصري متوازن' },
  { id: 'strong', label: 'ظل بارز (Elevated)', desc: 'بروز واضح عن خلفية الصفحة' },
  { id: 'glow', label: 'توهج مشع (Glow)', desc: 'ظل ملون متوهج بلون العلامة' },
  { id: 'isometric_3d', label: 'ثلاثي الأبعاد (3D Button)', desc: 'زر مجسم قابل للضغط' },
];

const POPULAR_COLORS = [
  { name: 'زمردي جزائري', hex: '#059669' },
  { name: 'أزرق ملكي', hex: '#2563eb' },
  { name: 'برتقالي تحويل', hex: '#ea580c' },
  { name: 'ذهبي كهرماني', hex: '#d97706' },
  { name: 'وردي أنيق', hex: '#e11d48' },
  { name: 'بنفسجي فاخر', hex: '#7c3aed' },
  { name: 'كربوني داكن', hex: '#0f172a' },
  { name: 'عنابي تراثي', hex: '#881337' },
];

export const ButtonCustomizerPanel: React.FC<ButtonCustomizerPanelProps> = ({
  buttonConfig,
  onChange,
  onReset,
}) => {
  const [testClickCount, setTestClickCount] = useState(0);
  const [justClicked, setJustClicked] = useState(false);

  const handleTestClick = (btnName: string) => {
    setTestClickCount((c) => c + 1);
    setJustClicked(true);
    setTimeout(() => setJustClicked(false), 600);
  };

  const primaryBtnStyles = getPrimaryButtonStyles(buttonConfig);
  const secondaryBtnStyles = getSecondaryButtonStyles(buttonConfig);
  const radiusClass = getButtonRadiusClass(buttonConfig.shape);
  const shadowClass = getButtonShadowClass(buttonConfig.shadow);
  const hoverClass = getButtonHoverClass(buttonConfig.hoverEffect);
  const paddingClass = getButtonPaddingClass(buttonConfig.padding);
  const fontSizeClass = getButtonFontSizeClass(buttonConfig.fontSize);
  const fontWeightClass = getButtonFontWeightClass(buttonConfig.fontWeight);

  return (
    <div className="space-y-6">
      {/* 1. Interactive Live Test Bar (Fixed Top Banner) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-700 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white flex items-center gap-2">
                <span>مختبر تجربة الأزرار التفاعلي (Interactive Live Arena)</span>
                {justClicked && (
                  <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md animate-bounce">
                    نقرة ناجحة! ✨
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-slate-300">
                جرّب تمرير الفأرة (Hover) والنقر المباشر لمعاينة الحركة والتأثير فوراً
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-slate-400">النقرات:</span>
            <span className="text-amber-400 font-bold">{testClickCount}</span>
          </div>
        </div>

        {/* Live Testing Buttons Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {/* Main COD Buy Button */}
          <button
            type="button"
            onClick={() => handleTestClick('cod')}
            style={primaryBtnStyles}
            className={`w-full flex items-center justify-center gap-2 cursor-pointer transition-all ${radiusClass} ${shadowClass} ${hoverClass} ${paddingClass} ${fontSizeClass} ${fontWeightClass}`}
          >
            {buttonConfig.iconPlacement === 'left' && <ShoppingBag className="w-4 h-4 shrink-0" />}
            <span>{buttonConfig.ctaDirectOrderText || 'اطلب فوراً - الدفع عند الاستلام'}</span>
            {buttonConfig.iconPlacement === 'right' && <ArrowLeft className="w-4 h-4 shrink-0" />}
          </button>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={() => handleTestClick('cart')}
            style={secondaryBtnStyles}
            className={`w-full flex items-center justify-center gap-2 cursor-pointer transition-all ${radiusClass} ${shadowClass} ${hoverClass} ${paddingClass} ${fontSizeClass} ${fontWeightClass}`}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>{buttonConfig.ctaAddToCartText || '+ أضف للسلة'}</span>
          </button>

          {/* Quick WhatsApp or Secondary Action */}
          <button
            type="button"
            onClick={() => handleTestClick('whatsapp')}
            className={`w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer transition-all ${radiusClass} ${shadowClass} ${hoverClass} ${paddingClass} ${fontSizeClass} ${fontWeightClass}`}
          >
            <Zap className="w-4 h-4 shrink-0 text-amber-200" />
            <span>طلب سريع عبر الواتساب</span>
          </button>
        </div>
      </div>

      {/* 2. Shape Selection */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-emerald-600" />
              <span>1. شكل حواف الأزرار (Button Shape & Radius)</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              حدد شكل الزوايا بما يتناسب مع هوية علامتك التجارية ونوع المنتجات
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {SHAPES.map((shape) => {
            const isSelected = buttonConfig.shape === shape.id;
            return (
              <button
                key={shape.id}
                type="button"
                onClick={() => onChange({ ...buttonConfig, shape: shape.id })}
                className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-black text-slate-900">{shape.label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>

                <div className="w-full flex items-center justify-center py-1">
                  <div
                    className={`w-full py-1.5 text-center text-[10px] font-bold text-white bg-slate-800 ${shape.previewRadius}`}
                  >
                    معاينة الشكل
                  </div>
                </div>

                <p className="text-[10px] text-slate-500">{shape.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Style Type & Gradients */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>2. نوع المظهر والتدرج (Button Style & Background)</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              اختر بين الألوان المصمتة، التدرجات الجذابة، أو الإطارات العصرية
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {STYLE_TYPES.map((st) => {
            const isSelected = buttonConfig.styleType === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onChange({ ...buttonConfig, styleType: st.id })}
                className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-black text-slate-900">{st.label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                </div>
                <p className="text-[10px] text-slate-500">{st.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Gradient Angle Slider if gradient selected */}
        {buttonConfig.styleType === 'gradient' && (
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-indigo-950">
                زاوية التدرج اللوني (Gradient Angle):
              </label>
              <span className="text-xs font-mono font-bold text-indigo-600">
                {buttonConfig.gradientAngle || 135}°
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="15"
              value={buttonConfig.gradientAngle || 135}
              onChange={(e) =>
                onChange({ ...buttonConfig, gradientAngle: Number(e.target.value) })
              }
              className="w-full accent-indigo-600"
            />
          </div>
        )}
      </div>

      {/* 4. Colors & Palettes */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-500" />
              <span>3. ألوان الأزرار (Button Color Palette)</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              تحديد لون الخلفية الرئيسي ولون النصوص ولون التدرج الإضافي
            </p>
          </div>
        </div>

        {/* Quick Popular Color Chips */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-2">
            لوحات ألوان التجارة الإلكترونية الأكثر مبيعاً:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {POPULAR_COLORS.map((col) => {
              const isSelected = buttonConfig.primaryColor === col.hex;
              return (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...buttonConfig,
                      primaryColor: col.hex,
                      secondaryColor: col.hex,
                    })
                  }
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-right transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] shadow-xs"
                    style={{ backgroundColor: col.hex }}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <span className="text-[11px] font-bold text-slate-800 truncate">{col.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Custom Hex Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
              لون زر الشراء الأساسي (Primary Color):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={buttonConfig.primaryColor}
                onChange={(e) => onChange({ ...buttonConfig, primaryColor: e.target.value })}
                className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={buttonConfig.primaryColor}
                onChange={(e) => onChange({ ...buttonConfig, primaryColor: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                placeholder="#059669"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
              اللون الثانوي / التدرج (Secondary):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={buttonConfig.secondaryColor || buttonConfig.primaryColor}
                onChange={(e) => onChange({ ...buttonConfig, secondaryColor: e.target.value })}
                className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={buttonConfig.secondaryColor || buttonConfig.primaryColor}
                onChange={(e) => onChange({ ...buttonConfig, secondaryColor: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                placeholder="#047857"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
              لون نص الزر (Button Text Color):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={buttonConfig.primaryTextColor || '#ffffff'}
                onChange={(e) => onChange({ ...buttonConfig, primaryTextColor: e.target.value })}
                className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={buttonConfig.primaryTextColor || '#ffffff'}
                onChange={(e) => onChange({ ...buttonConfig, primaryTextColor: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Hover Effects & Shadows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hover Effects */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>4. حركة وتأثير التمرير (Hover Effects)</span>
            </h4>
            <p className="text-[10px] text-slate-400">
              تأثير حركي يظهر عند وضع مؤشر الفأرة على الزر
            </p>
          </div>

          <div className="space-y-2">
            {HOVER_EFFECTS.map((effect) => {
              const isSelected = buttonConfig.hoverEffect === effect.id;
              return (
                <button
                  key={effect.id}
                  type="button"
                  onClick={() => onChange({ ...buttonConfig, hoverEffect: effect.id })}
                  className={`w-full p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{effect.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{effect.label}</div>
                      <div className="text-[10px] text-slate-500">{effect.desc}</div>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Shadows & 3D */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-600" />
              <span>5. الظلال والبروز (Shadows & Elevation)</span>
            </h4>
            <p className="text-[10px] text-slate-400">
              العمق البصري والتوهج الضوئي للزر
            </p>
          </div>

          <div className="space-y-2">
            {SHADOWS.map((sh) => {
              const isSelected = buttonConfig.shadow === sh.id;
              return (
                <button
                  key={sh.id}
                  type="button"
                  onClick={() => onChange({ ...buttonConfig, shadow: sh.id })}
                  className={`w-full p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-cyan-600 bg-cyan-50/50 ring-2 ring-cyan-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{sh.label}</div>
                    <div className="text-[10px] text-slate-500">{sh.desc}</div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Typography & CTA Texts */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
            <Type className="w-4 h-4 text-rose-500" />
            <span>6. حجم الخط والنصوص التسويقية (Typography & CTA Labels)</span>
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              حجم خط الزر (Font Size):
            </label>
            <select
              value={buttonConfig.fontSize}
              onChange={(e) => onChange({ ...buttonConfig, fontSize: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="xs">صغير أنيق (XS - 12px)</option>
              <option value="sm">متوسط قياسي (SM - 14px)</option>
              <option value="base">بارز واضح (Base - 16px)</option>
              <option value="lg">كبير جداً (LG - 18px)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              سُمك الخط (Font Weight):
            </label>
            <select
              value={buttonConfig.fontWeight}
              onChange={(e) => onChange({ ...buttonConfig, fontWeight: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="medium">متوسط (Medium 500)</option>
              <option value="semibold">نصف عريض (SemiBold 600)</option>
              <option value="bold">عريض (Bold 700)</option>
              <option value="black">سميك جداً (Black 900)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              كثافة الحشوة (Padding / Spacing):
            </label>
            <select
              value={buttonConfig.padding}
              onChange={(e) => onChange({ ...buttonConfig, padding: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="compact">مضغوط (Compact)</option>
              <option value="normal">متوازن قياسي (Normal)</option>
              <option value="spacious">عريض وواسع (Spacious)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              نص زر الطلب السريع (Direct COD Order CTA):
            </label>
            <input
              type="text"
              value={buttonConfig.ctaDirectOrderText || ''}
              onChange={(e) => onChange({ ...buttonConfig, ctaDirectOrderText: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold"
              placeholder="مثال: اطلب فوراً - الدفع عند الاستلام 🚚"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              نص زر أضف للسلة (Add to Cart CTA):
            </label>
            <input
              type="text"
              value={buttonConfig.ctaAddToCartText || ''}
              onChange={(e) => onChange({ ...buttonConfig, ctaAddToCartText: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold"
              placeholder="مثال: + أضف للسلة"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
