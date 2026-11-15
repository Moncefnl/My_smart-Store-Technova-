import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewTab } from './components/dashboard/OverviewTab';
import { StoreCustomizerTab } from './components/storefront/StoreCustomizerTab';
import { OrdersTab } from './components/orders/OrdersTab';
import { AbandonedCheckoutsTab } from './components/abandoned/AbandonedCheckoutsTab';
import { FraudProtectionTab } from './components/fraud/FraudProtectionTab';
import { ProductsTab } from './components/products/ProductsTab';
import { LandingPagesTab } from './components/landing/LandingPagesTab';
import { CategoriesTab } from './components/categories/CategoriesTab';
import { ShippingTab } from './components/shipping/ShippingTab';
import { MarketingTab } from './components/marketing/MarketingTab';
import { ReviewsTab } from './components/reviews/ReviewsTab';
import { PromoCodesTab } from './components/promos/PromoCodesTab';
import { DomainsTab } from './components/domains/DomainsTab';
import { AnalyticsTab } from './components/analytics/AnalyticsTab';
import { StaffTab } from './components/staff/StaffTab';
import { BlacklistTab } from './components/blacklist/BlacklistTab';
import { AddonsTab } from './components/addons/AddonsTab';
import { BillingTab } from './components/billing/BillingTab';
import { SettingsTab } from './components/settings/SettingsTab';
import { StaffLogin } from './components/staff/StaffLogin';
import { StorefrontView } from './components/storefront/StorefrontView';
import { LandingPageView } from './components/storefront/LandingPageView';
import { CreateStoreModal } from './components/modals/CreateStoreModal';
import { AuthModal } from './components/auth/AuthModal';
import { CustomerAccountModal } from './components/auth/CustomerAccountModal';
import { SessionManagerModal } from './components/auth/SessionManagerModal';
import { SimulatedIncomingMessageBanner } from './components/auth/SimulatedIncomingMessageBanner';
import { TrialCountdownBanner } from './components/billing/TrialCountdownBanner';
import { ShieldAlert, ArrowRight, Lock, LogIn, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { ROLE_PRIMARY_FALLBACK_TAB } from './context/StoreContext';

const DashboardContent: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    viewMode,
    isAuthenticated,
    currentUser,
    isTabPermitted,
    logoutStaff,
    notification,
    isAuthModalOpen,
    closeAuthModal,
    isSessionManagerModalOpen,
    setIsSessionManagerModalOpen,
    isCustomerAccountModalOpen,
    setIsCustomerAccountModalOpen,
  } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [autoFillCode, setAutoFillCode] = React.useState<string | undefined>(undefined);

  const isPermitted = isTabPermitted(currentTab);

  const renderTabContent = () => {
    if (!isPermitted) {
      const fallbackTab = currentUser ? (ROLE_PRIMARY_FALLBACK_TAB[currentUser.role] || 'overview') : 'overview';
      return (
        <div className="min-h-[420px] bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5 border border-rose-100 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2">
            عذراً، هذه الصفحة غير مصرح لك بالوصول إليها
          </h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            تم تقييد الصلاحيات لهذا القسم بناءً على دورك الحالي في المتجر (
            <span className="font-bold text-slate-700">{currentUser?.name}</span> -{' '}
            <span className="text-rose-600 font-semibold">{currentUser?.role}</span>).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setCurrentTab(fallbackTab)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة إلى لوحة عملك المعتمدة</span>
            </button>
            <button
              onClick={logoutStaff}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>تبديل الحساب</span>
            </button>
          </div>
        </div>
      );
    }

    switch (currentTab) {
      case 'overview':
        return <OverviewTab />;
      case 'store_customizer':
        return <StoreCustomizerTab />;
      case 'orders':
        return <OrdersTab />;
      case 'abandoned_checkouts':
        return <AbandonedCheckoutsTab />;
      case 'fraud_protection':
        return <FraudProtectionTab />;
      case 'products':
        return <ProductsTab />;
      case 'landing_pages':
        return <LandingPagesTab />;
      case 'categories':
        return <CategoriesTab />;
      case 'shipping':
        return <ShippingTab />;
      case 'marketing':
        return <MarketingTab />;
      case 'reviews':
        return <ReviewsTab />;
      case 'promo_codes':
        return <PromoCodesTab />;
      case 'domains':
        return <DomainsTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'staff':
        return <StaffTab />;
      case 'blacklist':
        return <BlacklistTab />;
      case 'addons':
        return <AddonsTab />;
      case 'billing':
        return <BillingTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  const renderCurrentView = () => {
    if (viewMode === 'staff_login' || viewMode === 'auth') {
      return <StaffLogin />;
    }

    if (viewMode === 'storefront') {
      return <StorefrontView />;
    }

    if (viewMode === 'landing_page') {
      return <LandingPageView />;
    }

    // Strict role separation: only authenticated merchant accounts can access dashboard
    if (!isAuthenticated || !currentUser) {
      return <StaffLogin />;
    }
    if (currentUser.accountType === 'customer' || currentUser.role === 'customer') {
      return <StorefrontView />;
    }

    return (
      <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden" dir="rtl">
        {/* Sidebar with Professional Polish Theme */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <TrialCountdownBanner />
              {renderTabContent()}
            </div>
          </section>

          {/* Dashboard Footer */}
          <footer className="h-10 bg-white border-t border-gray-100 px-6 sm:px-8 flex items-center justify-between text-[11px] text-gray-400 shrink-0">
            <p>© {new Date().getFullYear()} متجري الذكي لخدمات التجارة الإلكترونية</p>
            <div className="flex gap-4">
              <span className="hover:text-blue-500 cursor-pointer">مركز المساعدة</span>
              <span className="hover:text-blue-500 cursor-pointer">الشروط والأحكام</span>
            </div>
          </footer>
        </main>
      </div>
    );
  };

  return (
    <>
      {renderCurrentView()}

      {/* Multi-Store Creation Modal */}
      <CreateStoreModal />

      {/* Simulated SMS/Email Notification Banner for OTP */}
      <SimulatedIncomingMessageBanner onAutoFillCode={(code) => setAutoFillCode(code)} />

      {/* Universal Auth Modal (Merchant / Customer, Phone / Email, OTP Verification) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        autoFillCode={autoFillCode}
      />

      {/* Customer Account & Order History Modal */}
      <CustomerAccountModal
        isOpen={isCustomerAccountModalOpen}
        onClose={() => setIsCustomerAccountModalOpen(false)}
        onOpenSessionManager={() => setIsSessionManagerModalOpen(true)}
      />

      {/* Session Manager & Active Devices Modal */}
      <SessionManagerModal
        isOpen={isSessionManagerModalOpen}
        onClose={() => setIsSessionManagerModalOpen(false)}
      />

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold text-white ${
              notification.type === 'error'
                ? 'bg-red-600 border-red-500'
                : notification.type === 'info'
                ? 'bg-slate-900 border-slate-800'
                : 'bg-emerald-600 border-emerald-500'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
            ) : notification.type === 'info' ? (
              <Info className="w-4 h-4 text-slate-300 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <DashboardContent />
    </StoreProvider>
  );
}
