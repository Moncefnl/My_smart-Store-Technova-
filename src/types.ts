export type TabType =
  | 'overview'
  | 'store_customizer'
  | 'orders'
  | 'abandoned_checkouts'
  | 'fraud_protection'
  | 'products'
  | 'landing_pages'
  | 'categories'
  | 'shipping'
  | 'marketing'
  | 'reviews'
  | 'promo_codes'
  | 'domains'
  | 'analytics'
  | 'staff'
  | 'blacklist'
  | 'addons'
  | 'billing'
  | 'settings';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "أزرق - L" or "أسود - 42"
  color?: string;
  size?: string;
  price?: number;
  stock: number;
  sku?: string;
  image?: string;
}

export interface ProductBundleOffer {
  id: string;
  quantity: number;
  title: string; // e.g. "اشتري 2 واحصل على خصم 15%"
  discountPercentage?: number;
  freeShipping?: boolean;
  price?: number;
  badge?: string; // e.g. "الأكثر طلباً ⭐"
  isDefault?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  costPrice: number;
  stock: number;
  sku: string;
  images: string[];
  description: string;
  features: string[];
  variants?: ProductVariant[];
  videoUrl?: string; // YouTube or TikTok or MP4 demo video
  trustBadges?: string[];
  bundleOffers?: ProductBundleOffer[];
  isPublished: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewsCount: number;
  badge?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image: string;
  productsCount: number;
  description: string;
  order: number;
}

export type OrderStatus =
  | 'new'
  | 'no_answer_1'
  | 'no_answer_2'
  | 'no_answer_3'
  | 'confirmed'
  | 'ready'
  | 'postponed'
  | 'in_transit'
  | 'delivered'
  | 'cancelled_store'
  | 'cancelled_customer'
  | 'returned'
  | 'pending'
  | 'shipped'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  items: OrderItem[];
  subtotal?: number;
  shippingType: 'home' | 'desk';
  shippingCost: number;
  discountAmount: number;
  promoCode?: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'cod' | 'card' | 'cib_edahabia';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  notes?: string;
  callAttempts?: number;
  lastCallDate?: string;
  trackingNumber?: string;
  shippingProvider?: string;
  isSuspicious?: boolean;
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  productId: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  callToAction: string;
  countdownEnd?: string;
  features: { title: string; desc: string; icon: string }[];
  mediaUrl: string;
  themeColor: string;
  views: number;
  conversions: number;
  isActive: boolean;
}

export interface WilayaRate {
  code: string;
  nameAr: string;
  nameEn: string;
  homePrice: number;
  deskPrice: number;
  active: boolean;
}

export interface ShippingCompany {
  id: string;
  name: string;
  nameEn?: string;
  code: string;
  logo: string;
  phone: string;
  active: boolean;
  integrated: boolean;
  trackingUrl: string;
  defaultHomePrice: number;
  defaultDeskPrice: number;
  apiKey?: string;
  apiToken?: string;
  accountNumber?: string;
  senderAddress?: string;
  autoSyncOrders?: boolean;
  supportedWilayasCount?: number;
  category?: 'national' | 'express' | 'specialized' | 'international';
  badge?: string;
  description?: string;
  color?: string;
  connectedAt?: string;
}

export interface PixelConfig {
  id: string;
  name: string;
  platform: 'facebook' | 'tiktok' | 'snapchat' | 'google_tag_manager';
  pixelId: string;
  isActive: boolean;
  trackEvents: {
    pageView: boolean;
    viewContent: boolean;
    addToCart: boolean;
    initiateCheckout: boolean;
    purchase: boolean;
  };
}

export interface CustomerReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  wilaya: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
  isApproved: boolean;
  avatar?: string;
}

export interface AbandonedCheckout {
  id: string;
  customerName: string;
  phone: string;
  wilaya: string;
  commune?: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  status: 'abandoned' | 'contacted' | 'recovered' | 'expired';
  recoveryChannel?: 'whatsapp' | 'sms' | 'call';
  lastContactedAt?: string;
  notes?: string;
}

export interface ParcelTrackingEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  status: 'completed' | 'current' | 'pending';
  icon?: string;
}

