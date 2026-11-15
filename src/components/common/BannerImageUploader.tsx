import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Eye,
  Check,
  Zap,
  Info
} from 'lucide-react';

const PRESET_BANNER_CATEGORIES = [
  {
    category: 'إلكترونيات وسماعات',
    images: [
      {
        id: 'tech-headphones-yellow',
        title: 'سماعات رأس صفراء أنيقة (الافتراضية)',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        tag: 'سماعات Pro Max',
      },
      {
        id: 'tech-smartwatch',
        title: 'ساعة ذكية Titanium رياضية',
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        tag: 'ساعات ذكية',
      },
      {
        id: 'tech-gadgets',
        title: 'أجهزة ذكية وسماعات AirPods',
        url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
        tag: 'إلكترونيات',
      },
      {
        id: 'tech-setup',
        title: 'أجهزة ألعاب وشاشات قيمنق',
        url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
        tag: 'ألعاب وكمبيوتر',
      },
    ],
  },
  {
    category: 'أزياء وموضة',
    images: [
      {
        id: 'fashion-dress',
        title: 'فستان سهرة وأزياء راقية',
        url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
        tag: 'فساتين وسهرات',
      },
      {
        id: 'fashion-collection',
        title: 'ملابس أنيقة وتنسيق عصري',
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
        tag: 'موضة نسائية',
      },
      {
        id: 'fashion-mens',
        title: 'بدل وملابس رجالية كلاسيكية',
        url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
        tag: 'موضة رجالية',
      },
      {
        id: 'fashion-bag',
        title: 'حقائب نسائية فاخرة',
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
        tag: 'حقائب وإكسسوارات',
      },
    ],
  },
  {
    category: 'ديكور وأواني ومنزل',
    images: [
      {
        id: 'home-kitchen',
        title: 'أواني طهي عصرية وطواجن جرانيت',
        url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80',
        tag: 'أواني ومطبخ',
      },
      {
        id: 'home-decor',
        title: 'ديكور صالون ولمسات عصرية',
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
        tag: 'ديكور منزلي',
      },
      {
        id: 'home-tableware',
        title: 'أطقم سفرة وضيافة فخمة',
        url: 'https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=800&auto=format&fit=crop&q=80',
        tag: 'ضيافة ومائدة',
      },
    ],
  },
  {
    category: 'عطور وتجميل وعناية',
    images: [
      {
        id: 'beauty-perfume',
        title: 'عطور فرنسية فاخرة',
        url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
        tag: 'عطور ومسك',
      },
      {
        id: 'beauty-skincare',
        title: 'مستحضرات عناية بالبشرة وزيوت طبيعية',
        url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
        tag: 'عناية وجمال',
      },
      {
        id: 'beauty-cosmetics',
        title: 'مكياج وأدوات تجميل احترافية',
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
        tag: 'ميك اب ومستحضرات',
      },
    ],
  },
];

const DEFAULT_BANNER_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';

interface BannerImageUploaderProps {
  value?: string;
  onChange?: (newUrl: string) => void;
  variant?: 'card' | 'compact' | 'modal';
  title?: string;
  subtitle?: string;
}

