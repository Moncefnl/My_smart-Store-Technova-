import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { StoreSwitcher } from './StoreSwitcher';
import {
  Menu,
  Search,
  Bell,
  Plus,
  ExternalLink,
  ShoppingBag,
  AlertTriangle,
  Star,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  TicketPercent,
  UserCheck,
  LogOut,
  ChevronDown,
  Shield,
  KeyRound,
  Store,
  Clock,
  Zap,
} from 'lucide-react';

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  overview: { title: 'الرئيسية', subtitle: 'نظرة عامة على الأداء والمبيعات اللحظية' },
  store_customizer: { title: 'المتجر والتصميم', subtitle: 'تخصيص الواجهة والشعار وألوان المتجر' },
  orders: { title: 'إدارة الطلبات', subtitle: 'متابعة الطلبيات، تأكيد الشحن، وطباعة الفواتير' },
  abandoned_checkouts: { title: 'السلات المتروكة والاسترجاع', subtitle: 'استرجاع الطلبات غير المكتملة عبر واتساب ومضاعفة المبيعات' },
  fraud_protection: { title: 'حماية الطلبات ومكافحة الاحتيال', subtitle: 'تدقيق أرقام الهواتف والعناوين الوهمية وتفادي خسائر الروتور' },
  products: { title: 'المنتجات والمخزون', subtitle: 'إدارة كتالوج المنتجات، الأسعار، والمتغيرات' },
  landing_pages: { title: 'صفحات الهبوط المخصصة', subtitle: 'منشئ صفحات بيع فردية عالية التحويل' },
  categories: { title: 'التصنيف والأقسام', subtitle: 'تنظيم المنتجات في فئات رئيسية وفرعية' },
  shipping: { title: 'شركات الشحن والتوصيل', subtitle: 'ضبط تسعيرة الـ 58 ولاية والتكامل اللوجستي' },
  marketing: { title: 'أدوات التسويق والبكسل', subtitle: 'ربط بكسل تيك توك، فيسبوك، وجوجل تاج' },
  reviews: { title: 'آراء وتقييمات الزبائن', subtitle: 'مراجعة آراء العملاء وإضافة شهادات تجربة' },
  promo_codes: { title: 'الرموز الترويجية والكوبونات', subtitle: 'إنشاء قسائم تخفيض بنسبة أو مبلغ ثابت' },
  domains: { title: 'الدومينات والربط المخصص', subtitle: 'ربط نطاق متجرك الخاص وتفعيل شهادة SSL' },
  analytics: { title: 'التقارير والإحصائيات', subtitle: 'تحليل دقيق للمبيعات، الأرباح، وسلوك الزوار' },
  staff: { title: 'عُمّال المتجر والصلاحيات', subtitle: 'إدارة فريق العمل وتحديد الصلاحيات' },
  blacklist: { title: 'القوائم السوداء والحماية', subtitle: 'حظر الأرقام والعناوين المشبوهة لمنع الخسائر' },
  addons: { title: 'الإضافات والميزات المدفوعة', subtitle: 'سوق التطبيقات لتوسيع إمكانيات متجرك' },
  billing: { title: 'الاشتراكات والفواتير', subtitle: 'إدارة الباقات، ترقية الحساب، والوصولات الإلكترونية' },
  settings: { title: 'الإعدادات والاشتراك', subtitle: 'بيانات المتجر، بوابات الدفع، وخطة الاشتراك' },
};

