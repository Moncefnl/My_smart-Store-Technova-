import React, { useState } from 'react';
import { StoreThemePreset } from '../../types';
import { THEME_PRESETS_DATA } from '../../data/mockThemePresets';
import {
  getButtonRadiusClass,
  getButtonShadowClass,
  getButtonHoverClass,
  getButtonPaddingClass,
  getButtonFontSizeClass,
  getButtonFontWeightClass,
  getPrimaryButtonStyles
} from '../../utils/buttonStyles';
import {
  Sparkles,
  CheckCircle2,
  Check,
  Zap,
  ShoppingBag,
  Layers,
  Palette,
  Eye,
  Sliders
} from 'lucide-react';

interface ThemePresetsGalleryProps {
  activeThemeId?: string;
  onApplyTheme: (preset: StoreThemePreset) => void;
}

export const ThemePresetsGallery: React.FC<ThemePresetsGalleryProps> = ({
  activeThemeId = 'modern_emerald',
  onApplyTheme,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'كافة الأنماط (الكل)' },
    { id: 'ecommerce', label: 'تجارة عامة (E-Commerce)' },
    { id: 'luxury', label: 'فخامة وذهب (Luxury)' },
    { id: 'tech', label: 'تقنية وإلكترونيات (Tech)' },
    { id: 'beauty', label: 'جمال وعناية (Cosmetics)' },
    { id: 'high_conversion', label: 'مبيعات سريعة COD' },
    { id: 'minimal', label: 'مينيمال بسيط (Minimal)' },
    { id: 'heritage', label: 'تراث جزائري 🇩🇿' },
    { id: 'dark', label: 'نايت مود داكن 🌙' },
  ];

  const filteredPresets = THEME_PRESETS_DATA.filter((preset) => {
    if (selectedCategory === 'all') return true;
    return preset.category === selectedCategory;
  });

  const handleApply = (preset: StoreThemePreset) => {
    onApplyTheme(preset);
    setAppliedNotification(`تم تطبيق ثيم "${preset.name}" بنجاح! 🎨`);
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Notification Toast */}
      {appliedNotification && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-bold">{appliedNotification}</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">تم التحديث الحصري</span>
        </div>
      )}

      {/* 2. Top Header & Intro */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>معرض القوالب والأنماط الجاهزة (Theme Presets Studio)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              غيّر المظهر الكامل لمتجرك (الألوان، أشكال الأزرار، الخطوط، والظلال) بضغطة زر واحدة مصممة بواسطة خبراء تجارة إلكترونية.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              {THEME_PRESETS_DATA.length} قوالب جاهزة ومتجاوبة
            </span>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Grid of Theme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPresets.map((preset) => {
          const isCurrentActive = activeThemeId === preset.id;
          const btnStyles = getPrimaryButtonStyles(preset.buttonConfig);
          const radiusClass = getButtonRadiusClass(preset.buttonConfig.shape);
          const shadowClass = getButtonShadowClass(preset.buttonConfig.shadow);
          const hoverClass = getButtonHoverClass(preset.buttonConfig.hoverEffect);
          const paddingClass = getButtonPaddingClass(preset.buttonConfig.padding);
          const fontSizeClass = getButtonFontSizeClass(preset.buttonConfig.fontSize);
          const fontWeightClass = getButtonFontWeightClass(preset.buttonConfig.fontWeight);

          return (
            <div
              key={preset.id}
              className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                isCurrentActive
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md bg-white'
                  : 'border-slate-200/90 hover:border-slate-300 shadow-xs bg-white hover:shadow-md'
              }`}
            >
              {/* Header Gradient & Badge */}
              <div>
                <div className={`h-20 bg-gradient-to-r ${preset.previewGradient} p-4 flex items-start justify-between`}>
                  {preset.badge && (
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs ${preset.badgeColor || 'bg-white text-slate-900'}`}>
                      {preset.badge}
                    </span>
                  )}
                  {isCurrentActive && (
                    <span className="text-[10px] font-black bg-emerald-500 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>الثيم المفعّل</span>
                    </span>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h5 className="font-black text-sm text-slate-900">{preset.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono font-medium">{preset.nameEn}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  {/* Attributes Badges: Colors & Font */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-600">الألوان:</span>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-4 h-4 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: preset.primaryColor }}
                          title="اللون الأساسي"
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: preset.secondaryColor }}
                          title="اللون الثانوي"
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: preset.accentColor }}
                          title="لون التمييز"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                      <span className="text-slate-400">الخط:</span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {preset.fontFamily}
                      </span>
                    </div>
                  </div>

                  {/* Mini Live Button Preview */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400">شكل زر الطلب والشراء في هذا الثيم:</div>
                    <button
                      type="button"
                      style={btnStyles}
                      className={`w-full flex items-center justify-center gap-1.5 pointer-events-none ${radiusClass} ${shadowClass} ${paddingClass} ${fontSizeClass} ${fontWeightClass}`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{preset.buttonConfig.ctaDirectOrderText || 'اطلب فوراً - الدفع عند الاستلام'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => handleApply(preset)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    isCurrentActive
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-default'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-98'
                  }`}
                >
                  {isCurrentActive ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>قيد الاستخدام حالياً</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>تطبيق هذا الثيم بضغطة زر 🎨</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
