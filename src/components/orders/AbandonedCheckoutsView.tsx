import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AbandonedCheckout } from '../../types';
import {
  ShoppingBag,
  MessageCircle,
  PhoneCall,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  TrendingUp,
  Percent,
  DollarSign,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';

export const AbandonedCheckoutsView: React.FC = () => {
  const {
    abandonedCheckouts,
    updateAbandonedStatus,
    deleteAbandonedCheckout,
    convertAbandonedToOrder,
    showNotification
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [customDiscountText, setCustomDiscountText] = useState('خصم إضافي 500 دج أو توصيل مجاني');

  const filtered = abandonedCheckouts.filter((item) => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = item.customerName?.toLowerCase().includes(q);
      const matchPhone = item.phone.includes(q);
      const matchWilaya = item.wilaya?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchWilaya) return false;
    }
    return true;
  });

  const totalAbandonedCount = abandonedCheckouts.length;
  const recoveredCount = abandonedCheckouts.filter((a) => a.status === 'recovered').length;
  const recoveredRevenue = abandonedCheckouts
    .filter((a) => a.status === 'recovered')
    .reduce((sum, a) => sum + a.totalAmount, 0);
  const recoveryRate = totalAbandonedCount > 0 ? Math.round((recoveredCount / totalAbandonedCount) * 100) : 0;

  const handleSendWhatsApp = (item: AbandonedCheckout) => {
    const firstItem = item.items[0]?.productName || 'المنتج';
    const message = `السلام عليكم ورحمة الله وبركاته ${item.customerName || 'أخي/أختي الكريم(ة)'} 🌸
لاحظنا اهتمامكم بمنتج "${firstItem}" في متجرنا ولكن لم تكملوا الطلب.
يسعدنا أن نقدم لكم ${customDiscountText} لإتمام طلبكم الآن!
هل تودون تأكيد إرسال الطلبية إليكم في ولاية ${item.wilaya || 'كم'}؟ 🚚`;

    updateAbandonedStatus(item.id, 'contacted', 'whatsapp');
    const cleanPhone = item.phone.replace(/^0/, '');
    window.open(`https://wa.me/213${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">إجمالي السلات المتروكة</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalAbandonedCount}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-amber-700 mt-2 font-medium">طلبات لم تكتمل في صفحة الشراء</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">السلات المسترجعة بنجاح</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{recoveredCount}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-700 mt-2 font-medium">تم تحويلها لطلبات مؤكدة</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">نسبة الاسترجاع (Recovery Rate)</p>
              <h3 className="text-2xl font-bold text-teal-700 mt-1">{recoveryRate}%</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-teal-700 mt-2 font-medium">أعلى من متوسط السوق الجزائري</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">مبيعات مسترجعة (دينار جزائري)</p>
              <h3 className="text-2xl font-bold text-indigo-700 mt-1 font-mono">{recoveredRevenue.toLocaleString()} دج</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-indigo-700 mt-2 font-medium">إيرادات تم إنقاذها من الضياع</p>
        </div>
      </div>

      {/* Recovery Offer Preset */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950">نظام الاسترجاع الفوري عبر الواتساب (WhatsApp 1-Click Recovery)</h4>
            <p className="text-xs text-emerald-800">
              يقوم النظام بتجهيز نص رسالة احترافية بالعامية الجزائرية مع تفاصيل السلة لتشجيع المشتري على الإتمام بنقرة واحدة.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={customDiscountText}
            onChange={(e) => setCustomDiscountText(e.target.value)}
            placeholder="عرض الاسترجاع (مثال: خصم 400 دج)"
            className="px-3 py-2 text-xs bg-white border border-emerald-300 rounded-xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث برقم الهاتف أو الاسم أو الولاية..."
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل ({abandonedCheckouts.length})
          </button>
          <button
            onClick={() => setFilterStatus('abandoned')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'abandoned'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            متروكة ({abandonedCheckouts.filter((a) => a.status === 'abandoned').length})
          </button>
          <button
            onClick={() => setFilterStatus('contacted')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'contacted'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            تم التواصل ({abandonedCheckouts.filter((a) => a.status === 'contacted').length})
          </button>
          <button
            onClick={() => setFilterStatus('recovered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'recovered'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            مسترجعة ({abandonedCheckouts.filter((a) => a.status === 'recovered').length})
          </button>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-1" />
            <p className="text-sm font-semibold text-slate-700">لا توجد سلات متروكة مطابقة</p>
            <p className="text-xs text-slate-400 mt-1">كل الزبائن يكملون طلباتهم بنجاح!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">الزبون / الهاتف</th>
                  <th className="p-3.5">الولاية</th>
                  <th className="p-3.5">المنتجات في السلة</th>
                  <th className="p-3.5">القيمة</th>
                  <th className="p-3.5">تاريخ التخلي</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">إجراءات الاسترجاع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const isRecovered = item.status === 'recovered';
                  const isContacted = item.status === 'contacted';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Customer info */}
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{item.customerName || 'غير مسجل'}</p>
                        <p className="font-mono text-slate-500 text-[11px] mt-0.5">{item.phone}</p>
                      </td>

                      {/* Wilaya */}
                      <td className="p-3.5 text-slate-700">
                        <span className="font-medium">{item.wilaya || 'غير محددة'}</span>
                        {item.commune && <span className="block text-[11px] text-slate-400">{item.commune}</span>}
                      </td>

                      {/* Items */}
                      <td className="p-3.5">
                        <div className="space-y-1">
                          {item.items.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              {it.productImage && (
                                <img
                                  src={it.productImage}
                                  alt={it.productName}
                                  className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                                  referrerPolicy="no-referrer"
                                />
                              )}
                              <div>
                                <span className="font-semibold text-slate-800 block truncate max-w-[180px]">
                                  {it.productName}
                                </span>
                                {it.variantName && (
                                  <span className="text-[10px] text-slate-400">{it.variantName} × {it.quantity}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          {item.totalAmount.toLocaleString()} دج
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-3.5 text-slate-500 text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString('ar-DZ')}
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        {isRecovered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            <CheckCircle2 className="w-3 h-3" />
                            مسترجعة
                          </span>
                        ) : isContacted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px]">
                            <MessageCircle className="w-3 h-3" />
                            تمت المراسلة
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                            <Clock className="w-3 h-3" />
                            متروكة
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {!isRecovered && (
                            <>
                              <button
                                onClick={() => handleSendWhatsApp(item)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                                title="مراسلة الزبون عبر واتساب"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>واتساب</span>
                              </button>

                              <button
                                onClick={() => convertAbandonedToOrder(item.id)}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                title="تحويل لطلب مؤكد"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>تأكيد كطلب</span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => deleteAbandonedCheckout(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