export interface ParcelTrackingData {
  orderId: string;
  orderNumber: string;
  trackingNumber: string;
  courierCode: string;
  courierName: string;
  courierPhone: string;
  courierLogo: string;
  currentStep: number;
  totalSteps: number;
  statusCode: 'created' | 'prepared' | 'shipped' | 'hub' | 'out_for_delivery' | 'delivered' | 'returned';
  statusText: string;
  estimatedDelivery: string;
  recipientName: string;
  recipientPhone: string;
  recipientWilaya: string;
  recipientAddress: string;
  shippingType: 'home' | 'desk';
  totalToCollect: number;
  events: ParcelTrackingEvent[];
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  isActive: boolean;
  // Influencer affiliate fields
  isInfluencer?: boolean;
  influencerName?: string;
  influencerHandle?: string; // e.g. @amine_dz
  influencerPlatform?: 'instagram' | 'tiktok' | 'youtube' | 'facebook';
  commissionType?: 'percentage' | 'fixed';
  commissionRate?: number; // e.g. 10% or 300 DZD per order
  totalRevenueGenerated?: number;
  totalCommissionEarned?: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'shipping' | 'payment_cod' | 'pixel' | 'domain' | 'orders' | 'general';
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'user' | 'support' | 'ai_assistant';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface CustomDomain {
  id: string;
  domain: string;
  status: 'connected' | 'pending' | 'failed';
  sslActive: boolean;
  createdAt: string;
  dnsRecords: {
    type: string;
    host: string;
    value: string;
    status: 'matched' | 'pending';
  }[];
}

export type ViewMode = 'dashboard' | 'storefront' | 'landing_page' | 'staff_login' | 'auth';

export type StaffRole =
  | 'super_admin'
  | 'orders_manager'
  | 'inventory_manager'
  | 'support'
  | 'marketer';

export type StaffSection = 'all' | 'add';

export type ProductSection = 'all' | 'add' | 'inventory';

export type ShippingSection = 'wilayas' | 'companies';

export type AnalyticsSection = 'general' | 'products' | 'visits';

export type AuthMethod = 'phone' | 'email';
export type AccountType = 'merchant' | 'customer';

export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  userIdentifier: string; // phone or email
  accountType: AccountType;
  role?: 'super_admin' | StaffRole | 'customer';
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
  token: string;
}

export interface OTPState {
  target: string;
  type: AuthMethod;
  code: string;
  expiresAt: number;
  accountType: AccountType;
  purpose: 'signup' | 'login' | 'verify';
  tempUser?: {
    name: string;
    target: string;
    password?: string;
    accountType: AccountType;
    storeName?: string;
    wilaya?: string;
    commune?: string;
    address?: string;
  };
}

export interface RegisteredUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  accountType: AccountType;
  role: 'super_admin' | StaffRole | 'customer';
  isVerified: boolean;
  verificationMethod: AuthMethod;
  avatar?: string;
  storeName?: string;
  wilaya?: string;
  commune?: string;
  address?: string;
  createdAt: string;
  lastLogin: string;
  hasUsedTrial?: boolean;
  trialExpiresAt?: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | StaffRole | 'customer';
  isStaff: boolean;
  avatar?: string;
  permissions: string[];
  accountType?: AccountType;
  isVerified?: boolean;
  verificationMethod?: AuthMethod;
  storeName?: string;
  wilaya?: string;
  commune?: string;
  address?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: StaffRole;
  permissions: string[];
  isActive: boolean;
  lastLogin: string;
  avatar: string;
}

export interface BlacklistEntry {
  id: string;
  type: 'phone' | 'ip' | 'address';
  value: string;
  customerName?: string;
  reason: string;
  blockedDate: string;
  attemptsBlocked: number;
}

export interface BotBlockedAttempt {
  id: string;
  timestamp: string;
  reason: 'failed_captcha' | 'honeypot_triggered' | 'rate_limit' | 'suspicious_script';
  reasonLabel: string;
  customerName?: string;
  phone?: string;
  ipAddress?: string;
  page: 'cart_checkout' | 'quick_order' | 'landing_page';
  preventedLoss: number; // in DZD, e.g. 850 DZD return shipping fee saved
}

export interface BotSecuritySettings {
  captchaEnabled: boolean;
  captchaType: 'math_puzzle' | 'smart_checkbox' | 'visual_symbols';
  blockHoneypotBots: boolean;
  maxFailedAttemptsBeforeLock: number;
}

