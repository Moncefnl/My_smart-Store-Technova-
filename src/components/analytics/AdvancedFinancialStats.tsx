import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  StoreExpense,
  ExpenseCategory,
  ExpenseType,
  ExpenseRecurrence,
  FinancialPeriodStats
} from '../../types';
import {
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Megaphone,
  Box,
  Users,
  Truck,
  Monitor,
  Zap,
  Tag,
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart3,
  PieChart,
  Percent,
  X
} from 'lucide-react';

const CATEGORY_DETAILS: Record<
  ExpenseCategory,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  rent: {
    label: 'كراء وإيجار المستودع/المحل',
    icon: Building2,
    color: 'text-amber-700',
    bg: 'bg-amber-100/70',
  },
  ads: {
    label: 'إعلانات ممولة (Meta, TikTok, Google)',
    icon: Megaphone,
    color: 'text-blue-700',
    bg: 'bg-blue-100/70',
  },
  packaging: {
    label: 'تغليف، كراتين وأكياس الشحن',
    icon: Box,
    color: 'text-emerald-700',
    bg: 'bg-emerald-100/70',
  },
  salaries: {
    label: 'رواتب موظفي التأكيد والتجهيز',
    icon: Users,
    color: 'text-purple-700',
    bg: 'bg-purple-100/70',
  },
  shipping_returns: {
    label: 'رسوم شحن المرتجعات والتلفيات',
    icon: Truck,
    color: 'text-rose-700',
    bg: 'bg-rose-100/70',
  },
  software: {
    label: 'اشتراكات برامج وأدوات ورسائل SMS',
    icon: Monitor,
    color: 'text-cyan-700',
    bg: 'bg-cyan-100/70',
  },
  utilities: {
    label: 'فواتير كهرباء وإنترنت وهاتف',
    icon: Zap,
    color: 'text-yellow-700',
    bg: 'bg-yellow-100/70',
  },
  other: {
    label: 'مصاريف ونثريات أخرى',
    icon: Tag,
    color: 'text-slate-700',
    bg: 'bg-slate-100',
  },
};

