import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SubscriptionReceiptRequest, PlatformPaymentConfig } from '../../types';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Check,
  X,
  Copy,
  Upload,
  Smartphone,
  Landmark,
  ShieldCheck,
  AlertCircle,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Edit3,
  Save,
  User,
  Phone,
  Store,
  Calendar,
  Layers,
  Zap,
} from 'lucide-react';

export const PaymentReceiptsManagement: React.FC = () => {
  const {
    platformPaymentConfig,
    updatePlatformPaymentConfig,
    receiptRequests,
    approveReceiptRequest,
    rejectReceiptRequest,
    pendingReceiptsCount,
    showNotification,
  } = useStore();

  const [selectedReceipt, setSelectedReceipt] = useState<SubscriptionReceiptRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [configForm, setConfigForm] = useState<PlatformPaymentConfig>({ ...platformPaymentConfig });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformPaymentConfig(configForm);
    setIsEditingConfig(false);
  };

  const handleApprove = (requestId: string) => {
    approveReceiptRequest(requestId);
    if (selectedReceipt?.id === requestId) {
      setSelectedReceipt((prev) => (prev ? { ...prev, status: 'approved' } : null));
    }
  };

  const handleRejectSubmit = (requestId: string) => {
    if (!rejectionReason.trim()) {
      showNotification('يرجى كتابة سبب الرفض لتوضيحه للتاجر', 'error');
      return;
    }
    rejectReceiptRequest(requestId, rejectionReason.trim());
    setRejectingId(null);
    setRejectionReason('');
    if (selectedReceipt?.id === requestId) {
      setSelectedReceipt((prev) => (prev ? { ...prev, status: 'rejected', rejectionReason } : null));
    }
  };

  // Filter receipts
  const filteredReceipts = receiptRequests.filter((req) => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = req.merchantName?.toLowerCase().includes(q);
      const matchStore = req.storeName?.toLowerCase().includes(q);
      const matchRef = req.transactionRef?.toLowerCase().includes(q);
      const matchId = req.id?.toLowerCase().includes(q);
      const matchPlan = req.planName?.toLowerCase().includes(q);
      return matchName || matchStore || matchRef || matchId || matchPlan;
    }
    return true;
  });

  const totalAmountApproved = receiptRequests
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Platform Accounts Configuration Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-indigo-600" />
                <span>بيانات الحسابات البريدية للمنصة (BaridiMob RIP & CCP)</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                الحسابات الرسمية للاستقبال
              </span>
            </div>
            <p className="text-xs text-slate-500">
              هذه الحسابات تظهر تلقائياً للتجار في نافذة ترقية وتجديد الباقات لإرسال مستحقات الاشتراك
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isEditingConfig) {
                setConfigForm({ ...platformPaymentConfig });
              }
              setIsEditingConfig(!isEditingConfig);
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            {isEditingConfig ? (
              <>
                <X className="w-4 h-4" />
                <span>إلغاء التعديل</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>تعديل أرقام الحسابات البريدية</span>
              </>
            )}
          </button>
        </div>

        {isEditingConfig ? (
          /* Edit Config Form */
          <form onSubmit={handleSaveConfig} className="pt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* BaridiMob RIP */}
              <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200">
                <h4 className="font-black text-emerald-950 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>بيانات بريدي موب (BaridiMob):</span>
                </h4>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    رقم الحساب البريدي الموحد (RIP - 20 رقم):
                  </label>
                  <input
                    type="text"
                    value={configForm.baridiMobRip}
                    onChange={(e) => setConfigForm({ ...configForm, baridiMobRip: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    اسم صاحب حساب بريدي موب:
                  </label>
                  <input
                    type="text"
                    value={configForm.baridiMobHolderName}
                    onChange={(e) => setConfigForm({ ...configForm, baridiMobHolderName: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-bold"
                  />
                </div>
              </div>

              {/* CCP Account */}
              <div className="space-y-3 p-4 rounded-2xl bg-blue-50/40 border border-blue-200">
                <h4 className="font-black text-blue-950 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-blue-700" />
                  <span>بيانات الحساب الجاري البريدي (CCP):</span>
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      رقم الحساب البريدي (CCP):
                    </label>
                    <input
                      type="text"
                      value={configForm.ccpAccount}
                      onChange={(e) => setConfigForm({ ...configForm, ccpAccount: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      المفتاح (Clé):
                    </label>
                    <input
                      type="text"
                      value={configForm.ccpKey}
                      onChange={(e) => setConfigForm({ ...configForm, ccpKey: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    اسم صاحب حساب CCP:
                  </label>
                  <input
                    type="text"
                    value={configForm.ccpHolderName}
                    onChange={(e) => setConfigForm({ ...configForm, ccpHolderName: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Support Phone & Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  رقم هاتف التأكيد والدعم الفني:
                </label>
                <input
                  type="text"
                  value={configForm.contactPhone}
                  onChange={(e) => setConfigForm({ ...configForm, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  ملاحظات أو توجيهات إضافية للتجار:
                </label>
                <input
                  type="text"
                  value={configForm.paymentInstructions}
                  onChange={(e) => setConfigForm({ ...configForm, paymentInstructions: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingConfig(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات وتحديث الحسابات</span>
              </button>
            </div>
          </form>
        ) : (
          /* View Config Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
            {/* BaridiMob Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>تطبيق بريدي موب (BaridiMob RIP)</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-mono text-sm sm:text-base font-black text-slate-900 tracking-wider">
                    {platformPaymentConfig.baridiMobRip}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  المستفيد: <strong>{platformPaymentConfig.baridiMobHolderName}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(platformPaymentConfig.baridiMobRip, 'rip-view')}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all border border-emerald-200 flex items-center gap-1 shrink-0"
              >
                {copiedField === 'rip-view' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'rip-view' ? 'تم النسخ' : 'نسخ RIP'}</span>
              </button>
            </div>

            {/* CCP Card */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-blue-900">
                  <Landmark className="w-4 h-4 text-blue-700" />
                  <span>الحساب البريدي الجاري (CCP)</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-mono text-sm sm:text-base font-black text-slate-900">
                    {platformPaymentConfig.ccpAccount}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                    مفتاح: {platformPaymentConfig.ccpKey}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  صاحب الحساب: <strong>{platformPaymentConfig.ccpHolderName}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(`${platformPaymentConfig.ccpAccount} ${platformPaymentConfig.ccpKey}`, 'ccp-view')
                }
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-blue-100 text-blue-800 text-xs font-bold transition-all border border-blue-200 flex items-center gap-1 shrink-0"
              >
                {copiedField === 'ccp-view' ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'ccp-view' ? 'تم النسخ' : 'نسخ الحساب'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Receipts Verification Center Header & Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block mb-1">إجمالي طلبات الإيصالات</span>
          <span className="text-xl font-black text-slate-900 font-mono">{receiptRequests.length}</span>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[11px] text-amber-800 font-semibold block mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>قيد المراجعة والتأكيد</span>
          </span>
          <span className="text-xl font-black text-amber-900 font-mono">{pendingReceiptsCount}</span>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[11px] text-emerald-800 font-semibold block mb-1">مؤكدة ومفعلة</span>
          <span className="text-xl font-black text-emerald-900 font-mono">
            {receiptRequests.filter((r) => r.status === 'approved').length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block mb-1">إجمالي المبالغ المحققة</span>
          <span className="text-lg font-black text-slate-900 font-mono">
            {totalAmountApproved.toLocaleString()} د.ج
          </span>
        </div>
      </div>

      {/* Receipts Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>إيصالات التحويل وطلبات تفعيل الاشتراكات</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              راجع صور الإيصالات المحولة عبر بريدي موب أو CCP لتأكيد الباقة بضغطة زر
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بتاجر، متجر، أو رقم عملية..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white w-48 sm:w-60 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الكل
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                <span>معلق</span>
                {pendingReceiptsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-black">
                    {pendingReceiptsCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('approved')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  statusFilter === 'approved'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                مؤكد
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">التاجر والمتجر</th>
                <th className="py-3.5 px-4 font-bold">الباقة والمبلغ</th>
                <th className="py-3.5 px-4 font-bold">طريقة التحويل</th>
                <th className="py-3.5 px-4 font-bold">رقم العملية / المرجع</th>
                <th className="py-3.5 px-4 font-bold">تاريخ الإرسال</th>
                <th className="py-3.5 px-4 font-bold text-center">الحالة</th>
                <th className="py-3.5 px-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">لا توجد إيصالات مطابقة للبحث أو التصفية</p>
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-black text-slate-900 text-xs">{req.merchantName}</p>
                      <p className="text-[11px] text-indigo-600 font-semibold">{req.storeName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{req.merchantPhone}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{req.planName}</p>
                      <p className="text-[11px] font-black text-emerald-700 font-mono">
                        {req.amount.toLocaleString()} {req.currency}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        ({req.billingCycle === 'yearly' ? 'اشتراك سنوي' : 'اشتراك شهري'})
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {req.paymentMethod === 'baridimob' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
                          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>بريدي موب (BaridiMob)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[11px]">
                          <Landmark className="w-3.5 h-3.5 text-blue-600" />
                          <span>تحويل بريدي CCP</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-800 text-[11px]">
                        {req.transactionRef || 'بدون مرجع'}
                      </span>
                      {req.senderName && (
                        <p className="text-[10px] text-slate-500 mt-0.5">من: {req.senderName}</p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {req.submittedAt}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {req.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>مؤكد ومُفعّل</span>
                        </span>
                      ) : req.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200" title={req.rejectionReason}>
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>مرفوض</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                          <span>قيد المراجعة</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Receipt */}
                        {req.receiptUrl && (
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(req)}
                            className="p-1.5 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 text-slate-700 text-xs font-bold transition-all"
                            title="معاينة الوصل المرفق"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        {/* Approve Button */}
                        {req.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(req.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                              title="تأكيد الوصل وتفعيل الباقة فوراً"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">تأكيد وتفعيل</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setRejectingId(req.id)}
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all"
                              title="رفض الوصل مع ذكر السبب"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Reason Dialog Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5 text-rose-600">
                <AlertCircle className="w-4 h-4" />
                <span>رفض إيصال الدفع</span>
              </h4>
              <button
                type="button"
                onClick={() => setRejectingId(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              يرجى كتابة سبب رفض الوصل (مثل: لقطة الشاشة غير واضحة، المبلغ غير متطابق، أو رقم RIP خاطئ) لإشعار التاجر:
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="اكتب سبب الرفض هنا..."
              rows={3}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => handleRejectSubmit(rejectingId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Preview Modal */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 text-slate-900 relative my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">
                    معاينة وصل الدفع: {selectedReceipt.planName}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">{selectedReceipt.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Image Display */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 overflow-hidden max-h-[380px] flex items-center justify-center mb-4">
              {selectedReceipt.receiptUrl ? (
                <img
                  src={selectedReceipt.receiptUrl}
                  alt="وصل الدفع"
                  className="max-h-[360px] object-contain rounded-xl shadow-sm"
                />
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">لا توجد صورة مرفقة</div>
              )}
            </div>

            {/* Receipt Metadata */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs mb-4">
              <div>
                <span className="text-slate-500 text-[10px] block">اسم التاجر والمتجر:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.merchantName}</span>
                <span className="text-slate-600 block text-[11px]">({selectedReceipt.storeName})</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">المبلغ المطلوب تأكيده:</span>
                <span className="font-mono font-black text-emerald-700 text-sm">
                  {selectedReceipt.amount.toLocaleString()} {selectedReceipt.currency}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">طريقة التحويل:</span>
                <span className="font-bold text-slate-800">
                  {selectedReceipt.paymentMethod === 'baridimob' ? 'بريدي موب (BaridiMob RIP)' : 'حساب بريدي CCP'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">رقم المعاملة / المرجع:</span>
                <span className="font-mono font-bold text-indigo-700">
                  {selectedReceipt.transactionRef || 'غير محدد'}
                </span>
              </div>
              {selectedReceipt.notes && (
                <div className="col-span-2 pt-1 text-[11px] text-slate-600 border-t border-slate-200">
                  <strong>ملاحظات التاجر:</strong> {selectedReceipt.notes}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500">
                الحالة الحالية:{' '}
                <strong
                  className={
                    selectedReceipt.status === 'approved'
                      ? 'text-emerald-600'
                      : selectedReceipt.status === 'rejected'
                      ? 'text-rose-600'
                      : 'text-amber-600'
                  }
                >
                  {selectedReceipt.status === 'approved'
                    ? 'مؤكد ومُفعّل'
                    : selectedReceipt.status === 'rejected'
                    ? 'مرفوض'
                    : 'قيد المراجعة'}
                </strong>
              </span>

              <div className="flex items-center gap-2">
                {selectedReceipt.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedReceipt.id)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>تأكيد الوصل وتفعيل الباقة</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
