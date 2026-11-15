import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { Product } from '../../types';
import { CartDrawer } from '../cart/CartDrawer';
import { FloatingCartBar } from '../cart/FloatingCartBar';
import { CartCheckoutModal } from '../cart/CartCheckoutModal';
import { SmartCaptcha } from '../common/SmartCaptcha';
import {
  getButtonRadiusClass,
  getButtonShadowClass,
  getButtonHoverClass,
  getButtonPaddingClass,
  getButtonFontSizeClass,
  getButtonFontWeightClass,
  getPrimaryButtonStyles,
  getSecondaryButtonStyles,
} from '../../utils/buttonStyles';
import {
  ShoppingBag,
  Search,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Plus,
  Minus,
  Check,
  MessageCircle,
  Clock,
  Flame,
  ArrowLeft,
  X,
  Phone,
  MapPin,
  Sparkles,
  TicketPercent,
  ChevronRight,
  Eye,
  Globe,
  SlidersHorizontal,
  CheckCircle2,
  Lock,
  User,
} from 'lucide-react';

export const StorefrontView: React.FC = () => {
  const {
    settings,
    products,
    categories,
    wilayas,
    reviews,
    addons,
    promos,
    addOrder,
    setViewMode,
    showNotification,
    language,
    direction,
    cart,
    addToCart,
    isCartOpen,
    setIsCartOpen,
    isAuthenticated,
    currentUser,
    openAuthModal,
    openAuthPortal,
    setIsCustomerAccountModalOpen,
    t
  } = useStore();

  // Selected Category filter
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Drawer Modal states
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCartCheckoutOpen, setIsCartCheckoutOpen] = useState(false);
  const [justAddedIds, setJustAddedIds] = useState<{ [id: string]: boolean }>({});

  // Quick Single-Product Order Drawer / Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Cart & Checkout state
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState('16');
  const [deliveryType, setDeliveryType] = useState<'home' | 'desk'>('home');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [submittedOrderNumber, setSubmittedOrderNumber] = useState('');

  // Active wilaya object
  const currentWilaya = wilayas.find((w) => w.code === selectedWilayaCode) || wilayas[0];
  const shippingFee = deliveryType === 'home' ? currentWilaya.homePrice : currentWilaya.deskPrice;

  // Filtered products
  const activeProducts = products.filter((p) => {
    if (!p.isPublished) return false;
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(product, 1);
    setJustAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setJustAddedIds((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    }, 2200);
  };

  const handleOpenOrder = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setPromoInput('');
    setAppliedPromo(null);
    setIsCaptchaVerified(false);
    setIsOrderSubmitted(false);
    setIsOrderModalOpen(true);
  };

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const found = promos.find(
      (p) => p.code.toUpperCase() === promoInput.trim().toUpperCase() && p.isActive
    );
    if (!found) {
      showNotification('رمز الكوبون غير صالح أو منتهي الصلاحية', 'error');
      return;
    }
    setAppliedPromo(found);
    showNotification(`تم تطبيق خصم الكوبون ${found.code} بنجاح 🎉`, 'success');
  };

  const calculateSubtotal = () => {
    if (!selectedProduct) return 0;
    return selectedProduct.price * quantity;
  };

  const calculateDiscount = () => {
    if (!appliedPromo || !selectedProduct) return 0;
    const subtotal = calculateSubtotal();
    if (appliedPromo.type === 'percentage') {
      return (subtotal * appliedPromo.value) / 100;
    }
    return appliedPromo.value;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const isFreeShipping = subtotal >= settings.freeShippingThreshold;
    const finalShipping = isFreeShipping ? 0 : shippingFee;
    return Math.max(0, subtotal - discount + finalShipping);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (!customerPhone || customerPhone.length < 9) {
      showNotification('يرجى إدخال رقم هاتف صحيح', 'error');
      return;
    }

    if (!isCaptchaVerified) {
      showNotification(
        language === 'ar'
          ? 'يرجى إكمال اختبار التحقق البشري (الكابتشا) أولاً لتأكيد طلبك 🛡️'
          : 'Please complete the Anti-Bot CAPTCHA verification first 🛡️',
        'error'
      );
      return;
    }

    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const isFreeShipping = subtotal >= settings.freeShippingThreshold;
    const finalShipping = isFreeShipping ? 0 : shippingFee;
    const total = calculateTotal();

    const newOrder = addOrder({
      customerName,
      phone: customerPhone,
      wilaya: `${currentWilaya.code} - ${currentWilaya.nameAr}`,
      commune: address || 'المركز',
      address: address || 'الاستلام من المكتب',
      items: [
        {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          productImage: selectedProduct.images[0],
          quantity,
          unitPrice: selectedProduct.price,
        },
      ],
      shippingType: deliveryType,
      shippingCost: finalShipping,
      discountAmount: discount,
      promoCode: appliedPromo?.code,
      totalAmount: total,
      status: 'pending',
      paymentMethod: 'cod',
      notes: notes || undefined,
    });

    if (newOrder) {
      setSubmittedOrderNumber(newOrder.orderNumber);
      setIsOrderSubmitted(true);
    }
  };

  // Addons checks
  const isWhatsappActive = addons.some(
    (a) => (a.id === 'addon-1' || a.id === 'addon_whatsapp') && a.isInstalled
  );
  const isUrgencyActive = addons.some(
    (a) => (a.id === 'addon-6' || a.id === 'addon_countdown') && a.isInstalled
  );

  const buttonConfig = settings.buttonConfig;
  const btnRadius = getButtonRadiusClass(buttonConfig?.shape);
  const btnShadow = getButtonShadowClass(buttonConfig?.shadow);
  const btnHover = getButtonHoverClass(buttonConfig?.hoverEffect);
  const btnPadding = getButtonPaddingClass(buttonConfig?.padding);
  const btnFontSize = getButtonFontSizeClass(buttonConfig?.fontSize);
  const btnFontWeight = getButtonFontWeightClass(buttonConfig?.fontWeight);
  const primaryBtnStyles = getPrimaryButtonStyles(buttonConfig, settings.primaryColor);
  const secondaryBtnStyles = getSecondaryButtonStyles(buttonConfig);

  const isMerchantAuthenticated =
    isAuthenticated &&
    currentUser &&
    currentUser.accountType === 'merchant' &&
    currentUser.role !== 'customer';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir={direction}>
      {/* Top Admin Switch Bar (Strictly for authenticated merchants only) */}
      {isMerchantAuthenticated && (
        <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between z-30 sticky top-0 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold">{t('storefront.view_badge', 'معاينة واجهة المتجر الحية للزبائن (Storefront Preview)')}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="badge" />
            <button
              type="button"
              onClick={() => openAuthPortal('login')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1 rounded-lg text-xs transition-colors"
            >
              متاجرك
            </button>
            <button
              type="button"
              onClick={() => setViewMode('dashboard')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('storefront.back_to_dashboard', 'العودة للوحة التحكم')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Announcement Bar */}
      {settings.announcementActive && (
        <div
          className="py-2 px-4 text-center text-xs font-bold transition-all text-white shadow-xs"
          style={{
            backgroundColor: settings.primaryColor || '#059669',
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span>{settings.announcementBarText || t('storefront.announcement_default', 'شحن مجاني للطلبات الكبيرة والدفع عند الاستلام')}</span>
            {isUrgencyActive && (
              <span className="bg-black/20 px-2 py-0.5 rounded text-[11px] font-mono">
                {t('storefront.ends_in', 'ينتهي خلال:')} 04:22:15
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Store Header */}
      <header className={`bg-white border-b border-slate-200 sticky ${isMerchantAuthenticated ? 'top-8' : 'top-0'} z-20 shadow-xs`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Store Title */}
          <div className="flex items-center gap-3 shrink-0">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.storeName}
                className="h-10 w-10 object-contain rounded-xl"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm"
                style={{ backgroundColor: settings.primaryColor || '#059669' }}
              >
                {settings.storeName ? settings.storeName.charAt(0) : 'M'}
              </div>
            )}
            <div>
              <h1 className="font-black text-base sm:text-lg text-slate-900 leading-none">
                {settings.storeName || 'Technova'}
              </h1>
              <p className="text-[11px] text-slate-500 mt-1 hidden sm:block">
                {settings.slogan || t('storefront.slogan_default', 'أفضل المنتجات الأصلية مع توصيل سريع')}
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm hidden lg:block">
            <input
              type="text"
              placeholder={t('storefront.search_placeholder', 'ابحث عن منتج في المتجر...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-slate-100/80 text-xs text-slate-800 placeholder-slate-400 rounded-xl ${direction === 'rtl' ? 'pl-3 pr-10' : 'pr-3 pl-10'} py-2.5 border border-transparent focus:border-emerald-500 focus:bg-white focus:outline-none transition-all`}
            />
            <Search className={`w-4 h-4 text-slate-400 absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-3`} />
          </div>

          {/* Navbar Right/Left Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Primary Merchant Portal Buttons when unauthenticated */}
            {!isAuthenticated && (
              <>
                <button
                  type="button"
                  id="storefront-navbar-login-btn"
                  onClick={() => openAuthPortal('login')}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition-all cursor-pointer"
                >
                  تسجيل الدخول
                </button>
                <button
                  type="button"
                  id="storefront-navbar-create-store-btn"
                  onClick={() => openAuthPortal('create_store')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  أنشئ متجرك الآن
                </button>
              </>
            )}

            {/* Customer Authentication / Account Button */}
            {isAuthenticated && currentUser && (currentUser.accountType === 'customer' || currentUser.role === 'customer') ? (
              <button
                type="button"
                onClick={() => setIsCustomerAccountModalOpen(true)}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl transition-all flex items-center gap-2 font-bold text-xs shadow-xs cursor-pointer"
                id="storefront-customer-account-btn"
                title="فتح حساب الزبون وطلباتي"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline">حسابي وطلباتي ({currentUser.name.split(' ')[0]})</span>
                <span className="sm:hidden">طلباتي</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login', 'customer', 'phone')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all flex items-center gap-1.5 font-bold text-xs cursor-pointer"
                id="storefront-customer-login-btn"
                title="دخول الزبون لتتبع الطلبات"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden md:inline">تتبع طلباتي</span>
              </button>
            )}

            {/* Header Shopping Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all flex items-center gap-2 font-bold text-xs shadow-sm cursor-pointer"
              title={language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">
                {language === 'ar' ? 'السلة' : 'Cart'}
              </span>
              {cart.length > 0 && (
                <span className="bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full font-mono">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>

            <div className="hidden xl:block">
              <LanguageSwitcher variant="dropdown" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section
        className="relative py-12 px-4 sm:px-6 lg:px-8 text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${settings.primaryColor || '#059669'}, #090d16)`,
        }}
      >
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-start">
            <span className="inline-block bg-white/20 backdrop-blur-xs text-white text-xs font-bold px-3.5 py-1 rounded-full">
              🔥 {t('storefront.hero_tag', 'عروض حصرية ومميزة')}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              {settings.storeName || t('storefront.hero_title', 'متجرنا الإلكتروني')}
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {settings.slogan || t('storefront.hero_desc', 'تسوق أفضل المنتجات الأصلية مع توصيل سريع لـ 58 ولاية والدفع عند الاستلام.')}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href="#products-grid"
                className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-xs shadow-lg transition-all"
              >
                {t('storefront.browse_and_order', 'تصفح المنتجات واطلب الآن')}
              </a>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold bg-black/20 px-3 py-2 rounded-xl">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>{t('storefront.secure_cod', 'دفع آمن عند الاستلام (COD)')}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 shrink-0 relative group">
            <img
              src={
                settings.homepage?.heroBannerImage ||
                settings.bannerImage ||
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
              }
              alt={settings.storeName || 'Store Banner'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>
        </div>
      </section>

      {/* Value Badges Banner */}
      <section className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3 p-2">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{t('storefront.benefit_shipping_title', 'شحن لـ 58 ولاية')}</h4>
              <p className="text-[11px] text-slate-500">{t('storefront.benefit_shipping_desc', 'توصيل سريع لباب منزلك')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{t('storefront.benefit_guarantee_title', 'ضمان وفحص قبل الدفع')}</h4>
              <p className="text-[11px] text-slate-500">{t('storefront.benefit_guarantee_desc', 'تأكد من طلبك ثم ادفع')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{t('storefront.benefit_return_title', 'استبدال مجاني')}</h4>
              <p className="text-[11px] text-slate-500">{t('storefront.benefit_return_desc', 'في حالة وجود أي عيب مصنعي')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{t('storefront.benefit_support_title', 'خدمة عملاء مستمرة')}</h4>
              <p className="text-[11px] text-slate-500">{t('storefront.benefit_support_desc', 'فريقنا متواجد لمساعدتكم')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Store Content */}
      <main id="products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t('common.all_products', 'كافة المنتجات')}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                activeCategory === c.name
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeProducts.map((prod) => {
            const inCartItem = cart.find((item) => item.product.id === prod.id);
            const inCartQty = inCartItem ? inCartItem.quantity : 0;
            const isJustAdded = !!justAddedIds[prod.id];

            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {prod.badge && (
                      <span className={`absolute top-3 ${direction === 'rtl' ? 'right-3' : 'left-3'} bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1`}>
                        <Flame className="w-3 h-3 text-amber-400" />
                        {prod.badge}
                      </span>
                    )}
                    {prod.compareAtPrice && (
                      <span className={`absolute top-3 ${direction === 'rtl' ? 'left-3' : 'right-3'} bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm`}>
                        -{Math.round(((prod.compareAtPrice - prod.price) / prod.compareAtPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-600">
                        {prod.category}
                      </span>

                      {/* Ratings */}
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{prod.rating || 4.9}</span>
                        <span className="text-slate-400 font-normal text-[10px]">
                          ({prod.reviewsCount || Math.floor(40 + (prod.price % 80))})
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-relaxed h-10">
                      {prod.name}
                    </h3>

                    <div className="pt-2 flex items-baseline justify-between">
                      <div>
                        <span className="text-base font-black text-slate-900 font-mono">
                          {prod.price.toLocaleString()} {settings.currency}
                        </span>
                        {prod.compareAtPrice && (
                          <span className={`text-xs text-slate-400 line-through font-mono ${direction === 'rtl' ? 'mr-2' : 'ml-2'}`}>
                            {prod.compareAtPrice.toLocaleString()} {settings.currency}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: "+ Add" Button with Smooth "Added" Checkmark State & COD Direct Buy */}
                <div className="p-4 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Interactive "+ Add" Button with state change */}
                    <button
                      onClick={(e) => handleAddToCart(prod, e)}
                      style={!isJustAdded && inCartQty === 0 ? secondaryBtnStyles : undefined}
                      className={`w-full py-2.5 px-2 ${btnRadius} ${btnShadow} ${btnHover} ${btnFontSize} ${btnFontWeight} flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-md scale-[1.02]'
                          : inCartQty > 0
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                      title={language === 'ar' ? 'إضافة إلى سلة التسوق' : 'Add to Shopping Cart'}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3] text-white animate-in zoom-in" />
                          <span>{language === 'ar' ? 'تمّت الإضافة!' : 'Added!'}</span>
                        </>
                      ) : inCartQty > 0 ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {language === 'ar' ? `في السلة (${inCartQty}) +` : `In Cart (${inCartQty}) +`}
                          </span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>{buttonConfig?.ctaAddToCartText || (language === 'ar' ? '+ أضف للسلة' : '+ Add')}</span>
                        </>
                      )}
                    </button>

                    {/* Single Product Fast COD Order Button */}
                    <button
                      onClick={() => handleOpenOrder(prod)}
                      style={primaryBtnStyles}
                      className={`w-full py-2.5 px-2 ${btnRadius} ${btnShadow} ${btnHover} ${btnFontSize} ${btnFontWeight} flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{buttonConfig?.ctaDirectOrderText || (language === 'ar' ? 'اطلب فوراً' : 'Order COD')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Customer Reviews Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-black text-lg text-slate-900">{t('storefront.reviews_title', 'تجارب وآراء زبائننا الكرام ⭐')}</h3>
              <p className="text-xs text-slate-500">
                {t('storefront.reviews_subtitle', 'أكثر من 500+ زبون سعيد في جميع ربوع الجزائر يثقون في منتجاتنا وخدماتنا.')}
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-400 text-sm font-bold bg-amber-50 px-3 py-1.5 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="text-amber-900">{t('storefront.rating_score', 'تقييم 4.9 من 5')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.filter((r) => r.isApproved).slice(0, 3).map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2.5">
                  <img src={r.avatar} alt={r.customerName} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{r.customerName}</h5>
                    <span className="text-[10px] text-slate-400">{r.wilaya}</span>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  "{r.comment}"
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Section */}
        {settings.faqs && settings.faqs.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div>
              <h3 className="font-black text-lg text-slate-900">{t('store_customizer.faq', 'الأسئلة الشائعة')} 💡</h3>
              <p className="text-xs text-slate-500">
                {t('storefront.faqs_subtitle', 'إليك إجابات لأهم الأسئلة التي يطرحها زبائننا قبل تأكيد الشراء والتوصيل.')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5"
                >
                  <h5 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>{faq.question}</span>
                  </h5>
                  <p className={`text-xs text-slate-600 leading-relaxed ${direction === 'rtl' ? 'pr-4' : 'pl-4'}`}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Floating WhatsApp Addon */}
      {isWhatsappActive && (
        <a
          href={`https://wa.me/${settings.whatsappNumber || '213550123456'}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center gap-2 transition-transform hover:scale-110"
          title="تحدث معنا على واتساب"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs font-bold hidden sm:inline">طلب مساعدة عبر واتساب</span>
        </a>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          <div className="space-y-3">
            <h4 className="font-black text-sm text-white">{settings.storeName || 'متجرنا'}</h4>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              {settings.slogan || 'نوفر لزبائننا في الجزائر أفضل المنتجات المضمونة بأسرع توصيل ودفع آمن عند الاستلام.'}
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white text-xs">{t('storefront.support_guarantee', 'خدمة العملاء والضمان')}</h5>
            <p className="text-slate-400">{t('form.phone', 'الهاتف')}: {settings.phone}</p>
            <p className="text-slate-400">{t('form.email', 'البريد')}: {settings.email}</p>
            <p className="text-slate-400">{t('form.address', 'العنوان')}: {settings.address}</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white text-xs">{t('storefront.payment_delivery_methods', 'طريقة الدفع والتوصيل')}</h5>
            <p className="text-slate-400">
              {t('storefront.cod_guarantee_notice', 'الدفع عند الاستلام 100% (COD) بعد استلام الطرد وفحصه في 58 ولاية.')}
            </p>
          </div>
        </div>
      </footer>

      {/* Express COD Order Modal / Drawer */}
      {isOrderModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200" dir={direction}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>{t('storefront.order_modal_title', 'نموذج تأكيد الطلب السريع (الدفع عند الاستلام)')}</span>
              </h4>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isOrderSubmitted ? (
              <div className="text-center py-8 space-y-4 animate-in fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="text-lg font-black text-slate-900">{t('storefront.order_success_title', 'تم تسجيل طلبكم بنجاح! 🎉')}</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  {t('storefront.order_number', 'رقم طلبكم')}: <span className="font-mono font-bold text-emerald-700">{submittedOrderNumber}</span>
                  <br />
                  {t('storefront.order_success_notice', 'سيتصل بكم فريق خدمة العملاء على الرقم')} <span className="font-bold text-slate-800 font-mono" dir="ltr">{customerPhone}</span> {t('storefront.to_confirm_delivery', 'لتأكيد موعد التسليم.')}
                </p>
                <button
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  {t('storefront.continue_shopping', 'إغلاق ومتابعة التسوق')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmOrder} className="space-y-4 text-xs">
                {/* Product Summary Card */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                      {selectedProduct.name}
                    </h5>
                    <div className="font-black text-emerald-600 text-sm mt-0.5">
                      {selectedProduct.price.toLocaleString()} {settings.currency}
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-bold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Customer Contact Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form.full_name', 'الاسم الكامل للزبون')} *</label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'ar' ? 'مثال: كريم بلقاسم' : 'e.g. John Doe'}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form.phone', 'رقم الهاتف لتأكيد الطلب')} *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0550123456 / 0661234567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                      dir="ltr"
                    />
                  </div>

                  {/* Wilaya Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{t('form.state_wilaya', 'الولاية (58 ولاية)')} *</label>
                      <select
                        value={selectedWilayaCode}
                        onChange={(e) => setSelectedWilayaCode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      >
                        {wilayas.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.code} - {language === 'ar' ? w.nameAr : (w.nameEn || w.nameAr)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{t('form.delivery_type', 'نوع التوصيل')} *</label>
                      <select
                        value={deliveryType}
                        onChange={(e) => setDeliveryType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="home">
                          {t('shipping.home_delivery', 'توصيل حتى باب المنزل')} ({currentWilaya.homePrice} {settings.currency})
                        </option>
                        <option value="desk">
                          {t('shipping.desk_delivery', 'استلام من مكتب التوصيل')} ({currentWilaya.deskPrice} {settings.currency})
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form.detailed_address', 'البلدية والعنوان بالتفصيل')}</label>
                    <input
                      type="text"
                      placeholder={language === 'ar' ? 'مثال: بلدية الأبيار، حي النخيل عمارة 4' : 'e.g. Main Street, Apt 4'}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                {/* Promo Code Box */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder={t('storefront.have_promo', 'هل لديك كود خصم؟')}
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-xs uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-xl font-bold text-xs"
                  >
                    {t('action.apply', 'تطبيق')}
                  </button>
                </div>

                {/* Pricing Summary Breakdown */}
                <div className="bg-slate-50 p-3.5 rounded-2xl space-y-1.5 text-slate-700">
                  <div className="flex justify-between">
                    <span>{t('storefront.products_price', 'سعر المنتجات')} ({quantity} {t('common.pieces', 'قطع')}):</span>
                    <span className="font-bold">{calculateSubtotal().toLocaleString()} {settings.currency}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>{t('storefront.promo_discount', 'خصم الكوبون')} ({appliedPromo.code}):</span>
                      <span>-{calculateDiscount().toLocaleString()} {settings.currency}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{t('storefront.shipping_fees', 'مصاريف التوصيل')} ({language === 'ar' ? currentWilaya.nameAr : (currentWilaya.nameEn || currentWilaya.nameAr)}):</span>
                    <span className="font-bold">
                      {calculateSubtotal() >= settings.freeShippingThreshold ? (
                        <span className="text-emerald-600 font-bold">{t('storefront.free', 'مجاناً')} 🎉</span>
                      ) : (
                        `${shippingFee.toLocaleString()} ${settings.currency}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
                    <span>{t('storefront.total_cod_amount', 'المبلغ الإجمالي للدفع عند الاستلام')}:</span>
                    <span className="text-emerald-700">{calculateTotal().toLocaleString()} {settings.currency}</span>
                  </div>
                </div>

                {/* Anti-Bot & CAPTCHA Verification Component */}
                <SmartCaptcha
                  isVerified={isCaptchaVerified}
                  onVerify={setIsCaptchaVerified}
                  pageContext="quick_order"
                  customerName={customerName}
                  phone={customerPhone}
                />

                {/* Submit Order Button */}
                <button
                  type="submit"
                  style={isCaptchaVerified ? primaryBtnStyles : undefined}
                  className={`w-full py-3.5 ${btnRadius} ${btnShadow} ${btnHover} ${btnFontSize} ${btnFontWeight} flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isCaptchaVerified
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {isCaptchaVerified ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <Lock className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{settings.checkoutConfig?.submitButtonText || t('storefront.confirm_order_cod', 'تأكيد الطلب الآن (الدفع عند الاستلام)')}</span>
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  * {t('storefront.cod_footer_note', 'الدفع عند الاستلام بعد معاينة الطرد - شحن مضمون ومؤمن 100%')}
                </p>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Floating Interactive Shopping Cart Bar */}
      <FloatingCartBar
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onProceedToCheckout={() => setIsCartCheckoutOpen(true)}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen || isCartOpen}
        onClose={() => {
          setIsCartDrawerOpen(false);
          setIsCartOpen(false);
        }}
        onProceedToCheckout={() => {
          setIsCartDrawerOpen(false);
          setIsCartOpen(false);
          setIsCartCheckoutOpen(true);
        }}
      />

      {/* Multi-Item COD Checkout Modal */}
      <CartCheckoutModal
        isOpen={isCartCheckoutOpen}
        onClose={() => setIsCartCheckoutOpen(false)}
      />
    </div>
  );
};

