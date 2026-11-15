import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PixelConfig } from '../../types';
import {
  Flame,
  Plus,
  Edit3,
  Trash2,
  Check,
  Code,
  Radio,
  ExternalLink,
  Zap,
  Activity,
  Share2
} from 'lucide-react';

const PLATFORMS_DATA = [
  { id: 'facebook', name: 'Facebook Pixel (ميتا)', color: 'from-blue-600 to-indigo-600', icon: 'FB' },
  { id: 'tiktok', name: 'TikTok Pixel', color: 'from-slate-900 to-pink-600', icon: 'TT' },
  { id: 'snapchat', name: 'Snapchat Pixel', color: 'from-amber-400 to-yellow-500', icon: 'SC' },
  { id: 'google_tag_manager', name: 'Google Tag Manager', color: 'from-blue-500 to-teal-500', icon: 'GTM' },
];

export const MarketingTab: React.FC = () => {
  const { pixels, addPixel, updatePixel, deletePixel, showNotification } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPixel, setEditingPixel] = useState<PixelConfig | null>(null);

  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<'facebook' | 'tiktok' | 'snapchat' | 'google_tag_manager'>('facebook');
  const [pixelId, setPixelId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [trackEvents, setTrackEvents] = useState({
    pageView: true,
    viewContent: true,
    addToCart: true,
    initiateCheckout: true,
    purchase: true,
  });

  const openAddModal = () => {
    setEditingPixel(null);
    setName('بكسل الحملة الإعلانية الجديدة');
    setPlatform('facebook');
    setPixelId('');
    setIsActive(true);
    setTrackEvents({
      pageView: true,
      viewContent: true,
      addToCart: true,
      initiateCheckout: true,
      purchase: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (px: PixelConfig) => {
    setEditingPixel(px);
    setName(px.name);
    setPlatform(px.platform);
    setPixelId(px.pixelId);
    setIsActive(px.isActive);
    setTrackEvents(px.trackEvents);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pixelId.trim()) {
      showNotification('يرجى إدخال معرف البكسل Pixel ID', 'error');
      return;
    }

    const payload = {
      name,
      platform,
      pixelId: pixelId.trim(),
      isActive,
      trackEvents,
    };

    if (editingPixel) {
      updatePixel(editingPixel.id, payload);
    } else {
      addPixel(payload);
    }
    setIsModalOpen(false);
  };

  const handleTestEvent = (pixel: PixelConfig) => {
    showNotification(
      `تم إرسال حدث اختباري (Purchase Event) بنجاح للبكسل: ${pixel.name}`,
      'success'
    );
  };

  return (
    <div id="marketing-tab-content" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">أدوات التسويق وتتبع الإعلانات (Pixels)</h3>
          <p className="text-xs text-slate-500">
            ربط وتفعيل بكسلات الإعلانات لتتبع زوار المتجر، أحداث الإضافة للسلة، وعمليات الشراء الناجحة بدقة.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>ربط بكسل جديد</span>
        </button>
      </div>

      {/* Pixels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pixels.map((pixel) => {
          const platformInfo = PLATFORMS_DATA.find((p) => p.id === pixel.platform) || PLATFORMS_DATA[0];

          return (
            <div
              key={pixel.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${platformInfo.color} flex items-center justify-center text-white font-black text-xs shadow-sm`}
                    >
                      {platformInfo.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{pixel.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        معرف: {pixel.pixelId}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      pixel.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${pixel.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    {pixel.isActive ? 'نشط ويتتبع' : 'متوقف'}
                  </span>
                </div>

                {/* Tracked Events Chips */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-semibold text-slate-500">الأحداث المفعلة:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pixel.trackEvents.pageView && (
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">PageView</span>
                    )}
                    {pixel.trackEvents.viewContent && (
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">ViewContent</span>
                    )}
                    {pixel.trackEvents.addToCart && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md">AddToCart</span>
                    )}
                    {pixel.trackEvents.initiateCheckout && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md">InitiateCheckout</span>
                    )}
                    {pixel.trackEvents.purchase && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-md">Purchase 🔥</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleTestEvent(pixel)}
                  className="flex-1 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>إرسال حدث اختباري</span>
                </button>

                <button
                  onClick={() => openEditModal(pixel)}
                  className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors"
                  title="تعديل البكسل"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deletePixel(pixel.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="حذف البكسل"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-slate-900 text-base">
                {editingPixel ? 'تعديل إعدادات البكسل' : 'ربط بكسل تسويقي جديد'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم البكسل التوضيحي</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="مثال: بكسل فيسبوك - إعلانات رمضان"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">منصة الإعلانات</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="facebook">Facebook Pixel (ميتا)</option>
                  <option value="tiktok">TikTok Pixel</option>
                  <option value="snapchat">Snapchat Pixel</option>
                  <option value="google_tag_manager">Google Tag Manager (GTM)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">معرف البكسل (Pixel ID)</label>
                <input
                  type="text"
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value)}
                  required
                  placeholder="مثال: 948201948201948"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              {/* Events Checklist */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">الأحداث المراد تتبعها تلقائياً:</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={trackEvents.pageView}
                      onChange={(e) => setTrackEvents({ ...trackEvents, pageView: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span>مشاهدة الصفحة (PageView)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={trackEvents.viewContent}
                      onChange={(e) => setTrackEvents({ ...trackEvents, viewContent: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span>عرض المنتج (ViewContent)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={trackEvents.addToCart}
                      onChange={(e) => setTrackEvents({ ...trackEvents, addToCart: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span>إضافة للسلة (AddToCart)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={trackEvents.purchase}
                      onChange={(e) => setTrackEvents({ ...trackEvents, purchase: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span>شراء ناجح (Purchase)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ البكسل</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
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
