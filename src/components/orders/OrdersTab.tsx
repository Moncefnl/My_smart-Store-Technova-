import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { WILAYAS_LIST, evaluateOrderFraudRisk } from '../../data/mockData';
import { AbandonedCheckoutsView } from './AbandonedCheckoutsView';
import { LiveTrackingModal } from './LiveTrackingModal';
import { FraudAuditModal } from './FraudAuditModal';
import {
  ShoppingBag,
  Search,
  Filter,
  Phone,
  PhoneCall,
  PhoneMissed,
  MessageCircle,
  Truck,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  AlertTriangle,
  FileSpreadsheet,
  Trash2,
  Eye,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  PackageCheck,
  Calendar,
  CalendarRange,
  MapPin,
  ChevronDown,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowUpDown,
  PhoneForwarded,
  FileText,
  Navigation,
  Ban
} from 'lucide-react';

interface StatusConfig {
  id: OrderStatus;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
}

export const STATUS_DEFINITIONS: Record<string, StatusConfig> = {
  new: {
    id: 'new',
    label: 'جديدة',
    shortLabel: 'جديدة',
    icon: Clock,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badgeBg: 'bg-amber-500 text-white',
  },
  no_answer_1: {
    id: 'no_answer_1',
    label: 'لم يرد على الاتصال 1',
    shortLabel: 'لم يرد 1',
    icon: PhoneMissed,
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    badgeBg: 'bg-orange-500 text-white',
  },
  no_answer_2: {
    id: 'no_answer_2',
    label: 'لم يرد على الاتصال 2',
    shortLabel: 'لم يرد 2',
    icon: PhoneMissed,
    bg: 'bg-amber-100/70',
    text: 'text-amber-800',
    border: 'border-amber-300',
    badgeBg: 'bg-amber-600 text-white',
  },
  no_answer_3: {
    id: 'no_answer_3',
    label: 'لم يرد على الاتصال 3',
    shortLabel: 'لم يرد 3',
    icon: PhoneMissed,
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    badgeBg: 'bg-rose-500 text-white',
  },
  confirmed: {
    id: 'confirmed',
    label: 'مؤكدة',
    shortLabel: 'مؤكدة',
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badgeBg: 'bg-emerald-600 text-white',
  },
  ready: {
    id: 'ready',
    label: 'جاهزة',
    shortLabel: 'جاهزة للتغليف',
    icon: PackageCheck,
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    badgeBg: 'bg-teal-600 text-white',
  },
  postponed: {
    id: 'postponed',
    label: 'مُؤجلة',
    shortLabel: 'مؤجلة',
    icon: Calendar,
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    badgeBg: 'bg-indigo-600 text-white',
  },
  in_transit: {
    id: 'in_transit',
    label: 'في الطريق للزبون',
    shortLabel: 'في الطريق',
    icon: Truck,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badgeBg: 'bg-blue-600 text-white',
  },
  delivered: {
    id: 'delivered',
    label: 'تم تسليمها للزبون',
    shortLabel: 'تم التسليم',
    icon: UserCheck,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    badgeBg: 'bg-purple-600 text-white',
  },
  cancelled_store: {
    id: 'cancelled_store',
    label: 'ملغاة من المتجر',
    shortLabel: 'ملغاة (متجر)',
    icon: XCircle,
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    badgeBg: 'bg-rose-600 text-white',
  },
  cancelled_customer: {
    id: 'cancelled_customer',
    label: 'ملغاة من الزبون',
    shortLabel: 'ملغاة (زبون)',
    icon: XCircle,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    badgeBg: 'bg-red-500 text-white',
  },
  returned: {
    id: 'returned',
    label: 'مُرجعة',
    shortLabel: 'مسترجعة',
    icon: RotateCcw,
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300',
    badgeBg: 'bg-slate-700 text-white',
  },
};

// Aliases for compatibility
export const normalizeStatus = (status: OrderStatus): string => {
  if (status === 'pending') return 'new';
  if (status === 'shipped') return 'in_transit';
  if (status === 'cancelled') return 'cancelled_store';
  return status;
};

