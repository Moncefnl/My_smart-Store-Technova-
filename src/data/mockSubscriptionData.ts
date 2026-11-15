import {
  SubscriptionPlan,
  MerchantSubscription,
  SubscriptionInvoice,
  PlatformPaymentConfig,
  SubscriptionReceiptRequest,
} from '../types';

export const DEFAULT_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'الباقة المبتدئة (Starter)',
    nameEn: 'Starter Free Plan',
    badge: 'مجانية 100%',
    badgeColor: 'bg-emerald-500 text-white',
    description: 'مثالية للمبتدئين وتجربة التجارة الإلكترونية وإطلاق أول متجر جزائري مجاناً بدون أي تكاليف.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'د.ج',
    accentColor: '#10b981',
    limits: {
      maxStores: 1,
      maxProducts: 25,
      maxStaff: 1,
      maxLandingPages: 2,
      customDomainAllowed: false,
      fraudShieldAllowed: false,
      advancedAnalytics: false,
      aiAssistantAllowed: false,
      prioritySupport: false,
      zeroCommission: true,
      exportReportsAllowed: false,
    },
    features: [
      'إنشاء متجر إلكتروني احترافي 1',
      'حتى 25 منتج في الكتالوج',
      'حساب موظف 1 لإدارة الطلبيات',
      'استمارة طلب سريعة بنقرة واحدة (COD)',
      'عمولة 0% على جميع المبيعات',
      'قالب تجاري افتراضي متجاوب للهواتف',
      'دعم فني أساسي عبر البريد والمنصة',
    ],
    notIncluded: [
      'إنشاء عدة متاجر (Multi-Store)',
      'ربط نطاق مخصص (Custom Domain)',
      'نظام حماية كاشف الاحتيال والطلبات الوهمية',
      'لوحة صافي الأرباح والمصاريف المتقدمة',
      'مساعد الذكاء الاصطناعي لصناعة المحتوى',
    ],
  },
  {
    id: 'pro',
    name: 'الباقة الاحترافية (Pro)',
    nameEn: 'Professional Merchant Plan',
    badge: 'الأكثر شعبية ⭐',
    badgeColor: 'bg-indigo-600 text-white',
    description: 'الخيار الأفضل للتجار النشطين وأصحاب العلامات التجارية لزيادة المبيعات وإدارة حتى 3 متاجر.',
    monthlyPrice: 4900,
    yearlyPrice: 49000, // شهران مجاناً (وفر 9,800 د.ج)
    currency: 'د.ج',
    isPopular: true,
    accentColor: '#6366f1',
    limits: {
      maxStores: 3,
      maxProducts: -1, // Unlimited
      maxStaff: 5,
      maxLandingPages: 10,
      customDomainAllowed: true,
      fraudShieldAllowed: true,
      advancedAnalytics: true,
      aiAssistantAllowed: true,
      prioritySupport: true,
      zeroCommission: true,
      exportReportsAllowed: true,
    },
    features: [
      'إدارة حتى 3 متاجر مستقلة بالكامل (Multi-Store)',
      'عدد غير محدود من المنتجات والطلبيات',
      'حتى 5 حسابات لموظفي التأكيد والتغليف',
      'ربط نطاقات ودومينات مخصصة (Custom Domains)',
      'نظام كاشف الاحتيال وحظر الأرقام المشبوهة',
      'حساب صافي الأرباح وهامش الربح الفعلي',
      'استرجاع السلات المتروكة عبر واتساب ورسائل SMS',
      'مساعد الذكاء الاصطناعي لكتابة النصوص الإعلانية',
      'دعم فني سريع وأولوية عبر واتساب وهاتفياً',
    ],
    notIncluded: [
      'متاجر غير محدودة بدون سقف',
      'مدير حسابات تجاري مخصص 24/7',
      'واجهات ربط برمجية مخصصة API & Webhooks',
    ],
  },
  {
    id: 'enterprise',
    name: 'باقة المؤسسات والمحترفين (Scale & VIP)',
    nameEn: 'Scale & Enterprise Plan',
    badge: 'VIP غير محدود 👑',
    badgeColor: 'bg-slate-900 text-amber-400',
    description: 'حل متكامل وشامل للشركات الكبرى، وكالات الدروبشيبينغ، والمصانع التي تدير فروعاً ومتاجر متعددة.',
    monthlyPrice: 9900,
    yearlyPrice: 99000, // شهران مجاناً (وفر 19,800 د.ج)
    currency: 'د.ج',
    accentColor: '#0f172a',
    limits: {
      maxStores: 999,
      maxProducts: -1,
      maxStaff: -1,
      maxLandingPages: -1,
      customDomainAllowed: true,
      fraudShieldAllowed: true,
      advancedAnalytics: true,
      aiAssistantAllowed: true,
      prioritySupport: true,
      zeroCommission: true,
      exportReportsAllowed: true,
    },
    features: [
      'إنشاء وإدارة عدد غير محدود من المتاجر (Unlimited Stores)',
      'منتجات، طلبيات، وموظفين غير محدودين',
      'صفحات هبوط وبكسلات إعلانية غير محدودة (Meta, TikTok, Google)',
      'استضافة سحابية فائقة السرعة مع حماية DDoS متقدمة',
      'ربط واجهات برمجية خاصة API & Webhooks للأنظمة المحاسبية',
      'مدير حسابات تجاري مخصص 24/7 ودعم هاتفي فوري',
      'تصدير كافة التقارير والميزانيات بصيغ Excel/PDF للضرائب',
      'تدريب كامل لفريق العمل وتخصيص استمارات الشراء حسب الطلب',
    ],
  },
];

