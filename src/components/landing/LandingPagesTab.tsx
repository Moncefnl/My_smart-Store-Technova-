import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { LandingPage } from '../../types';
import {
  Layers,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Share2,
  TrendingUp,
  Clock,
  Sparkles,
  Check,
  Palette,
  ExternalLink,
  Flame
} from 'lucide-react';

export const LandingPagesTab: React.FC = () => {
  const {
    landingPages,
    products,
    addLandingPage,
    updateLandingPage,
    deleteLandingPage,
    setViewMode,
    setActiveLandingPageId,
    showNotification
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<LandingPage | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [productId, setProductId] = useState('');
  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [callToAction, setCallToAction] = useState('اطلب الآن والدفع عند الاستلام');
  const [mediaUrl, setMediaUrl] = useState('');
  const [themeColor, setThemeColor] = useState('#059669');
  const [isActive, setIsActive] = useState(true);

  const openAddModal = () => {
    const defaultProduct = products[0];
    setEditingPage(null);
    setTitle('صفحة هبوط تسويقية مخصصة');
    setSlug(`offer-${Date.now().toString().slice(-4)}`);
    setProductId(defaultProduct?.id || '');
    setHeroBadge('🔥 عرض حصري ومحدود لفترة قصيرة');
    setHeroTitle('أفضل جودة بأفضل سعر مع توصيل مجاني ودفع عند الاستلام');
    setHeroSubtitle('لا تفوت فرصة الحصول على المنتج الأصلي مع ضمان استبدال لمدة سنة كاملة.');
    setCallToAction('اطلب الآن قبل نفاد الكمية');
    setMediaUrl(defaultProduct?.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800');
    setThemeColor('#059669');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (page: LandingPage) => {
    setEditingPage(page);
    setTitle(page.title);
    setSlug(page.slug);
    setProductId(page.productId);
    setHeroBadge(page.heroBadge);
    setHeroTitle(page.heroTitle);
    setHeroSubtitle(page.heroSubtitle);
    setCallToAction(page.callToAction);
    setMediaUrl(page.mediaUrl);
    setThemeColor(page.themeColor);
    setIsActive(page.isActive);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      productId: productId || products[0]?.id || '',
      heroBadge,
      heroTitle,
      heroSubtitle,
      callToAction,
      mediaUrl,
      themeColor,
      isActive,
      features: [
        { title: 'جودة أصلية ومضمونة', desc: 'نضمن لك استلام المنتج الأصلي 100% مع إمكانية الفحص والتجربة قبل الدفع.', icon: 'ShieldCheck' },
        { title: 'توصيل سريع لـ 58 ولاية', desc: 'شحن فوري حتى باب بيتك أو لأقرب مكتب توصيل في ظرف 24 إلى 48 ساعة.', icon: 'Truck' },
        { title: 'دفع آمن عند الاستلام', desc: 'لا تدفع أي دينار حتى يصلك طردك وتتأكد من سلامته التامة.', icon: 'CheckCircle2' },
      ],
    };

    if (editingPage) {
      updateLandingPage(editingPage.id, payload);
    } else {
      addLandingPage(payload);
    }
    setIsModalOpen(false);
  };

  const handlePreview = (pageId: string) => {
    setActiveLandingPageId(pageId);
    setViewMode('landing_page');
  };

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/#lp/${slug}`);
    showNotification('تم نسخ رابط صفحة الهبوط إلى الحافظة', 'success');
  };

  return (
    <div id="landing-pages-tab-content" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">منشئ صفحات الهبوط المخصصة (Landing Pages)</h3>
          <p className="text-xs text-slate-500">
            صمم صفحات هبوط مستقلة وعالية التحويل لتسويق منتج معين بحملات إعلانية على فيسبوك وتيك توك.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء صفحة هبوط جديدة</span>
        </button>
      </div>

      {/* Landing Pages Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {landingPages.map((page) => {
          const linkedProduct = products.find((p) => p.id === page.productId);
          const conversionRate = page.views > 0 ? ((page.conversions / page.views) * 100).toFixed(1) : '0';

          return (
            <div
              key={page.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Header Preview Banner */}
              <div
                className="p-4 text-white relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${page.themeColor}, #0f172a)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full">
                    {page.heroBadge}
                  </span>
                  <span className="text-xs bg-black/40 px-2 py-0.5 rounded font-mono">
                    /{page.slug}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white mt-3 line-clamp-2 leading-relaxed">
                  {page.heroTitle}
                </h4>
                <p className="text-xs text-slate-200/80 mt-1 line-clamp-1">
                  {page.heroSubtitle}
                </p>
              </div>

              {/* Stats & Product Info */}
              <div className="p-5 space-y-4">
                {linkedProduct && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <img
                      src={linkedProduct.images[0]}
                      alt={linkedProduct.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="text-[11px] text-slate-500">المنتج المرتبط بالصفحة:</div>
                      <div className="font-bold text-xs text-slate-800 line-clamp-1">
                        {linkedProduct.name}
                      </div>
                      <div className="text-xs font-black text-emerald-600">
                        {linkedProduct.price.toLocaleString()} د.ج
                      </div>
                    </div>
                  </div>
                )}

                {/* Conversion Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="text-slate-400 text-[10px]">الزيارات</div>
                    <div className="font-black text-slate-800 text-sm mt-0.5">
                      {page.views.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="text-slate-400 text-[10px]">المبيعات</div>
                    <div className="font-black text-emerald-600 text-sm mt-0.5">
                      {page.conversions.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="text-slate-400 text-[10px]">معدل التحويل</div>
                    <div className="font-black text-indigo-600 text-sm mt-0.5">
                      {conversionRate}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handlePreview(page.id)}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>معاينة حية</span>
                </button>

                <button
                  onClick={() => handleCopyLink(page.slug)}
                  className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors"
                  title="نسخ الرابط الإعلاني"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => openEditModal(page)}
                  className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors"
                  title="تعديل صفحة الهبوط"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteLandingPage(page.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="حذف الصفحة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>{editingPage ? 'تعديل صفحة الهبوط' : 'إنشاء صفحة هبوط جديدة'}</span>
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">عنوان الصفحة الداخلي</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الرابط المخصص (Slug)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="offer-earphones"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المنتج المراد تسويقه في الصفحة</label>
                <select
                  value={productId}
                  onChange={(e) => {
                    setProductId(e.target.value);
                    const prod = products.find((p) => p.id === e.target.value);
                    if (prod) setMediaUrl(prod.images[0]);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.price.toLocaleString()} د.ج)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">شارة العرض العلوية (Hero Badge)</label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  placeholder="🔥 تخفيض حصري 30% ينتهي الليلة"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">العنوان الرئيسي الجذاب (Hero Title)</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الوصف التسويقي المشجع (Subtitle)</label>
                <textarea
                  rows={2}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نص زر الشراء (CTA)</label>
                  <input
                    type="text"
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">لون السمة (Theme Color)</label>
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 p-1 cursor-pointer bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رابط صورة أو فيديو البانر</label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ صفحة الهبوط</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