export const OrdersTab: React.FC = () => {
  const {
    orders,
    products,
    updateOrderStatus,
    updateOrder,
    recordCallAttempt,
    deleteOrder,
    addToBlacklist,
    blacklist,
    settings,
    showNotification,
    trackingModalOrder,
    setTrackingModalOrder,
    fraudAuditOrder,
    setFraudAuditOrder,
    abandonedCheckouts,
  } = useStore();

  // Top Section Mode
  const [activeSection, setActiveSection] = useState<'orders' | 'abandoned' | 'fraud_audit'>('orders');

  // Filters State
  const [activeStatusTab, setActiveStatusTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Selection & Modals
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Status Summary Counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: orders.length,
      new: 0,
      no_answer_1: 0,
      no_answer_2: 0,
      no_answer_3: 0,
      confirmed: 0,
      ready: 0,
      postponed: 0,
      in_transit: 0,
      delivered: 0,
      cancelled_store: 0,
      cancelled_customer: 0,
      returned: 0,
    };

    orders.forEach((o) => {
      const normalized = normalizeStatus(o.status);
      if (counts[normalized] !== undefined) {
        counts[normalized] += 1;
      }
    });

    return counts;
  }, [orders]);

  // Filtered Orders Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const normalized = normalizeStatus(order.status);

      // Status Tab filter
      if (activeStatusTab !== 'all' && normalized !== activeStatusTab) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNumber = order.orderNumber.toLowerCase().includes(q);
        const matchesName = order.customerName.toLowerCase().includes(q);
        const matchesPhone = order.phone.includes(q);
        const matchesWilaya = order.wilaya.toLowerCase().includes(q);
        const matchesCommune = order.commune.toLowerCase().includes(q);
        const matchesAddress = order.address.toLowerCase().includes(q);
        if (!matchesNumber && !matchesName && !matchesPhone && !matchesWilaya && !matchesCommune && !matchesAddress) {
          return false;
        }
      }

      // Wilaya filter
      if (selectedWilaya !== 'all') {
        if (!order.wilaya.includes(selectedWilaya)) {
          return false;
        }
      }

      // Delivery Type filter
      if (selectedDeliveryType !== 'all') {
        if (order.shippingType !== selectedDeliveryType) {
          return false;
        }
      }

      // Product Name filter
      if (selectedProduct !== 'all') {
        const hasProduct = order.items.some(
          (item) => item.productId === selectedProduct || item.productName.includes(selectedProduct)
        );
        if (!hasProduct) {
          return false;
        }
      }

      // Date Range filters
      if (startDate) {
        const orderDate = order.createdAt.split(' ')[0]; // yyyy-mm-dd or similar
        if (orderDate < startDate) return false;
      }

      if (endDate) {
        const orderDate = order.createdAt.split(' ')[0];
        if (orderDate > endDate) return false;
      }

      return true;
    });
  }, [
    orders,
    activeStatusTab,
    searchQuery,
    selectedWilaya,
    selectedDeliveryType,
    selectedProduct,
    startDate,
    endDate,
  ]);

  const resetFilters = () => {
    setActiveStatusTab('all');
    setSearchQuery('');
    setSelectedWilaya('all');
    setSelectedDeliveryType('all');
    setStartDate('');
    setEndDate('');
    setSelectedProduct('all');
    showNotification('تمت إعادة تعيين كافة الفلاتر', 'info');
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleToggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (status: OrderStatus) => {
    if (selectedOrderIds.length === 0) return;
    selectedOrderIds.forEach((id) => updateOrderStatus(id, status));
    showNotification(`تم تحديث حالة ${selectedOrderIds.length} طلب بنجاح`, 'success');
    setSelectedOrderIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedOrderIds.length === 0) return;
    if (window.confirm(`هل أنت متأكد من حذف ${selectedOrderIds.length} طلب نهائياً؟`)) {
      selectedOrderIds.forEach((id) => deleteOrder(id));
      showNotification(`تم حذف ${selectedOrderIds.length} طلب`, 'info');
      setSelectedOrderIds([]);
    }
  };

  const handleExportCSV = () => {
    const headers =
      'رقم الطلب,اسم الزبون,الهاتف,الولاية,البلدية,العنوان,نوع التوصيل,تكلفة الشحن,المجموع الكلي,الحالة,محاولات الاتصال,تاريخ الإنشاء\n';
    const rows = filteredOrders
      .map((o) => {
        const norm = normalizeStatus(o.status);
        const statusLabel = STATUS_DEFINITIONS[norm]?.label || o.status;
        return `"${o.orderNumber}","${o.customerName}","${o.phone}","${o.wilaya}","${o.commune}","${o.address}","${
          o.shippingType === 'home' ? 'توصيل للمنزل' : 'استلام من المكتب'
        }","${o.shippingCost}","${o.totalAmount}","${statusLabel}","${o.callAttempts || 0}","${o.createdAt}"`;
      })
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showNotification('تم تصدير تقرير الطلبات بنجاح', 'success');
  };

  const orderedStatusKeys: OrderStatus[] = [
    'new',
    'no_answer_1',
    'no_answer_2',
    'no_answer_3',
    'confirmed',
    'ready',
    'postponed',
    'in_transit',
    'delivered',
    'cancelled_store',
    'cancelled_customer',
    'returned',
  ];

  return (
    <div id="orders-tab-content" className="space-y-6">
      {/* 0. Section Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSection === 'orders'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>إدارة وتأكيد الطلبات ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('abandoned')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSection === 'abandoned'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>السلات المتروكة ({abandonedCheckouts.length})</span>
            {abandonedCheckouts.filter((a) => a.status === 'abandoned').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveSection('fraud_audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSection === 'fraud_audit'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>حماية من الاحتيال والأرقام الوهمية</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (orders.length > 0) {
                setTrackingModalOrder(orders[0]);
              } else {
                showNotification('لا توجد طلبات لعرض التتبع', 'info');
              }
            }}
            className="px-3.5 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>نظام التتبع المباشر (API)</span>
          </button>
        </div>
      </div>

      {activeSection === 'abandoned' ? (
        <AbandonedCheckoutsView />
      ) : activeSection === 'fraud_audit' ? (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-slate-900 to-rose-950 text-white rounded-2xl border border-rose-900/40 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/20 text-rose-300 rounded-xl border border-rose-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold">مركز الذكاء الاصطناعي لكشف الطلبات الوهمية والاحتيال</h3>
                <p className="text-xs text-rose-200/80">
                  فحص تلقائي لأرقام الهواتف الجزائرية (Mobilis / Djezzy / Ooredoo)، مطابقة القائمة السوداء، واحتساب درجة المخاطرة.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Ban className="w-4 h-4 text-rose-600" />
              فحص طلباتك الحالية وتصنيف المخاطر:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.slice(0, 9).map((order) => {
                const fraud = evaluateOrderFraudRisk(order, blacklist, orders);
                return (
                  <div
                    key={order.id}
                    className={`p-4 rounded-xl border transition-all ${
                      fraud.level === 'high'
                        ? 'bg-rose-50/50 border-rose-200'
                        : fraud.level === 'medium'
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-emerald-50/30 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-xs text-slate-800">{order.orderNumber}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          fraud.level === 'high'
                            ? 'bg-rose-100 text-rose-800'
                            : fraud.level === 'medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        مخاطرة: {fraud.score}%
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800">{order.customerName}</p>
                    <p className="text-xs text-slate-500 font-mono">{order.phone} • {order.wilaya}</p>
                    <p className="text-xs text-slate-600 mt-2 font-medium">{fraud.recommendation}</p>

                    <button
                      onClick={() => setFraudAuditOrder(order)}
                      className="mt-3 w-full py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                      <span>عرض التدقيق الأمني المفصل</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 1. Header & Summary Action Bar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">إدارة وتأكيد طلبات الزبائن</h3>
              <p className="text-xs text-slate-500">
                متابعة دورة الطلبات الكاملة، تسجيل محاولات الاتصال، وتعيين بوليصات الشحن لـ 58 ولاية.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              showAdvancedFilters
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>فلاتر متقدمة</span>
            {(selectedWilaya !== 'all' ||
              selectedDeliveryType !== 'all' ||
              selectedProduct !== 'all' ||
              startDate ||
              endDate) && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>تصدير Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* 2. ORDER STATUS SUMMARY BUTTONS (ALL 12 DETAILED STATUSES) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>ملخص وحالات الطلب (اضغط للتصفية الفورية):</span>
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            إجمالي الطلبات المسجلة: {orders.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {/* ALL TAB */}
          <button
            onClick={() => setActiveStatusTab('all')}
            className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
              activeStatusTab === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold">كافة الطلبات</span>
              <ShoppingBag className="w-3.5 h-3.5 opacity-60" />
            </div>
            <div className="text-lg font-black">{statusCounts.all}</div>
          </button>

          {/* 12 SPECIFIC STATUS BUTTONS */}
          {orderedStatusKeys.map((key) => {
            const config = STATUS_DEFINITIONS[key];
            const Icon = config.icon;
            const count = statusCounts[key] || 0;
            const isActive = activeStatusTab === key;

            return (
              <button
                key={key}
                onClick={() => setActiveStatusTab(key)}
                className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between relative group ${
                  isActive
                    ? `${config.bg} ${config.border} border-2 shadow-sm ring-2 ring-slate-900/10`
                    : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`text-[11px] font-black truncate ${
                      isActive ? config.text : 'text-slate-700'
                    }`}
                    title={config.label}
                  >
                    {config.label}
                  </span>
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? config.text : 'text-slate-400'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-black px-2 py-0.5 rounded-md ${
                      count > 0 ? config.badgeBg : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                  {isActive && (
                    <span className="text-[9px] font-bold text-emerald-600">محدد ✓</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ADVANCED FILTERS BAR */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="بحث برقم الطلب، اسم العميل، رقم الهاتف، الولاية أو العنوان..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 rounded-xl pl-4 pr-10 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-3 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Detailed Filters Grid (Wilaya, Delivery Type, Product Name, Date Range, Status) */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 animate-in fade-in duration-200">
            {/* Filter 1: Order Status */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                حالة الطلب
              </label>
              <select
                value={activeStatusTab}
                onChange={(e) => setActiveStatusTab(e.target.value)}
                className="w-full bg-slate-50 text-xs text-slate-800 rounded-xl px-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">كافة الحالات ({orders.length})</option>
                {orderedStatusKeys.map((key) => (
                  <option key={key} value={key}>
                    {STATUS_DEFINITIONS[key].label} ({statusCounts[key] || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 2: Wilaya (58 Algerian Wilayas) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                الولاية (58 ولاية)
              </label>
              <select
                value={selectedWilaya}
                onChange={(e) => setSelectedWilaya(e.target.value)}
                className="w-full bg-slate-50 text-xs text-slate-800 rounded-xl px-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">كافة الولايات (58)</option>
                {WILAYAS_LIST.map((w) => (
                  <option key={w.code} value={w.nameAr}>
                    {w.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 3: Delivery Location */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                مكان التوصيل
              </label>
              <select
                value={selectedDeliveryType}
                onChange={(e) => setSelectedDeliveryType(e.target.value)}
                className="w-full bg-slate-50 text-xs text-slate-800 rounded-xl px-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">الكل (المنزل + المكتب)</option>
                <option value="home">توصيل للعنوان / المنزل</option>
                <option value="desk">استلام من المكتب (Stop Desk)</option>
              </select>
            </div>

            {/* Filter 4: Product Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                اسم المنتج
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-slate-50 text-xs text-slate-800 rounded-xl px-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">كافة المنتجات</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 5: Date Range (Start & End Date) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                تاريخ البداية والإنتهاء
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-1/2 bg-slate-50 text-[10px] text-slate-800 rounded-lg p-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  title="تاريخ البداية"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-1/2 bg-slate-50 text-[10px] text-slate-800 rounded-lg p-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  title="تاريخ الإنتهاء"
                />
              </div>
            </div>
          </div>
        )}

        {/* Filter Summary & Quick Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-2">
            <span>النتائج المعروضة:</span>
            <strong className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
              {filteredOrders.length} طلب
            </strong>
          </div>

          {(activeStatusTab !== 'all' ||
            searchQuery ||
            selectedWilaya !== 'all' ||
            selectedDeliveryType !== 'all' ||
            selectedProduct !== 'all' ||
            startDate ||
            endDate) && (
            <button
              onClick={resetFilters}
              className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة تعيين الفلاتر</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. BULK ACTIONS BAR (When orders are selected) */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 font-bold text-xs">
            <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-md">
              {selectedOrderIds.length}
            </span>
            <span>طلبات محددة</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400">تغيير الحالة المجمعة إلى:</span>
            <button
              onClick={() => handleBulkStatusChange('confirmed')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تأكيد الكل</span>
            </button>
            <button
              onClick={() => handleBulkStatusChange('ready')}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>جاهزة للشحن</span>
            </button>
            <button
              onClick={() => handleBulkStatusChange('in_transit')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>في الطريق</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف المحدد</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. ORDERS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 text-[11px] font-black uppercase">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredOrders.length > 0 &&
                      selectedOrderIds.length === filteredOrders.length
                    }
                    onChange={handleSelectAll}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="p-4">رقم الطلب والتاريخ</th>
                <th className="p-4">الزبون والهاتف ومحاولات الاتصال</th>
                <th className="p-4">الولاية ونوع التوصيل</th>
                <th className="p-4">المنتجات والكمية</th>
                <th className="p-4">المجموع الكلي</th>
                <th className="p-4">حالة الطلب الحالية</th>
                <th className="p-4 text-center">الإجراءات السريعة</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <ShoppingBag className="w-10 h-10 text-slate-300 stroke-1" />
                      <p className="font-bold text-sm text-slate-600">
                        لا توجد طلبات مطابقة لمعايير البحث الحالية
                      </p>
                      <p className="text-xs text-slate-400">
                        جرّب تغيير فلاتر البحث أو إعادة تعيين الفلاتر
                      </p>
                      <button
                        onClick={resetFilters}
                        className="mt-2 px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                      >
                        عرض كافة الطلبات
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const norm = normalizeStatus(order.status);
                  const statusInfo = STATUS_DEFINITIONS[norm] || STATUS_DEFINITIONS.new;
                  const isBlocked = blacklist.some(
                    (b) => b.type === 'phone' && b.value === order.phone.replace(/\s+/g, '')
                  );
                  const isSelected = selectedOrderIds.includes(order.id);

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-50/90 transition-colors ${
                        isSelected ? 'bg-emerald-50/40' : ''
                      } ${order.isSuspicious || isBlocked ? 'bg-rose-50/40' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOrder(order.id)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      {/* Order Number & Date */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-slate-900 text-xs">
                            {order.orderNumber}
                          </span>
                          {(order.isSuspicious || isBlocked) && (
                            <span
                              title="عميل مشبوه أو مسجل في القائمة السوداء"
                              className="text-rose-600 bg-rose-100 p-0.5 rounded-md"
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-300" />
                          <span>{order.createdAt}</span>
                        </div>
                      </td>

                      {/* Customer & Call Tracking */}
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{order.customerName}</div>
                        <div className="flex items-center gap-2 mt-1" dir="ltr">
                          <a
                            href={`tel:${order.phone}`}
                            className="text-slate-600 hover:text-emerald-600 font-mono text-xs flex items-center gap-1 font-semibold"
                          >
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{order.phone}</span>
                          </a>

                          {/* Quick Call Log Button */}
                          <button
                            onClick={() => recordCallAttempt(order.id)}
                            title="تسجيل محاولة اتصال جديدة وتحديث الحالة"
                            className="p-1 rounded-md bg-orange-50 text-orange-600 hover:bg-orange-100 text-[10px] font-bold flex items-center gap-1 border border-orange-200"
                          >
                            <PhoneCall className="w-2.5 h-2.5" />
                            <span>+1 اتصال ({order.callAttempts || 0})</span>
                          </button>
                        </div>
                      </td>

                      {/* Wilaya & Shipping Type */}
                      <td className="p-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{order.wilaya}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <span
                            className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                              order.shippingType === 'home'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {order.shippingType === 'home' ? 'توصيل للمنزل' : 'مكتب الشحن'}
                          </span>
                          <span>• {order.shippingCost} د.ج</span>
                        </div>
                      </td>

                      {/* Products Summary */}
                      <td className="p-4">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-6 h-6 rounded-md object-cover border border-slate-200"
                              />
                              <span className="truncate max-w-[150px] text-slate-700 font-medium">
                                {item.productName} ({item.quantity}x)
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="p-4">
                        <div className="font-black text-slate-900 text-sm">
                          {order.totalAmount.toLocaleString()} {settings.currency}
                        </div>
                        {order.discountAmount > 0 && (
                          <div className="text-[10px] text-emerald-600 font-bold">
                            خصم: -{order.discountAmount} د.ج
                          </div>
                        )}
                      </td>

                      {/* Order Status Badge & Inline Selector */}
                      <td className="p-4">
                        <div className="relative group">
                          <select
                            value={norm}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value as OrderStatus)
                            }
                            className={`px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer appearance-none pr-6 pl-2.5 transition-all ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                          >
                            {orderedStatusKeys.map((st) => (
                              <option key={st} value={st}>
                                {STATUS_DEFINITIONS[st].label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3 h-3 absolute left-2 top-2.5 pointer-events-none text-slate-400" />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Live Tracking button */}
                          <button
                            onClick={() => setTrackingModalOrder(order)}
                            className="p-1.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                            title="تتبع مباشر للشحنة (Live Tracking)"
                          >
                            <Truck className="w-4 h-4" />
                          </button>

                          {/* Fraud Audit button */}
                          <button
                            onClick={() => setFraudAuditOrder(order)}
                            className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="فحص أمان الزبون ومكافحة الاحتيال"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="عرض تفاصيل الطلب كاملة"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsInvoiceModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="طباعة بوليصة الشحن والفاتورة"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`هل تريد حذف الطلب ${order.orderNumber}؟`)) {
                                deleteOrder(order.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* 6. ORDER DETAIL MODAL WITH FULL 12-STATUS CHANGER */}
      {selectedOrder && !isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-slate-900 text-base">
                    تفاصيل الطلب {selectedOrder.orderNumber}
                  </h4>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      STATUS_DEFINITIONS[normalizeStatus(selectedOrder.status)]?.bg
                    } ${STATUS_DEFINITIONS[normalizeStatus(selectedOrder.status)]?.text} ${
                      STATUS_DEFINITIONS[normalizeStatus(selectedOrder.status)]?.border
                    }`}
                  >
                    {STATUS_DEFINITIONS[normalizeStatus(selectedOrder.status)]?.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  تم الإنشاء في: {selectedOrder.createdAt} • محاولات الاتصال:{' '}
                  {selectedOrder.callAttempts || 0}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Customer Contact & Quick Actions */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    {selectedOrder.customerName}
                  </div>
                  <div className="text-xs text-slate-500 font-mono" dir="ltr">
                    {selectedOrder.phone}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedOrder.phone}`}
                    onClick={() => recordCallAttempt(selectedOrder.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>اتصال بالزبون</span>
                  </a>

                  <a
                    href={`https://wa.me/213${selectedOrder.phone.replace(/^0/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>واتساب</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-2 border-t border-slate-200/60">
                <div>
                  <strong>الولاية والبلدية:</strong> {selectedOrder.wilaya} - {selectedOrder.commune}
                </div>
                <div>
                  <strong>مكان التوصيل:</strong>{' '}
                  {selectedOrder.shippingType === 'home'
                    ? 'توصيل للمنزل / العنوان'
                    : 'استلام من مكتب الشحن'}
                </div>
                <div className="sm:col-span-2">
                  <strong>العنوان بالتفصيل:</strong> {selectedOrder.address}
                </div>
                {selectedOrder.notes && (
                  <div className="sm:col-span-2 bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl">
                    <strong>ملاحظات العميل:</strong> {selectedOrder.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Products List */}
            <div>
              <h5 className="font-bold text-xs text-slate-800 mb-2">المنتجات المطلوبة:</h5>
              <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 flex items-center justify-between bg-white text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{item.productName}</div>
                        {item.variantName && (
                          <div className="text-slate-500 text-[11px]">
                            الخيار: {item.variantName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-left font-black text-slate-900">
                      {item.quantity} × {item.unitPrice.toLocaleString()} {settings.currency}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>سعر المنتجات:</span>
                <span>
                  {selectedOrder.items
                    .reduce((acc, i) => acc + i.quantity * i.unitPrice, 0)
                    .toLocaleString()}{' '}
                  د.ج
                </span>
              </div>
              <div className="flex justify-between">
                <span>تكلفة الشحن ({selectedOrder.wilaya}):</span>
                <span>{selectedOrder.shippingCost} د.ج</span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>الخصم المطبق:</span>
                  <span>-{selectedOrder.discountAmount} د.ج</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-slate-900 border-t border-slate-200 pt-2">
                <span>المجموع المطلوب تحصيله (COD):</span>
                <span>
                  {selectedOrder.totalAmount.toLocaleString()} {settings.currency}
                </span>
              </div>
            </div>

            {/* All 12 Status Buttons Grid for Fast Updating */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-800">
                تحديث وتغيير حالة الطلب (12 حالة):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {orderedStatusKeys.map((stKey) => {
                  const conf = STATUS_DEFINITIONS[stKey];
                  const Icon = conf.icon;
                  const isCurrent = normalizeStatus(selectedOrder.status) === stKey;

                  return (
                    <button
                      key={stKey}
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, stKey);
                        setSelectedOrder({ ...selectedOrder, status: stKey });
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-start gap-2 ${
                        isCurrent
                          ? `${conf.bg} ${conf.border} ${conf.text} ring-2 ring-slate-900/20 border-2`
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{conf.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-2">
              <button
                onClick={() => {
                  addToBlacklist({
                    type: 'phone',
                    value: selectedOrder.phone,
                    customerName: selectedOrder.customerName,
                    reason: 'طلب ملغى / رقم وهمي أو رفض متكرر للاستلام',
                  });
                  setSelectedOrder(null);
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>حظر هذا الزبون (إضافة للقائمة السوداء)</span>
              </button>

              <button
                onClick={() => setIsInvoiceModalOpen(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة بوليصة الشحن والفاتورة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. PRINTABLE SHIPPING LABEL & INVOICE MODAL */}
      {selectedOrder && isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-800 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-600" />
                <h4 className="font-black text-sm">بوليصة شحن وتوصيل الطلب</h4>
              </div>
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Printable Frame */}
            <div
              id="printable-shipping-label"
              className="border-2 border-dashed border-slate-300 rounded-2xl p-4 space-y-3 bg-slate-50"
            >
              {/* Header */}
              <div className="text-center border-b border-slate-200 pb-2">
                <div className="font-black text-base text-slate-900">{settings.storeName}</div>
                <div className="text-[10px] text-slate-500">هاتف المتجر: {settings.phone}</div>
                <div className="font-mono font-black text-sm text-slate-900 mt-1 bg-white inline-block px-3 py-1 rounded-lg border border-slate-200">
                  {selectedOrder.orderNumber}
                </div>
              </div>

              {/* Recipient Details */}
              <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                  بيانات المستلم:
                </div>
                <div>
                  <strong>اسم الزبون:</strong> {selectedOrder.customerName}
                </div>
                <div>
                  <strong>رقم الهاتف:</strong> {selectedOrder.phone}
                </div>
                <div>
                  <strong>الولاية:</strong> {selectedOrder.wilaya}
                </div>
                <div>
                  <strong>البلدية والعنوان:</strong> {selectedOrder.commune} - {selectedOrder.address}
                </div>
                <div>
                  <strong>نوع التوصيل:</strong>{' '}
                  {selectedOrder.shippingType === 'home'
                    ? 'توصيل للمنزل'
                    : 'استلام من مكتب الشحن (Stop Desk)'}
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="border-t border-slate-200 pt-2 space-y-1.5">
                {selectedOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-slate-800 font-medium">
                    <span>
                      {i.productName} ({i.quantity}x)
                    </span>
                    <span className="font-bold">
                      {(i.quantity * i.unitPrice).toLocaleString()} د.ج
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-slate-500">
                  <span>رسوم التوصيل:</span>
                  <span>{selectedOrder.shippingCost} د.ج</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 border-t border-slate-300 pt-2">
                  <span>المبلغ المطلوب تحصيله (COD):</span>
                  <span className="text-emerald-700">
                    {selectedOrder.totalAmount.toLocaleString()} د.ج
                  </span>
                </div>
              </div>

              {/* Barcode Mock */}
              <div className="text-center pt-2">
                <div className="font-mono text-[10px] tracking-widest text-slate-400">
                  ||||| |||||| |||| | |||||||| ||||||||||
                </div>
                <div className="text-[9px] text-slate-400">
                  كود التتبع: {selectedOrder.trackingNumber || `TRACK-${selectedOrder.orderNumber}`}
                </div>
              </div>
            </div>

            {/* Print Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة فورية</span>
              </button>
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Modals */}
      <LiveTrackingModal
        order={trackingModalOrder}
        onClose={() => setTrackingModalOrder(null)}
      />

      <FraudAuditModal
        order={fraudAuditOrder}
        onClose={() => setFraudAuditOrder(null)}
      />
    </div>
  );
};