export const createTrialSubscription = (hours: number = 24): MerchantSubscription => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + hours * 60 * 60 * 1000);
  return {
    planId: 'starter',
    billingCycle: 'monthly',
    status: 'trial',
    startDate: now.toISOString().split('T')[0],
    expiryDate: expiresAt.toISOString().split('T')[0],
    autoRenew: false,
    paymentMethod: undefined,
    lastPaymentDate: undefined,
    lastAmountPaid: 0,
    trialDaysRemaining: 1,
    trialStartedAt: now.toISOString(),
    trialExpiresAt: expiresAt.toISOString(),
    isTrial: true,
  };
};

export const INITIAL_MERCHANT_SUBSCRIPTION: MerchantSubscription = {
  planId: 'pro',
  billingCycle: 'monthly',
  status: 'active',
  startDate: '2026-08-01',
  expiryDate: '2026-09-28',
  autoRenew: false,
  paymentMethod: 'baridimob',
  lastPaymentDate: '2026-08-01',
  lastAmountPaid: 4900,
  trialDaysRemaining: 0,
};

export const INITIAL_SUBSCRIPTION_INVOICES: SubscriptionInvoice[] = [
  {
    id: 'INV-2026-0881',
    planId: 'pro',
    planName: 'الباقة الاحترافية (Pro Plan) - اشتراك شهري',
    amount: 4900,
    currency: 'د.ج',
    billingCycle: 'monthly',
    status: 'paid',
    paymentMethod: 'بريدي موب (BaridiMob RIP)',
    date: '2026-08-01',
    dueDate: '2026-08-01',
    transactionId: 'BM-20260801-9982',
    taxAmount: 0,
    discountApplied: 0,
  },
  {
    id: 'INV-2026-0742',
    planId: 'pro',
    planName: 'الباقة الاحترافية (Pro Plan) - اشتراك شهري',
    amount: 4900,
    currency: 'د.ج',
    billingCycle: 'monthly',
    status: 'paid',
    paymentMethod: 'تحويل بريدي يدوي (CCP)',
    date: '2026-07-01',
    dueDate: '2026-07-01',
    transactionId: 'CCP-20260701-4412',
    taxAmount: 0,
    discountApplied: 0,
  },
  {
    id: 'INV-2026-0610',
    planId: 'starter',
    planName: 'الباقة المبتدئة (Starter) - فترة تجريبية مجانية',
    amount: 0,
    currency: 'د.ج',
    billingCycle: 'monthly',
    status: 'paid',
    paymentMethod: 'تفعيل مجاني ترويجي',
    date: '2026-06-01',
    dueDate: '2026-06-01',
    transactionId: 'FREE-START-010',
    taxAmount: 0,
    discountApplied: 0,
  },
];

