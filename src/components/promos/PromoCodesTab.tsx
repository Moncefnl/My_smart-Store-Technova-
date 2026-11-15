import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PromoCode } from '../../types';
import {
  TicketPercent,
  Plus,
  Trash2,
  Check,
  Copy,
  Calendar,
  Percent,
  DollarSign,
  Power,
  Users,
  Award,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export const PromoCodesTab: React.FC = () => {
  const { promos, addPromo, togglePromoStatus, deletePromo, showNotification, settings } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(10);
  const [minOrder, setMinOrder] = useState(3000);
  const [maxUses, setMaxUses] = useState(100);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [influencerName, setInfluencerName] = useState('');
  const [influencerCommissionRate, setInfluencerCommissionRate] = useState(10);

  const openAddModal = () => {
    setCode(`PROMO${Math.floor(10 + Math.random() * 90)}`);
    setType('percentage');
    setValue(15);
    setMinOrder(4000);
    setMaxUses(50);
    setExpiryDate('2026-12-31');
    setIsInfluencer(false);
    setInfluencerName('');
    setInfluencerCommissionRate(10);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addPromo({
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrder: Number(minOrder),
      maxUses: Number(maxUses),
      expiryDate,
      isActive: true,
      isInfluencer,
      influencerName: isInfluencer ? influencerName.trim() : undefined,
      influencerCommissionRate: isInfluencer ? Number(influencerCommissionRate) : undefined,
      totalRevenueGenerated: 0,
      totalCommissionEarned: 0,
    });
    setIsModalOpen(false);
    showNotification('تم إنشاء الكوبون الترويجي بنجاح', 'success');
  };

  const handleCopyCode = (promoCode: string) => {
    navigator.clipboard.writeText(promoCode);
    showNotification(`تم نسخ الكوبون ${promoCode}`, 'success');
  };

  const totalInfluencerRevenue = promos
    .filter((p) => p.isInfluencer)
    .reduce((sum, p) => sum + (p.totalRevenueGenerated || 0), 0);

  const totalInfluencerCommission = promos
    .filter((p) => p.isInfluencer)
    .reduce((sum, p) => sum + (p.totalCommissionEarned || 0), 0);

  return (
    <div id="promo-codes-tab-content" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">الرموز الترويجية وكوبونات المؤثرين (Influencer Affiliates)</h3>
          <p className="text-xs text-slate-500">
            إنشاء قسائم تخفيض بنسبة مئوية أو مبلغ ثابت، وتتبع عمولات المؤثرين والمبيعات المحققة بدقة.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء كوبون جديد</span>
        </button>
      </div>

      {/* Influencer Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">كوبونات المؤثرين النشطة</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {promos.filter((p) => p.isInfluencer).length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">مبيعات محققة عبر المؤثرين</p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
                {totalInfluencerRevenue.toLocaleString()} د.ج
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">إجمالي العمولات المستحقة</p>
              <h3 className="text-2xl font-bold text-indigo-700 mt-1 font-mono">
                {totalInfluencerCommission.toLocaleString()} د.ج
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Promos Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {promos.map((promo) => {
          const isExpired = new Date(promo.expiryDate) < new Date();
          const usagePercent = Math.round((promo.currentUses / promo.maxUses) * 100);

          return (
            <div
              key={promo.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all ${
                promo.isActive && !isExpired ? 'border-slate-200/80' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2.5 rounded-xl ${promo.isInfluencer ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {promo.isInfluencer ? <Award className="w-5 h-5" /> : <TicketPercent className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm font-mono tracking-wider text-slate-900">
                          {promo.code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(promo.code)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                          title="نسخ الكود"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600">
                        {promo.type === 'percentage' ? `خصم ${promo.value}%` : `خصم ${promo.value} ${settings.currency}`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => togglePromoStatus(promo.id)}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                      promo.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                    title={promo.isActive ? 'تعطيل الكوبون' : 'تفعيل الكوبون'}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Influencer Badge & Stats */}
                {promo.isInfluencer && (
                  <div className="mt-3 p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between text-purple-900 font-bold">
                      <span>المؤثر: {promo.influencerName}</span>
                      <span className="text-[10px] bg-purple-200/80 px-2 py-0.5 rounded-full font-mono">
                        عمولة {promo.influencerCommissionRate}%
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px] pt-1">
                      <span>مبيعات محققة:</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {(promo.totalRevenueGenerated || 0).toLocaleString()} د.ج
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>عمولة مستحقة:</span>
                      <span className="font-bold text-purple-700 font-mono">
                        {(promo.totalCommissionEarned || 0).toLocaleString()} د.ج
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-3 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>الحد الأدنى للطلب:</span>
                    <span className="font-bold text-slate-800">{promo.minOrder.toLocaleString()} د.ج</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تاريخ الانتهاء:</span>
                    <span className="font-bold text-slate-800">{promo.expiryDate}</span>
                  </div>
                </div>

                {/* Usage Bar */}
                <div className="pt-2">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>مرات الاستخدام:</span>
                    <span>{promo.currentUses} من {promo.maxUses}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, usagePercent)}%` }}
                      className="bg-emerald-500 h-full rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  promo.isActive && !isExpired ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {isExpired ? 'منتهي الصلاحية' : promo.isActive ? 'فعال في السلة' : 'معطل مؤقتاً'}
                </span>

                <button
                  onClick={() => deletePromo(promo.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="حذف الكوبون"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-slate-900 text-base">إنشاء رمز ترويجي جديد</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">رمز الكوبون (الكود)</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  placeholder="DISCOUNT15 أو INFLUENCER10"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold uppercase focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Influencer Affiliate Option */}
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInfluencer}
                    onChange={(e) => setIsInfluencer(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="font-bold text-purple-900">هذا الكوبون خاص بمؤثر / مسوّق بالعمولة (Affiliate)</span>
                </label>

                {isInfluencer && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">اسم المؤثر</label>
                      <input
                        type="text"
                        required={isInfluencer}
                        value={influencerName}
                        onChange={(e) => setInfluencerName(e.target.value)}
                        placeholder="مثال: يوتيوبر تقني"
                        className="w-full px-3 py-1.5 rounded-lg border border-purple-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">نسبة العمولة (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={influencerCommissionRate}
                        onChange={(e) => setInfluencerCommissionRate(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-purple-200 bg-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع الخصم</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (د.ج)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">قيمة الخصم</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الحد الأدنى للطلب (د.ج)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الحد الأقصى للاستخدام</label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">تاريخ انتهاء الصلاحية</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ وتفعيل الكوبون</span>
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