export const Header: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick = () => {} }) => {
  const {
    currentTab,
    setCurrentTab,
    setViewMode,
    globalSearch,
    setGlobalSearch,
    orders,
    reviews,
    blacklist,
    abandonedCheckouts,
    notification,
    currentUser,
    logoutStaff,
    isTabPermitted,
    setIsCreateStoreModalOpen,
    isSessionManagerModalOpen,
    setIsSessionManagerModalOpen,
    openAuthPortal,
    activeSessions,
    subscription,
    isTrialActive,
    isTrialExpired,
    trialTimeRemaining,
    setIsSubscriptionModalOpen,
    t
  } = useStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentTabInfo = TAB_TITLES[currentTab] || { title: t('tab.overview', 'ملخص الإحصائيات'), subtitle: '' };

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const unapprovedReviews = reviews.filter((r) => !r.isApproved);
  const suspiciousOrders = orders.filter((o) => o.isSuspicious);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-30 transition-all">
      {/* Right side: Mobile Menu + Page Titles */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-sidebar-toggle"
          onClick={onMenuClick}
          className="p-2 -mr-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 lg:hidden focus:outline-none"
          aria-label="فتح القائمة الجانبية"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            {currentTabInfo.title}
          </h1>
        </div>
      </div>

      {/* Center & Left Side: Search + Notifications + Separator + Quick Add Button + Storefront Link */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Bar */}
        <div className="relative hidden md:block">
          <input
            id="admin-global-search-input"
            type="text"
            placeholder="بحث عن طلب، عميل، منتج..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="bg-gray-100 border-none rounded-full px-4 py-2 text-sm w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-right placeholder-gray-400"
          />
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            id="admin-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors"
            aria-label="التنبيهات"
          >
            <Bell className="w-5 h-5" />
            {(pendingOrders.length > 0 || suspiciousOrders.length > 0) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150 text-right"
              onClick={() => setShowNotifications(false)}
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-800">التنبيهات المباشرة</span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">
                  محدث لحظياً
                </span>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {pendingOrders.slice(0, 3).map((o) => (
                  <div
                    key={o.id}
                    onClick={() => setCurrentTab('orders')}
                    className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100/70 cursor-pointer transition-colors flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-orange-200 text-orange-800 mt-0.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-800">
                        طلب جديد قيد التأكيد {o.orderNumber}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {o.customerName} • {o.totalAmount.toLocaleString()} دج
                      </p>
                    </div>
                  </div>
                ))}

                {suspiciousOrders.map((o) => (
                  <div
                    key={`sus-${o.id}`}
                    onClick={() => setCurrentTab('fraud_protection')}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100/80 cursor-pointer transition-colors flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-red-200 text-red-800 mt-0.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-red-800">
                        تنبيه احتيال: طلب مشبوه ({o.phone})
                      </p>
                      <p className="text-[11px] text-red-600">
                        الرقم أو العنوان يتطلب تدقيق ومراجعة
                      </p>
                    </div>
                  </div>
                ))}

                {(abandonedCheckouts || []).filter((a) => a.status === 'abandoned').length > 0 && (
                  <div
                    onClick={() => setCurrentTab('abandoned_checkouts')}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 cursor-pointer transition-colors flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-200 text-amber-800 mt-0.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-amber-900">
                        {(abandonedCheckouts || []).filter((a) => a.status === 'abandoned').length} سلات متروكة بانتظار الاسترجاع
                      </p>
                      <p className="text-[11px] text-amber-700">تواصل بالواتساب لاسترجاع المبيعات</p>
                    </div>
                  </div>
                )}

                {unapprovedReviews.length > 0 && (
                  <div
                    onClick={() => setCurrentTab('reviews')}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100/80 cursor-pointer transition-colors flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-200 text-blue-800 mt-0.5">
                      <Star className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-blue-900">
                        {unapprovedReviews.length} تقييم جديد بانتظار الموافقة
                      </p>
                      <p className="text-[11px] text-blue-600">انقر للمراجعة والنشر</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 1-Day Trial Status Badge in Header */}
        {(subscription.status === 'trial' || subscription.isTrial === true || (subscription.status === 'expired' && subscription.isTrial === true)) && (
          <button
            id="header-trial-badge-btn"
            onClick={() => setIsSubscriptionModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isTrialExpired
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
            }`}
            title="انقر لترقية الباقة وسداد الاشتراك عبر CCP أو بريدي موب"
          >
            <Clock className={`w-3.5 h-3.5 ${isTrialExpired ? 'text-rose-600' : 'text-amber-600 animate-spin-slow'}`} />
            <span className="hidden md:inline">
              {isTrialExpired ? 'انتهت التجربة: متجرك مقيد' : 'فترة تجريبية:'}
            </span>
            <span className="font-mono font-black">
              {isTrialExpired ? '00:00:00' : trialTimeRemaining.formatted}
            </span>
            <span className="hidden xl:inline text-[10px] px-1.5 py-0.5 rounded bg-amber-200/60 text-amber-900">
              Starter
            </span>
            <Zap className="w-3 h-3 text-amber-600" />
          </button>
        )}

        {/* Multi-Store Switcher */}
        <StoreSwitcher variant="header" />

        {/* Quick Add Store Button */}
        <button
          id="header-create-store-quick-btn"
          onClick={() => setIsCreateStoreModalOpen(true)}
          className="hidden lg:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
          title="إنشاء متجر جديد"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>متجر جديد</span>
        </button>

        {/* Language Switcher */}
        <LanguageSwitcher variant="dropdown" />

        <div className="h-8 w-[1px] bg-gray-200 mx-1 sm:mx-2 hidden sm:block"></div>

        {/* Primary Action Button (If permitted) */}
        {isTabPermitted('products') && (
          <button
            id="header-add-product-btn"
            onClick={() => setCurrentTab('products')}
            className="bg-emerald-600 text-white text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl font-medium hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t('action.add')} {t('tab.products')}</span>
          </button>
        )}

        {/* View Storefront Link */}
        <button
          id="header-view-storefront-btn"
          onClick={() => setViewMode('storefront')}
          className="hidden sm:flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('app.storefront')}</span>
        </button>

        {/* Sessions & Security Quick Button */}
        <button
          id="header-sessions-security-btn"
          onClick={() => setIsSessionManagerModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-xl text-xs font-bold transition-all"
          title="إدارة الجلسات والأجهزة المفتوحة"
        >
          <Shield className="w-3.5 h-3.5 text-indigo-600" />
          <span>الجلسات ({activeSessions.length})</span>
        </button>

        {/* Header User / Staff Quick Menu */}
        <div className="relative">
          <button
            id="header-user-menu-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-right"
          >
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-lg object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                {currentUser?.name.charAt(0) || 'م'}
              </div>
            )}
            <div className="hidden xl:block text-right">
              <p className="text-xs font-bold text-slate-800 leading-none truncate max-w-[110px]">{currentUser?.name}</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                {currentUser?.role === 'super_admin' ? 'المدير العام' : currentUser?.role === 'orders_manager' ? 'مسؤول الطلبات' : currentUser?.role === 'inventory_manager' ? 'مسؤول المخزون' : currentUser?.role === 'marketer' ? 'التسويق' : 'خدمة العملاء'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div
              className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 z-50 text-right space-y-1.5 animate-in fade-in zoom-in-95 duration-150"
              onClick={() => setShowUserMenu(false)}
            >
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-xl object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                    {currentUser?.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-slate-800 truncate">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                    {currentUser?.role === 'super_admin' ? 'صلاحية كاملة (Super Admin)' : `دور: ${currentUser?.role}`}
                  </span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-100 flex flex-col gap-1">
                <button
                  onClick={() => setIsSessionManagerModalOpen(true)}
                  className="w-full text-right px-3 py-2 rounded-xl text-xs text-indigo-700 hover:bg-indigo-50 font-bold flex items-center gap-2 transition-colors"
                  id="dropdown-session-manager-btn"
                >
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>إدارة الجلسات والأجهزة النشطة ({activeSessions.length})</span>
                </button>

                <button
                  onClick={() => openAuthPortal('login')}
                  className="w-full text-right px-3 py-2 rounded-xl text-xs text-emerald-700 hover:bg-emerald-50 font-bold flex items-center gap-2 transition-colors"
                  id="dropdown-merchant-stores-portal-btn"
                >
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span>بوابة متاجرك (الدخول والحذف)</span>
                </button>

                <button
                  onClick={logoutStaff}
                  className="w-full text-right px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Toast Notification */}
      {notification && (
        <div
          id="system-notification-toast"
          className={`fixed bottom-5 left-5 z-50 max-w-sm px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border transition-all animate-in slide-in-from-bottom-5 duration-300 ${
            notification.type === 'success'
              ? 'bg-slate-900 text-white border-slate-700'
              : notification.type === 'error'
              ? 'bg-red-950 text-red-100 border-red-800'
              : 'bg-slate-900 text-slate-100 border-slate-800'
          }`}
        >
          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${notification.type === 'success' ? 'text-green-400' : 'text-red-400'}`} />
          <p className="text-xs font-medium">{notification.message}</p>
        </div>
      )}
    </header>
  );
};
