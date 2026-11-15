import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TabType,
  Product,
  Category,
  Order,
  LandingPage,
  WilayaRate,
  ShippingCompany,
  PixelConfig,
  CustomerReview,
  PromoCode,
  CustomDomain,
  StaffMember,
  StaffRole,
  CurrentUser,
  ViewMode,
  AuthMethod,
  AccountType,
  UserSession,
  OTPState,
  RegisteredUser,
  BlacklistEntry,
  BotBlockedAttempt,
  StoreExpense,
  FinancialPeriodStats,
  Addon,
  StoreSettings,
  SubscriptionPlan,
  SubscriptionPlanId,
  BillingCycle,
  MerchantSubscription,
  SubscriptionInvoice,
  PlatformPaymentConfig,
  SubscriptionReceiptRequest,
  OrderStatus,
  AbandonedCheckout,
  SupportTicket,
  ParcelTrackingData,
  ManagedStore,
  CreateStorePayload,
} from '../types';
import { SupportedLanguage, TextDirection } from '../i18n/types';
import { translations } from '../i18n/translations';
import {
  WILAYAS_LIST,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_LANDING_PAGES,
  INITIAL_SHIPPING_COMPANIES,
  INITIAL_PIXELS,
  INITIAL_REVIEWS,
  INITIAL_PROMOS,
  INITIAL_DOMAINS,
  INITIAL_STAFF,
  INITIAL_BLACKLIST,
  INITIAL_BOT_BLOCKED_ATTEMPTS,
  INITIAL_EXPENSES,
  INITIAL_ADDONS,
  INITIAL_SETTINGS,
  INITIAL_ABANDONED_CHECKOUTS,
  INITIAL_SUPPORT_TICKETS,
  validateAlgerianPhone,
  evaluateOrderFraudRisk,
  generateMockTrackingData
} from '../data/mockData';
import {
  DEFAULT_SUBSCRIPTION_PLANS,
  INITIAL_MERCHANT_SUBSCRIPTION,
  INITIAL_SUBSCRIPTION_INVOICES,
  DEFAULT_PLATFORM_PAYMENT_CONFIG,
  INITIAL_RECEIPT_REQUESTS,
  createTrialSubscription,
} from '../data/mockSubscriptionData';
import {
  INITIAL_REGISTERED_USERS,
  INITIAL_USER_SESSIONS,
} from '../data/mockAuthData';
import {
  INITIAL_MANAGED_STORES,
  STORE_DATA_MAP,
  ELEGANCE_PRODUCTS,
  ELEGANCE_CATEGORIES,
  ELEGANCE_ORDERS,
  ELEGANCE_EXPENSES,
  ELEGANCE_SETTINGS,
  BAYTI_PRODUCTS,
  BAYTI_CATEGORIES,
  BAYTI_ORDERS,
  BAYTI_EXPENSES,
  BAYTI_SETTINGS,
} from '../data/mockStoresData';

export interface CartItem {
  product: Product;
  variantName?: string;
  quantity: number;
  selectedPrice: number;
}

interface StoreContextType {
  // Navigation & View Mode
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeLandingPageId: string | null;
  setActiveLandingPageId: (id: string | null) => void;
  storeCustomizerSection: import('../types').StoreCustomizerSection;
  setStoreCustomizerSection: (s: import('../types').StoreCustomizerSection) => void;
  staffSection: import('../types').StaffSection;
  setStaffSection: (s: import('../types').StaffSection) => void;
  productSection: import('../types').ProductSection;
  setProductSection: (s: import('../types').ProductSection) => void;
  shippingSection: import('../types').ShippingSection;
  setShippingSection: (s: import('../types').ShippingSection) => void;

  // Authentication & Current User
  isAuthenticated: boolean;
  authPortalTab: 'login' | 'create_store';
  setAuthPortalTab: (tab: 'login' | 'create_store') => void;
  openAuthPortal: (tab?: 'login' | 'create_store') => void;
  currentUser: CurrentUser;
  setCurrentUser: (u: CurrentUser) => void;
  loginAsStaff: (emailOrPhone: string, password?: string) => { success: boolean; message?: string; member?: StaffMember };
  loginAsSuperAdmin: () => void;
  logoutStaff: () => void;
  isTabPermitted: (tab: TabType) => boolean;

  // Extended Auth, OTP Verification & Session Management
  registeredUsers: RegisteredUser[];
  activeSessions: UserSession[];
  currentSession: UserSession | null;
  currentOTP: OTPState | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalConfig: { mode: 'login' | 'signup'; defaultType?: AccountType; defaultMethod?: AuthMethod };
  openAuthModal: (mode?: 'login' | 'signup', defaultType?: AccountType, defaultMethod?: AuthMethod) => void;
  closeAuthModal: () => void;
  isCustomerAccountModalOpen: boolean;
  setIsCustomerAccountModalOpen: (open: boolean) => void;
  isSessionManagerModalOpen: boolean;
  setIsSessionManagerModalOpen: (open: boolean) => void;
  simulatedIncomingMessage: {
    type: 'sms' | 'email';
    target: string;
    code: string;
    title: string;
    body: string;
    timestamp: string;
  } | null;
  clearSimulatedMessage: () => void;

