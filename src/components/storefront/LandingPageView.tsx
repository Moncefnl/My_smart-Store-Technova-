import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ShoppingBag,
  Flame,
  Check,
  Phone,
  Gift
} from 'lucide-react';

export const LandingPageView: React.FC = () => {
  const {
    landingPages,
    activeLandingPageId,
    products,
    wilayas,
    reviews,
    settings,
    addOrder,
    setViewMode,
    isAuthenticated,
    currentUser,
    showNotification
  } = useStore();

  const landingPage =
    landingPages.find((p) => p.id === activeLandingPageId) || landingPages[0];
  const linkedProduct =
    products.find((p) => p.id === landingPage?.productId) || products[0];

  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState('16');
  const [deliveryType, setDeliveryType] = useState<'home' | 'desk'>('home');
  const [address, setAddress] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!landingPage || !linkedProduct) {
    return (
      <div className="p-8 text-center" dir="rtl">
        <p>لا توجد صفحة هبوط متاحة حالياً.</p>
        <button
          onClick={() => setViewMode(isAuthenticated && currentUser?.accountType === 'merchant' ? 'dashboard' : 'storefront')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs"
        >
          {isAuthenticated && currentUser?.accountType === 'merchant' ? 'العودة للوحة التحكم' : 'العودة للمتجر'}
        </button>
      </div>
    );
  }

  const currentWilaya = wilayas.find((w) => w.code === selectedWilayaCode) || wilayas[0];
  const shippingFee = deliveryType === 'home' ? currentWilaya.homePrice : currentWilaya.deskPrice;
  const subtotal = linkedProduct.price * quantity;
  const total = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || customerPhone.length < 9) {
      showNotification('يرجى إدخال رقم هاتف صالح لتأكيد الطلب', 'error');
      return;
    }

    const newOrder = addOrder({
      customerName,
      phone: customerPhone,
      wilaya: `${currentWilaya.code} - ${currentWilaya.nameAr}`,
      commune: address || 'المركز',
      address: address || 'الاستلام من المكتب',
      items: [
        {
          productId: linkedProduct.id,
          productName: linkedProduct.name,
          productImage: linkedProduct.images[0],
          quantity,
          unitPrice: linkedProduct.price,
        },
      ],
      shippingCost: shippingFee,
      shippingType: deliveryType,
      discountAmount: 0,
      totalAmount: total,
      status: 'pending',
      paymentMethod: 'cod',
      notes: `تم الطلب عبر صفحة الهبوط: ${landingPage.title}`,
    });

    if (newOrder) {
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans" dir="rtl">
      {/* Top Admin Switch Bar (Merchants Only) */}
      {isAuthenticated && currentUser?.accountType === 'merchant' && currentUser?.role !== 'customer' && (
        <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between z-30 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold">معاينة صفحة الهبوط الإعلانية: {landingPage.title}</span>
          </div>
          <button
            onClick={() => setViewMode('dashboard')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>العودة للوحة التحكم</span>
          </button>
        </div>
      )}

      {/* Urgency Countdown Sticky Bar */}
      <div className="bg-rose-600 text-white py-2 px-4 text-center text-xs font-bold shadow-md flex items-center justify-center gap-3">
        <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
        <span>عرض خاص وحصري سينتهي خلال: 05:41:20</span>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 flex-1">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 text-center space-y-4">
          <span className="inline-block bg-rose-50 text-rose-600 border border-rose-200 text-xs font-black px-4 py-1.5 rounded-full">
            {landingPage.heroBadge}
          </span>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
            {landingPage.heroTitle}
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            {landingPage.heroSubtitle}
          </p>

          {/* Product Media */}
          <div className="max-w-md mx-auto aspect-square rounded-3xl overflow-hidden shadow-lg border border-slate-100 my-6">
            <img
              src={landingPage.mediaUrl || linkedProduct.images[0]}
              alt={linkedProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Pricing Highlight */}
          <div className="flex items-center justify-center gap-3 py-2">
            <span className="text-3xl font-black text-emerald-600">
              {linkedProduct.price.toLocaleString()} {settings.currency}
            </span>
            {linkedProduct.compareAtPrice && (
              <span className="text-base text-slate-400 line-through">
                {linkedProduct.compareAtPrice.toLocaleString()} {settings.currency}
              </span>
            )}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {landingPage.features.map((feat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">{feat.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Direct COD Checkout Form */}
        <div id="order-form" className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-500 space-y-6">
          <div className="text-center space-y-1 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900">
              {landingPage.callToAction}
            </h3>
            <p className="text-xs text-slate-500">
              املأ الاستمارة أدناه وسيتم التواصل معك هاتفياً لتأكيد إرسال الطلب لباب بيتك.
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-xl font-black text-slate-900">شكراً لك! تم استلام طلبك بنجاح 🎉</h4>
              <p className="text-xs text-slate-600">
                سيتصل بك فريقنا قريباً على الرقم <span className="font-bold font-mono">{customerPhone}</span> لتأكيد الشحن والتسليم.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    placeholder="الاسم واللقب"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0550112233"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الولاية (58 ولاية) *</label>
                  <select
                    value={selectedWilayaCode}
                    onChange={(e) => setSelectedWilayaCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs"
                  >
                    {wilayas.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.code} - {w.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">مكان التسليم *</label>
                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs"
                  >
                    <option value="home">
                      توصيل للمنزل (+{currentWilaya.homePrice} د.ج)
                    </option>
                    <option value="desk">
                      استلام من المكتب (+{currentWilaya.deskPrice} د.ج)
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">البلدية والعنوان بالتفصيل</label>
                <input
                  type="text"
                  placeholder="مثال: وسط المدينة، بالقرب من المسجد الكبير"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {/* Summary box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">
                    المجموع الكلي مع التوصيل ({currentWilaya.nameAr}):
                  </div>
                  <div className="text-[11px] text-slate-500">الدفع عند استلام الطرد نقداً</div>
                </div>
                <div className="text-xl font-black text-emerald-600">
                  {total.toLocaleString()} {settings.currency}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl transition-transform active:scale-98"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{landingPage.callToAction}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
