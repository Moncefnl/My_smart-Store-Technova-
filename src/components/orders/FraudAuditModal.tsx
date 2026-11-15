import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { evaluateOrderFraudRisk, validateAlgerianPhone } from '../../data/mockData';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Phone,
  Ban,
  UserX,
  CheckCircle2,
  PhoneCall,
  History,
  Activity,
  Sparkles
} from 'lucide-react';

interface FraudAuditModalProps {
  order: Order | null;
  onClose: () => void;
}

export const FraudAuditModal: React.FC<FraudAuditModalProps> = ({ order, onClose }) => {
  const { blacklist, orders, addToBlacklist, updateOrderStatus, showNotification } = useStore();

  if (!order) return null;

  const fraudEvaluation = evaluateOrderFraudRisk(order, blacklist, orders);
  const phoneInfo = validateAlgerianPhone(order.phone);

  const isBlacklisted = blacklist.some(
    (b) => b.type === 'phone' && (b.value === order.phone || b.value === phoneInfo.formatted)
  );

  const previousOrders = orders.filter((o) => o.id !== order.id && o.phone === order.phone);

  const handleBlockCustomer = () => {
    addToBlacklist({
      type: 'phone',
      value: phoneInfo.formatted || order.phone,
      reason: `طلب وهمي / مخاطرة عالية (الطلب ${order.orderNumber})`,
    });
    updateOrderStatus(order.id, 'cancelled_store');
    showNotification(`تمت إضافة الرقم ${order.phone} إلى القائمة السوداء وإلغاء الطلب`, 'error');
    onClose();
  };

  const handleMarkConfirmed = () => {
    updateOrderStatus(order.id, 'confirmed');
    showNotification(`تم تأكيد الطلب ${order.orderNumber} كطلب موثوق`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div
          className={`p-6 text-white relative ${
            fraudEvaluation.level === 'high'
              ? 'bg-gradient-to-r from-rose-600 to-red-700'
              : fraudEvaluation.level === 'medium'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600'
              : 'bg-gradient-to-r from-emerald-600 to-teal-700'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute left-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
              {fraudEvaluation.level === 'high' ? (
                <ShieldAlert className="w-6 h-6 text-white" />
              ) : fraudEvaluation.level === 'medium' ? (
                <AlertTriangle className="w-6 h-6 text-white" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
                نظام كشف الاحتيال والطلبات الوهمية
              </span>
              <h2 className="text-xl font-bold mt-1">
                تقرير فحص أمان الطلب {order.orderNumber}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Risk Score Meter */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">مؤشر درجة الخطورة التقديرية</p>
              <div className="flex items-center gap-3">
                <span
                  className={`text-3xl font-extrabold font-mono ${
                    fraudEvaluation.level === 'high'
                      ? 'text-rose-600'
                      : fraudEvaluation.level === 'medium'
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {fraudEvaluation.score} / 100
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    fraudEvaluation.level === 'high'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : fraudEvaluation.level === 'medium'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {fraudEvaluation.level === 'high'
                    ? '⚠️ مخاطرة عالية (طلب مشبوه)'
                    : fraudEvaluation.level === 'medium'
                    ? '⚡ مخاطرة متوسطة (يتطلب تأكيد)'
                    : '✅ آمن وموثوق'}
                </span>
              </div>
            </div>

            <div className="text-left md:text-right max-w-xs">
              <p className="text-xs text-slate-500 font-medium mb-1">توصية النظام الذكي:</p>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                {fraudEvaluation.recommendation}
              </p>
            </div>
          </div>

          {/* Phone Carrier & Quality Check */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              فحص رقم الهاتف ومتعامل الاتصالات الجزائري
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">الرقم المسجل:</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{order.phone}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">شبكة الهاتف:</span>
                <span className="font-semibold text-emerald-700">{phoneInfo.carrier}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">صحة الترقيم (10 أرقام):</span>
                <span className={`font-bold ${phoneInfo.isValid ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {phoneInfo.isValid ? 'سليم ومطابق 05/06/07' : 'غير سليم ⚠️'}
                </span>
              </div>
            </div>

            {phoneInfo.isSuspiciousPattern && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>تنبيه: أرقام الهاتف متكررة أو تسلسلية (مثل 0555555555) وقد تدل على طلب تجريبي أو وهمي.</span>
              </div>
            )}
          </div>

          {/* Audit Reasons */}
          {fraudEvaluation.reasons.length > 0 && (
            <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                أسباب احتساب نقاط المخاطرة:
              </h3>
              <ul className="space-y-1 text-xs text-rose-700 pr-4 list-disc">
                {fraudEvaluation.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Previous Customer Activity */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <History className="w-4 h-4 text-emerald-600" />
              سجل الطلبات السابقة لنفس الزبون ({previousOrders.length} طلبات أخرى)
            </h3>
            {previousOrders.length === 0 ? (
              <p className="text-xs text-slate-500">زبون جديد يطلب للمرة الأولى في متجرك.</p>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {previousOrders.map((po) => (
                  <div key={po.id} className="p-2 rounded bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-700">{po.orderNumber}</span>
                    <span className="text-slate-500">{po.createdAt}</span>
                    <span className="font-bold text-slate-800">{po.totalAmount.toLocaleString()} دج</span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-200 text-slate-700 font-medium">
                      {po.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBlockCustomer}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Ban className="w-4 h-4" />
              <span>إضافة للقائمة السوداء وإلغاء الطلب</span>
            </button>

            <button
              onClick={() => {
                window.open(`tel:${order.phone}`, '_self');
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-slate-700" />
              <span>اتصال هاتفي مباشر للتأكيد</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkConfirmed}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تأكيد الطلب كآمن</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
