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
  Filter,
  Eye,
  Settings,
  BellRing,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  User,
  MapPin,
  Flame,
  FileSpreadsheet
} from 'lucide-react';

export const AbandonedCheckoutsTab: React.FC = () => {
  const {
    abandonedCheckouts,
    addAbandonedCheckout,
    updateAbandonedStatus,
    deleteAbandonedCheckout,
    convertAbandonedToOrder,
    products,
    showNotification
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [customDiscountText, setCustomDiscountText] = useState('خصم حصري 400 د.ج أو شحن مجاني');
  const [inspectItem, setInspectItem] = useState<AbandonedCheckout | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [autoReminderDelay, setAutoReminderDelay] = useState('30_min');
  const [selectedTemplate, setSelectedTemplate] = useState<'friendly' | 'urgent' | 'discount'>('discount');

  // Filtered checkouts
  const filtered = abandonedCheckouts.filter((item) => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (selectedWilaya !== 'all' && item.wilaya !== selectedWilaya) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = item.customerName?.toLowerCase().includes(q);
      const matchPhone = item.phone.includes(q);
      const matchWilaya = item.wilaya?.toLowerCase().includes(q);
      const matchCommune = item.commune?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchWilaya && !matchCommune) return false;
    }
    return true;
  });

  const totalAbandonedCount = abandonedCheckouts.length;
  const unrecoveredCount = abandonedCheckouts.filter((a) => a.status === 'abandoned').length;
  const contactedCount = abandonedCheckouts.filter((a) => a.status === 'contacted').length;
  const recoveredCount = abandonedCheckouts.filter((a) => a.status === 'recovered').length;
  const recoveredRevenue = abandonedCheckouts
    .filter((a) => a.status === 'recovered')
    .reduce((sum, a) => sum + a.totalAmount, 0);
  const potentialRevenue = abandonedCheckouts
    .filter((a) => a.status === 'abandoned' || a.status === 'contacted')
    .reduce((sum, a) => sum + a.totalAmount, 0);
  const recoveryRate = totalAbandonedCount > 0 ? Math.round((recoveredCount / totalAbandonedCount) * 100) : 0;

  // Generate Algerian Darija Message
  const getPreparedMessage = (item: AbandonedCheckout) => {
    const customer = item.customerName || 'أخي/أختي الكريم(ة)';
    const firstProduct = item.items[0]?.productName || 'المنتج';
    const wilayaStr = item.wilaya ? `إلى ولاية ${item.wilaya}` : 'لباب منزلك';

    if (selectedTemplate === 'urgent') {
      return `السلام عليكم ${customer} 🌸
الكمية المتبقية من منتج "${firstProduct}" أوشكت على النفاد في المستودع!
يسعدنا أن نمنحك أولوية الشحن السريع ${wilayaStr} مع ${customDiscountText} إذا قمت بتأكيد الطلب الآن.
هل نجهز طلبيتك للإرسال؟ 🚚`;
    }

    if (selectedTemplate === 'friendly') {
      return `السلام عليكم ${customer} 👋
لاحظنا أنك زرت متجرنا واخترت "${firstProduct}" لكنك لم تكمل خطوة التأكيد.
هل واجهتك أية صعوبة في الموقع أو تحتاج لأي استفسار حول المنتج وطريقة الاستعمال؟ فريقنا في خدمتك لمساعدتك فوراً! ✨`;
    }

    // Default: Discount & Incentive
    return `السلام عليكم ورحمة الله وبركاته ${customer} 🌸
شكراً لاهتمامكم بمتجرنا وبمنتج "${firstProduct}".
يسرنا أن نقدم لحضرتكم عرضاً خاصاً: [ ${customDiscountText} ] لإتمام طلبكم الآن والتوصيل متاح والدفع عند الاستلام ${wilayaStr} 📦
هل تودون تأكيد إرسال الطلبية لحضرتكم؟`;
  };

  const handleSendWhatsApp = (item: AbandonedCheckout) => {
    const message = getPreparedMessage(item);
    updateAbandonedStatus(item.id, 'contacted', 'whatsapp');
    const cleanPhone = item.phone.replace(/^0/, '').replace(/\s+/g, '');
    window.open(`https://wa.me/213${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
    showNotification(`تم فتح محادثة الواتساب مع الزبون ${item.customerName || item.phone}`, 'success');
  };

  const handleSimulateNewDrop = () => {
    const randomProd = products[Math.floor(Math.random() * products.length)] || {
      id: 'prod-1',
      name: 'ساعة ذكية فاخرة مقاومة للماء',
      price: 4900,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200']
    };
    const sampleNames = ['أمين بلحاج', 'فاطمة الزهراء قاسمي', 'محمد لمين شريف', 'سمية بوعزة', 'كريم عثماني'];
    const sampleWilayas = ['16 - الجزائر العاصمة', '31 - وهران', '25 - قسنطينة', '19 - سطيف', '09 - البليدة'];
    const samplePhones = ['0554129845', '0661873421', '0770541290', '0550998811', '0671334455'];
    const rndIdx = Math.floor(Math.random() * sampleNames.length);

    addAbandonedCheckout({
      customerName: sampleNames[rndIdx],
      phone: samplePhones[rndIdx],
      wilaya: sampleWilayas[rndIdx],
      commune: 'وسط المدينة',
      totalAmount: randomProd.price + 500,
      items: [
        {
          productId: randomProd.id,
          productName: randomProd.name,
          productImage: randomProd.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
          quantity: 1,
          unitPrice: randomProd.price
        }
      ]
    });
    showNotification('🔔 تم تسجيل سلة متروكة جديدة في الوقت الفعلي!', 'info');
  };

  const handleExportCSV = () => {
    const rows = [
      ['ID', 'Customer Name', 'Phone', 'Wilaya', 'Commune', 'Total Amount', 'Status', 'Date'],
      ...filtered.map((item) => [
        item.id,
        item.customerName || 'N/A',
        item.phone,
        item.wilaya || 'N/A',
        item.commune || 'N/A',
        item.totalAmount,
        item.status,
        item.createdAt
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `abandoned_checkouts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('تم تصدير تقرير السلات المتروكة بنجاح (CSV)', 'success');
  };

  const wilayasSet = Array.from(new Set(abandonedCheckouts.map((a) => a.wilaya).filter(Boolean)));

  return (
    <div id="abandoned-checkouts-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>إشعارات واسترجاع السلات المتروكة</span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
                  {unrecoveredCount} سلة معلقة
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                متابعة زوار صفحة الدفع الذين غادروا قبل الإتمام مع إمكانية التواصل الفوري عبر الواتساب واسترجاع الأرباح.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSimulateNewDrop}
            className="px-3.5 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            title="إضافة سلة تجريبية للاختبار"
          >
            <BellRing className="w-4 h-4 text-amber-600" />
            <span>محاكاة سلة جديدة</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isSettingsOpen
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات الاسترجاع الآلي</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>تصدير CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">إجمالي المتروكة</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalAbandonedCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">{unrecoveredCount} بحاجة لتواصل</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">تم التواصل</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-700 mt-2">{contactedCount}</p>
          <p className="text-[11px] text-blue-600 mt-1">بانتظار رد الزبائن</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">سلات مسترجعة</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{recoveredCount}</p>
          <p className="text-[11px] text-emerald-700 mt-1">تحولت إلى طلبيات مؤكدة</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">نسبة الاسترجاع</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-teal-700 mt-2">{recoveryRate}%</p>
          <p className="text-[11px] text-teal-600 mt-1">معدل ممتاز للمتجر</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">إيرادات مسترجعة</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-indigo-700 mt-2 font-mono">{recoveredRevenue.toLocaleString()} د.ج</p>
          <p className="text-[11px] text-amber-600 mt-1 font-mono">محتجز: {potentialRevenue.toLocaleString()} د.ج</p>
        </div>
      </div>

      {/* Settings / Automated Setup Drawer (Toggleable) */}
      {isSettingsOpen && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl border border-slate-700 space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">إعدادات قوالب الاسترجاع ورسائل الواتساب الآلية</h3>
            </div>
            <span className="text-xs text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-full font-mono font-bold">
              AI Smart Recovery Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">نبرة الرسالة الترويجية</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTemplate('discount')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    selectedTemplate === 'discount'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  كود خصم 🎁
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTemplate('urgent')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    selectedTemplate === 'urgent'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  نفاد الكمية 🔥
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTemplate('friendly')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    selectedTemplate === 'friendly'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  مساعدة ودية 👋
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">الحافز الترويجي (Offer text)</label>
              <input
                type="text"
                value={customDiscountText}
                onChange={(e) => setCustomDiscountText(e.target.value)}
                placeholder="مثال: خصم 500 دج أو توصيل مجاني"
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">توقيت إرسال التنبيه التلقائي</label>
              <select
                value={autoReminderDelay}
                onChange={(e) => setAutoReminderDelay(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="15_min">بعد 15 دقيقة من ترك السلة (مستحسن)</option>
                <option value="30_min">بعد 30 دقيقة</option>
                <option value="1_hour">بعد ساعة واحدة</option>
                <option value="6_hours">بعد 6 ساعات</option>
                <option value="24_hours">بعد 24 ساعة</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs">
            <p className="text-slate-400 font-semibold mb-1">معاينة نص الرسالة التي ستصل للزبون عبر الواتساب:</p>
            <p className="text-slate-200 whitespace-pre-line leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800 font-sans">
              {getPreparedMessage({
                id: 'preview',
                customerName: 'محمد أمين',
                phone: '0550112233',
                wilaya: '16 - الجزائر العاصمة',
                commune: 'باب الزوار',
                totalAmount: 5800,
                status: 'abandoned',
                items: [{ productId: 'p1', productName: 'ساعة رياضية ذكية Smart Pro', quantity: 1, unitPrice: 5300, productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' }],
                createdAt: 'منذ 15 دقيقة'
              })}
            </p>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث بالاسم، رقم الهاتف الجزائري، الولاية، أو البلدية..."
              className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {wilayasSet.length > 0 && (
            <select
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
              className="px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700"
            >
              <option value="all">كل الولايات</option>
              {wilayasSet.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل ({abandonedCheckouts.length})
          </button>
          <button
            onClick={() => setFilterStatus('abandoned')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === 'abandoned'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            متروكة ({abandonedCheckouts.filter((a) => a.status === 'abandoned').length})
          </button>
          <button
            onClick={() => setFilterStatus('contacted')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === 'contacted'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            تم التواصل ({abandonedCheckouts.filter((a) => a.status === 'contacted').length})
          </button>
          <button
            onClick={() => setFilterStatus('recovered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === 'recovered'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            مسترجعة ({abandonedCheckouts.filter((a) => a.status === 'recovered').length})
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-800">لا توجد سلات متروكة مطابقة</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              جميع الزبائن الذين دخلوا صفحة الشراء أتموا طلباتهم، أو جرب تغيير معايير البحث والفلترة.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">الزبون / الهاتف</th>
                  <th className="p-4">الولاية والبلدية</th>
                  <th className="p-4">المنتجات في السلة</th>
                  <th className="p-4">إجمالي السلة</th>
                  <th className="p-4">توقيت التخلي</th>
                  <th className="p-4">حالة السلة</th>
                  <th className="p-4 text-center">أزرار التواصل والاسترجاع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const isRecovered = item.status === 'recovered';
                  const isContacted = item.status === 'contacted';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Customer info */}
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {item.customerName?.charAt(0) || '؟'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{item.customerName || 'زبون زائر'}</p>
                            <p className="font-mono text-slate-500 text-[11px] mt-0.5" dir="ltr">
                              {item.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="p-4 text-slate-700">
                        <div className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.wilaya || 'غير محددة'}</span>
                        </div>
                        {item.commune && (
                          <span className="text-[11px] text-slate-400 block pr-4.5 mt-0.5">{item.commune}</span>
                        )}
                      </td>

                      {/* Items Preview */}
                      <td className="p-4">
                        <div className="space-y-1 max-w-[200px]">
                          {item.items.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              {it.productImage ? (
                                <img
                                  src={it.productImage}
                                  alt={it.productName}
                                  className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                  📦
                                </div>
                              )}
                              <div className="truncate">
                                <span className="font-semibold text-slate-800 text-[11px] truncate block">
                                  {it.productName}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {it.quantity} × {it.unitPrice.toLocaleString()} د.ج
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {item.totalAmount.toLocaleString()} د.ج
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="p-4 text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.createdAt}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {isRecovered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>مسترجعة بنجاح</span>
                          </span>
                        ) : isContacted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                            <Send className="w-3.5 h-3.5" />
                            <span>تم التواصل ({item.recoveryChannel || 'واتساب'})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            <span>متروكة بانتظار تواصل</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* WhatsApp 1-Click Recovery Button */}
                          <button
                            onClick={() => handleSendWhatsApp(item)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm"
                            title="إرسال رسالة استرجاع فورية عبر واتساب"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>واتساب</span>
                          </button>

                          {/* Direct Phone Call */}
                          <a
                            href={`tel:${item.phone}`}
                            onClick={() => updateAbandonedStatus(item.id, 'contacted', 'sms')}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-blue-200"
                            title="اتصال هاتفي مباشر"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </a>

                          {/* Convert to Order */}
                          {!isRecovered && (
                            <button
                              onClick={() => {
                                const newOrd = convertAbandonedToOrder(item.id);
                                if (newOrd) {
                                  showNotification(`تم تحويل السلة بنجاح إلى الطلب رقم ${newOrd.orderNumber}!`, 'success');
                                }
                              }}
                              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1"
                              title="تحويل مباشر إلى طلب مؤكد في المتجر"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>تأكيد الطلب</span>
                            </button>
                          )}

                          {/* Inspect details */}
                          <button
                            onClick={() => setInspectItem(item)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                            title="عرض تفاصيل السلة"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (window.confirm('هل تريد حذف هذا السجل من السلات المتروكة؟')) {
                                deleteAbandonedCheckout(item.id);
                                showNotification('تم حذف السجل', 'info');
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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

      {/* Inspect Modal */}
      {inspectItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">تفاصيل السلة المتروكة</h3>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {inspectItem.id}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectItem(null)}
                className="text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block">اسم الزبون:</span>
                  <span className="font-bold text-slate-800">{inspectItem.customerName || 'غير مسجل'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">رقم الهاتف:</span>
                  <span className="font-mono font-bold text-slate-900" dir="ltr">
                    {inspectItem.phone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">الولاية والبلدية:</span>
                  <span className="font-medium text-slate-800">
                    {inspectItem.wilaya} {inspectItem.commune ? `- ${inspectItem.commune}` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">توقيت ترك السلة:</span>
                  <span className="font-medium text-slate-800">{inspectItem.createdAt}</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-2">المنتجات المختارة ({inspectItem.items.length}):</p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {inspectItem.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div className="flex items-center gap-2.5">
                        {it.productImage && (
                          <img
                            src={it.productImage}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                          />
                        )}
                        <div>
                          <p className="font-bold text-slate-800">{it.productName}</p>
                          {it.variantName && (
                            <span className="text-[10px] text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                              {it.variantName}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-left font-mono">
                        <span className="font-bold text-slate-900">{(it.quantity * it.unitPrice).toLocaleString()} د.ج</span>
                        <span className="text-[10px] text-slate-400 block">
                          {it.quantity} × {it.unitPrice.toLocaleString()} د.ج
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between font-bold text-slate-900">
                <span>القيمة الإجمالية للسلة:</span>
                <span className="text-base text-amber-900 font-mono">{inspectItem.totalAmount.toLocaleString()} د.ج</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  handleSendWhatsApp(inspectItem);
                  setInspectItem(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>إرسال واتساب فوري</span>
              </button>

              {inspectItem.status !== 'recovered' && (
                <button
                  onClick={() => {
                    const newOrd = convertAbandonedToOrder(inspectItem.id);
                    if (newOrd) {
                      showNotification(`تم تحويل السلة للطلب رقم ${newOrd.orderNumber}!`, 'success');
                    }
                    setInspectItem(null);
                  }}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs"
                >
                  تحويل لطلب مؤكد
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