export const BannerImageUploader: React.FC<BannerImageUploaderProps> = ({
  value,
  onChange,
  variant = 'card',
  title = 'تغيير صورة الواجهة الرئيسية (Hero Banner Image)',
  subtitle = 'الصورة البارزة التي تظهر في واجهة المتجر الرئيسية للزوار في قسم العرض والترويج (Hero Section).'
}) => {
  const { settings, updateSettings, showNotification, setViewMode, language } = useStore();

  const currentBanner =
    value ||
    settings.homepage?.heroBannerImage ||
    settings.bannerImage ||
    DEFAULT_BANNER_IMAGE;

  const [imageUrlInput, setImageUrlInput] = useState(currentBanner);
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'gallery'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyNewImage = (url: string) => {
    setImageUrlInput(url);
    setPreviewError(false);
    
    // Update local form state if controlled
    if (onChange) {
      onChange(url);
    }

    // Also update settings globally
    updateSettings({
      bannerImage: url,
      homepage: {
        ...(settings.homepage || {
          heroBadge: '🔥 عروض الصيف الحصرية',
          heroTitle: settings.storeName || 'متجرنا الإلكتروني',
          heroSubtitle: settings.slogan || 'تسوق أفضل المنتجات الأصلية مع توصيل سريع لـ 58 ولاية',
          heroCtaText: 'تصفح كل المنتجات الآن',
          showFeaturesBar: true,
          showCategories: true,
          showReviews: true,
        }),
        heroBannerImage: url,
      },
    });

    showNotification('تم تحديث صورة واجهة المتجر (Hero Banner) بنجاح ✨', 'success');
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showNotification('يرجى اختيار ملف صورة صالح (PNG, JPG, WebP, GIF)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميغابايت', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        applyNewImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) {
      showNotification('يرجى إدخال رابط الصورة أولاً', 'error');
      return;
    }
    applyNewImage(imageUrlInput.trim());
  };

  const handleResetToDefault = () => {
    applyNewImage(DEFAULT_BANNER_IMAGE);
    showNotification('تمت استعادة صورة السماعات الصفراء الافتراضية', 'info');
  };

  return (
    <div
      id="banner-image-uploader-container"
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-6"
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm sm:text-base">{title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* View Storefront Quick Button */}
        <button
          type="button"
          onClick={() => setViewMode('storefront')}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span>معاينة في المتجر</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* Main Grid: Preview on left, Upload controls on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Banner Preview Box */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>المعاينة الحية لصورة الواجهة:</span>
            </span>
            {currentBanner !== DEFAULT_BANNER_IMAGE && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 font-semibold"
                title="استعادة الصورة الأصلية"
              >
                <RotateCcw className="w-3 h-3" />
                <span>استعادة الافتراضية</span>
              </button>
            )}
          </div>

          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-950 aspect-4/3 sm:aspect-16/10 shadow-md group">
            <img
              src={currentBanner}
              alt="Hero Banner Preview"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
              onError={() => setPreviewError(true)}
            />

            {/* Overlay Gradient Badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-3.5">
              <div className="flex items-center justify-between">
                <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>الواجهة النشطة</span>
                </span>
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  Hero Section
                </span>
              </div>

              <div>
                <div className="text-white text-xs font-bold drop-shadow-sm truncate">
                  {settings.storeName || 'واجهة المتجر'}
                </div>
                <div className="text-slate-300 text-[10px] truncate mt-0.5">
                  {settings.slogan || 'عروض وتخفيضات حصرية'}
                </div>
              </div>
            </div>

            {previewError && (
              <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-4 text-center text-white text-xs">
                <Info className="w-6 h-6 text-amber-400 mb-1" />
                <p className="font-bold">تعذر تحميل رابط الصورة</p>
                <p className="text-[10px] text-slate-300 mt-1">تأكد من صحة الرابط أو ارفع ملف من جهازك</p>
              </div>
            )}
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-[11px] text-emerald-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>تحديث فوري ولحظي:</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              أي صورة تختارها أو ترفعها هنا سيتم تطبيقها مباشرة في واجهة المتجر الرئيسية لجميع الزوار بدون الحاجة لإعادة تشغيل أو تعقيدات.
            </p>
          </div>
        </div>

        {/* Right Column: Tab Controls for Upload, URL, and Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Method Select Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>رفع من جهازك</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'url'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>رابط صورة (URL)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'gallery'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>معرض صور جاهز</span>
            </button>
          </div>

          {/* TAB 1: FILE UPLOAD (DRAG & DROP) */}
          {activeTab === 'upload' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                accept="image/*"
                className="hidden"
              />

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                    : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50/80 bg-slate-50/40'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-emerald-600">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    اضغط هنا لاختيار صورة من جهازك، أو اسحب الملف وأفلته هنا
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    يدعم PNG, JPG, WebP, GIF (أقصى حجم: 5MB) • يوصى بنسبة 4:3 أو 16:9
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>تصفح الملفات</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT URL INPUT */}
          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رابط صورة الواجهة المباشر (Image Web URL):
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... أو أي رابط صورة مباشر"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono text-slate-800"
                    dir="ltr"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  يمكنك لصق رابط أي صورة من Unsplash، Pexels، Imgur، أو موقعك الخارجي.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>تطبيق وحفظ الصورة</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyNewImage(imageUrlInput.trim())}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  معاينة سريعة
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PRESET GALLERY (READY-TO-USE HIGH RESOLUTION IMAGES) */}
          {activeTab === 'gallery' && (
            <div className="space-y-4 animate-in fade-in duration-200 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
              <p className="text-xs text-slate-500">
                اختر أي صورة احترافية جاهزة بنقرة واحدة لتطبيقها فوراً في واجهة المتجر:
              </p>

              {PRESET_BANNER_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg inline-block">
                    {cat.category}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {cat.images.map((img) => {
                      const isSelected = currentBanner === img.url;
                      return (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => applyNewImage(img.url)}
                          className={`group relative rounded-xl overflow-hidden border-2 text-right transition-all aspect-4/3 flex flex-col justify-end p-2 ${
                            isSelected
                              ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          <div className="relative z-10">
                            {isSelected && (
                              <div className="absolute -top-10 left-0 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                            <div className="text-white text-[10px] font-bold truncate">
                              {img.tag}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