export interface Addon {
  id: string;
  name: string;
  category: 'marketing' | 'sales' | 'operations' | 'shipping' | 'analytics';
  description: string;
  icon: string;
  price: number; // 0 for free
  isInstalled: boolean;
  rating: number;
  downloads: number;
  popular?: boolean;
}

export type StoreCustomizerSection =
  | 'presets'
  | 'buttons'
  | 'live_preview'
  | 'logo'
  | 'template'
  | 'theme'
  | 'homepage'
  | 'contact'
  | 'faq'
  | 'about'
  | 'checkout'
  | 'checkout_cart';

export type ButtonShape = 'pill' | 'rounded_lg' | 'rounded_md' | 'squircle' | 'square';
export type ButtonStyleType = 'solid' | 'gradient' | 'outline' | 'soft' | 'glass';
export type ButtonShadow = 'none' | 'soft' | 'medium' | 'strong' | 'glow' | 'isometric_3d';
export type ButtonHoverEffect = 'scale' | 'lift' | 'glow' | 'pulse' | 'shimmer' | 'invert' | 'none';
export type ButtonFontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
export type ButtonFontWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
export type ButtonPadding = 'compact' | 'normal' | 'spacious';

export interface StoreButtonConfig {
  shape: ButtonShape;
  styleType: ButtonStyleType;
  primaryColor: string;
  primaryTextColor: string;
  secondaryColor?: string;
  gradientAngle?: number;
  fontSize: ButtonFontSize;
  fontWeight: ButtonFontWeight;
  padding: ButtonPadding;
  shadow: ButtonShadow;
  hoverEffect: ButtonHoverEffect;
  borderWidth: '0px' | '1px' | '2px' | '3px';
  borderColor?: string;
  iconPlacement: 'left' | 'right' | 'none';
  showCartPulseBadge?: boolean;
  ctaDirectOrderText?: string;
  ctaAddToCartText?: string;
  secondaryButtonBg?: string;
  secondaryButtonText?: string;
}

export interface StoreThemePreset {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  category: 'ecommerce' | 'luxury' | 'tech' | 'minimal' | 'beauty' | 'high_conversion' | 'heritage' | 'dark';
  badge?: string;
  badgeColor?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardBg: string;
  textColor: string;
  fontFamily: string;
  buttonConfig: StoreButtonConfig;
  cardBorderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  cardShadow: 'none' | 'soft' | 'medium' | 'strong';
  previewGradient: string;
}

export interface StoreFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isActive: boolean;
  order: number;
}

export interface StoreHomepageConfig {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroBannerImage: string;
  showFeaturesBar: boolean;
  showCategories: boolean;
  showReviews: boolean;
}

export interface CheckoutFormConfig {
  mode: 'one_page_cod' | 'cart_step';
  requireCustomerName: boolean;
  requirePhone: boolean;
  requireWilaya: boolean;
  requireCommune: boolean;
  requireAddress: boolean;
  requireNotes: boolean;
  showUrgencyTimer: boolean;
  urgencyTimerMinutes: number;
  showFreeShippingBar: boolean;
  guaranteeBadgeText: string;
  submitButtonText: string;
  whatsappOrderDirect: boolean;
}

export interface StoreAboutConfig {
  storyTitle: string;
  storyContent: string;
  storyImage: string;
  features: { title: string; desc: string; icon: string }[];
  returnPolicy: string;
  shippingPolicy: string;
}

export interface StoreSettings {
  storeName: string;
  slogan: string;
  storeDescription?: string;
  checkoutNotice?: string;
  email: string;
  phone: string;
  currency: string;
  logoUrl: string;
  bannerImage?: string;
  faviconUrl?: string;
  announcementBarText: string;
  announcementActive: boolean;
  primaryColor: string;
  secondaryColor?: string;
  fontFamily?: string;
  themeStyle?: 'modern' | 'minimal' | 'bold' | 'classic';
  activeThemeId?: string;
  buttonConfig?: StoreButtonConfig;
  cardBorderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  cardShadow?: 'none' | 'soft' | 'medium' | 'strong';
  codEnabled: boolean;
  cardEnabled: boolean;
  freeShippingThreshold: number;
  address: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  telegramUrl?: string;
  youtubeUrl?: string;
  faqs?: StoreFAQ[];
  homepage?: StoreHomepageConfig;
  checkoutConfig?: CheckoutFormConfig;
  botSecurity?: BotSecuritySettings;
  aboutConfig?: StoreAboutConfig;
  defaultLanguage?: 'ar' | 'en';
  enableLanguageSwitcher?: boolean;
}

