import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Copy,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

export const DomainsTab: React.FC = () => {
  const { domains, addDomain, deleteDomain, showNotification } = useStore();

  const [domainInput, setDomainInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    addDomain(domainInput.trim());
    setDomainInput('');
    setIsAdding(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification(`تم نسخ القيمة: ${text}`, 'success');
  };

  return (
    <div id="domains-tab-content" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">ربط النطاق المخصص (Custom Domains)</h3>
          <p className="text-xs text-slate-500">
            اربط اسم النطاق الخاص بك (مثل: yourstore.dz أو yourstore.com) مع شهادة حماية SSL مجانية وتلقائية.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة نطاق جديد</span>
        </button>
      </div>

      {/* Add Domain Form */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="bg-emerald-50/50 border border-emerald-500/30 rounded-2xl p-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <h4 className="font-bold text-xs text-slate-900">أدخل اسم النطاق المراد ربطه:</h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="myshop-dz.com أو boutique.dz"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              required
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
            >
              ربط النطاق والتحقق
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      {/* Domains List */}
      <div className="space-y-4">
        {domains.map((dom) => (
          <div
            key={dom.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm text-slate-900 font-mono" dir="ltr">
                      {dom.domain}
                    </h4>
                    {dom.sslActive && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>SSL مشفر</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">تاريخ الإضافة: {dom.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                    dom.status === 'connected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {dom.status === 'connected' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  <span>{dom.status === 'connected' ? 'متصل بنجاح 🟢' : 'بانتظار ضبط سجلات DNS ⏳'}</span>
                </span>

                <button
                  onClick={() => deleteDomain(dom.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="حذف النطاق"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* DNS Records Guide */}
            <div className="space-y-2">
              <h5 className="font-bold text-xs text-slate-700">
                سجلات الـ DNS المطلوبة في لوحة تحكم مزود النطاق الخاص بك (مثل Namecheap أو Cloudflare أو Godaddy):
              </h5>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-right text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="p-2.5">النوع (Type)</th>
                      <th className="p-2.5">المضيف (Host / Name)</th>
                      <th className="p-2.5">القيمة المطلوبة (Value / Target)</th>
                      <th className="p-2.5 text-center">حالة السجل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {dom.dnsRecords.map((rec, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{rec.type}</td>
                        <td className="p-2.5 text-slate-700">{rec.host}</td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-1 text-slate-800">
                            <span>{rec.value}</span>
                            <button
                              onClick={() => handleCopy(rec.value)}
                              className="text-slate-400 hover:text-slate-700"
                              title="نسخ"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                              rec.status === 'matched'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {rec.status === 'matched' ? 'متطابق ✓' : 'جاري الفحص...'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
