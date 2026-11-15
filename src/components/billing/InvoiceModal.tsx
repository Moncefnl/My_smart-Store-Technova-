import React from 'react';
import { SubscriptionInvoice } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Building2,
  CreditCard,
  Calendar,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface InvoiceModalProps {
  invoice: SubscriptionInvoice | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose }) => {
  const { settings, currentUser } = useStore();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="invoice-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="invoice-modal-card"
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 relative my-8"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">فاتورة إلكترونية رسمية</h3>
              <p className="text-xs text-slate-500 font-mono">رقم الفاتورة: {invoice.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="print-invoice-btn"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة / حفظ PDF</span>
            </button>
            <button
              id="close-invoice-modal-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Area */}
        <div id="invoice-printable-content" className="space-y-6">
          {/* Top Brand & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-black text-indigo-700 tracking-wide">منصة TECHNOVA DZ</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                  SaaS E-Commerce
                </span>
              </div>
              <p className="text-[11px] text-slate-500">حلول التجارة الإلكترونية والدفع في الجزائر</p>
              <p className="text-[11px] text-slate-500 font-mono">RC: 16/00-0982341B24 | NIF: 002416098234190</p>
            </div>

            <div className="text-left sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم الدفع بنجاح (PAID)</span>
              </div>
              <p className="text-[11px] text-slate-500">تاريخ الإصدار: {invoice.date}</p>
            </div>
          </div>

          {/* Billed To & Store Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>بيانات التاجر / المشترك:</span>
              </div>
              <p className="font-bold text-slate-900 text-sm mb-0.5">{currentUser?.name || 'التاجر المعتمد'}</p>
              <p className="text-slate-600 mb-0.5">المتجر: {settings.storeName || 'متجر تكنوفا'}</p>
              <p className="text-slate-500 font-mono">{currentUser?.email || settings.email || 'contact@technova.dz'}</p>
              <p className="text-slate-500 font-mono">{currentUser?.phone || settings.phone || '0550 12 34 56'}</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                <span>تفاصيل المعاملة المالية:</span>
              </div>
              <p className="text-slate-700 mb-1">
                <span className="text-slate-500">طريقة الدفع:</span>{' '}
                <span className="font-bold text-slate-900">{invoice.paymentMethod}</span>
              </p>
              <p className="text-slate-700 mb-1 font-mono">
                <span className="text-slate-500 font-sans">رقم التحويل (TXN ID):</span>{' '}
                <span className="font-semibold text-indigo-700">{invoice.transactionId || 'TXN-DIRECT-01'}</span>
              </p>
              <p className="text-slate-700">
                <span className="text-slate-500">الدورة الزمنية:</span>{' '}
                <span className="font-bold text-slate-900">
                  {invoice.billingCycle === 'yearly' ? 'اشتراك سنوي (12 شهراً)' : 'اشتراك شهري (30 يوماً)'}
                </span>
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">الوصف / الخدمة</th>
                  <th className="py-3 px-4 font-bold text-center">المدة</th>
                  <th className="py-3 px-4 font-bold text-left">المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-black text-slate-900 text-xs">{invoice.planName}</p>
                    <p className="text-[10px] text-slate-500">
                      تشمل كافة مميزات المنصة: المتاجر، النطاق المخصص، كاشف الاحتيال، والاستضافة السحابية
                    </p>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-700">
                    {invoice.billingCycle === 'yearly' ? '1 سنة' : '1 شهر'}
                  </td>
                  <td className="py-3 px-4 text-left font-black text-slate-900 font-mono">
                    {invoice.amount.toLocaleString()} {invoice.currency}
                  </td>
                </tr>
                {invoice.discountApplied && invoice.discountApplied > 0 ? (
                  <tr className="bg-emerald-50/50 text-emerald-800">
                    <td className="py-2.5 px-4 font-bold">خصم ترويجي / كود قسيمة اشتراك</td>
                    <td className="py-2.5 px-4 text-center">-</td>
                    <td className="py-2.5 px-4 text-left font-black font-mono">
                      -{invoice.discountApplied.toLocaleString()} {invoice.currency}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>

            {/* Total Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>فاتورة مشفرة ومؤكدة إلكترونياً من نظام Technova DZ</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">المجموع الإجمالي المدفوع:</span>
                <span className="text-base font-black text-indigo-700 font-mono">
                  {invoice.amount.toLocaleString()} {invoice.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="text-[11px] text-slate-400 text-center border-t border-dashed border-slate-200 pt-4 leading-relaxed">
            شكراً لثقتكم بمنصة Technova! في حال وجود أي استفسار حول فواتيركم أو اشتراككم يرجى مراسلتنا عبر
            support@technova.dz أو هاتف الدعم الفني: 0550 00 11 22.
          </div>
        </div>
      </div>
    </div>
  );
};