export type ExpenseType = 'fixed' | 'variable';
export type ExpenseCategory =
  | 'rent'
  | 'ads'
  | 'packaging'
  | 'salaries'
  | 'shipping_returns'
  | 'software'
  | 'utilities'
  | 'other';

export type ExpenseRecurrence = 'one_time' | 'monthly' | 'yearly' | 'daily';

export interface StoreExpense {
  id: string;
  title: string;
  amount: number; // in DZD
  type: ExpenseType; // fixed or variable
  category: ExpenseCategory;
  recurrence: ExpenseRecurrence;
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
}

export interface FinancialPeriodStats {
  period: 'today' | 'week' | 'month' | 'year';
  periodLabel: string;
  grossRevenue: number;
  cogs: number; // Cost of goods sold (cost of items)
  shippingCost: number;
  fixedExpenses: number;
  variableExpenses: number;
  totalExpenses: number; // fixed + variable + shipping
  netProfit: number; // grossRevenue - cogs - totalExpenses
  netMarginPercent: number;
  ordersCount: number;
  averageOrderValue: number;
  roiPercent: number;
}

export interface ManagedStore {
  id: string;
  ownerId?: string;
  name: string;
  slug: string;
  domain: string;
  category: string; // e.g. 'electronics' | 'fashion' | 'beauty' | 'home_decor' | 'general'
  currency: string; // e.g. 'د.ج' or 'DZD'
  logoUrl: string;
  slogan: string;
  primaryColor: string;
  themeStyle?: 'modern' | 'minimal' | 'bold' | 'classic';
  createdAt: string;
  isDefault?: boolean;
  totalProducts?: number;
  totalOrders?: number;
}

export interface CreateStorePayload {
  name: string;
  currency: string;
  ownerId?: string;
  domain?: string;
  slug?: string;
  category?: string;
  slogan?: string;
  primaryColor?: string;
  templateNiche?: 'electronics' | 'fashion' | 'home_decor' | 'beauty' | 'empty';
}

export type SubscriptionPlanId = 'starter' | 'pro' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'cancelled' | 'pending_payment';

export interface PlanLimits {
  maxStores: number;
  maxProducts: number; // -1 for unlimited
  maxStaff: number; // -1 for unlimited
  maxLandingPages: number; // -1 for unlimited
  customDomainAllowed: boolean;
  fraudShieldAllowed: boolean;
  advancedAnalytics: boolean;
  aiAssistantAllowed: boolean;
  prioritySupport: boolean;
  zeroCommission: boolean;
  exportReportsAllowed: boolean;
}

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  nameEn: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  isPopular?: boolean;
  accentColor: string;
  limits: PlanLimits;
  features: string[];
  notIncluded?: string[];
}

export interface MerchantSubscription {
  planId: SubscriptionPlanId;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  startDate: string;
  expiryDate: string;
  autoRenew: boolean;
  paymentMethod?: 'baridimob' | 'ccp' | 'cib_edahabia' | 'card' | 'bank_transfer';
  lastPaymentDate?: string;
  lastAmountPaid?: number;
  trialDaysRemaining?: number;
  trialStartedAt?: string;
  trialExpiresAt?: string;
  isTrial?: boolean;
}

export interface SubscriptionInvoice {
  id: string; // e.g. "INV-2026-0042"
  planId: SubscriptionPlanId;
  planName: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  status: 'paid' | 'pending' | 'failed';
  paymentMethod: string;
  date: string;
  dueDate: string;
  receiptUrl?: string;
  transactionId?: string;
  taxAmount?: number;
  discountApplied?: number;
}

export interface PlatformPaymentConfig {
  ccpAccount: string;
  ccpKey: string;
  ccpHolderName: string;
  baridiMobRip: string;
  baridiMobHolderName: string;
  contactPhone: string;
  paymentInstructions: string;
}

export interface SubscriptionReceiptRequest {
  id: string; // e.g. "REQ-2026-0401"
  storeId?: string;
  storeName: string;
  merchantName: string;
  merchantPhone: string;
  merchantEmail?: string;
  planId: SubscriptionPlanId;
  planName: string;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  paymentMethod: 'baridimob' | 'ccp';
  receiptUrl?: string;
  transactionRef?: string;
  senderName?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  rejectionReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}


