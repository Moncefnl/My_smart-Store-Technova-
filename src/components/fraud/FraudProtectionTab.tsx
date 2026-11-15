import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, BlacklistEntry } from '../../types';
import { validateAlgerianPhone, evaluateOrderFraudRisk } from '../../data/mockData';
import {
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  SlidersHorizontal,
  UserX,
  FileSpreadsheet,
  Phone,
  MapPin,
  Sparkles,
  Lock,
  Eye,
  RefreshCw,
  Info,
  Check
} from 'lucide-react';

export const FraudProtectionTab: React.FC = () => {
  const {
    orders,
    blacklist,
    addToBlacklist,
    removeFromBlacklist,
    updateOrder,
    updateOrderStatus,
    setFraudAuditOrder,
    showNotification
  } = useStore();

  // Test Sandbox State
  const [testPhone, setTestPhone] = useState('0770554433');
  const [testWilaya, setTestWilaya] = useState('16 - الجزائر العاصمة');
  const [testCommune, setTestCommune] = useState('سيدي امحمد');
  const [testAddress, setTestAddress] = useState('حي 500 مسكن عمارة ج');
  const [testAmount, setTestAmount] = useState(6500);

  // Blacklist form state
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [newBlockPhone, setNewBlockPhone] = useState('');
  const [newBlockName, setNewBlockName] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('رفض استلام الطرد وتهرب من سائق التوصيل');
  const [blacklistSearch, setBlacklistSearch] = useState('');

  // Rules Settings Toggles
  const [ruleBlockRepetitive, setRuleBlockRepetitive] = useState(true);
  const [ruleHighValueAlert, setRuleHighValueAlert] = useState(true);
  const [ruleDuplicateGuard, setRuleDuplicateGuard] = useState(true);
  const [ruleWilayaMatch, setRuleWilayaMatch] = useState(true);

  // Active view tab inside Fraud Tab
  const [activeSubView, setActiveSubView] = useState<'radar' | 'sandbox' | 'blacklist' | 'rules'>('radar');

  // Compute live test analysis in sandbox
  const phoneValidation = validateAlgerianPhone(testPhone);
  const isTestBlacklisted = blacklist.some((b) => b.value === testPhone.trim());
  
  // Calculate sandbox risk score
  let sandboxRiskScore = 0;
  const sandboxWarnings: string[] = [];

  if (!phoneValidation.isValid) {
    sandboxRiskScore += 45;
    sandboxWarnings.push('رقم الهاتف الجزائري غير صالح أو ينقصه أرقام');
  }
  if (phoneValidation.carrier === 'غير معروف') {
    sandboxRiskScore += 25;
    sandboxWarnings.push('مشغل شبكة الهاتف غير معروف في الجزائر');
  }
  if (phoneValidation.isSuspiciousPattern) {
    sandboxRiskScore += 35;
    sandboxWarnings.push('نمط رقم الهاتف مكرر أو متسلسل وهمي (مثل: 0555555555 أو 0612345678)');
  }
  if (isTestBlacklisted) {
    sandboxRiskScore += 50;
    sandboxWarnings.push('الرقم مدرج في القائمة السوداء للمتجر (سوابق روتور)');
  }
  if (!testCommune.trim() || testCommune.length < 3) {
    sandboxRiskScore += 20;
    sandboxWarnings.push('البلدية غير محددة أو قصيرة جداً');
  }
  if (testAmount > 20000) {
    sandboxRiskScore += 15;
    sandboxWarnings.push('قيمة الطلب مرتفعة بنظام الدفع عند الاستلام');
  }
  sandboxRiskScore = Math.min(100, sandboxRiskScore);

  // Suspicious orders from store
  const suspiciousOrders = orders.filter((o) => {
    if (o.isSuspicious) return true;
    const phoneCheck = validateAlgerianPhone(o.phone);
    if (!phoneCheck.isValid || phoneCheck.isSuspiciousPattern) return true;
    if (blacklist.some((b) => b.value === o.phone)) return true;
    return false;
  });

  const totalPreventedCost = blacklist.reduce((sum, b) => sum + b.attemptsBlocked * 850, 0) + (suspiciousOrders.length * 850);

  const filteredBlacklist = blacklist.filter(
    (b) =>
      b.value.includes(blacklistSearch) ||
      (b.customerName && b.customerName.toLowerCase().includes(blacklistSearch.toLowerCase())) ||
      b.reason.toLowerCase().includes(blacklistSearch.toLowerCase())
  );

  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockPhone.trim()) return;

    addToBlacklist({
      type: 'phone',
      value: newBlockPhone.trim(),
      customerName: newBlockName.trim() || undefined,
      reason: newBlockReason,
    });
    setNewBlockPhone('');
    setNewBlockName('');
    setIsBlacklistModalOpen(false);
    showNotification('تمت إضافة الرقم للقائمة السوداء بنجاح', 'success');
  };

  const handleMarkOrderSafe = (order: Order) => {
    updateOrder(order.id, { isSuspicious: false, fraudRiskScore: 10 });
    showNotification(`تم تأكيد سلامة الطلب #${order.orderNumber}`, 'success');
  };

  const handleBlockOrderCustomer = (order: Order) => {
    addToBlacklist({
      type: 'phone',
      value: order.phone,
      customerName: order.customerName,
      reason: 'تم حظره من رادار تدقيق الاحتيال (طلب مشبوه / غير جاد)'
    });
    updateOrderStatus(order.id, 'cancelled');
    showNotification(`تم إلغاء الطلب #${order.orderNumber} وحظر الرقم ${order.phone}`, 'error');
  };

  return (
    <div id="fraud-protection-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>حماية الطلبات ومكافحة الاحتيال (Fraud Protection)</span>
                <span className="text-xs bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full font-bold">
                  {suspiciousOrders.length} طلبات قيد التدقيق
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                تدقيق أرقام مشغلي الهاتف (Mobilis, Djezzy, Ooredoo)، كشف العناوين والطلبات الوهمية وتوفير تكاليف الإرجاع (Retour).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBlacklistModalOpen(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>حظر رقم جديد</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">طلبات مشبوهة مرصودة</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">{suspiciousOrders.length}</p>
          <p className="text-[11px] text-rose-700 mt-1">تتطلب اتصالاً وتأكيداً قبل الشحن</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">أرقام بالقائمة السوداء</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{blacklist.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">محظورة تلقائياً من الطلب</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">محاولات حظر تم إحباطها</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">
            {blacklist.reduce((sum, b) => sum + b.attemptsBlocked, 0)}
          </p>
          <p className="text-[11px] text-amber-700 mt-1">طلبات وهمية منعها النظام</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">تكاليف روتور تم توفيرها</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-emerald-700 mt-2 font-mono">
            {totalPreventedCost.toLocaleString()} د.ج
          </p>
          <p className="text-[11px] text-emerald-700 mt-1">حماية للأرباح والمخزون</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubView('radar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubView === 'radar'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>رادار الطلبات المشبوهة ({suspiciousOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubView('sandbox')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubView === 'sandbox'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>مختبر فحص الأرقام والعناوين (Sandbox)</span>
        </button>

        <button
          onClick={() => setActiveSubView('blacklist')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubView === 'blacklist'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserX className="w-4 h-4" />
          <span>القائمة السوداء ({blacklist.length})</span>
        </button>

        <button
          onClick={() => setActiveSubView('rules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubView === 'rules'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>قواعد الحماية الذاتية</span>
        </button>
      </div>

      {/* VIEW 1: Radar of Suspicious Orders */}
      {activeSubView === 'radar' && (
        <div className="space-y-4">
          <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-2xl flex items-center justify-between text-xs text-rose-900">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold">نظام الكشف المبكر نشط: </span>
                يقوم النظام بفحص الطلبات ومقارنة الهواتف بالنمط الجزائري وقواعد البيانات لتفادي إرسال شحنات محكومة بالإرجاع.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {suspiciousOrders.length === 0 ? (
              <div className="p-16 text-center text-slate-400 space-y-2">
                <ShieldCheck className="w-14 h-14 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">كل الطلبات الحالية سليمة وموثوقة</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  لم يتم رصد أي رقم متكرر أو هاتف وهمي في الطلبات الواردة مؤخراً.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="p-4">رقم الطلب / التاريخ</th>
                      <th className="p-4">الزبون والهاتف</th>
                      <th className="p-4">الولاية والعنوان</th>
                      <th className="p-4">المبلغ</th>
                      <th className="p-4">درجة الخطورة</th>
                      <th className="p-4">سبب الاشتباه</th>
                      <th className="p-4 text-center">إجراءات التدقيق</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {suspiciousOrders.map((order) => {
                      const validation = validateAlgerianPhone(order.phone);
                      const isListed = blacklist.some((b) => b.value === order.phone);

                      return (
                        <tr key={order.id} className="hover:bg-rose-50/40 transition-colors">
                          <td className="p-4">
                            <span className="font-mono font-bold text-slate-900">#{order.orderNumber}</span>
                            <span className="block text-[10px] text-slate-400 mt-0.5">{order.createdAt}</span>
                          </td>

                          <td className="p-4">
                            <p className="font-bold text-slate-800">{order.customerName}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-slate-700" dir="ltr">
                                {order.phone}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                  validation.carrier.includes('موبيليس')
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : validation.carrier.includes('جيزي')
                                    ? 'bg-red-100 text-red-800'
                                    : validation.carrier.includes('أوريدو')
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {validation.carrier}
                              </span>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="font-medium text-slate-800">{order.wilaya}</span>
                            <span className="block text-[11px] text-slate-400 truncate max-w-[150px]">
                              {order.commune} - {order.address}
                            </span>
                          </td>

                          <td className="p-4 font-mono font-bold text-slate-900">
                            {order.totalAmount.toLocaleString()} د.ج
                          </td>

                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>مرتفع ({order.fraudRiskScore || 85}%)</span>
                            </span>
                          </td>

                          <td className="p-4 text-rose-700 font-medium">
                            {isListed
                              ? 'رقم مدرج بالقائمة السوداء'
                              : validation.isSuspiciousPattern
                              ? 'نمط رقم وهمي متكرر'
                              : 'طلب متكرر أو عنوان غير مكتمل'}
                          </td>

                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Open Audit Modal */}
                              <button
                                onClick={() => setFraudAuditOrder(order)}
                                className="px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1"
                                title="فحص الأمان والتدقيق الكامل"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>تدقيق</span>
                              </button>

                              {/* Call Customer */}
                              <a
                                href={`tel:${order.phone}`}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-xl transition-all"
                                title="اتصال هاتفي بالزبون"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                              </a>

                              {/* Mark Safe */}
                              <button
                                onClick={() => handleMarkOrderSafe(order)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 border border-emerald-200 rounded-xl transition-all"
                                title="تأكيد سلامة الطلب والمتابعة"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>

                              {/* Block & Reject */}
                              <button
                                onClick={() => handleBlockOrderCustomer(order)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-all"
                                title="حظر الرقم وإلغاء الطلب"
                              >
                                <UserX className="w-3.5 h-3.5" />
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
      )}

      {/* VIEW 2: Sandbox / Simulator */}
      {activeSubView === 'sandbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">مختبر فحص أرقام الهواتف والعناوين الجزائرية</h3>
            </div>

            <p className="text-xs text-slate-500">
              أدخل أي رقم هاتف أو عنوان لاختبار مدى مطابقته لخوارزمية كشف الاحتيال وتفحص مشغل الشبكة والولاية المسجلة.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الهاتف الجزائري</label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="مثال: 0550112233 أو 0661223344"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الولاية</label>
                  <input
                    type="text"
                    value={testWilaya}
                    onChange={(e) => setTestWilaya(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">البلدية</label>
                  <input
                    type="text"
                    value={testCommune}
                    onChange={(e) => setTestCommune(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">العنوان التفصيلي</label>
                <input
                  type="text"
                  value={testAddress}
                  onChange={(e) => setTestAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">مبلغ الطلب بالدينار (COD)</label>
                <input
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              {/* Sample Presets */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-1.5">نماذج سريعة للاختبار:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTestPhone('0555555555');
                      setTestCommune('حي تجريبي');
                      setTestAmount(35000);
                    }}
                    className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold"
                  >
                    رقم مكرر وهمي 🔴
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTestPhone('0661987456');
                      setTestCommune('الجزائر الوسطى');
                      setTestAmount(5500);
                    }}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold"
                  >
                    رقم زبون حقيقي موبيليس 🟢
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTestPhone('0770998877');
                      setTestCommune('وهران');
                      setTestAmount(7900);
                    }}
                    className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[11px] font-bold"
                  >
                    رقم جازي سليم 🟡
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Report Result */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl border border-slate-700 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-xs font-bold text-slate-300">تقرير نتيجة الفحص الفوري</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    sandboxRiskScore > 60
                      ? 'bg-rose-500 text-white'
                      : sandboxRiskScore > 25
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {sandboxRiskScore > 60 ? 'عالي الخطورة 🔴' : sandboxRiskScore > 25 ? 'متوسط 🟡' : 'آمن وموثوق 🟢'}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                {/* Operator info */}
                <div className="flex justify-between items-center bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400">مشغل شبكة الهاتف:</span>
                  <span className="font-bold text-amber-400">{phoneValidation.carrier}</span>
                </div>

                {/* Score gauge */}
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">مؤشر الاحتيال (Fraud Risk):</span>
                    <span className="font-mono font-bold text-base">{sandboxRiskScore}%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${sandboxRiskScore}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        sandboxRiskScore > 60 ? 'bg-rose-500' : sandboxRiskScore > 25 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Warnings list */}
                <div className="space-y-1.5 pt-1">
                  <p className="font-bold text-slate-300">الملاحظات والتنبيهات المرصودة:</p>
                  {sandboxWarnings.length === 0 ? (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-700/50 rounded-xl text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>الرقم والعنوان مطابقان لجميع معايير السلامة والتجارة الجزائرية.</span>
                    </div>
                  ) : (
                    sandboxWarnings.map((w, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-rose-950/40 border border-rose-800/50 rounded-xl text-rose-300 flex items-center gap-2 text-[11px]"
                      >
                        <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{w}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700">
              <button
                type="button"
                onClick={() => {
                  addToBlacklist({
                    type: 'phone',
                    value: testPhone,
                    reason: 'تم حظره من نتائج اختبار Sandbox'
                  });
                  showNotification('تمت إضافة الرقم إلى القائمة السوداء', 'success');
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>حظر هذا الرقم فوراً في القائمة السوداء</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Blacklist Management */}
      {activeSubView === 'blacklist' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              <input
                type="text"
                value={blacklistSearch}
                onChange={(e) => setBlacklistSearch(e.target.value)}
                placeholder="بحث برقم الهاتف أو الاسم أو السبب..."
                className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button
              onClick={() => setIsBlacklistModalOpen(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة رقم للقائمة السوداء</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {filteredBlacklist.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <p className="text-sm font-bold text-slate-700">لا توجد أرقام مطابقة في القائمة السوداء</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="p-4">الرقم المحظور</th>
                      <th className="p-4">اسم الزبون</th>
                      <th className="p-4">سبب الإدراج والحظر</th>
                      <th className="p-4 text-center">محاولات حظر تم صدها</th>
                      <th className="p-4">تاريخ الإدراج</th>
                      <th className="p-4 text-center">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBlacklist.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono font-bold text-rose-600" dir="ltr">
                          {item.value}
                        </td>
                        <td className="p-4 font-bold text-slate-800">{item.customerName || 'غير محدد'}</td>
                        <td className="p-4 text-slate-600 max-w-xs">{item.reason}</td>
                        <td className="p-4 text-center">
                          <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            {item.attemptsBlocked} محاولات
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 font-mono">{item.blockedDate}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              removeFromBlacklist(item.id);
                              showNotification('تم رفع الحظر بنجاح', 'info');
                            }}
                            className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold rounded-lg transition-colors border border-slate-200 text-[11px]"
                          >
                            فك الحظر
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: Automated Rules Manager */}
      {activeSubView === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">حظر الأنماط المتكررة (Pattern Blocker)</h4>
                  <p className="text-[11px] text-slate-500">حظر أي رقم يحتوي على أكثر من 5 أرقام متكررة متتالية.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={ruleBlockRepetitive}
                onChange={(e) => setRuleBlockRepetitive(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">إنذار الطلبيات المرتفعة (High Value Alert)</h4>
                  <p className="text-[11px] text-slate-500">
                    وضع الطلبات التي تفوق 15,000 د.ج في حالة تدقيق وتأكيد هاتفي إجباري.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={ruleHighValueAlert}
                onChange={(e) => setRuleHighValueAlert(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">حماية الطلبات المكررة (Duplicate Guard)</h4>
                  <p className="text-[11px] text-slate-500">
                    منع تكرار إرسال أكثر من طلب لنفس الهاتف خلال أقل من 24 ساعة.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={ruleDuplicateGuard}
                onChange={(e) => setRuleDuplicateGuard(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">مطابقة الولاية والبلدية (Geo Validation)</h4>
                  <p className="text-[11px] text-slate-500">
                    التأكد من أن البلدية المختارة تتبع للولاية المسجلة رسمياً بالجزائر.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={ruleWilayaMatch}
                onChange={(e) => setRuleWilayaMatch(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add to Blacklist Modal */}
      {isBlacklistModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>إدراج رقم جديد في القائمة السوداء</span>
              </h4>
              <button
                onClick={() => setIsBlacklistModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBlacklist} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الهاتف الجزائري</label>
                <input
                  type="text"
                  required
                  value={newBlockPhone}
                  onChange={(e) => setNewBlockPhone(e.target.value)}
                  placeholder="0550112233"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الزبون (اختياري)</label>
                <input
                  type="text"
                  value={newBlockName}
                  onChange={(e) => setNewBlockName(e.target.value)}
                  placeholder="اسم الشخص المشبوه"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">سبب الحظر</label>
                <select
                  value={newBlockReason}
                  onChange={(e) => setNewBlockReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="رفض استلام الطرد وتهرب من سائق التوصيل">رفض استلام الطرد وتهرب من سائق التوصيل</option>
                  <option value="رقم هاتف غير موجود / مغلق دائماً">رقم هاتف غير موجود / مغلق دائماً</option>
                  <option value="عنوان وهمي ولا وجود له في الولاية">عنوان وهمي ولا وجود له في الولاية</option>
                  <option value="منافس أو طلب كيدي غير جاد">منافس أو طلب كيدي غير جاد</option>
                  <option value="سوابق روتور متكررة دون عذر">سوابق روتور متكررة دون عذر</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد الحظر</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBlacklistModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
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