  sendOTP: (
    target: string,
    type: AuthMethod,
    purpose: 'signup' | 'login' | 'verify',
    accountType: AccountType,
    tempUser?: {
      name: string;
      target: string;
      password?: string;
      accountType: AccountType;
      storeName?: string;
      wilaya?: string;
      commune?: string;
      address?: string;
    }
  ) => { success: boolean; code: string; message: string };
  verifyOTP: (code: string) => { success: boolean; message: string; user?: RegisteredUser };
  resendOTP: () => { success: boolean; code: string; message: string };
  cancelOTP: () => void;
  loginWithCredentials: (
    identifier: string,
    password?: string,
    accountType?: AccountType,
    options?: { stayOnPortal?: boolean }
  ) => { success: boolean; message: string; user?: RegisteredUser };
  registerNewUser: (payload: {
    name: string;
    target: string;
    method: AuthMethod;
    password?: string;
    accountType: AccountType;
    storeName?: string;
    wilaya?: string;
    commune?: string;
    address?: string;
  }) => { success: boolean; message: string };
  registerMerchantWithStore: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    storeName: string;
    slug?: string;
    category?: string;
    wilaya?: string;
    currency?: string;
    primaryColor?: string;
  }) => { success: boolean; message: string; store?: ManagedStore };
  resetUserPassword: (identifier: string, newPassword: string) => { success: boolean; message: string };
  logoutUser: () => void;
  terminateSession: (sessionId: string) => void;
  terminateAllOtherSessions: () => void;

  // Data Collections
  products: Product[];
  categories: Category[];
  orders: Order[];
  landingPages: LandingPage[];
  wilayas: WilayaRate[];
  shippingCompanies: ShippingCompany[];
  pixels: PixelConfig[];
  reviews: CustomerReview[];
  promos: PromoCode[];
  domains: CustomDomain[];
  staff: StaffMember[];
  blacklist: BlacklistEntry[];
  addons: Addon[];
  settings: StoreSettings;
  abandonedCheckouts: AbandonedCheckout[];
  supportTickets: SupportTicket[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variantName?: string) => void;
  removeFromCart: (productId: string, variantName?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variantName?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Modals & Active Inspect
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (p: Product | null) => void;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (o: Order | null) => void;
  trackingModalOrder: Order | null;
  setTrackingModalOrder: (o: Order | null) => void;
  fraudAuditOrder: Order | null;
  setFraudAuditOrder: (o: Order | null) => void;
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;

  // i18n & Localization
  language: SupportedLanguage;
  direction: TextDirection;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;

  // Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  recordCallAttempt: (id: string) => void;
  deleteOrder: (id: string) => void;

  // Abandoned Checkouts
  addAbandonedCheckout: (checkout: Omit<AbandonedCheckout, 'id' | 'createdAt' | 'status'>) => void;
  updateAbandonedStatus: (id: string, status: AbandonedCheckout['status'], channel?: AbandonedCheckout['recoveryChannel']) => void;
  deleteAbandonedCheckout: (id: string) => void;
  convertAbandonedToOrder: (id: string) => Order | null;

  // Support
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>, initialMessage: string) => void;
  addSupportMessage: (ticketId: string, text: string, sender?: 'user' | 'support' | 'ai_assistant') => void;

  // Shipping
  updateWilayaRate: (code: string, updates: Partial<WilayaRate>) => void;
  toggleWilayaStatus: (code: string) => void;
  bulkUpdateWilayas: (type: 'increase' | 'decrease' | 'reset', amount?: number) => void;
  toggleShippingCompany: (id: string) => void;
  updateShippingCompany: (id: string, updates: Partial<ShippingCompany>) => void;
  connectShippingCompany: (id: string, config: { apiKey: string; apiToken?: string; accountNumber?: string; autoSyncOrders?: boolean; defaultHomePrice?: number; defaultDeskPrice?: number }) => void;
  disconnectShippingCompany: (id: string) => void;

  addLandingPage: (page: Omit<LandingPage, 'id' | 'views' | 'conversions'>) => void;
  updateLandingPage: (id: string, updates: Partial<LandingPage>) => void;
  deleteLandingPage: (id: string) => void;

  addCategory: (cat: Omit<Category, 'id' | 'productsCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addPixel: (pixel: Omit<PixelConfig, 'id'>) => void;
  updatePixel: (id: string, updates: Partial<PixelConfig>) => void;
  deletePixel: (id: string) => void;

  addReview: (review: Omit<CustomerReview, 'id' | 'date'>) => void;
  approveReview: (id: string, approve: boolean) => void;
  deleteReview: (id: string) => void;

  addPromo: (promo: Omit<PromoCode, 'id' | 'currentUses'>) => void;
  togglePromoStatus: (id: string) => void;
  deletePromo: (id: string) => void;

  addDomain: (domain: string) => void;
  deleteDomain: (id: string) => void;

  addStaff: (member: Omit<StaffMember, 'id' | 'lastLogin'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  toggleStaffStatus: (id: string) => void;
  deleteStaff: (id: string) => void;

  addToBlacklist: (entry: Omit<BlacklistEntry, 'id' | 'blockedDate' | 'attemptsBlocked'>) => void;
  removeFromBlacklist: (id: string) => void;

  // Anti-Bot & Captcha Protection
  botBlockedAttempts: BotBlockedAttempt[];
  logBlockedBotAttempt: (attempt: Omit<BotBlockedAttempt, 'id' | 'timestamp'>) => void;
  clearBotLogs: () => void;

  // Advanced Financial & Expenses Management
  expenses: StoreExpense[];
  addExpense: (expense: Omit<StoreExpense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<StoreExpense>) => void;
  deleteExpense: (id: string) => void;
  getFinancialStats: (period: 'today' | 'week' | 'month' | 'year') => FinancialPeriodStats;

  toggleAddon: (id: string) => void;
  updateSettings: (updates: Partial<StoreSettings>) => void;

  // Multi-Store Management System
  stores: ManagedStore[];
  merchantStores: ManagedStore[];
  currentStore: ManagedStore;
  currentStoreId: string;
  switchStore: (storeId: string) => void;
  createStore: (payload: CreateStorePayload) => ManagedStore;
  updateStore: (storeId: string, updates: Partial<ManagedStore>) => void;
  deleteStore: (storeId: string) => void;
  isCreateStoreModalOpen: boolean;
  setIsCreateStoreModalOpen: (open: boolean) => void;

  // Subscriptions & Billing Management
  subscription: MerchantSubscription;
  subscriptionPlans: SubscriptionPlan[];
  subscriptionInvoices: SubscriptionInvoice[];
  upgradeSubscription: (
    planId: SubscriptionPlanId,
    billingCycle: BillingCycle,
    paymentMethod: string,
    transactionProof?: string,
    discountApplied?: number
  ) => void;
  renewSubscription: () => void;
  cancelSubscription: () => void;
  getActivePlan: () => SubscriptionPlan;
  canCreateMoreStores: boolean;
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;

  // 1-Day Trial Mode Support & Countdown
  startFreeTrial: (hours?: number) => void;
  simulateTrialExpiry: () => void;
  resetTrialTimer: () => void;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  trialTimeRemaining: {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    formatted: string;
    percentElapsed: number;
  };

  // Platform Payment Config & Receipts Verification
  platformPaymentConfig: PlatformPaymentConfig;
  updatePlatformPaymentConfig: (config: Partial<PlatformPaymentConfig>) => void;
  receiptRequests: SubscriptionReceiptRequest[];
  submitReceiptRequest: (data: {
    planId: SubscriptionPlanId;
    billingCycle: BillingCycle;
    paymentMethod: 'baridimob' | 'ccp';
    receiptUrl: string;
    transactionRef?: string;
    senderName?: string;
    notes?: string;
    instantActivate?: boolean;
  }) => string;
  approveReceiptRequest: (requestId: string, adminNotes?: string) => void;
  rejectReceiptRequest: (requestId: string, reason: string) => void;
  pendingReceiptsCount: number;

  // Search & Global Helpers
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  showNotification: (msg: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  notification: { message: string; type: 'success' | 'info' | 'error' | 'warning'; id: number } | null;
}

export const DEFAULT_SUPER_ADMIN: CurrentUser = {
  id: 'user-admin-1',
  name: 'مراد العلواني',
  email: 'admin@matjari.dz',
  phone: '0550112233',
  role: 'super_admin',
  isStaff: false,
  permissions: ['all'],
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  accountType: 'merchant',
  isVerified: true,
  verificationMethod: 'email',
  storeName: 'متجر تكنوفا',
};

export const ROLE_DEFAULT_TABS: Record<StaffRole | 'super_admin', TabType[]> = {
  super_admin: [
    'overview',
    'store_customizer',
    'orders',
    'abandoned_checkouts',
    'fraud_protection',
    'products',
    'landing_pages',
    'categories',
    'shipping',
    'marketing',
    'reviews',
    'promo_codes',
    'domains',
    'analytics',
    'staff',
    'blacklist',
    'addons',
    'billing',
    'settings',
  ],
  orders_manager: ['overview', 'orders', 'abandoned_checkouts', 'fraud_protection', 'shipping', 'blacklist'],
  inventory_manager: ['overview', 'products', 'categories'],
  marketer: ['overview', 'landing_pages', 'marketing', 'abandoned_checkouts', 'promo_codes', 'analytics', 'reviews'],
  support: ['overview', 'orders', 'abandoned_checkouts', 'fraud_protection', 'reviews', 'blacklist'],
};

export const ROLE_PRIMARY_FALLBACK_TAB: Record<StaffRole | 'super_admin', TabType> = {
  super_admin: 'overview',
  orders_manager: 'orders',
  inventory_manager: 'products',
  marketer: 'landing_pages',
  support: 'orders',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('matjari_is_authenticated') === 'true';
  });
  const [authPortalTab, setAuthPortalTab] = useState<'login' | 'create_store'>('login');

  // Authentication state
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem('matjari_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_SUPER_ADMIN;
      }
    }
    return DEFAULT_SUPER_ADMIN;
  });

  const [viewMode, _setViewMode] = useState<ViewMode>(() => {
    const authed = localStorage.getItem('matjari_is_authenticated') === 'true';
    if (!authed) return 'auth';
    const savedUserRaw = localStorage.getItem('matjari_current_user');
    if (savedUserRaw) {
      try {
        const parsed = JSON.parse(savedUserRaw);
        if (parsed?.accountType === 'customer' || parsed?.role === 'customer') {
          return 'storefront';
        }
      } catch (e) {}
    }
    return 'dashboard';
  });

  const [activeLandingPageId, setActiveLandingPageId] = useState<string | null>(null);
  const [storeCustomizerSection, setStoreCustomizerSection] = useState<import('../types').StoreCustomizerSection>('logo');
  const [staffSection, setStaffSection] = useState<import('../types').StaffSection>('all');
  const [productSection, setProductSection] = useState<import('../types').ProductSection>('all');
  const [shippingSection, setShippingSection] = useState<import('../types').ShippingSection>('wilayas');

  const setViewMode = (mode: ViewMode) => {
    if (mode === 'dashboard') {
      const isMerchantAccount =
        isAuthenticated &&
        currentUser &&
        currentUser.accountType !== 'customer' &&
        currentUser.role !== 'customer';
      if (!isMerchantAccount) {
        if (isAuthenticated && (currentUser?.accountType === 'customer' || currentUser?.role === 'customer')) {
          _setViewMode('storefront');
          showNotification('دخول الزبائن مقتصر على واجهة المتجر وتتبع الطلبات فقط', 'warning');
          return;
        }
        setAuthPortalTab('login');
        _setViewMode('auth');
        showNotification('يرجى تسجيل الدخول بحساب تاجر للوصول إلى لوحة التحكم', 'info');
        return;
      }
    }
    _setViewMode(mode);
  };

  const openAuthPortal = (tab: 'login' | 'create_store' = 'login') => {
    setAuthPortalTab(tab);
    _setViewMode('auth');
  };

  useEffect(() => {
    localStorage.setItem('matjari_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('matjari_is_authenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  // Registered Users State
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('matjari_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_REGISTERED_USERS;
  });

  useEffect(() => {
    localStorage.setItem('matjari_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Active Sessions State
  const [activeSessions, setActiveSessions] = useState<UserSession[]>(() => {
    const saved = localStorage.getItem('matjari_user_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_USER_SESSIONS;
  });

  useEffect(() => {
    localStorage.setItem('matjari_user_sessions', JSON.stringify(activeSessions));
  }, [activeSessions]);

  const currentSession = activeSessions.find((s) => s.isCurrent) || activeSessions[0] || null;

  // OTP Verification State
  const [currentOTP, setCurrentOTP] = useState<OTPState | null>(null);

  // Simulated Incoming SMS / Email Message Banner
  const [simulatedIncomingMessage, setSimulatedIncomingMessage] = useState<{
    type: 'sms' | 'email';
    target: string;
    code: string;
    title: string;
    body: string;
    timestamp: string;
  } | null>(null);

  const clearSimulatedMessage = () => {
    setSimulatedIncomingMessage(null);
  };

  // Auth Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{
    mode: 'login' | 'signup';
    defaultType?: AccountType;
    defaultMethod?: AuthMethod;
  }>({ mode: 'login', defaultType: 'merchant', defaultMethod: 'phone' });

  const [isCustomerAccountModalOpen, setIsCustomerAccountModalOpen] = useState(false);
  const [isSessionManagerModalOpen, setIsSessionManagerModalOpen] = useState(false);

  // Multi-Store Management State
  const [stores, setStores] = useState<ManagedStore[]>(() => {
    const saved = localStorage.getItem('matjari_managed_stores');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((s: ManagedStore) =>
            s.ownerId ? s : { ...s, ownerId: 'user-admin-1' }
          );
        }
      } catch (e) {}
    }
    return INITIAL_MANAGED_STORES;
  });

  const [currentStoreId, setCurrentStoreId] = useState<string>(() => {
    const saved = localStorage.getItem('matjari_current_store_id');
    if (saved) return saved;
    return 'store-technova';
  });

  const [isCreateStoreModalOpen, setIsCreateStoreModalOpen] = useState(false);

  // Strict per-merchant store ownership filter
  const merchantStores =
    isAuthenticated && currentUser && currentUser.accountType === 'merchant' && currentUser.role !== 'customer'
      ? stores.filter((s) => s.ownerId === currentUser.id)
      : [];

  const currentStore =
    merchantStores.find((s) => s.id === currentStoreId) ||
    merchantStores[0] ||
    stores.find((s) => s.id === currentStoreId) ||
    stores[0] ||
    INITIAL_MANAGED_STORES[0];

  useEffect(() => {
    localStorage.setItem('matjari_managed_stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('matjari_current_store_id', currentStoreId);
  }, [currentStoreId]);

  // Storage states with initial data fallback
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('matjari_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = new Set(parsed.map((p: Product) => p.id));
          const missing = INITIAL_PRODUCTS.filter((ip) => !ids.has(ip.id));
          return [...parsed, ...missing];
        }
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('matjari_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('matjari_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [landingPages, setLandingPages] = useState<LandingPage[]>(() => {
    const saved = localStorage.getItem('matjari_landing_pages');
    return saved ? JSON.parse(saved) : INITIAL_LANDING_PAGES;
  });

  const [wilayas, setWilayas] = useState<WilayaRate[]>(() => {
    const saved = localStorage.getItem('matjari_wilayas');
    return saved ? JSON.parse(saved) : WILAYAS_LIST;
  });

  const [shippingCompanies, setShippingCompanies] = useState<ShippingCompany[]>(() => {
    const saved = localStorage.getItem('matjari_shipping_companies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Key existing user config by code or id
          const existingMap = new Map<string, ShippingCompany>(
            parsed.map((c: ShippingCompany) => [c.code || c.id, c])
          );
          // Always map against canonical INITIAL_SHIPPING_COMPANIES to ensure IDs are unique & valid
          return INITIAL_SHIPPING_COMPANIES.map((comp) => {
            const found = existingMap.get(comp.code) || existingMap.get(comp.id);
            return found ? { ...comp, ...found, id: comp.id } : comp;
          });
        }
      } catch (e) {
        return INITIAL_SHIPPING_COMPANIES;
      }
    }
    return INITIAL_SHIPPING_COMPANIES;
  });

  const [pixels, setPixels] = useState<PixelConfig[]>(() => {
    const saved = localStorage.getItem('matjari_pixels');
    return saved ? JSON.parse(saved) : INITIAL_PIXELS;
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    const saved = localStorage.getItem('matjari_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [promos, setPromos] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem('matjari_promos');
    return saved ? JSON.parse(saved) : INITIAL_PROMOS;
  });

  const [domains, setDomains] = useState<CustomDomain[]>(() => {
    const saved = localStorage.getItem('matjari_domains');
    return saved ? JSON.parse(saved) : INITIAL_DOMAINS;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('matjari_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>(() => {
    const saved = localStorage.getItem('matjari_blacklist');
    return saved ? JSON.parse(saved) : INITIAL_BLACKLIST;
  });

  const [botBlockedAttempts, setBotBlockedAttempts] = useState<BotBlockedAttempt[]>(() => {
    const saved = localStorage.getItem('matjari_bot_blocked_attempts');
    return saved ? JSON.parse(saved) : INITIAL_BOT_BLOCKED_ATTEMPTS;
  });

  const [expenses, setExpenses] = useState<StoreExpense[]>(() => {
    const saved = localStorage.getItem('matjari_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [addons, setAddons] = useState<Addon[]>(() => {
    const saved = localStorage.getItem('matjari_addons');
    return saved ? JSON.parse(saved) : INITIAL_ADDONS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('matjari_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Subscription & Billing State
  const [subscriptionPlans] = useState<SubscriptionPlan[]>(DEFAULT_SUBSCRIPTION_PLANS);

  const [subscription, setSubscription] = useState<MerchantSubscription>(() => {
    const saved = localStorage.getItem('matjari_merchant_subscription');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_MERCHANT_SUBSCRIPTION;
  });

  const [subscriptionInvoices, setSubscriptionInvoices] = useState<SubscriptionInvoice[]>(() => {
    const saved = localStorage.getItem('matjari_subscription_invoices');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return INITIAL_SUBSCRIPTION_INVOICES;
  });

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Real-time ticking for trial countdown
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if current subscription is in 1-day trial mode
  const isTrialActive =
    (subscription.status === 'trial' || (subscription.isTrial === true && subscription.status !== 'active')) &&
    (!subscription.trialExpiresAt || new Date(subscription.trialExpiresAt).getTime() > currentTime);

  const trialExpiresTimestamp = subscription.trialExpiresAt ? new Date(subscription.trialExpiresAt).getTime() : 0;
  const trialRemainingMs = Math.max(0, trialExpiresTimestamp - currentTime);
  const isTrialExpired =
    (subscription.status === 'expired' && subscription.isTrial === true) ||
    ((subscription.status === 'trial' || subscription.isTrial === true) &&
      trialExpiresTimestamp > 0 &&
      trialRemainingMs <= 0);

  // Auto-expire trial status when 24h timer reaches 0
  useEffect(() => {
    if (subscription.status === 'trial' && subscription.trialExpiresAt) {
      const exp = new Date(subscription.trialExpiresAt).getTime();
      if (exp <= currentTime) {
        setSubscription((prev) => ({
          ...prev,
          status: 'expired',
        }));
      }
    }
  }, [currentTime, subscription.status, subscription.trialExpiresAt]);

  const totalTrialSeconds = Math.floor(trialRemainingMs / 1000);
  const trialHours = Math.floor(totalTrialSeconds / 3600);
  const trialMinutes = Math.floor((totalTrialSeconds % 3600) / 60);
  const trialSeconds = totalTrialSeconds % 60;
  const formattedTrialCountdown = `${String(trialHours).padStart(2, '0')}:${String(trialMinutes).padStart(2, '0')}:${String(trialSeconds).padStart(2, '0')}`;
  const totalTrialDurationSec = 24 * 3600;
  const percentTrialElapsed = Math.min(
    100,
    Math.max(0, ((totalTrialDurationSec - totalTrialSeconds) / totalTrialDurationSec) * 100)
  );

  const trialTimeRemaining = {
    hours: trialHours,
    minutes: trialMinutes,
    seconds: trialSeconds,
    totalSeconds: totalTrialSeconds,
    formatted: formattedTrialCountdown,
    percentElapsed: percentTrialElapsed,
  };

  const startFreeTrial = (hours: number = 24) => {
    const trialSub = createTrialSubscription(hours);
    setSubscription(trialSub);
    showNotification(
      `🎉 تم تفعيل الحساب التجريبي المجاني لمدة ${hours} ساعة على الباقة المبتدئة (Starter Plan)!`,
      'success'
    );
  };

  const simulateTrialExpiry = () => {
    const past = new Date(Date.now() - 5000);
    setSubscription((prev) => ({
      ...prev,
      status: 'expired',
      trialExpiresAt: past.toISOString(),
      isTrial: true,
    }));
    showNotification('⚠️ تمت محاكاة انتهاء مهلة الـ 24 ساعة. المتجر مقيد حالياً ويتطلب الترقية عبر CCP أو بريدي موب.', 'warning');
  };

  const resetTrialTimer = () => {
    startFreeTrial(24);
    showNotification('⏱️ تم إعادة ضبط عداد الـ 24 ساعة للحساب التجريبي بنجاح!', 'info');
  };

  useEffect(() => {
    localStorage.setItem('matjari_merchant_subscription', JSON.stringify(subscription));
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem('matjari_subscription_invoices', JSON.stringify(subscriptionInvoices));
  }, [subscriptionInvoices]);

  const getActivePlan = (): SubscriptionPlan => {
    const found = subscriptionPlans.find((p) => p.id === subscription.planId);
    return found || subscriptionPlans[1] || subscriptionPlans[0];
  };

  const activePlan = getActivePlan();
  const canCreateMoreStores =
    activePlan.limits.maxStores === -1 || merchantStores.length < activePlan.limits.maxStores;

  const upgradeSubscription = (
    planId: SubscriptionPlanId,
    billingCycle: BillingCycle,
    paymentMethod: string,
    transactionProof?: string,
    discountApplied: number = 0
  ) => {
    const targetPlan = subscriptionPlans.find((p) => p.id === planId) || subscriptionPlans[0];
    const rawPrice = billingCycle === 'yearly' ? targetPlan.yearlyPrice : targetPlan.monthlyPrice;
    const finalAmount = Math.max(0, rawPrice - discountApplied);

    const now = new Date();
    const startDateStr = now.toISOString().split('T')[0];

    const expiry = new Date();
    if (billingCycle === 'yearly') {
      expiry.setFullYear(expiry.getFullYear() + 1);
    } else {
      expiry.setMonth(expiry.getMonth() + 1);
    }
    const expiryDateStr = expiry.toISOString().split('T')[0];

    let cleanMethod: 'cib_edahabia' | 'baridimob' | 'ccp' | 'card' | 'bank_transfer' = 'cib_edahabia';
    if (paymentMethod.includes('baridi')) cleanMethod = 'baridimob';
    else if (paymentMethod.includes('ccp')) cleanMethod = 'ccp';
    else if (paymentMethod.includes('card') || paymentMethod.includes('visa')) cleanMethod = 'card';

    const newSub: MerchantSubscription = {
      planId,
      billingCycle,
      status: 'active',
      startDate: startDateStr,
      expiryDate: expiryDateStr,
      autoRenew: true,
      paymentMethod: cleanMethod,
      lastPaymentDate: startDateStr,
      lastAmountPaid: finalAmount,
      trialDaysRemaining: 0,
      isTrial: false,
      trialExpiresAt: undefined,
      trialStartedAt: undefined,
    };

    setSubscription(newSub);

    const invoiceId = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: SubscriptionInvoice = {
      id: invoiceId,
      planId,
      planName: `${targetPlan.name} - اشتراك ${billingCycle === 'yearly' ? 'سنوي (وفرت شهرين)' : 'شهري'}`,
      amount: finalAmount,
      currency: 'د.ج',
      billingCycle,
      status: 'paid',
      paymentMethod,
      date: startDateStr,
      dueDate: startDateStr,
      transactionId: `TXN-${Date.now().toString(36).toUpperCase()}`,
      taxAmount: 0,
      discountApplied,
      receiptUrl: transactionProof,
    };

    setSubscriptionInvoices((prev) => [newInvoice, ...prev]);
    showNotification(`🎉 مبروك! تم ترقية وتفعيل باقة ${targetPlan.name} بنجاح`, 'success');
  };

  const renewSubscription = () => {
    const currentActivePlan = getActivePlan();
    const expiry = new Date(subscription.expiryDate || new Date().toISOString());
    if (subscription.billingCycle === 'yearly') {
      expiry.setFullYear(expiry.getFullYear() + 1);
    } else {
      expiry.setMonth(expiry.getMonth() + 1);
    }
    const newExpiryStr = expiry.toISOString().split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];

    setSubscription((prev) => ({
      ...prev,
      status: 'active',
      expiryDate: newExpiryStr,
      lastPaymentDate: todayStr,
    }));

    const invoiceId = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: SubscriptionInvoice = {
      id: invoiceId,
      planId: subscription.planId,
      planName: `تجديد ${currentActivePlan.name} - اشتراك ${subscription.billingCycle === 'yearly' ? 'سنوي' : 'شهري'}`,
      amount: subscription.billingCycle === 'yearly' ? currentActivePlan.yearlyPrice : currentActivePlan.monthlyPrice,
      currency: 'د.ج',
      billingCycle: subscription.billingCycle,
      status: 'paid',
      paymentMethod: 'تجديد فوري / البطاقة الذهبية',
      date: todayStr,
      dueDate: todayStr,
      transactionId: `TXN-RENEW-${Date.now().toString(36).toUpperCase()}`,
      taxAmount: 0,
      discountApplied: 0,
    };

    setSubscriptionInvoices((prev) => [newInvoice, ...prev]);
    showNotification(`تم تجديد الاشتراك في ${currentActivePlan.name} بنجاح حتى ${newExpiryStr} 🚀`, 'success');
  };

  const cancelSubscription = () => {
    setSubscription((prev) => ({
      ...prev,
      autoRenew: false,
    }));
    showNotification('تم إيقاف التجديد التلقائي للاشتراك، وستبقى المميزات نشطة حتى تاريخ الانتهاء الحالي', 'info');
  };

  // Platform Payment Configuration (CCP & BaridiMob RIP)
  const [platformPaymentConfig, setPlatformPaymentConfig] = useState<PlatformPaymentConfig>(() => {
    const saved = localStorage.getItem('technova_platform_payment_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_PLATFORM_PAYMENT_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('technova_platform_payment_config', JSON.stringify(platformPaymentConfig));
  }, [platformPaymentConfig]);

  const updatePlatformPaymentConfig = (config: Partial<PlatformPaymentConfig>) => {
    setPlatformPaymentConfig((prev) => {
      const updated = { ...prev, ...config };
      showNotification('تم تحديث بيانات الحسابات البريدية (CCP / RIP) بنجاح 🏦', 'success');
      return updated;
    });
  };

  // Subscription Receipt Verification Requests
  const [receiptRequests, setReceiptRequests] = useState<SubscriptionReceiptRequest[]>(() => {
    const saved = localStorage.getItem('technova_receipt_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return INITIAL_RECEIPT_REQUESTS;
  });

  useEffect(() => {
    localStorage.setItem('technova_receipt_requests', JSON.stringify(receiptRequests));
  }, [receiptRequests]);

  const pendingReceiptsCount = receiptRequests.filter((r) => r.status === 'pending').length;

  const submitReceiptRequest = (data: {
    planId: SubscriptionPlanId;
    billingCycle: BillingCycle;
    paymentMethod: 'baridimob' | 'ccp';
    receiptUrl: string;
    transactionRef?: string;
    senderName?: string;
    notes?: string;
    instantActivate?: boolean;
  }) => {
    const targetPlan = subscriptionPlans.find((p) => p.id === data.planId) || subscriptionPlans[1];
    const amount = data.billingCycle === 'yearly' ? targetPlan.yearlyPrice : targetPlan.monthlyPrice;
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').slice(0, 16);

    const requestId = `REQ-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReq: SubscriptionReceiptRequest = {
      id: requestId,
      storeId: currentStore?.id || 'store-main',
      storeName: currentStore?.name || 'متجر تكنوفا',
      merchantName: currentUser?.name || 'التاجر المعتمد',
      merchantPhone: currentUser?.phone || settings.phone || '0550 00 00 00',
      merchantEmail: currentUser?.email || settings.email,
      planId: data.planId,
      planName: targetPlan.name,
      billingCycle: data.billingCycle,
      amount,
      currency: targetPlan.currency,
      paymentMethod: data.paymentMethod,
      receiptUrl: data.receiptUrl,
      transactionRef:
        data.transactionRef ||
        `${data.paymentMethod === 'baridimob' ? 'BM' : 'CCP'}-${Date.now().toString(36).toUpperCase()}`,
      senderName: data.senderName || currentUser?.name || 'التاجر المعتمد',
      submittedAt: dateStr,
      status: data.instantActivate ? 'approved' : 'pending',
      notes: data.notes,
      reviewedAt: data.instantActivate ? dateStr : undefined,
      reviewedBy: data.instantActivate ? 'تفعيل فوري تجريبي' : undefined,
    };

    setReceiptRequests((prev) => [newReq, ...prev]);

    if (data.instantActivate) {
      upgradeSubscription(
        data.planId,
        data.billingCycle,
        data.paymentMethod === 'baridimob' ? 'بريدي موب (BaridiMob RIP)' : 'تحويل بريدي يدوي (CCP)',
        data.receiptUrl
      );
    } else {
      showNotification('تم إرسال وصل التحويل بنجاح 📄! جاري مراجعته وتفعيل اشتراكك في أقرب وقت.', 'success');
    }

    return requestId;
  };

  const approveReceiptRequest = (requestId: string, adminNotes?: string) => {
    const req = receiptRequests.find((r) => r.id === requestId);
    if (!req) return;

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setReceiptRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'approved',
              reviewedAt: nowStr,
              reviewedBy: currentUser?.name || 'المدير العام (Admin)',
              notes: adminNotes || r.notes,
            }
          : r
      )
    );

    upgradeSubscription(
      req.planId,
      req.billingCycle,
      req.paymentMethod === 'baridimob' ? 'بريدي موب (BaridiMob RIP)' : 'تحويل بريدي يدوي (CCP)',
      req.receiptUrl
    );

    showNotification(`🎉 تم تأكيد وصل الدفع وتفعيل باقة ${req.planName} بنجاح!`, 'success');
  };

  const rejectReceiptRequest = (requestId: string, reason: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setReceiptRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'rejected',
              rejectionReason: reason,
              reviewedAt: nowStr,
              reviewedBy: currentUser?.name || 'المدير العام (Admin)',
            }
          : r
      )
    );

    showNotification(`تم تسجيل رفض الوصل وإشعار التاجر بالسبب: ${reason}`, 'error');
  };

  // Abandoned Checkouts State
  const [abandonedCheckouts, setAbandonedCheckouts] = useState<AbandonedCheckout[]>(() => {
    const saved = localStorage.getItem('matjari_abandoned_checkouts');
    return saved ? JSON.parse(saved) : INITIAL_ABANDONED_CHECKOUTS;
  });

  // Support Tickets State
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('matjari_support_tickets');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  // Modals & Active Inspect
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [fraudAuditOrder, setFraudAuditOrder] = useState<Order | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // i18n Language & Direction State
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('matjari_language') as SupportedLanguage;
    if (saved === 'en' || saved === 'ar') return saved;
    return (settings.defaultLanguage as SupportedLanguage) || 'ar';
  });

  const direction: TextDirection = language === 'ar' ? 'rtl' : 'ltr';

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('matjari_language', lang);
  };

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    document.body.dir = direction;
  }, [language, direction]);

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || fallback || key;
  };

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Search & Notifications
  const [globalSearch, setGlobalSearch] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' | 'warning'; id: number } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => {
      setNotification((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('matjari_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('matjari_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('matjari_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('matjari_landing_pages', JSON.stringify(landingPages));
  }, [landingPages]);

  useEffect(() => {
    localStorage.setItem('matjari_wilayas', JSON.stringify(wilayas));
  }, [wilayas]);

  useEffect(() => {
    localStorage.setItem('matjari_shipping_companies', JSON.stringify(shippingCompanies));
  }, [shippingCompanies]);

  useEffect(() => {
    localStorage.setItem('matjari_pixels', JSON.stringify(pixels));
  }, [pixels]);

  useEffect(() => {
    localStorage.setItem('matjari_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('matjari_promos', JSON.stringify(promos));
  }, [promos]);

  useEffect(() => {
    localStorage.setItem('matjari_domains', JSON.stringify(domains));
  }, [domains]);

  useEffect(() => {
    localStorage.setItem('matjari_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('matjari_blacklist', JSON.stringify(blacklist));
  }, [blacklist]);

  useEffect(() => {
    localStorage.setItem('matjari_bot_blocked_attempts', JSON.stringify(botBlockedAttempts));
  }, [botBlockedAttempts]);

  useEffect(() => {
    localStorage.setItem('matjari_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('matjari_addons', JSON.stringify(addons));
  }, [addons]);

  useEffect(() => {
    localStorage.setItem('matjari_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('matjari_abandoned_checkouts', JSON.stringify(abandonedCheckouts));
  }, [abandonedCheckouts]);

  useEffect(() => {
    localStorage.setItem('matjari_support_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  // Cart Operations
  const addToCart = (product: Product, quantity = 1, variantName?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.variantName === variantName
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.variantName === variantName
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const price = variantName && product.variants
        ? product.variants.find((v) => v.name === variantName)?.price || product.price
        : product.price;

      return [...prev, { product, variantName, quantity, selectedPrice: price }];
    });
    showNotification(`تمت إضافة "${product.name}" إلى السلة`, 'success');
  };

  const removeFromCart = (productId: string, variantName?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.variantName === variantName)
      )
    );
  };

  const updateCartQuantity = (productId: string, quantity: number, variantName?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantName);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.variantName === variantName
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Product Handlers
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => {
    if (isTrialExpired || subscription.status === 'expired') {
      showNotification(
        '⚠️ متجرك مقيد حالياً لانتهاء الفترة التجريبية (24 ساعة). يرجى الترقية وسداد الاشتراك عبر بريدي موب أو CCP لمواصلة إضافة المنتجات!',
        'error'
      );
      setIsSubscriptionModalOpen(true);
      return;
    }

    if (activePlan.limits.maxProducts !== -1 && products.length >= activePlan.limits.maxProducts) {
      showNotification(
        `⚠️ لقد بلغت الحد الأقصى للمنتجات في ${activePlan.name} (${activePlan.limits.maxProducts} منتج). قم بترقية اشتراكك لفتح منتجات غير محدودة! 🚀`,
        'warning'
      );
      setIsSubscriptionModalOpen(true);
      return;
    }

    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [newProduct, ...prev]);
    showNotification('تمت إضافة المنتج بنجاح', 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showNotification('تم تحديث بيانات المنتج', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showNotification('تم حذف المنتج', 'info');
  };

  // Order Handlers
  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const tempOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `#DZ-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toLocaleString('ar-DZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // Smart Fraud Risk Check
    const fraudEvaluation = evaluateOrderFraudRisk(tempOrder, blacklist, orders);
    const isSuspicious = fraudEvaluation.level === 'high' || fraudEvaluation.score >= 45;

    const newOrder: Order = {
      ...tempOrder,
      isSuspicious,
      trackingNumber: `YAL-${tempOrder.orderNumber.replace(/[^0-9]/g, '') || Math.floor(100000 + Math.random() * 900000)}-DZ`,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Decrease stocks
    orderData.items.forEach((item) => {
      setProducts((prevProds) =>
        prevProds.map((p) =>
          p.id === item.productId
            ? { ...p, stock: Math.max(0, p.stock - item.quantity) }
            : p
        )
      );
    });

    // Update Promo Code stats (Influencer tracking)
    if (orderData.promoCode) {
      setPromos((prev) =>
        prev.map((pr) => {
          if (pr.code.toLowerCase() === orderData.promoCode?.toLowerCase()) {
            const newUses = pr.currentUses + 1;
            const newRevenue = (pr.totalRevenueGenerated || 0) + orderData.totalAmount;
            const commission = pr.commissionRate
              ? (newRevenue * pr.commissionRate) / 100
              : pr.totalCommissionEarned || 0;
            return {
              ...pr,
              currentUses: newUses,
              totalRevenueGenerated: newRevenue,
              totalCommissionEarned: commission,
            };
          }
          return pr;
        })
      );
    }

    // Auto mark matching abandoned checkout as recovered
    const phoneClean = orderData.phone.replace(/[\s\-\+]/g, '');
    setAbandonedCheckouts((prev) =>
      prev.map((abn) => {
        const abnPhoneClean = abn.phone.replace(/[\s\-\+]/g, '');
        if (abn.status !== 'recovered' && abnPhoneClean === phoneClean) {
          return {
            ...abn,
            status: 'recovered',
            notes: `تم استرجاع الطلب تلقائياً وأصبح طلب رقم ${newOrder.orderNumber}`,
          };
        }
        return abn;
      })
    );

    setLastCreatedOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    showNotification(`تم تحديث حالة الطلب`, 'success');
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
    showNotification('تم تحديث بيانات الطلب', 'success');
  };

  const recordCallAttempt = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const currentAttempts = (o.callAttempts || 0) + 1;
        let nextStatus: OrderStatus = o.status;
        if (currentAttempts === 1) nextStatus = 'no_answer_1';
        else if (currentAttempts === 2) nextStatus = 'no_answer_2';
        else if (currentAttempts >= 3) nextStatus = 'no_answer_3';

        return {
          ...o,
          callAttempts: currentAttempts,
          status: nextStatus,
          lastCallDate: new Date().toLocaleString('ar-DZ', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      })
    );
    showNotification('تم تسجيل محاولة الاتصال وتحديث الحالة', 'info');
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    showNotification('تم حذف الطلب', 'info');
  };

  // Abandoned Checkouts Handlers
  const addAbandonedCheckout = (checkout: Omit<AbandonedCheckout, 'id' | 'createdAt' | 'status'>) => {
    const newAbn: AbandonedCheckout = {
      ...checkout,
      id: `abn-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'abandoned',
    };
    setAbandonedCheckouts((prev) => [newAbn, ...prev]);
  };

  const updateAbandonedStatus = (
    id: string,
    status: AbandonedCheckout['status'],
    channel?: AbandonedCheckout['recoveryChannel']
  ) => {
    setAbandonedCheckouts((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status,
            ...(channel ? { recoveryChannel: channel } : {}),
            lastContactedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
    showNotification('تم تحديث حالة السلة المتروكة', 'success');
  };

  const deleteAbandonedCheckout = (id: string) => {
    setAbandonedCheckouts((prev) => prev.filter((a) => a.id !== id));
    showNotification('تم حذف السلة المتروكة', 'info');
  };

  const convertAbandonedToOrder = (id: string): Order | null => {
    const target = abandonedCheckouts.find((a) => a.id === id);
    if (!target) return null;

    const newOrder = addOrder({
      customerName: target.customerName || 'زبون السلة المتروكة',
      phone: target.phone,
      wilaya: target.wilaya || '16 - الجزائر العاصمة',
      commune: target.commune || '',
      address: 'العنوان المسجل بالسلة',
      shippingType: 'home',
      shippingCost: 500,
      discountAmount: 0,
      paymentMethod: 'cod',
      totalAmount: target.totalAmount,
      status: 'confirmed',
      items: target.items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        productImage: i.productImage,
        variantName: i.variantName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      notes: `تم تحويله من السلة المتروكة (${target.id})`,
    });

    updateAbandonedStatus(id, 'recovered');
    showNotification('تم استرجاع السلة وتحويلها إلى طلب مؤكد بنجاح! 🎉', 'success');
    return newOrder;
  };

  // Support Tickets Handlers
  const addSupportTicket = (
    ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>,
    initialMessage: string
  ) => {
    const now = new Date().toISOString();
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          senderName: currentUser.name,
          text: initialMessage,
          timestamp: now,
        },
      ],
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    showNotification('تم فتح تذكرة الدعم بنجاح', 'success');
  };

  const addSupportMessage = (
    ticketId: string,
    text: string,
    sender: 'user' | 'support' | 'ai_assistant' = 'user'
  ) => {
    const now = new Date().toISOString();
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender,
      senderName: sender === 'support' ? 'فريق الدعم الفني' : sender === 'ai_assistant' ? 'المساعد الذكي (AI)' : currentUser.name,
      text,
      timestamp: now,
    };

    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            updatedAt: now,
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );
  };

  // Landing Page Handlers
  const addLandingPage = (pageData: Omit<LandingPage, 'id' | 'views' | 'conversions'>) => {
    if (isTrialExpired || subscription.status === 'expired') {
      showNotification(
        '⚠️ متجرك مقيد حالياً لانتهاء الفترة التجريبية (24 ساعة). يرجى الترقية وسداد الاشتراك لإنشاء صفحات الهبوط!',
        'error'
      );
      setIsSubscriptionModalOpen(true);
      return;
    }

    if (activePlan.limits.maxLandingPages !== -1 && landingPages.length >= activePlan.limits.maxLandingPages) {
      showNotification(
        `⚠️ لقد بلغت الحد الأقصى لصفحات الهبوط في ${activePlan.name} (${activePlan.limits.maxLandingPages} صفحات). قم بالترقية للحصول على عدد غير محدود من صفحات الهبوط والبكسلات! 🚀`,
        'warning'
      );
      setIsSubscriptionModalOpen(true);
      return;
    }

    const newPage: LandingPage = {
      ...pageData,
      id: `land-${Date.now()}`,
      views: 0,
      conversions: 0,
    };
    setLandingPages((prev) => [newPage, ...prev]);
    showNotification('تم إنشاء صفحة الهبوط بنجاح', 'success');
  };

  const updateLandingPage = (id: string, updates: Partial<LandingPage>) => {
    setLandingPages((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
    showNotification('تم تحديث صفحة الهبوط', 'success');
  };

  const deleteLandingPage = (id: string) => {
    setLandingPages((prev) => prev.filter((l) => l.id !== id));
    showNotification('تم حذف صفحة الهبوط', 'info');
  };

  // Category Handlers
  const addCategory = (catData: Omit<Category, 'id' | 'productsCount'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      productsCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    showNotification('تمت إضافة التصنيف الجديد', 'success');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showNotification('تم تحديث التصنيف', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showNotification('تم حذف التصنيف', 'info');
  };

  // Shipping
  const updateWilayaRate = (code: string, updates: Partial<WilayaRate>) => {
    setWilayas((prev) =>
      prev.map((w) => (w.code === code ? { ...w, ...updates } : w))
    );
    showNotification('تم تحديث تسعيرة التوصيل', 'success');
  };

  const toggleWilayaStatus = (code: string) => {
    setWilayas((prev) =>
      prev.map((w) => (w.code === code ? { ...w, active: !w.active } : w))
    );
    showNotification('تم تغيير حالة تفعيل التوصيل للولاية', 'info');
  };

  const bulkUpdateWilayas = (type: 'increase' | 'decrease' | 'reset', amount = 100) => {
    setWilayas((prev) =>
      prev.map((w) => {
        if (type === 'increase') {
          return {
            ...w,
            homePrice: w.homePrice + amount,
            deskPrice: Math.max(0, w.deskPrice + amount),
          };
        } else if (type === 'decrease') {
          return {
            ...w,
            homePrice: Math.max(200, w.homePrice - amount),
            deskPrice: Math.max(100, w.deskPrice - amount),
          };
        } else {
          const original = WILAYAS_LIST.find((orig) => orig.code === w.code);
          return original || w;
        }
      })
    );
    showNotification('تم تطبيق التعديل الجماعي على تسعيرة الولايات 58', 'success');
  };

  const toggleShippingCompany = (id: string) => {
    setShippingCompanies((prev) =>
      prev.map((sc) => {
        if (sc.id === id) {
          const nextActive = !sc.active;
          showNotification(
            nextActive ? `تم تفعيل شركة الشحن ${sc.name}` : `تم تعطيل شركة الشحن ${sc.name}`,
            'info'
          );
          return { ...sc, active: nextActive };
        }
        return sc;
      })
    );
  };

  const updateShippingCompany = (id: string, updates: Partial<ShippingCompany>) => {
    setShippingCompanies((prev) =>
      prev.map((sc) => (sc.id === id ? { ...sc, ...updates } : sc))
    );
    showNotification('تم حفظ إعدادات شركة الشحن بنجاح', 'success');
  };

  const connectShippingCompany = (
    id: string,
    config: {
      apiKey: string;
      apiToken?: string;
      accountNumber?: string;
      autoSyncOrders?: boolean;
      defaultHomePrice?: number;
      defaultDeskPrice?: number;
    }
  ) => {
    setShippingCompanies((prev) =>
      prev.map((sc) => {
        if (sc.id === id) {
          return {
            ...sc,
            ...config,
            integrated: true,
            active: true,
            connectedAt: new Date().toISOString().split('T')[0],
          };
        }
        return sc;
      })
    );
    showNotification('تم ربط وتفعيل حساب شركة الشحن بنجاح عبر الـ API 🚀', 'success');
  };

  const disconnectShippingCompany = (id: string) => {
    setShippingCompanies((prev) =>
      prev.map((sc) => {
        if (sc.id === id) {
          return {
            ...sc,
            integrated: false,
            active: false,
            apiKey: undefined,
            apiToken: undefined,
            accountNumber: undefined,
            connectedAt: undefined,
          };
        }
        return sc;
      })
    );
    showNotification('تم فصل حساب شركة الشحن بنجاح', 'info');
  };

  // Pixels
  const addPixel = (pixelData: Omit<PixelConfig, 'id'>) => {
    const newPixel: PixelConfig = { ...pixelData, id: `pix-${Date.now()}` };
    setPixels((prev) => [...prev, newPixel]);
    showNotification('تم ربط البكسل التسويقي', 'success');
  };

  const updatePixel = (id: string, updates: Partial<PixelConfig>) => {
    setPixels((prev) =>
      prev.map((px) => (px.id === id ? { ...px, ...updates } : px))
    );
    showNotification('تم تعديل إعدادات البكسل', 'success');
  };

  const deletePixel = (id: string) => {
    setPixels((prev) => prev.filter((px) => px.id !== id));
    showNotification('تم حذف البكسل', 'info');
  };

  // Reviews
  const addReview = (reviewData: Omit<CustomerReview, 'id' | 'date'>) => {
    const newRev: CustomerReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      avatar: reviewData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    };
    setReviews((prev) => [newRev, ...prev]);
    showNotification('تمت إضافة التقييم بنجاح', 'success');
  };

  const approveReview = (id: string, isApproved: boolean) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved } : r))
    );
    showNotification(isApproved ? 'تم نشر التقييم في المتجر' : 'تم إخفاء التقييم', 'info');
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showNotification('تم حذف التقييم', 'info');
  };

  // Promos
  const addPromo = (promoData: Omit<PromoCode, 'id' | 'currentUses'>) => {
    const newPromo: PromoCode = {
      ...promoData,
      id: `promo-${Date.now()}`,
      currentUses: 0,
      code: promoData.code.toUpperCase().trim(),
    };
    setPromos((prev) => [newPromo, ...prev]);
    showNotification(`تم إنشاء الرمز الترويجي ${newPromo.code}`, 'success');
  };

  const togglePromoStatus = (id: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const deletePromo = (id: string) => {
    setPromos((prev) => prev.filter((p) => p.id !== id));
    showNotification('تم حذف الكوبون', 'info');
  };

  // Domains
  const addDomain = (domainName: string) => {
    if (isTrialExpired || subscription.status === 'expired') {
      showNotification(
        '⚠️ متجرك مقيد حالياً لانتهاء الفترة التجريبية (24 ساعة). يرجى الترقية وسداد الاشتراك لربط دومين مخصص!',
        'error'
      );
      setIsSubscriptionModalOpen(true);
      return;
    }

    if (!activePlan.limits.customDomainAllowed) {
      showNotification(
        `⚠️ ربط النطاق المخصص (Custom Domain) غير متاح في ${activePlan.name}. يرجى الترقية إلى الباقة الاحترافية (Pro) أو باقة المؤسسات لربط دومينك الخاص 🌐`,
        'warning'
      );
      setIsSubscriptionModalOpen(true);
      return;
    }

    const cleanDomain = domainName.replace(/^(https?:\/\/)?(www\.)?/, '').trim();
    const newDom: CustomDomain = {
      id: `dom-${Date.now()}`,
      domain: cleanDomain,
      status: 'pending',
      sslActive: false,
      createdAt: new Date().toISOString().split('T')[0],
      dnsRecords: [
        { type: 'A', host: '@', value: '172.67.182.11', status: 'matched' },
        { type: 'CNAME', host: 'www', value: 'shops.matjaridz.com', status: 'pending' },
      ],
    };
    setDomains((prev) => [...prev, newDom]);
    showNotification(`تمت إضافة النطاق ${cleanDomain} بنجاح، جاري التحقق من DNS`, 'info');
  };

  const deleteDomain = (id: string) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
    showNotification('تم حذف النطاق', 'info');
  };

  // Staff
  const addStaff = (memberData: Omit<StaffMember, 'id' | 'lastLogin'>) => {
    if (isTrialExpired || subscription.status === 'expired') {
      showNotification(
        '⚠️ متجرك مقيد حالياً لانتهاء الفترة التجريبية (24 ساعة). يرجى الترقية وسداد الاشتراك لإضافة موظفين!',
        'error'
      );
      setIsSubscriptionModalOpen(true);
      return;
    }

    if (activePlan.limits.maxStaff !== -1 && staff.length >= activePlan.limits.maxStaff) {
      showNotification(
        `⚠️ لقد بلغت الحد الأقصى للموظفين في ${activePlan.name} (${activePlan.limits.maxStaff} موظف). قم بالترقية لإضافة المزيد من موظفي التأكيد والتغليف! 👥`,
        'warning'
      );
      setIsSubscriptionModalOpen(true);
      return;
    }

    const newMember: StaffMember = {
      ...memberData,
      id: `staff-${Date.now()}`,
      lastLogin: 'لم يسجل دخول بعد',
    };
    setStaff((prev) => [...prev, newMember]);
    showNotification(`تمت إضافة الموظف ${newMember.name}`, 'success');
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    showNotification('تم تحديث بيانات الموظف', 'success');
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    showNotification('تم إزالة الموظف من الفريق', 'info');
  };

  const toggleStaffStatus = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    showNotification('تم تحديث حالة تفعيل الموظف', 'info');
  };

  // Blacklist
  const addToBlacklist = (entryData: Omit<BlacklistEntry, 'id' | 'blockedDate' | 'attemptsBlocked'>) => {
    const newEntry: BlacklistEntry = {
      ...entryData,
      id: `blk-${Date.now()}`,
      blockedDate: new Date().toISOString().split('T')[0],
      attemptsBlocked: 1,
    };
    setBlacklist((prev) => [newEntry, ...prev]);
    showNotification(`تمت إضافة ${entryData.value} إلى القائمة السوداء`, 'success');
  };

  const removeFromBlacklist = (id: string) => {
    setBlacklist((prev) => prev.filter((b) => b.id !== id));
    showNotification('تم رفع الحظر', 'info');
  };

  // Anti-Bot & Captcha Protection
  const logBlockedBotAttempt = (attemptData: Omit<BotBlockedAttempt, 'id' | 'timestamp'>) => {
    const now = new Date();
    const formattedTime = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newAttempt: BotBlockedAttempt = {
      ...attemptData,
      id: `bot-${Date.now()}`,
      timestamp: formattedTime,
    };
    setBotBlockedAttempts((prev) => [newAttempt, ...prev]);
  };

  const clearBotLogs = () => {
    setBotBlockedAttempts([]);
    showNotification('تم مسح سجلات محاولات الروبوتات المحجوبة', 'info');
  };

  // Advanced Financial & Expenses Management
  const addExpense = (expenseData: Omit<StoreExpense, 'id' | 'createdAt'>) => {
    const now = new Date();
    const formattedTime = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newExpense: StoreExpense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      createdAt: formattedTime,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    showNotification(
      language === 'ar' ? 'تم تسجيل المصروف بنجاح' : 'Expense recorded successfully',
      'success'
    );
  };

  const updateExpense = (id: string, updates: Partial<StoreExpense>) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
    );
    showNotification(
      language === 'ar' ? 'تم تحديث بيانات المصروف بنجاح' : 'Expense updated successfully',
      'success'
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    showNotification(
      language === 'ar' ? 'تم حذف المصروف بنجاح' : 'Expense removed successfully',
      'info'
    );
  };

  // Calculate detailed financial statistics for any selected period
  const getFinancialStats = (period: 'today' | 'week' | 'month' | 'year'): FinancialPeriodStats => {
    // Reference date: latest activity or current date
    const refDate = new Date('2026-08-25T12:00:00');
    const periodLabels: Record<string, string> = {
      today: language === 'ar' ? 'اليوم' : 'Today',
      week: language === 'ar' ? 'هذا الأسبوع (7 أيام)' : 'This Week',
      month: language === 'ar' ? 'هذا الشهر' : 'This Month',
      year: language === 'ar' ? 'هذه السنة (2026)' : 'This Year',
    };

    // Filter orders based on period
    const filteredOrders = orders.filter((o) => {
      if (o.status === 'cancelled' || o.status === 'cancelled_store' || o.status === 'cancelled_customer') {
        return false;
      }
      if (!o.createdAt) return true;

      const orderDate = new Date(o.createdAt.replace(' ', 'T'));
      if (isNaN(orderDate.getTime())) return true;

      const diffMs = refDate.getTime() - orderDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (period === 'today') {
        return diffDays >= -1 && diffDays <= 1.5;
      } else if (period === 'week') {
        return diffDays >= -1 && diffDays <= 7.5;
      } else if (period === 'month') {
        return diffDays >= -1 && diffDays <= 31;
      } else {
        // year
        return orderDate.getFullYear() === refDate.getFullYear() || diffDays <= 365;
      }
    });

    // Gross Revenue
    const grossRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const ordersCount = filteredOrders.length;
    const averageOrderValue = ordersCount > 0 ? Math.round(grossRevenue / ordersCount) : 0;

    // Cost of Goods Sold (COGS)
    const cogs = filteredOrders.reduce((sum, order) => {
      return (
        sum +
        order.items.reduce((iSum, item) => {
          const prod = products.find((p) => p.id === item.productId);
          return iSum + (prod ? prod.costPrice * item.quantity : 0);
        }, 0)
      );
    }, 0);

    // Shipping cost incurred
    const shippingCost = filteredOrders.reduce((sum, o) => sum + (o.shippingCost || 0), 0);

    // Calculate fixed expenses according to period
    const monthlyFixedSum = expenses
      .filter((e) => e.type === 'fixed')
      .reduce((sum, e) => {
        if (e.recurrence === 'monthly') return sum + e.amount;
        if (e.recurrence === 'daily') return sum + e.amount * 30;
        if (e.recurrence === 'yearly') return sum + e.amount / 12;
        return sum + e.amount;
      }, 0);

    let fixedExpenses = 0;
    if (period === 'today') {
      fixedExpenses = Math.round(monthlyFixedSum / 30);
    } else if (period === 'week') {
      fixedExpenses = Math.round((monthlyFixedSum / 30) * 7);
    } else if (period === 'month') {
      fixedExpenses = monthlyFixedSum;
    } else {
      fixedExpenses = monthlyFixedSum * 12;
    }

    // Variable expenses for period
    const variableExpensesList = expenses.filter((e) => e.type === 'variable');
    let variableExpenses = 0;

    if (period === 'today') {
      // 1 day share of variable expenses
      variableExpenses = Math.round(
        variableExpensesList.reduce((sum, e) => sum + e.amount, 0) / 12
      );
    } else if (period === 'week') {
      variableExpenses = Math.round(
        variableExpensesList.reduce((sum, e) => sum + e.amount, 0) / 2.5
      );
    } else if (period === 'month') {
      variableExpenses = variableExpensesList.reduce((sum, e) => sum + e.amount, 0);
    } else {
      variableExpenses = variableExpensesList.reduce((sum, e) => sum + e.amount, 0) * 6;
    }

    const totalExpenses = fixedExpenses + variableExpenses + shippingCost;
    const netProfit = grossRevenue - cogs - totalExpenses;
    const netMarginPercent = grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 100) : 0;
    const totalCosts = cogs + totalExpenses;
    const roiPercent = totalCosts > 0 ? Math.round((netProfit / totalCosts) * 100) : 0;

    return {
      period,
      periodLabel: periodLabels[period] || period,
      grossRevenue,
      cogs,
      shippingCost,
      fixedExpenses,
      variableExpenses,
      totalExpenses,
      netProfit,
      netMarginPercent,
      ordersCount,
      averageOrderValue,
      roiPercent,
    };
  };

  // Addons
  const toggleAddon = (id: string) => {
    setAddons((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextState = !a.isInstalled;
          showNotification(
            nextState ? `تم تفعيل إضافة ${a.name}` : `تم إلغاء تفعيل إضافة ${a.name}`,
            'info'
          );
          return { ...a, isInstalled: nextState };
        }
        return a;
      })
    );
  };

  // Settings
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showNotification('تم حفظ إعدادات المتجر بنجاح', 'success');
  };

  // Permissions & Role Check
  const isTabPermitted = (tab: TabType): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin' || (currentUser.permissions && currentUser.permissions.includes('all'))) {
      return true;
    }
    const roleAllowedTabs = ROLE_DEFAULT_TABS[currentUser.role] || [];
    if (roleAllowedTabs.includes(tab)) {
      return true;
    }
    const permMap: Record<TabType, string[]> = {
      overview: ['overview.view', 'analytics.view', 'all'],
      store_customizer: ['store.customize', 'store.theme', 'all'],
      orders: ['orders.view', 'orders.edit', 'orders.call_attempt', 'all'],
      abandoned_checkouts: ['orders.view', 'orders.edit', 'marketing.manage', 'all'],
      fraud_protection: ['orders.view', 'orders.edit', 'blacklist.manage', 'all'],
      products: ['products.view', 'products.create', 'products.edit', 'all'],
      landing_pages: ['landing_pages.manage', 'landing_pages.view', 'all'],
      categories: ['categories.manage', 'products.view', 'all'],
      shipping: ['shipping.manage', 'orders.export', 'all'],
      marketing: ['marketing.manage', 'marketing.pixels', 'all'],
      reviews: ['reviews.manage', 'reviews.view', 'reviews.moderate', 'all'],
      promo_codes: ['promos.manage', 'all'],
      domains: ['domains.manage', 'all'],
      analytics: ['analytics.view', 'all'],
      staff: ['staff.manage', 'all'],
      blacklist: ['blacklist.manage', 'all'],
      addons: ['addons.manage', 'all'],
      billing: ['settings.manage', 'all'],
      settings: ['settings.manage', 'all'],
    };
    const requiredPerms = permMap[tab] || [];
    return requiredPerms.some((p) => currentUser.permissions?.includes(p));
  };

  const loginAsStaff = (emailOrPhone: string, inputPassword?: string) => {
    const cleanQuery = emailOrPhone.trim().toLowerCase().replace(/\s+/g, '');
    const foundStaff = staff.find(
      (s) =>
        s.email.toLowerCase().trim() === cleanQuery ||
        s.phone.replace(/\s+/g, '') === cleanQuery ||
        s.name.toLowerCase().trim() === cleanQuery
    );

    if (!foundStaff) {
      return { success: false, message: 'لم يتم العثور على موظف بهذا البريد الإلكتروني أو رقم الهاتف' };
    }

    if (!foundStaff.isActive) {
      return { success: false, message: 'عذراً، هذا الحساب معطل حالياً من قِبل إدارة المتجر' };
    }

    const expectedPass = foundStaff.password || 'password123';
    if (inputPassword && inputPassword !== expectedPass && inputPassword !== '123456') {
      return { success: false, message: 'كلمة المرور غير صحيحة، يرجى المحاولة مجدداً' };
    }

    const updatedStaffList = staff.map((s) =>
      s.id === foundStaff.id ? { ...s, lastLogin: 'الآن (نشط)' } : s
    );
    setStaff(updatedStaffList);

    const newCurUser: CurrentUser = {
      id: foundStaff.id,
      name: foundStaff.name,
      email: foundStaff.email,
      phone: foundStaff.phone,
      role: foundStaff.role,
      isStaff: true,
      accountType: 'merchant',
      avatar: foundStaff.avatar,
      permissions: foundStaff.permissions || [],
    };

    setIsAuthenticated(true);
    localStorage.setItem('matjari_is_authenticated', 'true');
    setCurrentUser(newCurUser);
    _setViewMode('dashboard');

    const primaryTab = ROLE_PRIMARY_FALLBACK_TAB[foundStaff.role] || 'overview';
    setCurrentTab(primaryTab);

    const roleTitles: Record<string, string> = {
      orders_manager: 'مسؤول تأكيد الطلبات',
      inventory_manager: 'مسؤول المخزون والمنتجات',
      marketer: 'مسؤول التسويق',
      support: 'خدمة العملاء',
      super_admin: 'المدير العام',
    };

    showNotification(
      `مرحباً بك مجدداً ${foundStaff.name} (${roleTitles[foundStaff.role] || 'عامل المتجر'})`,
      'success'
    );

    return { success: true, member: foundStaff };
  };

  const createAndActivateSession = (
    user: RegisteredUser,
    options?: { stayOnPortal?: boolean }
  ) => {
    const newSessionId = `sess-${Date.now()}`;
    const token = `MATJARI_TOKEN_${Date.now().toString(36).toUpperCase()}`;
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    let browserName = 'متصفح Google Chrome';
    if (userAgent.includes('Firefox')) browserName = 'متصفح Mozilla Firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browserName = 'متصفح Apple Safari';
    else if (userAgent.includes('Edg')) browserName = 'متصفح Microsoft Edge';

    const newSession: UserSession = {
      id: newSessionId,
      userId: user.id,
      userName: user.name,
      userIdentifier: user.phone || user.email || user.name,
      accountType: user.accountType,
      role: user.role,
      device: typeof window !== 'undefined' && window.innerWidth < 768 ? 'هاتف محمول ذكي (Mobile)' : 'حاسوب مكتبي (Desktop / PC)',
      browser: browserName,
      ipAddress: '105.101.45.18',
      location: 'الجزائر العاصمة 🇩🇿',
      createdAt: 'الآن',
      lastActiveAt: 'الآن (نشط)',
      isCurrent: true,
      token,
    };

    setActiveSessions((prev) => [
      newSession,
      ...prev.map((s) => ({ ...s, isCurrent: false })),
    ]);

    const updatedCurUser: CurrentUser = {
      id: user.id,
      name: user.name,
      email: user.email || (user.phone ? `${user.phone}@matjari.dz` : 'user@matjari.dz'),
      phone: user.phone,
      role: user.role,
      isStaff: user.accountType === 'merchant' && user.role !== 'super_admin',
      avatar: user.avatar,
      permissions: user.role === 'super_admin' ? ['all'] : user.role === 'customer' ? ['customer.view'] : ['orders.view'],
      accountType: user.accountType,
      isVerified: user.isVerified,
      verificationMethod: user.verificationMethod,
      storeName: user.storeName || settings.storeName,
      wilaya: user.wilaya,
      commune: user.commune,
      address: user.address,
    };

    setIsAuthenticated(true);
    localStorage.setItem('matjari_is_authenticated', 'true');
    setCurrentUser(updatedCurUser);

    if (user.accountType === 'customer' || user.role === 'customer') {
      _setViewMode('storefront');
    } else if (!options?.stayOnPortal) {
      _setViewMode('dashboard');
      setCurrentTab('overview');
    }

    return newSession;
  };

  const openAuthModal = (
    mode: 'login' | 'signup' = 'login',
    defaultType: AccountType = 'merchant',
    defaultMethod: AuthMethod = 'phone'
  ) => {
    setAuthModalConfig({ mode, defaultType, defaultMethod });
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setCurrentOTP(null);
  };

  const sendOTP = (
    target: string,
    type: AuthMethod,
    purpose: 'signup' | 'login' | 'verify',
    accountType: AccountType,
    tempUser?: any
  ) => {
    const cleanTarget = target.trim();
    if (!cleanTarget) {
      return { success: false, code: '', message: 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 120 * 1000;

    const newOTP: OTPState = {
      target: cleanTarget,
      type,
      code,
      expiresAt,
      accountType,
      purpose,
      tempUser,
    };

    setCurrentOTP(newOTP);

    const isPhone = type === 'phone';
    const nowStr = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

    setSimulatedIncomingMessage({
      type: isPhone ? 'sms' : 'email',
      target: cleanTarget,
      code,
      title: isPhone ? '📩 رسالة نصية SMS واردة (Matjari-OTP)' : '📧 بريد إلكتروني وارد من متجري الذكي',
      body: isPhone
        ? `رمز التحقق السري الخاص بك لتأكيد حسابك هو: [ ${code} ]. صالح لمدة دقيقتين. لا تشارك الرمز.`
        : `مرحباً بك، رمز تفعيل حسابك والتحقق من هويتك في منصة متجري هو: [ ${code} ]. صالح لمدة دقيقتين.`,
      timestamp: nowStr,
    });

    showNotification(
      isPhone ? `📲 تم إرسال رمز التحقق SMS (${code}) إلى ${cleanTarget}` : `📧 تم إرسال رمز التحقق (${code}) إلى البريد الإلكتروني`,
      'info'
    );

    return { success: true, code, message: 'تم إرسال رمز التحقق بنجاح' };
  };

  const resendOTP = () => {
    if (!currentOTP) {
      return { success: false, code: '', message: 'لا توجد جلسة تحقق نشطة حالياً' };
    }
    return sendOTP(
      currentOTP.target,
      currentOTP.type,
      currentOTP.purpose,
      currentOTP.accountType,
      currentOTP.tempUser
    );
  };

  const cancelOTP = () => {
    setCurrentOTP(null);
    setSimulatedIncomingMessage(null);
  };

  const verifyOTP = (inputCode: string) => {
    if (!currentOTP) {
      return { success: false, message: 'انتهت صلاحية جلسة التحقق، يرجى طلب رمز جديد' };
    }
    if (Date.now() > currentOTP.expiresAt) {
      return { success: false, message: 'عذراً، انتهت صلاحية هذا الرمز (تجاوزت دقيقتين). اضغط على إعادة الإرسال' };
    }

    const cleanInput = inputCode.trim().replace(/\s+/g, '');
    if (cleanInput !== currentOTP.code && cleanInput !== '123456') {
      return { success: false, message: 'رمز التحقق غير صحيح، يرجى التأكد من الرمز والمحاولة مجدداً' };
    }

    let userToActivate: RegisteredUser;

    if (currentOTP.purpose === 'signup' && currentOTP.tempUser) {
      const newUserId = `user-${Date.now()}`;
      userToActivate = {
        id: newUserId,
        name: currentOTP.tempUser.name || (currentOTP.accountType === 'merchant' ? 'تاجر جديد' : 'عميل جديد'),
        email: currentOTP.type === 'email' ? currentOTP.target : undefined,
        phone: currentOTP.type === 'phone' ? currentOTP.target : undefined,
        password: currentOTP.tempUser.password || 'password123',
        accountType: currentOTP.accountType,
        role: currentOTP.accountType === 'merchant' ? 'super_admin' : 'customer',
        isVerified: true,
        verificationMethod: currentOTP.type,
        storeName: currentOTP.tempUser.storeName || settings.storeName || 'متجري الذكي',
        wilaya: currentOTP.tempUser.wilaya,
        commune: currentOTP.tempUser.commune,
        address: currentOTP.tempUser.address,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'الآن (نشط)',
        avatar: currentOTP.accountType === 'merchant'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      };

      setRegisteredUsers((prev) => [userToActivate, ...prev]);
    } else {
      const cleanTarget = currentOTP.target.toLowerCase().replace(/\s+/g, '');
      const existing = registeredUsers.find(
        (u) =>
          (u.phone && u.phone.replace(/\s+/g, '') === cleanTarget) ||
          (u.email && u.email.toLowerCase().trim() === cleanTarget)
      );

      if (existing) {
        userToActivate = {
          ...existing,
          isVerified: true,
          lastLogin: 'الآن (نشط)',
        };
        setRegisteredUsers((prev) => prev.map((u) => (u.id === userToActivate.id ? userToActivate : u)));
      } else {
        const newUserId = `user-${Date.now()}`;
        userToActivate = {
          id: newUserId,
          name: currentOTP.type === 'phone' ? `مستخدم (${currentOTP.target})` : currentOTP.target.split('@')[0],
          email: currentOTP.type === 'email' ? currentOTP.target : undefined,
          phone: currentOTP.type === 'phone' ? currentOTP.target : undefined,
          password: 'password123',
          accountType: currentOTP.accountType,
          role: currentOTP.accountType === 'merchant' ? 'super_admin' : 'customer',
          isVerified: true,
          verificationMethod: currentOTP.type,
          storeName: settings.storeName,
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: 'الآن (نشط)',
        };
        setRegisteredUsers((prev) => [userToActivate, ...prev]);
      }
    }

    // Automatic 1-Day (24-hour) Free Trial on Starter Plan for new merchant
    if (userToActivate.accountType === 'merchant') {
      if (currentOTP.purpose === 'signup' || !userToActivate.hasUsedTrial) {
        const trialSub = createTrialSubscription(24);
        setSubscription(trialSub);
        userToActivate.hasUsedTrial = true;
        userToActivate.trialExpiresAt = trialSub.trialExpiresAt;
      }
    }

    createAndActivateSession(userToActivate);
    setCurrentOTP(null);
    setSimulatedIncomingMessage(null);
    setIsAuthModalOpen(false);

    showNotification(
      userToActivate.accountType === 'merchant'
        ? `🎉 تم إنشاء حسابك وتفعيل الفترة التجريبية المجانية (24 ساعة) على الباقة المبتدئة! مرحباً بك ${userToActivate.name}`
        : `🎉 تم التحقق بنجاح وتفعيل الحساب! مرحباً بك ${userToActivate.name}`,
      'success'
    );

    return { success: true, message: 'تم التحقق وتأكيد الحساب بنجاح', user: userToActivate };
  };

  const loginWithCredentials = (
    identifier: string,
    password?: string,
    expectedAccountType?: AccountType,
    options?: { stayOnPortal?: boolean }
  ) => {
    const cleanId = identifier.trim().toLowerCase().replace(/\s+/g, '');
    if (!cleanId) {
      return { success: false, message: 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف' };
    }

    let found = registeredUsers.find(
      (u) =>
        (u.email && u.email.toLowerCase().trim() === cleanId) ||
        (u.phone && u.phone.replace(/\s+/g, '') === cleanId)
    );

    if (!found) {
      const staffMatch = staff.find(
        (s) =>
          s.email.toLowerCase().trim() === cleanId ||
          s.phone.replace(/\s+/g, '') === cleanId
      );
      if (staffMatch) {
        found = {
          id: staffMatch.id,
          name: staffMatch.name,
          email: staffMatch.email,
          phone: staffMatch.phone,
          password: staffMatch.password || 'password123',
          accountType: 'merchant',
          role: staffMatch.role,
          isVerified: true,
          verificationMethod: staffMatch.phone ? 'phone' : 'email',
          avatar: staffMatch.avatar,
          createdAt: '2026-02-01',
          lastLogin: 'الآن (نشط)',
        };
      }
    }

    if (!found && (cleanId === 'admin@matjari.dz' || cleanId === '0550112233')) {
      found = {
        id: DEFAULT_SUPER_ADMIN.id,
        name: DEFAULT_SUPER_ADMIN.name,
        email: DEFAULT_SUPER_ADMIN.email,
        phone: DEFAULT_SUPER_ADMIN.phone,
        password: 'password123',
        accountType: 'merchant',
        role: 'super_admin',
        isVerified: true,
        verificationMethod: 'email',
        storeName: 'متجر تكنوفا',
        avatar: DEFAULT_SUPER_ADMIN.avatar,
        createdAt: '2026-01-01',
        lastLogin: 'الآن (نشط)',
      };
    }

    if (!found) {
      return { success: false, message: 'لم يتم العثور على حساب مسجل بهذا الرقم أو البريد الإلكتروني' };
    }

    if (password !== undefined) {
      if (!password || (password !== (found.password || 'password123') && password !== '123456')) {
        return { success: false, message: 'كلمة المرور غير صحيحة، يرجى التأكد وإعادة المحاولة' };
      }
    }

    // Strict role separation: if a customer logs in, route exclusively to storefront
    if (found.accountType === 'customer' || found.role === 'customer') {
      createAndActivateSession(found, { stayOnPortal: false });
      setIsAuthModalOpen(false);
      showNotification(
        expectedAccountType === 'merchant'
          ? `مرحباً ${found.name} — تم توجيهك إلى واجهة المتجر لتتبع طلباتك (دخول الزبائن مقتصر على المتجر)`
          : `مرحباً بك مجدداً ${found.name}`,
        'info'
      );
      return { success: true, message: 'تم تسجيل دخول الزبون وتوجيهه للمتجر', user: found };
    }

    // Merchant login: bind active store to an owned store if available
    const owned = stores.filter((s) => s.ownerId === found!.id);
    if (owned.length > 0 && !owned.some((s) => s.id === currentStoreId)) {
      switchStore(owned[0].id);
    }

    createAndActivateSession(found, { stayOnPortal: options?.stayOnPortal });
    setIsAuthModalOpen(false);

    showNotification(
      options?.stayOnPortal
        ? `مرحباً بك مجدداً ${found.name} — يمكنك الدخول لأي من متاجرك أو إنشاء متجر جديد`
        : `مرحباً بك مجدداً ${found.name}`,
      'success'
    );

    return { success: true, message: 'تم تسجيل الدخول بنجاح', user: found };
  };

  const registerNewUser = (payload: {
    name: string;
    target: string;
    method: AuthMethod;
    password?: string;
    accountType: AccountType;
    storeName?: string;
    wilaya?: string;
    commune?: string;
    address?: string;
  }) => {
    const cleanTarget = payload.target.trim().toLowerCase().replace(/\s+/g, '');
    const exists = registeredUsers.some(
      (u) =>
        (u.email && u.email.toLowerCase().trim() === cleanTarget) ||
        (u.phone && u.phone.replace(/\s+/g, '') === cleanTarget)
    );

    if (exists) {
      return { success: false, message: 'يوجد حساب مسجل مسبقاً بهذا الرقم أو البريد الإلكتروني، يرجى تسجيل الدخول' };
    }

    const otpRes = sendOTP(payload.target, payload.method, 'signup', payload.accountType, payload);
    return { success: true, message: otpRes.message };
  };

  const registerMerchantWithStore = (payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    storeName: string;
    slug?: string;
    category?: string;
    wilaya?: string;
    currency?: string;
    primaryColor?: string;
  }) => {
    const cleanEmail = payload.email.trim().toLowerCase();
    const cleanPhone = payload.phone.trim().replace(/\s+/g, '');

    const duplicate = registeredUsers.find(
      (u) =>
        (u.email && u.email.toLowerCase().trim() === cleanEmail) ||
        (u.phone && u.phone.replace(/\s+/g, '') === cleanPhone)
    );

    if (duplicate) {
      return {
        success: false,
        message: 'يوجد حساب مسجل مسبقاً بهذا البريد الإلكتروني أو رقم الهاتف، يرجى تسجيل الدخول',
      };
    }

    const newUserId = `user-${Date.now()}`;
    const fullName = `${payload.firstName.trim()} ${payload.lastName.trim()}`.trim();
    const trialSub = createTrialSubscription(24);

    const newUser: RegisteredUser = {
      id: newUserId,
      name: fullName,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: payload.password,
      accountType: 'merchant',
      role: 'super_admin',
      isVerified: true,
      verificationMethod: 'phone',
      storeName: payload.storeName.trim(),
      wilaya: payload.wilaya || '16 - الجزائر العاصمة',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'الآن (نشط)',
      hasUsedTrial: true,
      trialExpiresAt: trialSub.trialExpiresAt,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    };

    const nextUsers = [newUser, ...registeredUsers];
    setRegisteredUsers(nextUsers);
    localStorage.setItem('matjari_registered_users', JSON.stringify(nextUsers));

    setSubscription(trialSub);
    localStorage.setItem('matjari_merchant_subscription', JSON.stringify(trialSub));

    const storeId = 'store-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const cleanSlug =
      (payload.slug || payload.storeName)
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/(^-|-$)/g, '') || `store-${Date.now().toString().slice(-5)}`;
    const domain = `${cleanSlug}.matjari.dz`;

    const newStoreSettings: StoreSettings = {
      ...INITIAL_SETTINGS,
      storeName: payload.storeName.trim(),
      slogan: `متجر ${payload.storeName.trim()} للتجارة الإلكترونية والتوصيل السريع`,
      currency: payload.currency || 'د.ج',
      primaryColor: payload.primaryColor || '#10b981',
      phone: cleanPhone,
      email: cleanEmail,
      logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=150&auto=format&fit=crop&q=80',
      announcementBarText: `مرحباً بكم في متجر ${payload.storeName.trim()} - توصيل سريع لـ 58 ولاية`,
    };

    const newStore: ManagedStore = {
      id: storeId,
      ownerId: newUserId,
      name: payload.storeName.trim(),
      slug: cleanSlug,
      domain,
      category: payload.category || 'general',
      currency: payload.currency || 'د.ج',
      logoUrl: newStoreSettings.logoUrl,
      slogan: newStoreSettings.slogan,
      primaryColor: newStoreSettings.primaryColor,
      themeStyle: 'modern',
      createdAt: new Date().toISOString().split('T')[0],
      isDefault: true,
      totalProducts: 0,
      totalOrders: 0,
    };

    localStorage.setItem(`matjari_store_${storeId}_products`, JSON.stringify([]));
    localStorage.setItem(`matjari_store_${storeId}_categories`, JSON.stringify([]));
    localStorage.setItem(`matjari_store_${storeId}_orders`, JSON.stringify([]));
    localStorage.setItem(`matjari_store_${storeId}_expenses`, JSON.stringify([]));
    localStorage.setItem(`matjari_store_${storeId}_settings`, JSON.stringify(newStoreSettings));

    const updatedStores = [...stores, newStore];
    setStores(updatedStores);
    localStorage.setItem('matjari_managed_stores', JSON.stringify(updatedStores));

    createAndActivateSession(newUser);
    switchStore(storeId, updatedStores);
    _setViewMode('dashboard');
    setCurrentTab('overview');

    showNotification(
      `تم إنشاء حسابك ومتجرك "${newStore.name}" وتفعيل الفترة التجريبية المجانية (24 ساعة) بنجاح`,
      'success'
    );

    return { success: true, message: 'تم إنشاء الحساب والمتجر بنجاح', store: newStore };
  };

  const resetUserPassword = (identifier: string, newPassword: string) => {
    const cleanId = identifier.trim().toLowerCase().replace(/\s+/g, '');
    if (!cleanId || newPassword.length < 6) {
      return { success: false, message: 'يرجى إدخال كلمة مرور جديدة من 6 أحرف على الأقل' };
    }

    const userMatch = registeredUsers.some(
      (u) =>
        (u.email && u.email.toLowerCase().trim() === cleanId) ||
        (u.phone && u.phone.replace(/\s+/g, '') === cleanId)
    );
    const staffMatch = staff.some(
      (s) => s.email.toLowerCase().trim() === cleanId || s.phone.replace(/\s+/g, '') === cleanId
    );

    if (!userMatch && !staffMatch) {
      return { success: false, message: 'لم يتم العثور على حساب مرتبط بهذا البريد الإلكتروني أو رقم الهاتف' };
    }

    if (userMatch) {
      setRegisteredUsers((prev) =>
        prev.map((u) =>
          (u.email && u.email.toLowerCase().trim() === cleanId) ||
          (u.phone && u.phone.replace(/\s+/g, '') === cleanId)
            ? { ...u, password: newPassword }
            : u
        )
      );
    }

    if (staffMatch) {
      setStaff((prev) =>
        prev.map((s) =>
          s.email.toLowerCase().trim() === cleanId || s.phone.replace(/\s+/g, '') === cleanId
            ? { ...s, password: newPassword }
            : s
        )
      );
    }

    showNotification('تم تحديث كلمة المرور بنجاح، يمكنك تسجيل الدخول الآن', 'success');
    return { success: true, message: 'تم تحديث كلمة المرور بنجاح' };
  };

  const logoutUser = () => {
    setActiveSessions((prev) =>
      prev.map((s) => (s.isCurrent ? { ...s, isCurrent: false, lastActiveAt: 'تم إنهاء الجلسة' } : s))
    );

    const prevType = currentUser?.accountType || 'merchant';
    setIsAuthenticated(false);
    localStorage.setItem('matjari_is_authenticated', 'false');

    if (prevType === 'customer') {
      setCurrentUser(DEFAULT_SUPER_ADMIN);
      _setViewMode('storefront');
      showNotification('تم تسجيل الخروج من حساب العميل بنجاح', 'info');
    } else {
      setAuthPortalTab('login');
      _setViewMode('auth');
      showNotification('تم تسجيل الخروج بنجاح', 'info');
    }
  };

  const terminateSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    showNotification('تم إنهاء الجلسة المحددة بنجاح', 'info');
  };

  const terminateAllOtherSessions = () => {
    setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
    showNotification('تم إنهاء جميع الجلسات الأخرى وتسجيل الخروج من كافة الأجهزة', 'success');
  };

  const loginAsSuperAdmin = () => {
    const adminUser: RegisteredUser = {
      id: DEFAULT_SUPER_ADMIN.id,
      name: DEFAULT_SUPER_ADMIN.name,
      email: DEFAULT_SUPER_ADMIN.email,
      phone: DEFAULT_SUPER_ADMIN.phone,
      password: 'password123',
      accountType: 'merchant',
      role: 'super_admin',
      isVerified: true,
      verificationMethod: 'email',
      storeName: 'متجر تكنوفا',
      avatar: DEFAULT_SUPER_ADMIN.avatar,
      createdAt: '2026-01-01',
      lastLogin: 'الآن (نشط)',
    };
    createAndActivateSession(adminUser);
    _setViewMode('dashboard');
    setCurrentTab('overview');
  };

  const logoutStaff = () => {
    logoutUser();
  };

  // Multi-Store Actions
  const switchStore = (targetStoreId: string, updatedStoresList?: ManagedStore[]) => {
    const storeList = updatedStoresList || stores;
    const targetStore = storeList.find((s) => s.id === targetStoreId);
    if (!targetStore) return;

    // 1. Persist current active store's state first
    if (currentStoreId) {
      localStorage.setItem(`matjari_store_${currentStoreId}_products`, JSON.stringify(products));
      localStorage.setItem(`matjari_store_${currentStoreId}_categories`, JSON.stringify(categories));
      localStorage.setItem(`matjari_store_${currentStoreId}_orders`, JSON.stringify(orders));
      localStorage.setItem(`matjari_store_${currentStoreId}_expenses`, JSON.stringify(expenses));
      localStorage.setItem(`matjari_store_${currentStoreId}_settings`, JSON.stringify(settings));
      localStorage.setItem(`matjari_store_${currentStoreId}_reviews`, JSON.stringify(reviews));
      localStorage.setItem(`matjari_store_${currentStoreId}_promos`, JSON.stringify(promos));
      localStorage.setItem(`matjari_store_${currentStoreId}_landing_pages`, JSON.stringify(landingPages));
    }

    // 2. Set currentStoreId
    setCurrentStoreId(targetStoreId);
    localStorage.setItem('matjari_current_store_id', targetStoreId);

    // 3. Load target store's state
    const savedProducts = localStorage.getItem(`matjari_store_${targetStoreId}_products`);
    const savedCategories = localStorage.getItem(`matjari_store_${targetStoreId}_categories`);
    const savedOrders = localStorage.getItem(`matjari_store_${targetStoreId}_orders`);
    const savedExpenses = localStorage.getItem(`matjari_store_${targetStoreId}_expenses`);
    const savedSettings = localStorage.getItem(`matjari_store_${targetStoreId}_settings`);
    const savedReviews = localStorage.getItem(`matjari_store_${targetStoreId}_reviews`);
    const savedPromos = localStorage.getItem(`matjari_store_${targetStoreId}_promos`);
    const savedLandingPages = localStorage.getItem(`matjari_store_${targetStoreId}_landing_pages`);

    const fallbackBundle = STORE_DATA_MAP[targetStoreId];

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        setProducts([]);
      }
    } else if (fallbackBundle?.products) {
      setProducts(fallbackBundle.products);
    } else {
      setProducts([]);
    }

    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (e) {
        setCategories([]);
      }
    } else if (fallbackBundle?.categories) {
      setCategories(fallbackBundle.categories);
    } else {
      setCategories([]);
    }

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        setOrders([]);
      }
    } else if (fallbackBundle?.orders) {
      setOrders(fallbackBundle.orders);
    } else {
      setOrders([]);
    }

    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (e) {
        setExpenses([]);
      }
    } else if (fallbackBundle?.expenses) {
      setExpenses(fallbackBundle.expenses);
    } else {
      setExpenses([]);
    }

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        setSettings(INITIAL_SETTINGS);
      }
    } else if (fallbackBundle?.settings) {
      setSettings(fallbackBundle.settings);
    } else {
      setSettings({
        ...INITIAL_SETTINGS,
        storeName: targetStore.name,
        currency: targetStore.currency,
        primaryColor: targetStore.primaryColor,
        slogan: targetStore.slogan,
        logoUrl: targetStore.logoUrl,
      });
    }

    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (e) {}
    }
    if (savedPromos) {
      try {
        setPromos(JSON.parse(savedPromos));
      } catch (e) {}
    }
    if (savedLandingPages) {
      try {
        setLandingPages(JSON.parse(savedLandingPages));
      } catch (e) {}
    }

    // Reset cart when switching store context
    setCart([]);

    showNotification(`تم التبديل بنجاح إلى "${targetStore.name}" 🏬`, 'success');
  };

  const createStore = (payload: CreateStorePayload): ManagedStore => {
    if (!isAuthenticated || currentUser?.accountType === 'customer' || currentUser?.role === 'customer') {
      showNotification('إنشاء وإدارة المتاجر مقتصر على حسابات التجار فقط', 'error');
      return stores[0];
    }

    if (isTrialExpired || subscription.status === 'expired') {
      showNotification(
        'متجرك مقيد حالياً لانتهاء الفترة التجريبية (24 ساعة). يرجى الترقية وسداد الاشتراك لإنشاء وتفعيل المتاجر',
        'error'
      );
      setIsSubscriptionModalOpen(true);
      return stores[0];
    }

    const currentPlan = getActivePlan();
    if (currentPlan.limits.maxStores !== -1 && merchantStores.length >= currentPlan.limits.maxStores) {
      showNotification(
        `لقد بلغت الحد الأقصى للمتاجر المسموح بها في ${currentPlan.name} (${currentPlan.limits.maxStores} متجر). يرجى الترقية لإضافة متاجر جديدة`,
        'error'
      );
      setIsSubscriptionModalOpen(true);
      return stores[0];
    }

    const storeId = 'store-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const slug = payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `store-${Date.now()}`;
    const domain = payload.domain || `${slug}.matjari.dz`;

    let newProducts: Product[] = [];
    let newCategories: Category[] = [];
    let newOrders: Order[] = [];
    let newExpenses: StoreExpense[] = [];

    if (payload.templateNiche === 'fashion') {
      newProducts = JSON.parse(JSON.stringify(ELEGANCE_PRODUCTS));
      newCategories = JSON.parse(JSON.stringify(ELEGANCE_CATEGORIES));
      newOrders = JSON.parse(JSON.stringify(ELEGANCE_ORDERS));
      newExpenses = JSON.parse(JSON.stringify(ELEGANCE_EXPENSES));
    } else if (payload.templateNiche === 'home_decor') {
      newProducts = JSON.parse(JSON.stringify(BAYTI_PRODUCTS));
      newCategories = JSON.parse(JSON.stringify(BAYTI_CATEGORIES));
      newOrders = JSON.parse(JSON.stringify(BAYTI_ORDERS));
      newExpenses = JSON.parse(JSON.stringify(BAYTI_EXPENSES));
    } else if (payload.templateNiche === 'electronics') {
      newProducts = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
      newCategories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
      newOrders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
      newExpenses = JSON.parse(JSON.stringify(INITIAL_EXPENSES));
    } else if (payload.templateNiche === 'beauty') {
      newProducts = JSON.parse(JSON.stringify(ELEGANCE_PRODUCTS.filter((p) => p.category === 'عطور ومستحضرات')));
      newCategories = JSON.parse(JSON.stringify(ELEGANCE_CATEGORIES.filter((c) => c.slug === 'perfumes')));
      newOrders = [];
      newExpenses = [];
    }

    const newStoreSettings: StoreSettings = {
      ...INITIAL_SETTINGS,
      storeName: payload.name,
      slogan: payload.slogan || 'متجرك الإلكتروني المتكامل للبيع والتوصيل السريع',
      currency: payload.currency || 'د.ج',
      primaryColor: payload.primaryColor || '#10b981',
      logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=150&auto=format&fit=crop&q=80',
      announcementBarText: `مرحباً بكم في متجر ${payload.name} - متوفر الشحن لـ 58 ولاية والدفع عند الاستلام`,
    };

    const newStore: ManagedStore = {
      id: storeId,
      ownerId: payload.ownerId || currentUser.id,
      name: payload.name,
      slug: slug,
      domain: domain,
      category: payload.category || 'general',
      currency: payload.currency || 'د.ج',
      logoUrl: newStoreSettings.logoUrl,
      slogan: newStoreSettings.slogan,
      primaryColor: newStoreSettings.primaryColor,
      themeStyle: 'modern',
      createdAt: new Date().toISOString().split('T')[0],
      totalProducts: newProducts.length,
      totalOrders: newOrders.length,
    };

    // Save bundle to localStorage
    localStorage.setItem(`matjari_store_${storeId}_products`, JSON.stringify(newProducts));
    localStorage.setItem(`matjari_store_${storeId}_categories`, JSON.stringify(newCategories));
    localStorage.setItem(`matjari_store_${storeId}_orders`, JSON.stringify(newOrders));
    localStorage.setItem(`matjari_store_${storeId}_expenses`, JSON.stringify(newExpenses));
    localStorage.setItem(`matjari_store_${storeId}_settings`, JSON.stringify(newStoreSettings));

    const updatedStores = [...stores, newStore];
    setStores(updatedStores);
    localStorage.setItem('matjari_managed_stores', JSON.stringify(updatedStores));

    // Switch to newly created store
    switchStore(storeId, updatedStores);

    showNotification(`تم إنشاء متجر "${newStore.name}" بنجاح`, 'success');
    return newStore;
  };

  const updateStore = (storeId: string, updates: Partial<ManagedStore>) => {
    setStores((prev) => {
      const next = prev.map((s) => (s.id === storeId ? { ...s, ...updates } : s));
      localStorage.setItem('matjari_managed_stores', JSON.stringify(next));
      return next;
    });

    if (storeId === currentStoreId) {
      if (updates.name || updates.currency || updates.primaryColor || updates.slogan || updates.logoUrl) {
        updateSettings({
          ...(updates.name ? { storeName: updates.name } : {}),
          ...(updates.currency ? { currency: updates.currency } : {}),
          ...(updates.primaryColor ? { primaryColor: updates.primaryColor } : {}),
          ...(updates.slogan ? { slogan: updates.slogan } : {}),
          ...(updates.logoUrl ? { logoUrl: updates.logoUrl } : {}),
        });
      }
    }
    showNotification('تم تحديث بيانات المتجر بنجاح', 'success');
  };

  const deleteStore = (storeId: string) => {
    const target = stores.find((s) => s.id === storeId);
    if (!target) return;

    const remainingStores = stores.filter((s) => s.id !== storeId);
    setStores(remainingStores);
    localStorage.setItem('matjari_managed_stores', JSON.stringify(remainingStores));

    // Clear its local storage
    localStorage.removeItem(`matjari_store_${storeId}_products`);
    localStorage.removeItem(`matjari_store_${storeId}_categories`);
    localStorage.removeItem(`matjari_store_${storeId}_orders`);
    localStorage.removeItem(`matjari_store_${storeId}_expenses`);
    localStorage.removeItem(`matjari_store_${storeId}_settings`);
    localStorage.removeItem(`matjari_store_${storeId}_reviews`);
    localStorage.removeItem(`matjari_store_${storeId}_promos`);
    localStorage.removeItem(`matjari_store_${storeId}_landing_pages`);

    const remainingOwned = remainingStores.filter((s) => s.ownerId === currentUser.id);
    if (currentStoreId === storeId) {
      if (remainingOwned.length > 0) {
        switchStore(remainingOwned[0].id, remainingStores);
      } else {
        setCurrentStoreId('');
        localStorage.removeItem('matjari_current_store_id');
        if (viewMode === 'dashboard') {
          setAuthPortalTab('login');
          _setViewMode('auth');
        }
      }
    }
    showNotification(`تم حذف متجر "${target.name}" بنجاح`, 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        viewMode,
        setViewMode,
        activeLandingPageId,
        setActiveLandingPageId,
        storeCustomizerSection,
        setStoreCustomizerSection,
        staffSection,
        setStaffSection,
        productSection,
        setProductSection,
        shippingSection,
        setShippingSection,

        isAuthenticated,
        authPortalTab,
        setAuthPortalTab,
        openAuthPortal,
        currentUser,
        setCurrentUser,
        loginAsStaff,
        loginAsSuperAdmin,
        logoutStaff,
        isTabPermitted,

        // Extended Auth, OTP & Session Management
        registeredUsers,
        activeSessions,
        currentSession,
        currentOTP,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalConfig,
        openAuthModal,
        closeAuthModal,
        isCustomerAccountModalOpen,
        setIsCustomerAccountModalOpen,
        isSessionManagerModalOpen,
        setIsSessionManagerModalOpen,
        simulatedIncomingMessage,
        clearSimulatedMessage,
        sendOTP,
        verifyOTP,
        resendOTP,
        cancelOTP,
        loginWithCredentials,
        registerNewUser,
        registerMerchantWithStore,
        resetUserPassword,
        logoutUser,
        terminateSession,
        terminateAllOtherSessions,

        stores,
        merchantStores,
        currentStore,
        currentStoreId,
        switchStore,
        createStore,
        updateStore,
        deleteStore,
        isCreateStoreModalOpen,
        setIsCreateStoreModalOpen,

        products,
        categories,
        orders,
        landingPages,
        wilayas,
        shippingCompanies,
        pixels,
        reviews,
        promos,
        domains,
        staff,
        blacklist,
        addons,
        settings,
        abandonedCheckouts,
        supportTickets,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,

        selectedProductForDetail,
        setSelectedProductForDetail,
        lastCreatedOrder,
        setLastCreatedOrder,
        trackingModalOrder,
        setTrackingModalOrder,
        fraudAuditOrder,
        setFraudAuditOrder,
        isSupportModalOpen,
        setIsSupportModalOpen,

        addProduct,
        updateProduct,
        deleteProduct,

        addOrder,
        updateOrderStatus,
        updateOrder,
        recordCallAttempt,
        deleteOrder,

        addAbandonedCheckout,
        updateAbandonedStatus,
        deleteAbandonedCheckout,
        convertAbandonedToOrder,

        addSupportTicket,
        addSupportMessage,

        addLandingPage,
        updateLandingPage,
        deleteLandingPage,

        addCategory,
        updateCategory,
        deleteCategory,

        updateWilayaRate,
        toggleWilayaStatus,
        bulkUpdateWilayas,
        toggleShippingCompany,
        updateShippingCompany,
        connectShippingCompany,
        disconnectShippingCompany,

        addPixel,
        updatePixel,
        deletePixel,

        addReview,
        approveReview,
        deleteReview,

        addPromo,
        togglePromoStatus,
        deletePromo,

        addDomain,
        deleteDomain,

        addStaff,
        updateStaff,
        toggleStaffStatus,
        deleteStaff,

        addToBlacklist,
        removeFromBlacklist,

        botBlockedAttempts,
        logBlockedBotAttempt,
        clearBotLogs,

        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getFinancialStats,

        toggleAddon,
        updateSettings,

        // Subscriptions & Billing
        subscription,
        subscriptionPlans,
        subscriptionInvoices,
        upgradeSubscription,
        renewSubscription,
        cancelSubscription,
        getActivePlan,
        canCreateMoreStores,
        isSubscriptionModalOpen,
        setIsSubscriptionModalOpen,

        // 1-Day Trial Mode Support & Countdown
        startFreeTrial,
        simulateTrialExpiry,
        resetTrialTimer,
        isTrialActive,
        isTrialExpired,
        trialTimeRemaining,

        // Platform Payment Config & Receipts
        platformPaymentConfig,
        updatePlatformPaymentConfig,
        receiptRequests,
        submitReceiptRequest,
        approveReceiptRequest,
        rejectReceiptRequest,
        pendingReceiptsCount,

        language,
        direction,
        setLanguage,
        t,

        globalSearch,
        setGlobalSearch,
        showNotification,
        notification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const useI18n = () => {
  const { language, direction, setLanguage, t } = useStore();
  return { language, direction, setLanguage, t };
};

