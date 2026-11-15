import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdvancedFinancialStats } from './AdvancedFinancialStats';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Percent,
  Calendar,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Users
} from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
  const { orders, products, settings, language } = useStore();
  const [activeSubTab, setActiveSubTab] = useState<'financial' | 'general'>('financial');

  // Calculations for general overview
  const grossSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCost = orders.reduce((sum, o) => {
    return (
      sum +
      o.items.reduce((itemSum, item) => {
        const prod = products.find((p) => p.id === item.productId);
        return itemSum + (prod ? prod.costPrice * item.quantity : 0);
      }, 0)
    );
  }, 0);

  const netProfit = grossSales - totalCost;
  const marginPercent = grossSales > 0 ? Math.round((netProfit / grossSales) * 100) : 0;

  // Wilaya distribution stats
  const wilayaCounts: Record<string, number> = {};
  orders.forEach((o) => {
    wilayaCounts[o.wilaya] = (wilayaCounts[o.wilaya] || 0) + 1;
  });

  const sortedWilayas = Object.entries(wilayaCounts).sort((a, b) => b[1] - a[1]);

  // Devices breakdown
  const deviceTraffic = [
    { label: 'الهواتف الذكية (Mobile)', percent: 84, count: '4,074 زائر' },
    { label: 'أجهزة الكمبيوتر (Desktop)', percent: 14, count: '679 زائر' },
    { label: 'الأجهزة اللوحية (Tablet)', percent: 2, count: '97 زائر' },
  ];

  return (
    <div id="analytics-tab-content" className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('financial')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'financial'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{language === 'ar' ? 'الإحصائيات المالية المتقدمة والأرباح' : 'Advanced Financial Stats & Net Profit'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('general')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'general'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{language === 'ar' ? 'تحليلات المبيعات والولايات والأجهزة' : 'Sales, Geography & Traffic'}</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'financial' ? (
        <AdvancedFinancialStats />
      ) : (
        <div className="space-y-6">
          {/* KPI Financial Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="text-xs font-bold text-slate-500 mb-1">إجمالي الإيرادات</div>
              <div className="text-2xl font-black text-slate-900">
                {grossSales.toLocaleString()} <span className="text-xs text-slate-400 font-normal">د.ج</span>
              </div>
              <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+24.5% نمو الإيراد</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="text-xs font-bold text-slate-500 mb-1">صافي الأرباح التقديرية</div>
              <div className="text-2xl font-black text-emerald-600">
                {netProfit.toLocaleString()} <span className="text-xs text-slate-400 font-normal">د.ج</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                بعد خصم تكاليف شراء البضاعة
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="text-xs font-bold text-slate-500 mb-1">هامش الربح الإجمالي</div>
              <div className="text-2xl font-black text-indigo-600">
                {marginPercent}%
              </div>
              <div className="mt-2 text-xs text-slate-500">
                نسبة ربح ممتازة في التجارة الإلكترونية
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="text-xs font-bold text-slate-500 mb-1">متوسط قيمة السلة (AOV)</div>
              <div className="text-2xl font-black text-slate-900">
                {orders.length > 0 ? Math.round(grossSales / orders.length).toLocaleString() : 0}{' '}
                <span className="text-xs text-slate-400 font-normal">د.ج</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                لكل طلب مسجل
              </div>
            </div>
          </div>

          {/* Wilayas Breakdown & Device Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Wilayas */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>أعلى الولايات طلباً ومبيعات</span>
                </h4>
                <span className="text-xs text-slate-400">حسب عدد الطرود</span>
              </div>

              <div className="space-y-3">
                {sortedWilayas.slice(0, 5).map(([wilaya, count], idx) => {
                  const percent = Math.round((count / orders.length) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{wilaya}</span>
                        <span>{count} طلبات ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percent}%` }}
                          className="bg-emerald-500 h-full rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Traffic by Device */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>مصادر الأجهزة والزيارات</span>
                </h4>
                <span className="text-xs text-slate-400">إجمالي 4,850 زيارة</span>
              </div>

              <div className="space-y-4">
                {deviceTraffic.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{item.label}</span>
                      <span>{item.percent}% ({item.count})</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.percent}%` }}
                        className="bg-indigo-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 mt-2">
                💡 نصيحة: غالبية زوارك (84%) يتصفحون عبر الهاتف، متجرك مهيأ ومحسن كلياً للشاشات المحمولة.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

