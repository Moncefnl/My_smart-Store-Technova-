import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Boxes,
  CheckCircle2,
  Power,
  Sliders,
  Sparkles,
  Zap,
  MessageCircle,
  Clock,
  BellRing,
  FileSpreadsheet,
  Globe2,
  Share2
} from 'lucide-react';

const ADDON_ICONS: Record<string, any> = {
  MessageCircle,
  Clock,
  Zap,
  BellRing,
  FileSpreadsheet,
  Globe2,
};

export const AddonsTab: React.FC = () => {
  const { addons, toggleAddon, showNotification } = useStore();

  return (
    <div id="addons-tab-content" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">سوق التطبيقات والإضافات (App Store & Addons)</h3>
          <p className="text-xs text-slate-500">
            توسيع إمكانيات متجرك وتفعيل ميزات زيادة المبيعات بنقرة زر واحدة (زر واتساب، عدادات الحث، إشعارات الشراء).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
            {addons.filter((a) => a.isInstalled).length} إضافات نشطة
          </span>
        </div>
      </div>

      {/* Addons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {addons.map((addon) => {
          const IconComp = ADDON_ICONS[addon.icon] || Boxes;

          return (
            <div
              key={addon.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition-all ${
                addon.isInstalled
                  ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-50/20 to-white'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <IconComp className="w-6 h-6" />
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      addon.price === 0
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {addon.price === 0 ? 'مجاني' : `${addon.price} د.ج`}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-slate-900">{addon.name}</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600">
                    {addon.category}
                  </span>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {addon.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => toggleAddon(addon.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    addon.isInstalled
                      ? 'bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 border border-slate-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{addon.isInstalled ? 'تعطيل وإلغاء التثبيت' : 'تثبيت وتفعيل الآن'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