export const DEFAULT_PLATFORM_PAYMENT_CONFIG: PlatformPaymentConfig = {
  ccpAccount: '24190823',
  ccpKey: '41',
  ccpHolderName: 'تكنوفا للحلول الرقمية (TECHNOVA DZ)',
  baridiMobRip: '00799999002419082341',
  baridiMobHolderName: 'TECHNOVA SARL / المنصة الرقمية',
  contactPhone: '0555 12 34 56',
  paymentInstructions:
    'يرجى إرسال المبلغ المحدد للباقة عبر تطبيق بريدي موب برقم الـ RIP أو عبر مكاتب البريد لحساب الـ CCP، ثم إرفاق صورة واضحة للوصل لتفعيل الاشتراك فوراً من لوحة التحكم.',
};

// Realistic mock receipt images encoded in SVG
const SAMPLE_BARIDIMOB_RECEIPT_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520" style="background:%23047857;border-radius:24px;font-family:sans-serif;color:white;">
  <rect width="400" height="520" fill="%23047857" rx="24"/>
  <circle cx="200" cy="70" r="32" fill="white"/>
  <path d="M190 70 L197 77 L212 62" stroke="%23047857" stroke-width="4" fill="none" stroke-linecap="round"/>
  <text x="200" y="130" fill="white" font-size="20" font-weight="bold" text-anchor="middle">BaridiMob - إشعار تحويل ناجح</text>
  <text x="200" y="155" fill="%23a7f3d0" font-size="12" text-anchor="middle">بريد الجزائر - Algérie Poste</text>
  <rect x="24" y="180" width="352" height="300" fill="white" rx="16"/>
  <text x="200" y="220" fill="%23111827" font-size="26" font-weight="900" text-anchor="middle">4,900.00 DZD</text>
  <text x="200" y="245" fill="%23059669" font-size="12" font-weight="bold" text-anchor="middle">تم التحويل بنجاح لحساب RIP</text>
  <line x1="44" y1="265" x2="356" y2="265" stroke="%23e5e7eb" stroke-width="1"/>
  <text x="44" y="295" fill="%236b7280" font-size="11">إلى الحساب (RIP):</text>
  <text x="44" y="315" fill="%23111827" font-size="12" font-weight="bold">00799999002419082341</text>
  <text x="44" y="345" fill="%236b7280" font-size="11">المستفيد:</text>
  <text x="44" y="365" fill="%23111827" font-size="12" font-weight="bold">TECHNOVA SARL</text>
  <text x="44" y="395" fill="%236b7280" font-size="11">رقم المعاملة (Ref):</text>
  <text x="44" y="415" fill="%234f46e5" font-size="12" font-weight="bold">BM-9823412-DZ</text>
  <text x="44" y="445" fill="%236b7280" font-size="11">التاريخ والوقت:</text>
  <text x="44" y="465" fill="%23111827" font-size="12">2026-09-04 10:14:22</text>