export const AdvancedFinancialStats: React.FC = () => {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getFinancialStats,
    settings,
    language,
    t,
  } = useStore();

  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Filter & Search expenses list
  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseTypeFilter, setExpenseTypeFilter] = useState<'all' | 'fixed' | 'variable'>('all');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState<string>('all');

  // Form State for Expense creation / editing
  const [formData, setFormData] = useState<{
    title: string;
    amount: string;
    type: ExpenseType;
    category: ExpenseCategory;
    recurrence: ExpenseRecurrence;
    date: string;
    notes: string;
  }>({
    title: '',
    amount: '',
    type: 'variable',
    category: 'ads',
    recurrence: 'one_time',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Calculate current period stats
  const currentStats = getFinancialStats(selectedPeriod);

  // Pre-calculate stats for all 4 periods for the comparative cards
  const statsToday = getFinancialStats('today');
  const statsWeek = getFinancialStats('week');
  const statsMonth = getFinancialStats('month');
  const statsYear = getFinancialStats('year');

  const periodOptions: Array<{
    id: 'today' | 'week' | 'month' | 'year';
    label: string;
    sublabel: string;
    stats: FinancialPeriodStats;
  }> = [
    {
      id: 'today',
      label: language === 'ar' ? 'اليوم' : 'Today',
      sublabel: language === 'ar' ? 'آخر 24 ساعة' : 'Last 24h',
      stats: statsToday,
    },
    {
      id: 'week',
      label: language === 'ar' ? 'هذا الأسبوع' : 'This Week',
      sublabel: language === 'ar' ? 'آخر 7 أيام' : 'Last 7 days',
      stats: statsWeek,
    },
    {
      id: 'month',
      label: language === 'ar' ? 'هذا الشهر' : 'This Month',
      sublabel: language === 'ar' ? 'أوت 2026' : 'August 2026',
      stats: statsMonth,
    },
    {
      id: 'year',
      label: language === 'ar' ? 'هذه السنة' : 'This Year',
      sublabel: language === 'ar' ? 'سنة 2026' : 'Year 2026',
      stats: statsYear,
    },
  ];

  // Handle open modal for create
  const handleOpenCreate = () => {
    setEditingExpenseId(null);
    setFormData({
      title: '',
      amount: '',
      type: 'variable',
      category: 'ads',
      recurrence: 'one_time',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsAddExpenseModalOpen(true);
  };

  // Handle open modal for edit
  const handleOpenEdit = (expense: StoreExpense) => {
    setEditingExpenseId(expense.id);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      type: expense.type,
      category: expense.category,
      recurrence: expense.recurrence,
      date: expense.date,
      notes: expense.notes || '',
    });
    setIsAddExpenseModalOpen(true);
  };

  // Handle submit form
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(formData.amount);
    if (!formData.title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    if (editingExpenseId) {
      updateExpense(editingExpenseId, {
        title: formData.title.trim(),
        amount: parsedAmount,
        type: formData.type,
        category: formData.category,
        recurrence: formData.recurrence,
        date: formData.date,
        notes: formData.notes.trim() || undefined,
      });
    } else {
      addExpense({
        title: formData.title.trim(),
        amount: parsedAmount,
        type: formData.type,
        category: formData.category,
        recurrence: formData.recurrence,
        date: formData.date,
        notes: formData.notes.trim() || undefined,
      });
    }

    setIsAddExpenseModalOpen(false);
  };

  // Filtered expenses list
  const filteredExpenses = expenses.filter((exp) => {
    if (expenseTypeFilter !== 'all' && exp.type !== expenseTypeFilter) return false;
    if (expenseCategoryFilter !== 'all' && exp.category !== expenseCategoryFilter) return false;
    if (expenseSearch.trim()) {
      const q = expenseSearch.toLowerCase();
      return (
        exp.title.toLowerCase().includes(q) ||
        (exp.notes && exp.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Calculate expense sums by category
  const categorySums = expenses.reduce<Record<string, number>>((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const totalExpensesSum = expenses.reduce((sum, e) => sum + e.amount, 0);
  const fixedExpensesSum = expenses.filter((e) => e.type === 'fixed').reduce((sum, e) => sum + e.amount, 0);
  const variableExpensesSum = expenses.filter((e) => e.type === 'variable').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div id="advanced-financial-stats" className="space-y-6">
      {/* Header with Period Switcher & Quick Add Button */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {language === 'ar' ? 'الإحصائيات المالية المتقدمة وصافي الأرباح' : 'Advanced Financial Stats & Net Profit'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'ar'
                  ? 'حساب تلقائي دقيق للأرباح بعد طرح تكلفة السلع، الشحن، والمصاريف الثابتة والمتغيرة'
                  : 'Automatic accurate net profit calculation deducting COGS, shipping, and fixed/variable expenses'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Add Expense Trigger */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة مصروف جديد' : 'Add Expense'}</span>
          </button>
        </div>
      </div>

      {/* 1. Profit Cards for (Today, This Week, This Month, This Year) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ar' ? 'بطاقات صافي الأرباح حسب الفترة الزمنية' : 'Net Profit Cards by Period'}</span>
          </h3>
          <span className="text-xs text-slate-400">
            {language === 'ar' ? 'اضغط على أي فترة لعرض تفكيك المعادلة التفصيلي' : 'Click a period to inspect details'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {periodOptions.map((item) => {
            const isSelected = selectedPeriod === item.id;
            const isProfitable = item.stats.netProfit >= 0;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedPeriod(item.id)}
                className={`relative rounded-3xl p-5 border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg ring-4 ring-emerald-500/20'
                    : 'bg-white text-slate-900 border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Period Badge Header */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className={`text-[11px] font-medium ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                    {item.sublabel}
                  </span>
                </div>

                {/* Net Profit Big Display */}
                <div className="space-y-1">
                  <span className={`text-xs font-semibold block ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {language === 'ar' ? 'صافي الربح الحقيقي' : 'Net Profit'}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`text-2xl font-black tracking-tight ${
                        isSelected
                          ? 'text-emerald-400'
                          : isProfitable
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {item.stats.netProfit.toLocaleString()}
                    </span>
                    <span className={`text-xs font-bold ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                      {settings.currency || 'د.ج'}
                    </span>
                  </div>
                </div>

                {/* Margin & Orders micro stats */}
                <div
                  className={`mt-4 pt-3 border-t grid grid-cols-2 gap-2 text-xs ${
                    isSelected ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      {language === 'ar' ? 'هامش الربح' : 'Margin'}
                    </span>
                    <span className={`font-bold ${item.stats.netMarginPercent >= 20 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {item.stats.netMarginPercent}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      {language === 'ar' ? 'الإيراد الإجمالي' : 'Revenue'}
                    </span>
                    <span className="font-bold">
                      {item.stats.grossRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-xs flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Automatic Formula & Deductions Breakdown for Selected Period */}
      <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-700/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-700/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {language === 'ar'
                  ? `المعادلة التلقائية لحساب الأرباح (${currentStats.periodLabel})`
                  : `Automatic Net Profit Formula (${currentStats.periodLabel})`}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'صافي الربح = الإيرادات - تكلفة شراء السلع - مصاريف الشحن - المصاريف الثابتة والمتغيرة'
                  : 'Net Profit = Gross Revenue - COGS - Shipping - Fixed & Variable Expenses'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">{language === 'ar' ? 'عدد الطلبات الناجحة:' : 'Orders:'}</span>
            <span className="font-bold text-emerald-400 font-mono">{currentStats.ordersCount}</span>
          </div>
        </div>

        {/* Dynamic Formula Interactive Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 items-center">
          {/* Step 1: Gross Revenue */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 hover:border-slate-600 transition-all">
            <div className="text-[11px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
              <span>+ الإيراد الإجمالي</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white">
              {currentStats.grossRevenue.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {currentStats.ordersCount} {language === 'ar' ? 'طلب مسجل' : 'orders'}
            </div>
          </div>

          {/* Minus Step 2: COGS */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 hover:border-slate-600 transition-all">
            <div className="text-[11px] font-bold text-rose-400 mb-1 flex items-center gap-1">
              <span>- تكلفة السلع (COGS)</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-rose-300">
              {currentStats.cogs.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {language === 'ar' ? 'سعر شراء المنتجات' : 'Product cost'}
            </div>
          </div>

          {/* Minus Step 3: Shipping */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 hover:border-slate-600 transition-all">
            <div className="text-[11px] font-bold text-amber-400 mb-1 flex items-center gap-1">
              <span>- رسوم التوصيل والشحن</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-300">
              {currentStats.shippingCost.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {language === 'ar' ? 'شحن لشركات التوصيل' : 'Delivery fees'}
            </div>
          </div>

          {/* Minus Step 4: Fixed & Variable Expenses */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 hover:border-slate-600 transition-all">
            <div className="text-[11px] font-bold text-cyan-400 mb-1 flex items-center gap-1">
              <span>- المصاريف التشغيلية</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-cyan-300">
              {(currentStats.fixedExpenses + currentStats.variableExpenses).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {currentStats.fixedExpenses.toLocaleString()} {language === 'ar' ? 'ثابت' : 'fix'} + {currentStats.variableExpenses.toLocaleString()} {language === 'ar' ? 'متغير' : 'var'}
            </div>
          </div>

          {/* Equal Step 5: NET PROFIT Result */}
          <div className="col-span-2 md:col-span-1 bg-emerald-950/60 rounded-2xl p-4 border border-emerald-500/40 shadow-lg shadow-emerald-950/40">
            <div className="text-[11px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
              <span>= صافي الربح الصافي</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-300">
              {currentStats.netProfit.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400/80 mt-1 font-bold">
              {language === 'ar' ? 'الهامش الصافي' : 'Margin'}: {currentStats.netMarginPercent}% | ROI: {currentStats.roiPercent}%
            </div>
          </div>
        </div>

        {/* Visual Progress Bar Ratio */}
        <div className="mt-6 pt-5 border-t border-slate-700/80 space-y-2">
          <div className="flex justify-between text-xs text-slate-300">
            <span>{language === 'ar' ? 'توزيع نسبة الإيرادات:' : 'Revenue Breakdown:'}</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span>تكلفة السلع ({currentStats.grossRevenue > 0 ? Math.round((currentStats.cogs / currentStats.grossRevenue) * 100) : 0}%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                <span>المصاريف ({currentStats.grossRevenue > 0 ? Math.round(((currentStats.fixedExpenses + currentStats.variableExpenses + currentStats.shippingCost) / currentStats.grossRevenue) * 100) : 0}%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span className="font-bold text-emerald-400">الربح الصافي ({currentStats.netMarginPercent}%)</span>
              </span>
            </div>
          </div>

          <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-700">
            <div
              style={{
                width: `${Math.min(
                  100,
                  currentStats.grossRevenue > 0 ? (currentStats.cogs / currentStats.grossRevenue) * 100 : 0
                )}%`,
              }}
              className="bg-rose-500 rounded-l-full transition-all duration-500"
              title="COGS"
            />
            <div
              style={{
                width: `${Math.min(
                  100,
                  currentStats.grossRevenue > 0
                    ? ((currentStats.fixedExpenses + currentStats.variableExpenses + currentStats.shippingCost) /
                        currentStats.grossRevenue) *
                        100
                    : 0
                )}%`,
              }}
              className="bg-cyan-500 transition-all duration-500"
              title="Expenses"
            />
            <div
              style={{
                width: `${Math.max(
                  0,
                  Math.min(100, currentStats.netMarginPercent)
                )}%`,
              }}
              className="bg-emerald-400 rounded-r-full transition-all duration-500"
              title="Net Profit"
            />
          </div>
        </div>
      </div>

      {/* 2. Dedicated Section for Managing Fixed & Variable Expenses */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        {/* Section Title & Summaries */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>{language === 'ar' ? 'سجل المصاريف الثابتة والمتغيرة' : 'Fixed & Variable Expenses Ledger'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'ar'
                ? 'إدخال وتتبع كافة المصاريف مثل إيجار المستودع، الإعلانات الممولة، مواد التغليف، والرواتب'
                : 'Track and manage rent, ad campaigns, custom packaging, team payroll, and operations'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة مصروف' : 'Add Expense'}</span>
            </button>
          </div>
        </div>

        {/* Expenses Summary Stats Top Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <div className="text-xs font-bold text-slate-500 mb-1">
              {language === 'ar' ? 'إجمالي المصاريف المسجلة' : 'Total Expenses'}
            </div>
            <div className="text-xl font-black text-slate-900">
              {totalExpensesSum.toLocaleString()}{' '}
              <span className="text-xs text-slate-500 font-normal">{settings.currency || 'د.ج'}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {expenses.length} {language === 'ar' ? 'بند مسجل' : 'items'}
            </div>
          </div>

          <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60">
            <div className="text-xs font-bold text-amber-800 mb-1 flex items-center justify-between">
              <span>{language === 'ar' ? 'المصاريف الثابتة (Fixed)' : 'Fixed Expenses'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                {language === 'ar' ? 'شهرية متكررة' : 'Recurring'}
              </span>
            </div>
            <div className="text-xl font-black text-amber-900">
              {fixedExpensesSum.toLocaleString()}{' '}
              <span className="text-xs text-amber-700 font-normal">{settings.currency || 'د.ج'}</span>
            </div>
            <div className="text-[10px] text-amber-700 mt-1">
              {language === 'ar' ? 'تشمل الكراء، الرواتب، الفواتير، والبرامج' : 'Rent, payroll, utilities, software'}
            </div>
          </div>

          <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-200/60">
            <div className="text-xs font-bold text-blue-800 mb-1 flex items-center justify-between">
              <span>{language === 'ar' ? 'المصاريف المتغيرة (Variable)' : 'Variable Expenses'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                {language === 'ar' ? 'حسب حجم النشاط' : 'Activity based'}
              </span>
            </div>
            <div className="text-xl font-black text-blue-900">
              {variableExpensesSum.toLocaleString()}{' '}
              <span className="text-xs text-blue-700 font-normal">{settings.currency || 'د.ج'}</span>
            </div>
            <div className="text-[10px] text-blue-700 mt-1">
              {language === 'ar' ? 'تشمل إعلانات فيسبوك وتيك توك والتغليف' : 'Meta/TikTok Ads, custom boxes'}
            </div>
          </div>
        </div>

        {/* Category Distribution Pills */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 block">
            {language === 'ar' ? 'توزيع المصاريف حسب الفئة:' : 'Expenses by Category:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORY_DETAILS).map(([catKey, catMeta]) => {
              const IconComp = catMeta.icon;
              const sum = categorySums[catKey] || 0;
              const isSelected = expenseCategoryFilter === catKey;

              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setExpenseCategoryFilter(isSelected ? 'all' : catKey)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : catMeta.color}`} />
                  <span>{catMeta.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {sum.toLocaleString()} د.ج
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'ar' ? 'بحث عن مصروف بالاسم أو الملاحظات...' : 'Search expenses...'}
              value={expenseSearch}
              onChange={(e) => setExpenseSearch(e.target.value)}
              className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Type selector toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setExpenseTypeFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  expenseTypeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {language === 'ar' ? 'الكل' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => setExpenseTypeFilter('fixed')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  expenseTypeFilter === 'fixed' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {language === 'ar' ? 'ثابتة' : 'Fixed'}
              </button>
              <button
                type="button"
                onClick={() => setExpenseTypeFilter('variable')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  expenseTypeFilter === 'variable' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {language === 'ar' ? 'متغيرة' : 'Variable'}
              </button>
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{language === 'ar' ? 'بند المصروف' : 'Title'}</th>
                  <th className="py-3 px-4">{language === 'ar' ? 'الفئة' : 'Category'}</th>
                  <th className="py-3 px-4">{language === 'ar' ? 'النوع والتكرار' : 'Type & Recurrence'}</th>
                  <th className="py-3 px-4">{language === 'ar' ? 'المبلغ' : 'Amount'}</th>
                  <th className="py-3 px-4">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th className="py-3 px-4 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-bold">{language === 'ar' ? 'لا توجد مصاريف مطابقة' : 'No expenses found'}</p>
                      <p className="text-[11px] mt-0.5">
                        {language === 'ar' ? 'قم بإضافة بند مصروف جديد لتظهر الحسابات تلقائياً' : 'Add a new expense item to track it automatically'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => {
                    const catMeta = CATEGORY_DETAILS[expense.category] || CATEGORY_DETAILS.other;
                    const IconComp = catMeta.icon;

                    return (
                      <tr key={expense.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-black text-slate-800">{expense.title}</div>
                          {expense.notes && (
                            <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              {expense.notes}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold ${catMeta.bg} ${catMeta.color}`}
                          >
                            <IconComp className="w-3 h-3" />
                            <span>{catMeta.label}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                expense.type === 'fixed'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {expense.type === 'fixed' ? 'ثابت' : 'متغير'}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {expense.recurrence === 'monthly'
                                ? 'شهرياً'
                                : expense.recurrence === 'yearly'
                                ? 'سنوياً'
                                : expense.recurrence === 'daily'
                                ? 'يومياً'
                                : 'مرة واحدة'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-black text-slate-900 font-mono text-sm">
                            {expense.amount.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-slate-400 mr-1">{settings.currency || 'د.ج'}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {expense.date}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(expense)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              title={language === 'ar' ? 'تعديل' : 'Edit'}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteExpense(expense.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              title={language === 'ar' ? 'حذف' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Expense Modal: Add / Edit */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingExpenseId
                      ? language === 'ar' ? 'تعديل بيانات المصروف' : 'Edit Expense'
                      : language === 'ar' ? 'إضافة مصروف جديد للمتجر' : 'Add New Expense'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'ar' ? 'سيتم خصم المبلغ تلقائياً من الأرباح الصافية' : 'Will be automatically deducted from Net Profit'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddExpenseModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="mt-4 space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'ar' ? 'عنوان أو وصف المصروف *' : 'Expense Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'ar' ? 'مثال: حملة إعلانات ممولة على فيسبوك وتيك توك' : 'e.g. Meta Ads campaign'}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Amount & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'ar' ? 'المبلغ بالدينار (د.ج) *' : 'Amount (DZD) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="مثال: 35000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-bold font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'ar' ? 'تاريخ الصرف *' : 'Expense Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Type (Fixed vs Variable) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {language === 'ar' ? 'نوع المصروف *' : 'Expense Type *'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setFormData({ ...formData, type: 'variable', recurrence: 'one_time' })}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 select-none ${
                      formData.type === 'variable'
                        ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.type === 'variable' ? 'border-blue-600' : 'border-slate-300'
                      }`}
                    >
                      {formData.type === 'variable' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">
                        {language === 'ar' ? 'مصروف متغير (Variable)' : 'Variable Expense'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {language === 'ar' ? 'مرتبط بحجم المبيعات (إعلانات، تغليف)' : 'Scale with orders volume'}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, type: 'fixed', recurrence: 'monthly' })}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 select-none ${
                      formData.type === 'fixed'
                        ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.type === 'fixed' ? 'border-amber-600' : 'border-slate-300'
                      }`}
                    >
                      {formData.type === 'fixed' && <div className="w-2 h-2 rounded-full bg-amber-600" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">
                        {language === 'ar' ? 'مصروف ثابت (Fixed)' : 'Fixed Expense'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {language === 'ar' ? 'مستمر شهرياً (كراء، رواتب، كهرباء)' : 'Recurring monthly costs'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'ar' ? 'تصنيف وفئة المصروف *' : 'Category *'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-bold bg-white"
                >
                  {Object.entries(CATEGORY_DETAILS).map(([key, meta]) => (
                    <option key={key} value={key}>
                      {meta.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recurrence (if fixed) */}
              {formData.type === 'fixed' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'ar' ? 'دورة تكرار المصروف الثابت' : 'Recurrence Cycle'}
                  </label>
                  <select
                    value={formData.recurrence}
                    onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as ExpenseRecurrence })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white font-medium"
                  >
                    <option value="monthly">{language === 'ar' ? 'شهرياً (Monthly - الافتراضي)' : 'Monthly (Default)'}</option>
                    <option value="yearly">{language === 'ar' ? 'سنوياً (Yearly)' : 'Yearly'}</option>
                    <option value="daily">{language === 'ar' ? 'يومياً (Daily)' : 'Daily'}</option>
                    <option value="one_time">{language === 'ar' ? 'دفعة لمرة واحدة (One-time)' : 'One-time'}</option>
                  </select>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'ar' ? 'ملاحظات وتفاصيل إضافية (اختياري)' : 'Notes / Remarks (Optional)'}
                </label>
                <textarea
                  rows={2}
                  placeholder={language === 'ar' ? 'أضف أي تفاصيل مثل رقم الفاتورة أو اسم المورد...' : 'Invoice number, vendor, etc.'}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-all"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-black shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingExpenseId ? (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (language === 'ar' ? 'تسجيل المصروف' : 'Add Expense')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
