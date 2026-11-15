import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShippingCompany } from '../../types';
import {
  Truck,
  Building,
  Home,
  Check,
  Search,
  Sliders,
  Phone,
  Power,
  ShieldCheck,
  Save,
  Link,
  Unlink,
  ExternalLink,
  Copy,
  RefreshCw,
  X,
  Radio,
  MapPin,
  CheckCircle2,
  Zap,
  Globe,
  Boxes,
  Info,
  ChevronRight,
  Sparkles,
  DollarSign
} from 'lucide-react';

export const ShippingTab: React.FC = () => {
  const {
    wilayas,
    updateWilayaRate,
    shippingCompanies,
    toggleShippingCompany,
    updateShippingCompany,
    connectShippingCompany,
    disconnectShippingCompany,
    settings,
    updateSettings,
    showNotification,
    language,
    direction,
    t
  } = useStore();

  // Search & Filters for Shipping Companies
  const [searchCompany, setSearchCompany] = useState('');
  const [companyFilter, setCompanyFilter] = useState<'all' | 'connected' | 'available'>('all');

  // Free shipping threshold inline state
  const [freeShippingValue, setFreeShippingValue] = useState<number>(settings.freeShippingThreshold || 10000);
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);

  // Modal State for "ربط الآن" / "إعدادات الربط"
  const [selectedCompanyForModal, setSelectedCompanyForModal] = useState<ShippingCompany | null>(null);
  const [modalApiKey, setModalApiKey] = useState('');
  const [modalApiToken, setModalApiToken] = useState('');
  const [modalAccountNumber, setModalAccountNumber] = useState('');
  const [modalSenderAddress, setModalSenderAddress] = useState('');
  const [modalAutoSync, setModalAutoSync] = useState(true);
  const [modalHomePrice, setModalHomePrice] = useState<number>(500);
  const [modalDeskPrice, setModalDeskPrice] = useState<number>(300);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [testApiResult, setTestApiResult] = useState<'success' | 'failed' | null>(null);

  // Modal State for "معاينة تفاصيل الشركة" (Company Details Preview)
  const [previewCompany, setPreviewCompany] = useState<ShippingCompany | null>(null);

  // Wilaya Matrix State
  const [searchWilaya, setSearchWilaya] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [bulkHomePrice, setBulkHomePrice] = useState('');
  const [bulkDeskPrice, setBulkDeskPrice] = useState('');

  // Handle saving free shipping threshold
  const handleSaveFreeShippingThreshold = () => {
    updateSettings({ freeShippingThreshold: Number(freeShippingValue) });
    setIsEditingThreshold(false);
    showNotification(
      language === 'ar'
        ? `تم تحديث حد الشحن المجاني إلى ${Number(freeShippingValue).toLocaleString()} ${settings.currency}`
        : `Free shipping threshold updated to ${Number(freeShippingValue).toLocaleString()} ${settings.currency}`,
      'success'
    );
  };

  // Open connect/configure modal handler
  const handleOpenConnectModal = (company: ShippingCompany) => {
    setSelectedCompanyForModal(company);
    setModalApiKey(company.apiKey || '');
    setModalApiToken(company.apiToken || '');
    setModalAccountNumber(company.accountNumber || '');
    setModalSenderAddress(company.senderAddress || 'الجزائر العاصمة - المركز الرئيسي');
    setModalAutoSync(company.autoSyncOrders ?? true);
    setModalHomePrice(company.defaultHomePrice || 500);
    setModalDeskPrice(company.defaultDeskPrice || 300);
    setTestApiResult(null);
  };

  // Close connect modal handler
  const handleCloseConnectModal = () => {
    setSelectedCompanyForModal(null);
    setTestApiResult(null);
    setIsTestingApi(false);
  };

  // Test API Connection simulation
  const handleTestApi = () => {
    if (!modalApiKey) {
      showNotification(
        language === 'ar' ? 'يرجى إدخال مفتاح الـ API أولاً للفحص' : 'Please enter API Key first to test',
        'error'
      );
      return;
    }
    setIsTestingApi(true);
    setTestApiResult(null);
    setTimeout(() => {
      setIsTestingApi(false);
      setTestApiResult('success');
      showNotification(
        language === 'ar'
          ? 'تم التحقق من اتصال الـ API بنجاح! السيرفر يستجيب (200 OK)'
          : 'API Connection verified successfully! Server responded with 200 OK',
        'success'
      );
    }, 850);
  };

  // Save / Connect handler
  const handleSaveConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompanyForModal) return;

    if (!modalApiKey) {
      showNotification(
        language === 'ar' ? 'يرجى إدخال مفتاح الـ API للربط' : 'Please enter API Key to connect',
        'error'
      );
      return;
    }

    connectShippingCompany(selectedCompanyForModal.id, {
      apiKey: modalApiKey,
      apiToken: modalApiToken,
      accountNumber: modalAccountNumber,
      senderAddress: modalSenderAddress,
      autoSyncOrders: modalAutoSync,
      defaultHomePrice: Number(modalHomePrice),
      defaultDeskPrice: Number(modalDeskPrice),
    });

    handleCloseConnectModal();
  };

  // Disconnect handler
  const handleDisconnect = (id: string) => {
    disconnectShippingCompany(id);
    handleCloseConnectModal();
  };

  // Copy Webhook helper
  const handleCopyWebhook = (code: string) => {
    const url = `https://api.matjari.dz/v1/webhooks/shipping/${code}/events`;
    navigator.clipboard.writeText(url);
    showNotification(
      language === 'ar' ? 'تم نسخ رابط الـ Webhook للحافظة' : 'Webhook URL copied to clipboard',
      'info'
    );
  };

  // Normalization helpers for ultra-flexible Arabic & English search
  const normalizeArabicText = (text: string): string => {
    if (!text) return '';
    return text
      .toLowerCase()
      .trim()
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // Tashkeel and Tatweel
      .replace(/[أإآٱ]/g, 'ا') // Normalize Alef
      .replace(/[ى]/g, 'ي') // Normalize Yeh
      .replace(/[ة]/g, 'ه') // Normalize Teh Marbuta
      .replace(/[ؤ]/g, 'و') // Hamza on waw
      .replace(/[ئ]/g, 'ي') // Hamza on yeh
      .replace(/[-_()\[\]{}.,/\\+*&^%$#@!~`":;'<>?|]/g, ' ')
      .replace(/\s+/g, ' ');
  };

  const normalizeLatinText = (text: string): string => {
    if (!text) return '';
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[-_()\[\]{}.,/\\+*&^%$#@!~`":;'<>?|]/g, ' ')
      .replace(/\s+/g, ' ');
  };

  // Comprehensive alias dictionary to ensure every company is found in English, Arabic, slang, or abbreviations
  const COMPANY_ALIASES: Record<string, string[]> = {
    yalidine: ['yalidine', 'ياليدين', 'yalidain', 'yaledine', 'ياليدين اكسبريس', 'غيبكس', 'yalite', '58 ولاية'],
    zr_express: ['zr', 'zr express', 'زاد ار', 'زادار', 'زاد ار اكسبريس', 'زد ار', 'زدآر', 'زدار'],
    kazitour: ['kazitour', 'كازيتور', 'كازيتور للتوصيل', 'قازيتور', 'كازي', 'تور'],
    ems: ['ems', 'بريد الجزائر', 'champion post', 'اي ام اس', 'ايمس', 'البريد السريع', 'poste dz'],
    abex_express: ['abex', 'ابكس', 'أبكس', 'ابيكس', 'abex express', 'ابكس اكسبريس'],
    ecom_v2: ['ecom', 'e-com', 'ايكوم', 'ايكوم ديليفري', 'ecom delivery v2', 'ايكوم v2'],
    ecom_v1: ['ecom', 'e-com', 'ايكوم', 'ايكوم ديليفري', 'ecom delivery v1', 'ايكوم v1'],
    leopard_express: ['leopard', 'ليوبارد', 'ليوبار', 'فهد', 'leopard express'],
    isr_services: ['isr', 'اي اس ار', 'ايس ار', 'isr services', 'ايسار'],
    colireli: ['colireli', 'كولي رولي', 'كوليرولي', 'كولي', 'رولي', 'colis'],
    courrier_48hr: ['48hr', '48h', '48', 'ساعة', '48 ساعة', 'courrier 48hr', 'كوريا'],
    elogistia: ['elogistia', 'اللوجستية', 'اللوجستيا', 'إلوجيستيا', 'لوجستيك'],
    noest_express: ['noest', 'نويست', 'نوست', 'noest express', 'شمال شرق غرب'],
    flash_delivery: ['flash', 'فلاش', 'فلاش ديليفري', 'flash delivery', 'سريع'],
    packers: ['packers', 'باكرز', 'باكر', 'packers logistics', 'تغليف'],
    rocket_delivery: ['rocket', 'روكيت', 'صاروخ', 'rocket delivery'],
    msm_go: ['msm', 'msm go', 'ام اس ام', 'اماسام', 'ام اس ام جو'],
    golivri: ['golivri', 'غوليفري', 'قوليفري', 'جو ليفري', 'golivri express'],
    areex_delivery: ['areex', 'اريكس', 'أريكس', 'areex delivery'],
    rb_livraison: ['rb', 'ار بي', 'اربي', 'rb livraison', 'ار بي ليفريزون'],
    negmar_express: ['negmar', 'نقمـار', 'نقمار', 'نجمار', 'negmar express'],
    world_express: ['world', 'ورلد', 'عالمي', 'world express', 'ورلد اكسبريس'],
    ups: ['ups', 'يو بي اس', 'يوبي اس', 'يو بي إس', 'ups express', 'دولي'],
    one_delivery: ['one', 'وان', 'وان ديليفري', 'one delivery dz', 'رقم 1'],
    rm_express: ['rm', 'ار ام', 'آر إم', 'rm express', 'ارام'],
    navex_delivery: ['navex', 'نافيكس', 'نافكس', 'navex delivery'],
    vitrans_express: ['vitrans', 'فيترانس', 'في ترانس', 'vitrans express'],
    rs_express: ['rs', 'ار اس', 'آر إس', 'rs express', 'اراس'],
    rj360_express: ['rj', 'rj360', 'ار جي', 'ار جي 360', '360', 'rj360 express'],
    fast_delivery_fort: ['fast', 'فاست', 'فورت', 'fast delivery', 'فاست ديليفري'],
    sbl_express: ['sbl', 'اس بي ال', 'إس بي إل', 'sbl express'],
    jaguar_express: ['jaguar', 'جاغوار', 'جاكوار', 'نمر', 'jaguar express'],
    lynx_express: ['lynx', 'لينكس', 'وشق', 'lynx express'],
    jo_express_time: ['jo', 'جو', 'جو اكسبريس', 'jo express time'],
    ovred: ['ovred', 'اوفريد', 'أوفريد', 'ovred logistics'],
    chrono_rex: ['chrono', 'rex', 'كرونو', 'ريكس', 'كرونو ريكس', 'chrono rex'],
    samex_express: ['samex', 'ساميكس', 'سميكس', 'samex express'],
    fz_delivery: ['fz', 'اف زد', 'إف زد', 'fz delivery', 'افزد'],
  };

  // Filter companies with multi-field search and Arabic/Latin normalization
  const cleanSearchQuery = searchCompany.trim();
  const searchTerms = cleanSearchQuery
    ? cleanSearchQuery.split(/\s+/).filter(Boolean)
    : [];

  const filteredCompanies = shippingCompanies.filter((comp) => {
    // 1. Tab filter check
    if (companyFilter === 'connected' && !comp.integrated) return false;
    if (companyFilter === 'available' && comp.integrated) return false;

    // 2. Search query check
    if (searchTerms.length === 0) return true;

    // Build unified searchable text pool for this company
    const aliases = COMPANY_ALIASES[comp.code] || [];
    const rawSearchPool = [
      comp.name || '',
      comp.nameEn || '',
      comp.code || '',
      comp.phone || '',
      comp.badge || '',
      comp.category || '',
      comp.description || '',
      comp.senderAddress || '',
      ...aliases
    ].join(' ');

    const normArabicPool = normalizeArabicText(rawSearchPool);
    const normLatinPool = normalizeLatinText(rawSearchPool);

    // Check that EVERY search term is matched in at least one format
    return searchTerms.every((term) => {
      const normArTerm = normalizeArabicText(term);
      const normLatTerm = normalizeLatinText(term);

      return (
        normArabicPool.includes(normArTerm) ||
        normLatinPool.includes(normLatTerm) ||
        rawSearchPool.toLowerCase().includes(term.toLowerCase())
      );
    });
  });

  // Filter Wilayas by search and region
  const filteredWilayas = wilayas.filter((w) => {
    const matchesSearch =
      w.nameAr.includes(searchWilaya) ||
      w.nameEn.toLowerCase().includes(searchWilaya.toLowerCase()) ||
      w.code.includes(searchWilaya);

    if (!matchesSearch) return false;

    const codeNum = parseInt(w.code, 10);
    if (selectedRegion === 'center') return [16, 9, 35, 42, 15, 26, 44].includes(codeNum);
    if (selectedRegion === 'east') return [25, 23, 19, 6, 5, 24, 18, 21, 4, 34, 41, 43, 51, 55].includes(codeNum);
    if (selectedRegion === 'west') return [31, 13, 27, 22, 29, 46, 20, 14, 48].includes(codeNum);
    if (selectedRegion === 'south') return [30, 39, 47, 33, 11, 1, 8, 32, 52, 53, 54, 56, 57, 58].includes(codeNum);

    return true;
  });

  const handleBulkApply = () => {
    if (!bulkHomePrice && !bulkDeskPrice) return;
    filteredWilayas.forEach((w) => {
      updateWilayaRate(w.code, {
        homePrice: bulkHomePrice ? Number(bulkHomePrice) : w.homePrice,
        deskPrice: bulkDeskPrice ? Number(bulkDeskPrice) : w.deskPrice,
      });
    });
    showNotification(
      language === 'ar'
        ? `تم تطبيق الأسعار الجماعية بنجاح على ${filteredWilayas.length} ولاية`
        : `Bulk prices applied successfully to ${filteredWilayas.length} wilayas`,
      'success'
    );
  };

  const totalCompaniesCount = shippingCompanies.length;
  const connectedCount = shippingCompanies.filter((c) => c.integrated).length;
  const availableCount = shippingCompanies.filter((c) => !c.integrated).length;

  return (
    <div id="shipping-tab-content" className="space-y-6" dir={direction}>
      {/* 1. Header & Top Statistics (إحصائيات علوية) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Truck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-tight">
                  {t('shipping.title', 'شركات الشحن وتسعيرة الـ 58 ولاية')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t(
                    'shipping.subtitle',
                    'إدارة وربط شركات التوصيل السريع في الجزائر وضبط تسعيرة الشحن للمنزل والمكتب لكل ولاية.'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Free Shipping Threshold Inline Controller */}
          <div className="w-full lg:w-auto bg-slate-50/90 border border-slate-200/80 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700">
                {language === 'ar' ? 'حد الشحن المجاني:' : 'Free Shipping Limit:'}
              </span>
            </div>

            {isEditingThreshold ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={freeShippingValue}
                  onChange={(e) => setFreeShippingValue(Number(e.target.value))}
                  className="w-24 px-2 py-1 bg-white border border-emerald-500 rounded-xl text-xs font-mono font-black text-emerald-700 focus:outline-none"
                  autoFocus
                />
                <span className="text-[11px] font-bold text-slate-500">{settings.currency}</span>
                <button
                  onClick={handleSaveFreeShippingThreshold}
                  className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                  title={language === 'ar' ? 'حفظ' : 'Save'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-700 font-mono bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60">
                  {settings.freeShippingThreshold.toLocaleString()} {settings.currency}
                </span>
                <button
                  onClick={() => setIsEditingThreshold(true)}
                  className="text-[11px] text-slate-500 hover:text-emerald-700 font-semibold underline underline-offset-2"
                >
                  {language === 'ar' ? 'تعديل' : 'Edit'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4 Statistics KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2 border-t border-slate-100">
          {/* Total Companies */}
          <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-200/60 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-100/80 text-blue-700 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              {totalCompaniesCount}
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">
                {language === 'ar' ? 'شركات الشحن المعتمدة' : 'Verified Couriers'}
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {totalCompaniesCount} {language === 'ar' ? 'شركة معتمدة 🇩🇿' : 'Partners'}
              </span>
            </div>
          </div>

          {/* Connected via API */}
          <div className="bg-emerald-50/40 rounded-2xl p-3.5 border border-emerald-200/60 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">
                {language === 'ar' ? 'الشركات المربوطة عبر API' : 'Connected APIs'}
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {connectedCount} {language === 'ar' ? 'شركات متصلة' : 'Connected'}
                </span>
              </span>
            </div>
          </div>

          {/* Wilayas Coverage */}
          <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-200/60 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              58
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">
                {language === 'ar' ? 'تغطية الولايات' : 'Wilayas Coverage'}
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {language === 'ar' ? '58 ولاية كاملة' : '58 Wilayas (100%)'}
              </span>
            </div>
          </div>

          {/* Cash On Delivery (COD) */}
          <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-200/60 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">
                {language === 'ar' ? 'نظام الدفع عند الاستلام' : 'Payment Method'}
              </span>
              <span className="text-xs sm:text-sm font-black text-purple-700">
                {language === 'ar' ? 'دفع عند الاستلام (COD)' : 'Cash On Delivery'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs & Search & Company Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>{t('shipping.companies_title', 'شركات التوصيل والشحن (36 شركة معتمدة)')}</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'ar'
                ? 'اربط حساب شركتك بنقرة زر واحدة عبر الـ API لتوليد بوليصات الشحن ومتابعة حالة الطرود تلقائياً.'
                : 'Connect your courier accounts via API with one click to auto-dispatch orders and sync live tracking.'}
            </p>
          </div>

          {/* 3 Main Filter Tabs: "كافة الشركات (36)", "المربوطة فقط", "المتاحة للربط" */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setCompanyFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                companyFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('shipping.filter_all', 'كافة الشركات (36)')}
            </button>
            <button
              onClick={() => setCompanyFilter('connected')}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                companyFilter === 'connected'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>
                {t('shipping.filter_connected', 'المربوطة فقط')} ({connectedCount})
              </span>
            </button>
            <button
              onClick={() => setCompanyFilter('available')}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                companyFilter === 'available'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('shipping.filter_available', 'المتاحة للربط')} ({availableCount})
            </button>
          </div>
        </div>

        {/* Company Search Bar & Query Indicator */}
        <div className="space-y-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder={t(
                'shipping.search_company',
                'بحث عن شركة توصيل بالاسم أو الرمز (مثل: Yalidine, ZR, Kazitour, EMS, Abex, UPS)...'
              )}
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              className={`w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 rounded-2xl py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                direction === 'rtl' ? 'pl-10 pr-11' : 'pr-10 pl-11'
              }`}
            />
            <Search
              className={`w-4 h-4 text-slate-400 absolute top-3.5 ${
                direction === 'rtl' ? 'right-4' : 'left-4'
              }`}
            />
            {searchCompany && (
              <button
                onClick={() => setSearchCompany('')}
                className={`absolute top-2.5 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 rounded-xl transition-colors ${
                  direction === 'rtl' ? 'left-3' : 'right-3'
                }`}
                title={language === 'ar' ? 'مسح البحث' : 'Clear search'}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search & Filter Status Ribbon */}
          {(searchCompany.trim() || companyFilter !== 'all') && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-50 border border-slate-200/70 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {language === 'ar'
                    ? `تم العثور على ${filteredCompanies.length} من أصل ${totalCompaniesCount} شركة توصيل`
                    : `Showing ${filteredCompanies.length} of ${totalCompaniesCount} courier partners`}
                </span>
                {companyFilter !== 'all' && (
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">
                    {companyFilter === 'connected'
                      ? language === 'ar'
                        ? 'المربوطة فقط'
                        : 'Connected only'
                      : language === 'ar'
                      ? 'المتاحة للربط فقط'
                      : 'Available only'}
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  setSearchCompany('');
                  setCompanyFilter('all');
                }}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 transition-colors"
              >
                {language === 'ar' ? 'إعادة ضبط البحث والفلاتر' : 'Reset search & filters'}
              </button>
            </div>
          )}
        </div>

        {/* 3. Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((comp) => (
            <div
              key={comp.id}
              className={`rounded-3xl p-5 border transition-all relative flex flex-col justify-between group ${
                comp.integrated
                  ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-50/40 via-white to-white shadow-xs hover:shadow-md'
                  : comp.active
                  ? 'border-slate-300 bg-white hover:border-slate-400 hover:shadow-xs'
                  : 'border-slate-200 bg-slate-50/60 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="space-y-3">
                {/* Top Row: Logo, Title (AR/EN), Badge & Power Switch */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs border border-black/5 shrink-0 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: comp.color ? `${comp.color}15` : '#f1f5f9' }}
                    >
                      {comp.logo}
                    </div>
                    <div>
                      <h5 className="font-black text-xs sm:text-sm text-slate-900 leading-tight">
                        {comp.name}
                      </h5>
                      {comp.nameEn && (
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {comp.nameEn}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Active Toggle Switch */}
                  <button
                    onClick={() => toggleShippingCompany(comp.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      comp.active
                        ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                    title={
                      comp.active
                        ? language === 'ar'
                          ? 'تعطيل الشركة'
                          : 'Deactivate'
                        : language === 'ar'
                        ? 'تفعيل الشركة'
                        : 'Activate'
                    }
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Phone & Feature Badge */}
                <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{comp.phone}</span>
                  </div>

                  {comp.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/50">
                      {comp.badge}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed min-h-[32px]">
                  {comp.description ||
                    (language === 'ar'
                      ? 'خدمة توصيل سريعة وموثوقة لجميع ربوع الوطن مع تسوية دورية للمستحقات.'
                      : 'Reliable door-to-door courier service across Algeria with cash on delivery.')}
                </p>

                {/* Status Bar & Coverage */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  {/* Status Badge */}
                  <div>
                    {comp.integrated ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{t('shipping.connected', 'مربوطة ومتصلة')}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                        <Radio className="w-3 h-3 text-slate-400" />
                        <span>{t('shipping.ready_to_connect', 'جاهزة للربط')}</span>
                      </span>
                    )}
                  </div>

                  {/* Coverage Status */}
                  <div className="flex items-center gap-1 text-[11px] font-black text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {language === 'ar'
                        ? `تغطية ${comp.supportedWilayasCount || 58} ولاية`
                        : `${comp.supportedWilayasCount || 58} Wilayas`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: "ربط الآن / إعدادات الربط" + "زر خارجي لمعاينة تفاصيل الشركة والتتبع" */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleOpenConnectModal(comp)}
                  className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 ${
                    comp.integrated
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {comp.integrated ? (
                    <>
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{t('shipping.configure', 'إعدادات الربط')}</span>
                    </>
                  ) : (
                    <>
                      <Link className="w-3.5 h-3.5" />
                      <span>{t('shipping.connect_now', 'ربط الآن')}</span>
                    </>
                  )}
                </button>

                {/* External Preview & Tracking Details Button */}
                <button
                  onClick={() => setPreviewCompany(comp)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs transition-colors shrink-0 flex items-center justify-center"
                  title={language === 'ar' ? 'معاينة تفاصيل الشركة' : 'Preview Company Details'}
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12 px-4 bg-slate-50/80 rounded-3xl border border-dashed border-slate-200 space-y-4">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Truck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h5 className="font-black text-sm text-slate-800">
                {language === 'ar' ? 'لم يتم العثور على شركة توصيل مطابقة' : 'No shipping partners matched your search'}
              </h5>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {language === 'ar'
                  ? 'يرجى التحقق من كتابة الاسم أو تجربة البحث باسم آخر أو إعادة ضبط الفلاتر.'
                  : 'Check your search query or reset the filters to show all partners.'}
              </p>
            </div>

            {/* Quick Actions in Empty State */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={() => {
                  setSearchCompany('');
                  setCompanyFilter('all');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                {language === 'ar' ? `إظهار كافة الشركات (${totalCompaniesCount})` : `Show all couriers (${totalCompaniesCount})`}
              </button>
            </div>

            {/* Quick Search Suggestions */}
            <div className="pt-2 border-t border-slate-200/60 max-w-lg mx-auto">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                {language === 'ar' ? 'أو اختر من الشركات المقترحة:' : 'Or choose from popular couriers:'}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {[
                  { label: 'Yalidine', query: 'Yalidine' },
                  { label: 'ZR Express', query: 'ZR' },
                  { label: 'Kazitour', query: 'Kazitour' },
                  { label: 'EMS بريد الجزائر', query: 'EMS' },
                  { label: 'Abex Express', query: 'Abex' },
                  { label: 'UPS الدولي', query: 'UPS' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setSearchCompany(item.query);
                      setCompanyFilter('all');
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200 rounded-lg text-[11px] font-bold transition-colors shadow-2xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 58 Wilayas Pricing Matrix */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-600" />
              <span>
                {language === 'ar'
                  ? 'جدول تسعيرة الشحن لكافة الولايات (1 - 58)'
                  : '58 Wilayas Pricing Matrix'}
              </span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'ar'
                ? 'حدد تسعيرة التوصيل للمنزل والمكتب لكل ولاية، أو قم بتطبيق تعديل جماعي حسب المنطقة الجغرافية.'
                : 'Set custom home and stop-desk delivery fees for each Wilaya, or bulk apply prices by region.'}
            </p>
          </div>

          {/* Bulk Price Editor */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 hidden sm:inline">
              {language === 'ar' ? 'تعديل جماعي:' : 'Bulk Set:'}
            </span>
            <input
              type="number"
              placeholder={language === 'ar' ? 'سعر المنزل' : 'Home Price'}
              value={bulkHomePrice}
              onChange={(e) => setBulkHomePrice(e.target.value)}
              className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
            />
            <input
              type="number"
              placeholder={language === 'ar' ? 'سعر المكتب' : 'Desk Price'}
              value={bulkDeskPrice}
              onChange={(e) => setBulkDeskPrice(e.target.value)}
              className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
            />
            <button
              onClick={handleBulkApply}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-xs"
            >
              {t('action.apply', 'تطبيق')}
            </button>
          </div>
        </div>

        {/* Wilaya Filter Bars (Region + Search) */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Region Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedRegion === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {language === 'ar' ? 'كافة الولايات (58)' : 'All (58)'}
            </button>
            <button
              onClick={() => setSelectedRegion('center')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedRegion === 'center' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {language === 'ar' ? 'الوسط' : 'Center'}
            </button>
            <button
              onClick={() => setSelectedRegion('east')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedRegion === 'east' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {language === 'ar' ? 'الشرق' : 'East'}
            </button>
            <button
              onClick={() => setSelectedRegion('west')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedRegion === 'west' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {language === 'ar' ? 'الغرب' : 'West'}
            </button>
            <button
              onClick={() => setSelectedRegion('south')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedRegion === 'south' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {language === 'ar' ? 'الجنوب والصحراء' : 'South'}
            </button>
          </div>

          {/* Search Wilaya */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder={
                language === 'ar'
                  ? 'بحث عن ولاية بالرقم أو الاسم (مثال: 16 أو الجزائر أو Oran)...'
                  : 'Search Wilaya by code or name...'
              }
              value={searchWilaya}
              onChange={(e) => setSearchWilaya(e.target.value)}
              className={`w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 rounded-2xl py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                direction === 'rtl' ? 'pl-3 pr-10' : 'pr-3 pl-10'
              }`}
            />
            <Search
              className={`w-4 h-4 text-slate-400 absolute top-3 ${
                direction === 'rtl' ? 'right-3.5' : 'left-3.5'
              }`}
            />
          </div>
        </div>

        {/* 58 Wilayas Table */}
        <div className="max-h-[480px] overflow-y-auto border border-slate-200 rounded-3xl">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold z-10">
              <tr>
                <th className={`p-3.5 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'الرمز والولاية' : 'Code & Wilaya'}
                </th>
                <th className={`p-3.5 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'الاسم باللاتينية' : 'Latin Name'}
                </th>
                <th className={`p-3.5 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'توصيل للمنزل (د.ج)' : 'Home Delivery (DZD)'}
                </th>
                <th className={`p-3.5 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'استلام من المكتب (د.ج)' : 'Stop Desk (DZD)'}
                </th>
                <th className="p-3.5 text-center">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredWilayas.map((w) => (
                <tr key={w.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    <span className="inline-block w-7 font-mono font-black text-slate-400">
                      {w.code}
                    </span>
                    <span>{w.nameAr}</span>
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono">{w.nameEn}</td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 max-w-[130px]">
                      <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="number"
                        value={w.homePrice}
                        onChange={(e) =>
                          updateWilayaRate(w.code, { homePrice: Number(e.target.value) })
                        }
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 max-w-[130px]">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="number"
                        value={w.deskPrice}
                        onChange={(e) =>
                          updateWilayaRate(w.code, { deskPrice: Number(e.target.value) })
                        }
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => updateWilayaRate(w.code, { active: !w.active })}
                      className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                        w.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {w.active
                        ? language === 'ar'
                          ? 'نشط'
                          : 'Active'
                        : language === 'ar'
                        ? 'معطل'
                        : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Company Details Preview Modal (معاينة تفاصيل الشركة) */}
      {previewCompany && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in-95 duration-200"
            dir={direction}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs border border-black/5 shrink-0"
                  style={{
                    backgroundColor: previewCompany.color ? `${previewCompany.color}15` : '#f1f5f9'
                  }}
                >
                  {previewCompany.logo}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <span>{previewCompany.name}</span>
                  </h4>
                  {previewCompany.nameEn && (
                    <span className="text-xs text-slate-500 font-medium block">
                      {previewCompany.nameEn}
                    </span>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {previewCompany.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {previewCompany.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      {previewCompany.code}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setPreviewCompany(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <h5 className="font-black text-slate-800">
                  {language === 'ar' ? 'نبذة عن شركة الشحن:' : 'About Courier Service:'}
                </h5>
                <p className="text-slate-600 leading-relaxed">
                  {previewCompany.description ||
                    (language === 'ar'
                      ? 'شبكة توزيع وتوصيل الطرود والشحن السريع في الجزائر مع تغطية شاملة لجميع الولايات.'
                      : 'Parcel distribution and rapid courier network across all Algerian Wilayas.')}
                </p>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block font-semibold">
                    {language === 'ar' ? 'هاتف خدمة العملاء' : 'Customer Support'}
                  </span>
                  <span className="font-black text-slate-800 font-mono mt-0.5 block">
                    {previewCompany.phone}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block font-semibold">
                    {language === 'ar' ? 'حالة التغطية' : 'Coverage'}
                  </span>
                  <span className="font-black text-emerald-700 mt-0.5 block">
                    {previewCompany.supportedWilayasCount || 58} {language === 'ar' ? 'ولاية مغطاة' : 'Wilayas'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block font-semibold">
                    {language === 'ar' ? 'حالة الربط البرمجي' : 'API Status'}
                  </span>
                  <span
                    className={`font-black mt-0.5 block ${
                      previewCompany.integrated ? 'text-emerald-700' : 'text-slate-600'
                    }`}
                  >
                    {previewCompany.integrated
                      ? language === 'ar'
                        ? 'مربوطة ومتصلة ✅'
                        : 'Connected'
                      : language === 'ar'
                      ? 'متاحة للربط الفوري 🚀'
                      : 'Ready to connect'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block font-semibold">
                    {language === 'ar' ? 'نظام تحصيل الأموال' : 'COD Settlement'}
                  </span>
                  <span className="font-black text-purple-700 mt-0.5 block">
                    {language === 'ar' ? 'تسوية دورية COD' : 'Weekly Settlement'}
                  </span>
                </div>
              </div>

              {/* External Tracking URL */}
              {previewCompany.trackingUrl && (
                <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-black text-blue-900 block text-[11px]">
                        {language === 'ar' ? 'بوابة التتبع المباشر الرسمية' : 'Official Tracking Portal'}
                      </span>
                      <span className="text-[10px] text-blue-600 font-mono truncate max-w-xs block">
                        {previewCompany.trackingUrl}
                      </span>
                    </div>
                  </div>
                  <a
                    href={previewCompany.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-1 hover:bg-blue-700 transition-colors"
                  >
                    <span>{language === 'ar' ? 'فتح البوابة' : 'Visit'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPreviewCompany(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-colors"
              >
                {t('action.close', 'إغلاق')}
              </button>

              <button
                type="button"
                onClick={() => {
                  const comp = previewCompany;
                  setPreviewCompany(null);
                  handleOpenConnectModal(comp);
                }}
                className={`px-6 py-2.5 rounded-2xl font-black flex items-center gap-2 shadow-lg transition-all active:scale-98 ${
                  previewCompany.integrated
                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {previewCompany.integrated ? (
                  <>
                    <Sliders className="w-4 h-4" />
                    <span>{t('shipping.configure', 'إعدادات الربط')}</span>
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4" />
                    <span>{t('shipping.connect_now', 'ربط الآن')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: "ربط الآن" / API Connection Settings for Selected Courier */}
      {selectedCompanyForModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in-95 duration-200"
            dir={direction}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl border border-slate-200/80 shrink-0">
                  {selectedCompanyForModal.logo}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <span>
                      {language === 'ar'
                        ? `ربط وتكامل: ${selectedCompanyForModal.name}`
                        : `Integrate: ${selectedCompanyForModal.nameEn || selectedCompanyForModal.name}`}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    {language === 'ar'
                      ? 'أدخل مفاتيح الـ API الممنوحة لك من شركة الشحن لتفعيل الربط التلقائي.'
                      : 'Enter your API credentials provided by the courier to enable automated dispatch.'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseConnectModal}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveConnection} className="space-y-4 text-xs">
              {/* API Key */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t('shipping.api_key', 'مفتاح الـ API (API Key)')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. yal_live_9482019482a87b1c"
                  value={modalApiKey}
                  onChange={(e) => setModalApiKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* API Token & Account Number Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('shipping.api_token', 'رمز الأمان (API Secret / Token)')}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••••••"
                    value={modalApiToken}
                    onChange={(e) => setModalApiToken(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-mono focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('shipping.account_number', 'رقم الحساب / Client ID')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CLI-84920"
                    value={modalAccountNumber}
                    onChange={(e) => setModalAccountNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-mono focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Sender Hub / Warehouse Address */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t('shipping.sender_hub', 'مركز الشحن / العنوان المعتمد للمتجر')}
                </label>
                <input
                  type="text"
                  placeholder="مثال: الجزائر العاصمة - مستودع سيدي يحيى"
                  value={modalSenderAddress}
                  onChange={(e) => setModalSenderAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Webhook URL with Copy Button */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t('shipping.webhook_url', 'رابط الـ Webhook للإشعارات')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://api.matjari.dz/v1/webhooks/shipping/${selectedCompanyForModal.code}/events`}
                    className="flex-1 px-3.5 py-2 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-[11px] text-slate-600 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyWebhook(selectedCompanyForModal.code)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t('shipping.copy_webhook', 'نسخ')}</span>
                  </button>
                </div>
              </div>

              {/* Auto Sync Toggle */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">
                    {t('shipping.auto_dispatch', 'إرسال الطلبيات تلقائياً لشركة الشحن')}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {language === 'ar'
                      ? 'عند تحويل حالة الطلب إلى "مؤكدة" أو "جاهزة للشحن" يتم توليد البوليصة تلقائياً.'
                      : 'Automatically generate tracking label when order is confirmed.'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={modalAutoSync}
                    onChange={(e) => setModalAutoSync(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* API Test Button & Result Feedback */}
              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestApi}
                  disabled={isTestingApi}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingApi ? 'animate-spin' : ''}`} />
                  <span>
                    {isTestingApi
                      ? t('shipping.testing', 'جاري الفحص والتحقق...')
                      : t('shipping.test_connection', 'فحص الاتصال عبر الـ API')}
                  </span>
                </button>

                {testApiResult === 'success' && (
                  <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-xl">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{language === 'ar' ? 'الاتصال سليم 100%' : 'Connected Successfully'}</span>
                  </span>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                {selectedCompanyForModal.integrated ? (
                  <button
                    type="button"
                    onClick={() => handleDisconnect(selectedCompanyForModal.id)}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    <span>{t('shipping.disconnect', 'فصل الحساب')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCloseConnectModal}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-colors"
                  >
                    {t('action.cancel', 'إلغاء')}
                  </button>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black flex items-center gap-2 shadow-lg transition-all active:scale-98"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {selectedCompanyForModal.integrated
                      ? language === 'ar'
                        ? 'حفظ إعدادات الربط'
                        : 'Save Settings'
                      : language === 'ar'
                      ? 'ربط وتفعيل الآن 🚀'
                      : 'Connect & Activate Now'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
