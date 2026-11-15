import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronLeft,
  Store,
  Plus,
  Globe,
  Sparkles
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const {
    orders,
    products,
    setCurrentTab,
    setViewMode,
    settings,
    getFinancialStats,
    language,
    currentStore,
    stores,
    setIsCreateStoreModalOpen
  } = useStore();

  // Financial Stats for Month
  const monthStats = getFinancialStats('month');
  const todayStats = getFinancialStats('today');

  // Aggregate Metrics
  const totalSales = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.totalAmount : sum), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const deliveredRate = totalOrders > 0 ? Math.round((deliveredOrders.length / totalOrders) * 100) : 0;
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  // Sales Trend Mock Data (7 Days)
  const salesHistory = [
    { day: 'السبت', amount: 34500, orders: 7 },
    { day: 'الأحد', amount: 48200, orders: 11 },
    { day: 'الإثنين', amount: 29000, orders: 6 },
    { day: 'الثلاثاء', amount: 62400, orders: 14 },
    { day: 'الأربعاء', amount: 51000, orders: 12 },
    { day: 'الخميس', amount: 78900, orders: 18 },
    { day: 'الجمعة', amount: 94200, orders: 23 },
  ];

  const maxAmount = Math.max(...salesHistory.map((s) => s.amount));

  return (
    <div id="overview-tab-content" className="space-y-6">
      {/* Store Quick Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-4 min-w-0">
          {currentStore?.logoUrl ? (
            <img
              src={currentStore.logoUrl}
              alt={currentStore.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-md shrink-0"
            />
          ) : (
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-md shrink-0"
              style={{ backgroundColor: currentStore?.primaryColor || '#10b981' }}
            >
              <Store className="w-7 h-7" />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white truncate">{currentStore?.name || settings.storeName}</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                متجر نشط 🟢
              </span>
              <span className="text-[10px] bg-white/10 text-slate-300 px-2.5 py-0.5 rounded-full font-mono">
                {currentStore?.currency || settings.currency}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 truncate flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-mono text-slate-300">{currentStore?.domain || 'online'}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{products.length} منتج مسجل</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{orders.length} طلب إجمالي</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            onClick={() => setViewMode('storefront')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>معاينة المتجر</span>
          </button>

          <button
            onClick={() => setIsCreateStoreModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ إنشاء متجر جديد</span>
          </button>
        </div>
      </div>

      {/* Top Banner Alert for Pending Actions */}
      {pendingOrders.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">
                لديك {pendingOrders.length} طلبات جديدة بانتظار التأكيد والمعالجة
              </h4>
              <p className="text-xs text-gray-500">
                قم بمراجعة الطلبات وتأكيد الشحن مع الزبائن في أقرب وقت.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('orders')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all shadow-xs flex items-center gap-1 self-end sm:self-auto"
          >
            <span>معالجة الطلبات</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards Grid matching Professional Polish theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600 text-xl font-bold">
              💰
            </div>
            <span className="text-green-500 text-xs font-bold">+١٢٪</span>
          </div>
          <p className="text-gray-500 text-xs mb-1">إجمالي المبيعات</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalSales.toLocaleString()} <span className="text-sm font-medium text-gray-500">{settings.currency}</span>
          </p>
        </div>

        {/* Net Profit Card */}
        <div
          onClick={() => setCurrentTab('analytics')}
          className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600 text-xl font-bold group-hover:scale-105 transition-transform">
              📈
            </div>
            <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              {monthStats.netMarginPercent}% هامش
            </span>
          </div>
          <p className="text-gray-500 text-xs mb-1">صافي الأرباح (هذا الشهر)</p>
          <p className="text-2xl font-bold text-emerald-600 font-mono">
            {monthStats.netProfit.toLocaleString()} <span className="text-sm font-medium text-gray-500">{settings.currency}</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>بعد خصم المصاريف والسلع</span>
            <span className="text-emerald-600 font-bold underline">عرض التفاصيل &larr;</span>
          </p>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-orange-50 rounded-lg text-orange-600 text-xl font-bold">
              🛒
            </div>
            <span className="text-green-500 text-xs font-bold">+٨٪</span>
          </div>
          <p className="text-gray-500 text-xs mb-1">عدد الطلبات</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalOrders} <span className="text-sm font-medium text-gray-500">طلب</span>
          </p>
        </div>

        {/* Delivery / Customers Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-purple-50 rounded-lg text-purple-600 text-xl font-bold">
              👤
            </div>
            <span className="text-green-500 text-xs font-bold">{deliveredRate}%</span>
          </div>
          <p className="text-gray-500 text-xs mb-1">نسبة التوصيل الناجح</p>
          <p className="text-2xl font-bold text-gray-900">
            {deliveredOrders.length} <span className="text-sm font-medium text-gray-500">مكتمل</span>
          </p>
        </div>

        {/* Delivery Time / Inventory Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-green-50 rounded-lg text-green-600 text-xl font-bold">
              🚚
            </div>
            <span className="text-gray-400 text-xs font-bold">مستقر</span>
          </div>
          <p className="text-gray-500 text-xs mb-1">متوسط وقت التوصيل</p>
          <p className="text-2xl font-bold text-gray-900">
            ٢.٤ <span className="text-sm font-medium text-gray-500">يوم</span>
          </p>
        </div>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-base">مخطط المبيعات الأسبوعي</h3>
              <p className="text-xs text-gray-400">حجم المبيعات اليومية خلال آخر 7 أيام</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                المبيعات اليومية
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2">
            {salesHistory.map((item, index) => {
              const heightPercent = Math.round((item.amount / maxAmount) * 100);
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-2 py-1 rounded-md shadow pointer-events-none whitespace-nowrap mb-1">
                    {item.amount.toLocaleString()} {settings.currency} ({item.orders} طلب)
                  </div>
                  {/* Bar */}
                  <div className="w-full max-w-[40px] bg-gray-100 rounded-t-xl h-full flex items-end overflow-hidden">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-blue-600 group-hover:bg-blue-700 rounded-t-xl transition-all duration-300"
                    />
                  </div>
                  {/* Label */}
                  <span className="text-[11px] font-medium text-gray-500">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions & Store Health (1 col) */}
        <div className="space-y-6">
          {/* Conversion Funnel Box */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm mb-4">معدل تحويل المتجر</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>زيارات المتجر</span>
                  <span>4,850 زائر</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-gray-400 h-full rounded-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>إضافة إلى السلة</span>
                  <span>620 سلة (12.8%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full w-[45%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>طلبات مؤكدة</span>
                  <span>148 طلب (3.1%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full w-[25%]" />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <button
                onClick={() => setViewMode('storefront')}
                className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <span>معاينة تجربة العميل</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Low Stock Warning */}
          {lowStockProducts.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-red-600 font-bold text-xs mb-3">
                <AlertCircle className="w-4 h-4" />
                <span>تنبيه: مخزون قارب على النفاد</span>
              </div>
              <div className="space-y-2.5">
                {lowStockProducts.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 truncate max-w-[170px]">{p.name}</span>
                    <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                      متبقي {p.stock}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Table: Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-base">أحدث الطلبات</h2>
          <button
            onClick={() => setCurrentTab('orders')}
            className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
          >
            عرض الكل
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase font-bold sticky top-0">
              <tr>
                <th className="px-6 py-4">رقم الطلب</th>
                <th className="px-6 py-4">العميل</th>
                <th className="px-6 py-4">المنتج / الولاية</th>
                <th className="px-6 py-4">المجموع</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {orders.slice(0, 5).map((order) => {
                const isDelivered = order.status === 'delivered';
                const isShipped = order.status === 'shipped';
                const isConfirmed = order.status === 'confirmed';
                const isCancelled = order.status === 'cancelled';
                const isPending = order.status === 'pending';

                return (
                  <tr key={order.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-600 text-xs">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {order.items[0]?.productName || order.wilaya}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {order.totalAmount.toLocaleString()} {settings.currency}
                    </td>
                    <td className="px-6 py-4">
                      {isDelivered && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold inline-block">
                          تم التوصيل
                        </span>
                      )}
                      {isShipped && (
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-bold inline-block">
                          جاري الشحن
                        </span>
                      )}
                      {(isConfirmed || isPending) && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold inline-block">
                          {isConfirmed ? 'مؤكد' : 'قيد المعالجة'}
                        </span>
                      )}
                      {isCancelled && (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold inline-block">
                          ملغي
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setCurrentTab('orders')}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                        title="معاينة الطلب"
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
