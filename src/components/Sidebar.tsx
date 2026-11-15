import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { TabType, StoreCustomizerSection, StaffSection, ProductSection, ShippingSection } from '../types';
import { StoreSwitcher } from './StoreSwitcher';
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Package,
  Layers,
  Tag,
  Truck,
  Flame,
  Star,
  TicketPercent,
  Globe,
  BarChart3,
  Users,
  ShieldAlert,
  Puzzle,
  Settings,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  LogOut,
  Sparkles,
  Image as ImageIcon,
  LayoutTemplate,
  PhoneCall,
  HelpCircle,
  Info,
  ShoppingCart,
  UserPlus,
  UserCheck,
  PlusCircle,
  Boxes,
  Warehouse,
  PackagePlus,
  SlidersHorizontal,
  ClipboardList,
  MapPin,
  Crown,
  CreditCard,
  Zap,
  MousePointerClick,
  Eye,
} from 'lucide-react';

interface SidebarSubItem {
  id: string;
  title: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}

interface SidebarItem {
  id: TabType;
  title: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  subItems?: SidebarSubItem[];
  isSubmenuOpen?: boolean;
  onToggleSubmenu?: () => void;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose = () => {} }) => {
  const {
    currentTab,
    setCurrentTab,
    storeCustomizerSection,
    setStoreCustomizerSection,
    staffSection,
    setStaffSection,
    productSection,
    setProductSection,
    setViewMode,
    orders,
    products,
    reviews,
    blacklist,
    staff,
    settings,
    currentUser,
    abandonedCheckouts,
    subscription,
    getActivePlan,
    setIsSubscriptionModalOpen,
    isTabPermitted,
    logoutStaff,
    openAuthPortal,
    t,
  } = useStore();

  const [isStoreSubmenuOpen, setIsStoreSubmenuOpen] = useState(true);
  const [isProductsSubmenuOpen, setIsProductsSubmenuOpen] = useState(true);
  const [isStaffSubmenuOpen, setIsStaffSubmenuOpen] = useState(true);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'new' || o.status === 'pending'
  ).length;
  const pendingAbandonedCount = (abandonedCheckouts || []).filter((a) => a.status === 'abandoned').length;
  const unapprovedReviewsCount = reviews.filter((r) => !r.isApproved).length;
  const suspiciousCount = orders.filter((o) => o.isSuspicious).length + blacklist.length;
  const activeStaffCount = staff.filter((s) => s.isActive).length;

  const storeSubItems: SidebarSubItem[] = [
    {
      id: 'presets',
      title: t('store_customizer.presets', 'قوالب المتجر (Themes)'),
      icon: Sparkles,
      isActive: currentTab === 'store_customizer' && storeCustomizerSection === 'presets',
      onClick: () => {
        setCurrentTab('store_customizer');
        setStoreCustomizerSection('presets');
        if (window.innerWidth < 1024) onClose();
      },
    },
    {
      id: 'buttons',
      title: t('store_customizer.buttons', 'تخصيص الأزرار (Buttons)'),
      icon: MousePointerClick,
      isActive: currentTab === 'store_customizer' && storeCustomizerSection === 'buttons',
      onClick: () => {
        setCurrentTab('store_customizer');
        setStoreCustomizerSection('buttons');
        if (window.innerWidth < 1024) onClose();
      },
    },
    {
      id: 'live_preview',
      title: t('store_customizer.live_preview', 'المعاينة الحية التفاعلية'),
      icon: Eye,
      isActive: currentTab === 'store_customizer' && storeCustomizerSection === 'live_preview',
      onClick: () => {
        setCurrentTab('store_customizer');
        setStoreCustomizerSection('live_preview');
        if (window.innerWidth < 1024) onClose();
      },
    },
    {
      id: 'logo',
      title: t('store_customizer.logo', 'الشعار والهوية'),
      icon: ImageIcon,
      isActive: currentTab === 'store_customizer' && storeCustomizerSection === 'logo',
      onClick: () => {
        setCurrentTab('store_customizer');
        setStoreCustomizerSection('logo');
        if (window.innerWidth < 1024) onClose();
      },
    },
    {
      id: 'template',
      title: t('store_customizer.template', 'القالب'),
      icon: LayoutTemplate,
      isActive: currentTab === 'store_customizer' && storeCustomizerSection === 'template',
      onClick: () => {
        setCurrentTab('store_customizer');
        setStoreCustomizerSection('template');
        if (window.innerWidth < 1024) onClose();
      },
    },
    {
      id: 'homepage',
      title: t('store_customizer.homepage', 'الصفحة الرئيسية'),
      icon: Sparkles,
      isActive: currentTab === 'store_customizer' && storeCustomizerSection === 'homepage',
      onClick: () => {
        setCurrentTab('store_customizer');
        setStoreCustomizerSection('homepage');
        if (window.innerWidth < 1024) onClose();
      },
    },
    {
      id: 'contact',
      title: t('store_customizer.contact', 'معلومات الاتصال'),
      icon: PhoneCall,
      isActive: currentTab === 'store_customizer' && storeCustomizerSection === 'contact',
      onClick: () => {
        setCurrentTab('store_customizer');
        setStoreCustomizerSection('contact');
        if (window.innerWidth < 1024) onClose();
      },
    },
    {
      id: 'faq',
      title: t('store_customizer.faq', 'الأسئلة الشائعة'),
      icon: HelpCircle,
      isActive: currentTab === 'store_customizer' && storeCustomizerSection === 'faq',
      onClick: () => {
        setCurrentTab('store_customizer');
        setStoreCustomizerSection('faq');
        if (window.innerWidth < 1024) onClose();
      },
    },
    {
      id: 'about',
      title: t('store_customizer.about', 'حول المتجر'),
      icon: Info,
      isActive: currentTab === 'store_customizer' && storeCustomizerSection === 'about',
      onClick: () => {
        setCurrentTab('store_customizer');
        setStoreCustomizerSection('about');
        if (window.innerWidth < 1024) onClose();
      },
    },
    {
      id: 'checkout',
      title: t('store_customizer.checkout', 'إعدادات استمارة الطلب وسلة التسوق'),
      icon: ShoppingCart,
      isActive: currentTab === 'store_customizer' && storeCustomizerSection === 'checkout',
      onClick: () => {
        setCurrentTab('store_customizer');
        setStoreCustomizerSection('checkout');
        if (window.innerWidth < 1024) onClose();
      },
    },
  ];

  const productsSubItems: SidebarSubItem[] = [
    {
      id: 'products-all',
      title: t('products.all', 'الكل'),
      icon: Boxes,
      isActive: currentTab === 'products' && productSection === 'all',
      onClick: () => {
        setCurrentTab('products');
        setProductSection('all');
        if (window.innerWidth < 1024) onClose();
      },
    },
    {
      id: 'products-add',
      title: t('products.add', 'إضافة منتج'),
      icon: PlusCircle,
      isActive: currentTab === 'products' && productSection === 'add',
      onClick: () => {
        setCurrentTab('products');
        setProductSection('add');
        if (window.innerWidth < 1024) onClose();
      },
    },
    {
      id: 'products-inventory',
      title: t('products.inventory', 'مدير المخزون'),
      icon: Warehouse,
      isActive: currentTab === 'products' && productSection === 'inventory',
      onClick: () => {
        setCurrentTab('products');
        setProductSection('inventory');
        if (window.innerWidth < 1024) onClose();
      },
    },
  ];

  const staffSubItems: SidebarSubItem[] = [
    {
      id: 'staff-all',
      title: t('staff.all', 'الكل'),
      icon: UserCheck,
      isActive: currentTab === 'staff' && staffSection === 'all',
      onClick: () => {
        setCurrentTab('staff');
        setStaffSection('all');
        if (window.innerWidth < 1024) onClose();
      },
    },
    {
      id: 'staff-add',
      title: t('staff.add', 'إضافة عامل'),
      icon: UserPlus,
      isActive: currentTab === 'staff' && staffSection === 'add',
      onClick: () => {
        setCurrentTab('staff');
        setStaffSection('add');
        if (window.innerWidth < 1024) onClose();
      },
    },
  ];

  const menuSections: { group: string; items: SidebarItem[] }[] = [
    {
      group: t('tab.overview', 'الرئيسية والمتجر'),
      items: [
        { id: 'overview', title: t('tab.overview', 'الرئيسية'), icon: LayoutDashboard },
        {
          id: 'store_customizer',
          title: t('tab.store_customizer', 'المتجر والتصميم'),
          icon: Store,
          subItems: storeSubItems,
          isSubmenuOpen: isStoreSubmenuOpen,
          onToggleSubmenu: () => setIsStoreSubmenuOpen(!isStoreSubmenuOpen),
        },
      ],
    },
    {
      group: t('tab.orders', 'إدارة المبيعات والطلبات'),
      items: [
        {
          id: 'orders',
          title: t('tab.orders', 'الطلبات'),
          icon: ShoppingBag,
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
          badgeColor: 'bg-emerald-500',
        },
        {
          id: 'abandoned_checkouts',
          title: t('tab.abandoned_checkouts', 'السلات المتروكة'),
          icon: ShoppingCart,
          badge: pendingAbandonedCount > 0 ? pendingAbandonedCount : undefined,
          badgeColor: 'bg-amber-500',
        },
        {
          id: 'fraud_protection',
          title: t('tab.fraud_protection', 'حماية الطلبات والاحتيال'),
          icon: ShieldAlert,
          badge: suspiciousCount > 0 ? suspiciousCount : undefined,
          badgeColor: 'bg-rose-600',
        },
        {
          id: 'products',
          title: t('tab.products', 'المنتجات'),
          icon: Package,
          badge: products.length,
          badgeColor: 'bg-emerald-600',
          subItems: productsSubItems,
          isSubmenuOpen: isProductsSubmenuOpen,
          onToggleSubmenu: () => setIsProductsSubmenuOpen(!isProductsSubmenuOpen),
        },
        { id: 'categories', title: t('tab.categories', 'التصنيفات'), icon: Tag },
      ],
    },
    {
      group: t('tab.marketing', 'التسويق والنمو'),
      items: [
        { id: 'landing_pages', title: t('tab.landing_pages', 'صفحات الهبوط'), icon: Layers, badge: 'HOT', badgeColor: 'bg-rose-500' },
        { id: 'marketing', title: t('tab.marketing', 'الحملات الإعلانية'), icon: Flame },
        { id: 'promo_codes', title: t('tab.promo_codes', 'قسائم الخصم'), icon: TicketPercent },
        {
          id: 'reviews',
          title: t('tab.reviews', 'تقييمات العملاء'),
          icon: Star,
          badge: unapprovedReviewsCount > 0 ? unapprovedReviewsCount : undefined,
          badgeColor: 'bg-blue-500',
        },
        { id: 'shipping', title: t('tab.shipping', 'شركات التوصيل'), icon: Truck },
        { id: 'domains', title: t('tab.domains', 'الدومينات والربط'), icon: Globe },
        { id: 'analytics', title: t('tab.analytics', 'الإحصائيات والتقارير'), icon: BarChart3 },
      ],
    },
    {
      group: t('tab.staff', 'فريق العمل والإدارة'),
      items: [
        {
          id: 'staff',
          title: t('tab.staff', 'عُمال المتجر'),
          icon: Users,
          badge: staff.length,
          badgeColor: 'bg-slate-700',
          subItems: staffSubItems,
          isSubmenuOpen: isStaffSubmenuOpen,
          onToggleSubmenu: () => setIsStaffSubmenuOpen(!isStaffSubmenuOpen),
        },
        {
          id: 'blacklist',
          title: t('tab.blacklist', 'القوائم المحظورة والحماية'),
          icon: ShieldAlert,
          badge: suspiciousCount > 0 ? suspiciousCount : undefined,
          badgeColor: 'bg-rose-600',
        },
        { id: 'addons', title: t('tab.addons', 'التطبيقات والإضافات'), icon: Puzzle },
        {
          id: 'billing',
          title: t('tab.billing', 'الاشتراكات والباقات'),
          icon: Crown,
          badge: 'PRO',
          badgeColor: 'bg-amber-500',
        },
        { id: 'settings', title: t('tab.settings', 'إعدادات المتجر'), icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed top-0 bottom-0 right-0 z-50 w-64 bg-[#1E293B] text-slate-100 flex flex-col shadow-xl overflow-hidden transition-transform duration-300 ease-in-out border-l border-slate-800 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-emerald-500/20 text-base">
              {settings.storeName?.charAt(0) || 'M'}
            </div>
            <div>
              <span className="text-sm font-black text-white tracking-tight block leading-tight truncate max-w-[140px]">
                {settings.storeName || 'متجري الذكي'}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">لوحة التحكم والتجارة</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
            aria-label="إغلاق القائمة"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Store Switcher in Sidebar */}
        <div className="px-4 py-2.5 border-b border-slate-800/60">
          <StoreSwitcher variant="sidebar" />
        </div>

        {/* View Storefront Quick Button */}
        <div className="px-4 py-2.5 border-b border-slate-800/60">
          <button
            id="view-storefront-sidebar-btn"
            onClick={() => {
              setViewMode('storefront');
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 font-bold text-xs transition-all group"
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span>معاينة المتجر للزوار</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-75 group-hover:translate-x-[-2px] transition-transform" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar py-3">
          {/* Staff Role Warning Banner if restricted */}
          {currentUser && currentUser.role !== 'super_admin' && (
            <div className="mx-1 mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-snug">
              <span className="font-bold block text-amber-200">وضع العامل المقيد:</span>
              <span>مسموح لك فقط بالأقسام المرتبطة بـ ({currentUser.role === 'orders_manager' ? 'تأكيد وشحن الطلبات' : currentUser.role === 'inventory_manager' ? 'إدارة المنتجات والمخزون' : currentUser.role === 'marketer' ? 'التسويق وصفحات الهبوط' : 'خدمة العملاء'})</span>
            </div>
          )}

          {menuSections
            .map((section) => ({
              ...section,
              items: section.items.filter((item) => isTabPermitted(item.id)),
            }))
            .filter((section) => section.items.length > 0)
            .map((section, idx) => (
            <div key={idx} className="mb-3">
              <div className="text-gray-400 text-[10px] uppercase font-bold px-3 mb-1.5 mt-2">
                {section.group}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
                  const isSubOpen = item.isSubmenuOpen ?? false;

                  return (
                    <div key={item.id} className="space-y-0.5">
                      <button
                        id={`sidebar-tab-${item.id}`}
                        onClick={() => {
                          setCurrentTab(item.id);
                          if (hasSubItems && item.onToggleSubmenu && !isSubOpen) {
                            item.onToggleSubmenu();
                          }
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                          isActive
                            ? 'text-white bg-emerald-600 shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'opacity-75'}`} />
                          <span>{item.title}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {item.badge !== undefined && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${
                                item.badgeColor || 'bg-slate-700'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          {hasSubItems && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item.onToggleSubmenu) {
                                  item.onToggleSubmenu();
                                }
                              }}
                              className="p-1 hover:bg-slate-700/50 rounded"
                            >
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform ${
                                  isSubOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </span>
                          )}
                        </div>
                      </button>

                      {/* Submenu Items */}
                      {hasSubItems && isSubOpen && (
                        <div className="mr-3 pr-2 border-r-2 border-slate-700/80 space-y-0.5 py-1">
                          {item.subItems!.map((sub) => {
                            const SubIcon = sub.icon;

                            return (
                              <button
                                key={sub.id}
                                id={`sidebar-subitem-${sub.id}`}
                                onClick={sub.onClick}
                                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                                  sub.isActive
                                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                }`}
                              >
                                <SubIcon className="w-3.5 h-3.5 opacity-80 shrink-0" />
                                <span className="truncate">{sub.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Subscription Plan Quick Widget */}
        <div className="px-3 pb-2 pt-1">
          <div
            onClick={() => {
              setCurrentTab('billing');
              if (window.innerWidth < 1024) onClose();
            }}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-black text-indigo-200">
                  {getActivePlan().name}
                </span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                نشط
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{subscription.billingCycle === 'yearly' ? 'اشتراك سنوي' : 'اشتراك شهري'}</span>
              <span className="text-amber-300 group-hover:text-amber-200 font-bold flex items-center gap-0.5">
                <span>ترقية</span>
                <Zap className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        </div>

        {/* User Card Profile & Account Switcher */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80 relative">
          {showAccountDropdown && (
            <div className="absolute bottom-full right-3 left-3 mb-2 bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 text-right space-y-1">
              <button
                onClick={() => {
                  openAuthPortal('login');
                  setShowAccountDropdown(false);
                  if (window.innerWidth < 1024) onClose();
                }}
                className="w-full text-right p-2 rounded-xl text-xs text-emerald-300 hover:bg-slate-700/70 flex items-center gap-2 font-bold transition-all"
              >
                <Store className="w-3.5 h-3.5" />
                <span>بوابة متاجرك (تسجيل الدخول)</span>
              </button>

              <button
                id="sidebar-dropdown-logout-btn"
                onClick={() => {
                  logoutStaff();
                  setShowAccountDropdown(false);
                  if (window.innerWidth < 1024) onClose();
                }}
                className="w-full text-right p-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 font-bold transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between bg-slate-800/90 p-2.5 rounded-2xl border border-slate-700/60 shadow-md">
            <button
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="flex items-center gap-2.5 text-right flex-1 min-w-0 hover:opacity-90 transition-opacity"
              title="انقر لتبديل الحساب"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover border border-emerald-500/40 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-white leading-tight truncate">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                    currentUser.role === 'super_admin'
                      ? 'bg-rose-500/20 text-rose-300'
                      : currentUser.role === 'orders_manager'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : currentUser.role === 'inventory_manager'
                      ? 'bg-blue-500/20 text-blue-300'
                      : currentUser.role === 'marketer'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {currentUser.role === 'super_admin'
                      ? 'مدير عام'
                      : currentUser.role === 'orders_manager'
                      ? 'تأكيد الطلبات'
                      : currentUser.role === 'inventory_manager'
                      ? 'المخزون'
                      : currentUser.role === 'marketer'
                      ? 'التسويق'
                      : 'خدمة العملاء'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </button>

            <button
              id="sidebar-logout-btn"
              onClick={() => {
                logoutStaff();
                if (window.innerWidth < 1024) onClose();
              }}
              title="تسجيل الخروج"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/80 rounded-xl transition-colors shrink-0 mr-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
