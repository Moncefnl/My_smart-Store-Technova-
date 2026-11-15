import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BlacklistEntry } from '../../types';
import {
  ShieldAlert,
  Plus,
  Trash2,
  PhoneOff,
  MapPinOff,
  UserX,
  Check,
  Search,
  AlertTriangle
} from 'lucide-react';

export const BlacklistTab: React.FC = () => {
  const { blacklist, addToBlacklist, removeFromBlacklist, showNotification } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [reason, setReason] = useState('رفض استلام طرود متكررة دون عذر');
  const [search, setSearch] = useState('');

  const filtered = blacklist.filter(
    (b) =>
      b.value.includes(search) ||
      (b.customerName && b.customerName.toLowerCase().includes(search.toLowerCase())) ||
      b.reason.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    addToBlacklist({
      type: 'phone',
      value: phone.trim(),
      customerName: customerName.trim() || undefined,
      reason,
    });
    setPhone('');
    setCustomerName('');
    setIsModalOpen(false);
  };

  return (
    <div id="blacklist-tab-content" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">القائمة السوداء ومكافحة الطلبات الوهمية</h3>
          <p className="text-xs text-slate-500">
            حظر أرقام الزبائن غير الجادين تلقائياً لمنع إرسال طرود مرجوعة (Retour) وتوفير مصاريف الشحن.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة رقم للقائمة السوداء</span>
        </button>
      </div>

      {/* Info Shield Banner */}
      <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-2xl flex items-center gap-3">
        <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="text-xs text-rose-900">
          <span className="font-bold">نظام الحماية الذكي مفعّل: </span>
          سيتم رفض أي محاولة طلب قادمة من الأرقام المدرجة في هذه القائمة مع إشعار بالخطأ.
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="بحث برقم الهاتف أو اسم الزبون أو سبب الحظر..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white text-xs text-slate-800 placeholder-slate-400 rounded-2xl pl-3 pr-10 py-3 border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
      </div>

      {/* Table of Blacklist */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
              <tr>
                <th className="p-3.5">رقم الهاتف المحظور</th>
                <th className="p-3.5">اسم العميل (إن وجد)</th>
                <th className="p-3.5">سبب الحظر والإدراج</th>
                <th className="p-3.5 text-center">الطرود المرجوعة</th>
                <th className="p-3.5">تاريخ الإدراج</th>
                <th className="p-3.5 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold font-mono text-rose-600" dir="ltr">
                    {item.value}
                  </td>
                  <td className="p-3.5 text-slate-800 font-bold">
                    {item.customerName || 'غير محدد'}
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-xs">
                    {item.reason}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {item.attemptsBlocked} محاولات محظورة
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {item.blockedDate}
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => {
                        removeFromBlacklist(item.id);
                        showNotification('تم رفع الحظر بنجاح', 'info');
                      }}
                      className="px-2.5 py-1 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg font-bold text-[11px] transition-colors border border-slate-200"
                    >
                      فك الحظر
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>حظر رقم هاتف جديد</span>
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الهاتف المراد حظره</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="0661002233"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم العميل (اختياري)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: فلان بن فلان"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">سبب الحظر</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="رفض استلام طرود متكررة دون عذر">رفض استلام طرود متكررة دون عذر (Retour)</option>
                  <option value="معلومات عنوان واسم وهمية غير صحيحة">معلومات عنوان واسم وهمية غير صحيحة</option>
                  <option value="إلغاء الطلب بعد خروج الطرد مع الموزع">إلغاء الطلب بعد خروج الطرد مع الموزع</option>
                  <option value="سلوك مسيء مع موظفي خدمة العملاء أو الموزع">سلوك مسيء مع موظفي خدمة العملاء أو الموزع</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد الحظر والإدراج</span>
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