</svg>`;

const SAMPLE_CCP_RECEIPT_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="340" viewBox="0 0 500 340" style="background:%23fef3c7;border:2px solid %23f59e0b;border-radius:16px;font-family:sans-serif;">
  <rect width="500" height="340" fill="%23fef3c7" rx="16"/>
  <rect x="15" y="15" width="470" height="40" fill="%231e3a8a" rx="8"/>
  <text x="250" y="40" fill="white" font-size="14" font-weight="bold" text-anchor="middle">بريد الجزائر - وصل دفع بحساب جاري بريدي (CCP)</text>
  <rect x="25" y="70" width="450" height="240" fill="white" rx="10" stroke="%23e5e7eb"/>
  <text x="450" y="100" fill="%23111827" font-size="12" font-weight="bold" text-anchor="end">رقم حساب المستفيد:</text>
  <text x="450" y="125" fill="%231e40af" font-size="16" font-weight="900" font-family="monospace" text-anchor="end">24190823 Clé 41</text>
  <text x="450" y="155" fill="%234b5563" font-size="11" text-anchor="end">اسم صاحب الحساب: تكنوفا للحلول الرقمية (TECHNOVA DZ)</text>
  <line x1="45" y1="175" x2="455" y2="175" stroke="%23e5e7eb" stroke-dasharray="4"/>
  <text x="450" y="205" fill="%23111827" font-size="12" font-weight="bold" text-anchor="end">المبلغ المودع بالحروف والأرقام:</text>
  <text x="450" y="230" fill="%23047857" font-size="18" font-weight="900" font-family="monospace" text-anchor="end">11,900.00 د.ج (أحد عشر ألف وتسعمائة دينار جزائري)</text>
  <text x="45" y="270" fill="%23b45309" font-size="11">ختم مكتب البريد والتاريخ:</text>
  <text x="45" y="290" fill="%231f2937" font-size="11" font-weight="bold">مكتب بريد ديدوش مراد - 2026-09-03 (Ref: CCP-VL-77890)</text>
</svg>`;

export const INITIAL_RECEIPT_REQUESTS: SubscriptionReceiptRequest[] = [
  {
    id: 'REQ-2026-0401',
    storeId: 'store-demo-1',
    storeName: 'متجر النخبة للأزياء',
    merchantName: 'ياسين بلقاسم',
    merchantPhone: '0555 44 33 22',
    merchantEmail: 'yacine@elitenokhba.dz',
    planId: 'pro',
    planName: 'الباقة الاحترافية (Pro Plan)',
    billingCycle: 'monthly',
    amount: 4900,
    currency: 'د.ج',
    paymentMethod: 'baridimob',
    receiptUrl: SAMPLE_BARIDIMOB_RECEIPT_SVG,
    transactionRef: 'BM-9823412-DZ',
    senderName: 'YACINE BELKACEM',
    submittedAt: '2026-09-04 10:15',
    status: 'pending',
    notes: 'تم الدفع عبر بريدي موب لتجديد الباقة الاحترافية لمدة شهر.',
  },
  {
    id: 'REQ-2026-0402',
    storeId: 'store-demo-2',
    storeName: 'بوتيك الأناقة الجزائرية',
    merchantName: 'سارة بوجمعة',
    merchantPhone: '0661 78 90 12',
    merchantEmail: 'sarah.elegance@gmail.com',
    planId: 'enterprise',
    planName: 'باقة الشركات (Enterprise Plan)',
    billingCycle: 'monthly',
    amount: 11900,
    currency: 'د.ج',
    paymentMethod: 'ccp',
    receiptUrl: SAMPLE_CCP_RECEIPT_SVG,
    transactionRef: 'CCP-VL-77890',
    senderName: 'SARAH BOUDJEMAA',
    submittedAt: '2026-09-03 16:30',
    status: 'pending',
    notes: 'تحويل عبر مكتب البريد المركزي لحساب CCP، أرجو التفعيل السريع.',
  },
  {
    id: 'REQ-2026-0390',
    storeId: 'store-main',
    storeName: 'متجر تكنوفا الرسمي',
    merchantName: 'محمد علي',
    merchantPhone: '0550 12 34 56',
    merchantEmail: 'contact@technova.dz',
    planId: 'pro',
    planName: 'الباقة الاحترافية (Pro Plan)',
    billingCycle: 'monthly',
    amount: 4900,
    currency: 'د.ج',
    paymentMethod: 'baridimob',
    receiptUrl: SAMPLE_BARIDIMOB_RECEIPT_SVG,
    transactionRef: 'BM-8812301-DZ',
    senderName: 'MOHAMED ALI',
    submittedAt: '2026-08-01 11:20',
    status: 'approved',
    reviewedAt: '2026-08-01 11:25',
    reviewedBy: 'مدير المنصة (Admin)',
    notes: 'تم التحقق من استلام المبلغ وتفعيل الاشتراك بنجاح.',
  },
];
