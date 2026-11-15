import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  X,
  Check,
  Truck,
  ShieldCheck,
  Phone,
  MapPin,
  Sparkles,
  TicketPercent,
  CheckCircle2,
  Package,
  Lock
} from 'lucide-react';
import { OrderItem } from '../../types';
import { SmartCaptcha } from '../common/SmartCaptcha';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    cart,
    clearCart,
    settings,
    wilayas,
    promos,
    addOrder,
    showNotification,
    direction,
    language,
    t,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState('16');
  const [deliveryType, setDeliveryType] = useState<'home' | 'desk'>('home');
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);

  // CAPTCHA Verification state
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedOrderNumber, setSubmittedOrderNumber] = useState('');

  if (!isOpen) return null;

  const currentWilaya = wilayas.find((w) => w.code === selectedWilayaCode) || wilayas[0];
  const shippingFee = deliveryType === 'home' ? currentWilaya.homePrice : currentWilaya.deskPrice;

  const subtotal = cart.reduce(
    (acc, item) => acc + item.selectedPrice * item.quantity,
    0
  );

  const isFreeShipping = subtotal >= (settings.freeShippingThreshold || 8000);
  const finalShippingCost = isFreeShipping ? 0 : shippingFee;

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === 'percentage') {
      return (subtotal * appliedPromo.value) / 100;
    }
    return Math.min(subtotal, appliedPromo.value);
  };

  const discountAmount = calculateDiscount();
  const grandTotal = Math.max(0, subtotal - discountAmount + finalShippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const found = promos.find(
      (p) => p.code.toUpperCase() === promoInput.trim().toUpperCase() && p.isActive
    );

    if (!found) {
      showNotification('رمز الكوبون غير صالح أو غير نشط', 'error');
      return;
    }

    setAppliedPromo(found);
    showNotification(`تم تطبيق خصم الكوبون ${found.code} بنجاح 🎉`, 'success');
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showNotification('السلة فارغة!', 'error');
      return;
    }

    if (!customerPhone || customerPhone.replace(/\s+/g, '').length < 9) {
      showNotification('يرجى إدخال رقم هاتف صحيح', 'error');
      return;
    }

    if (!isCaptchaVerified) {
      showNotification(
        language === 'ar'
          ? 'يرجى حل اختبار التحقق البشري (الكابتشا) أولاً لتأكيد الطلب 🛡️'
          : 'Please complete the Anti-Bot CAPTCHA verification first 🛡️',
        'error'
      );
      return;
    }

    // Prepare order items
    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images[0],
      variantName: item.variantName,
      quantity: item.quantity,
      unitPrice: item.selectedPrice,
    }));

    const newOrder = addOrder({
      customerName: customerName || (language === 'ar' ? 'زبون المتجر' : 'Store Customer'),
      phone: customerPhone,
      wilaya: `${currentWilaya.code} - ${language === 'ar' ? currentWilaya.nameAr : currentWilaya.nameEn}`,
      commune: commune || address || (language === 'ar' ? 'المركز' : 'Center'),
      address: address || (deliveryType === 'home' ? 'توصيل للمنزل' : 'استلام من مكتب التوصيل'),
      items: orderItems,
      shippingType: deliveryType,
      shippingCost: finalShippingCost,
      discountAmount,
      promoCode: appliedPromo?.code,
      totalAmount: grandTotal,
      status: 'pending',
      paymentMethod: 'cod',
      notes: notes || undefined,
    });

    if (newOrder) {
      setSubmittedOrderNumber(newOrder.orderNumber);
      setIsSubmitted(true);
      clearCart();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir={direction}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-4 text-center">
        <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl text-start relative z-10 my-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base leading-snug">
                  {language === 'ar'
                    ? 'تأكيد طلب السلة - الدفع عند الاستلام'
                    : 'Confirm Order - Cash On Delivery'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ar'
                    ? 'يرجى إدخال معلومات التوصيل لتأكيد الشحن'
                    : 'Please fill in your delivery details'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isSubmitted ? (
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-slate-900">
                  {language === 'ar' ? 'تم تسجيل طلبك بنجاح! 🎉' : 'Order Placed Successfully! 🎉'}
                </h4>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 max-w-sm mx-auto">
                  <div className="text-xs text-slate-500">
                    {language === 'ar' ? 'رقم الطلب الخاص بك:' : 'Your Order Number:'}
                  </div>
                  <div className="font-mono font-black text-emerald-700 text-lg mt-0.5">
                    {submittedOrderNumber}
                  </div>
                </div>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed pt-1">
                  {language === 'ar' ? (
                    <>
                      سيتصل بكم فريق خدمة العملاء على الرقم{' '}
                      <span className="font-bold font-mono text-slate-900" dir="ltr">
                        {customerPhone}
                      </span>{' '}
                      لتأكيد موعد التسليم والتوصيل لباب منزلك.
                    </>
                  ) : (
                    <>
                      Our customer service team will call you at{' '}
                      <span className="font-bold font-mono text-slate-900">{customerPhone}</span> to
                      confirm dispatch.
                    </>
                  )}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirmOrder} className="space-y-4 text-xs">
              {/* Order Items Preview Ribbon */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-600" />
                    {language === 'ar' ? 'المنتجات في الطلب:' : 'Items in Order:'}
                  </span>
                  <span className="text-slate-500">{cart.length} {language === 'ar' ? 'عناصر' : 'items'}</span>
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 text-xs bg-white p-2 rounded-xl border border-slate-200/60"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate text-[11px]">
                            {item.product.name}
                          </span>
                          {item.variantName && (
                            <span className="text-[10px] text-slate-500 block">
                              {item.variantName}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-end shrink-0">
                        <span className="font-mono font-bold text-slate-800 text-xs">
                          {item.quantity} × {item.selectedPrice.toLocaleString()} {settings.currency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('form.full_name', 'الاسم الكامل للزبون')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'ar' ? 'مثال: محمد بن عيسى' : 'e.g. John Doe'}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('form.phone', 'رقم الهاتف لتأكيد التوصيل')} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0550123456 / 0661234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    dir="ltr"
                  />
                </div>

                {/* Wilaya & Delivery Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t('form.state_wilaya', 'الولاية (58 ولاية)')} *
                    </label>
                    <select
                      value={selectedWilayaCode}
                      onChange={(e) => setSelectedWilayaCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    >
                      {wilayas.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.code} - {language === 'ar' ? w.nameAr : (w.nameEn || w.nameAr)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t('form.delivery_type', 'مكان الاستلام')} *
                    </label>
                    <select
                      value={deliveryType}
                      onChange={(e) => setDeliveryType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="home">
                        {language === 'ar' ? 'توصيل حتى باب المنزل' : 'Home Delivery'} (
                        {currentWilaya.homePrice} {settings.currency})
                      </option>
                      <option value="desk">
                        {language === 'ar' ? 'استلام من مكتب التوصيل (Stop Desk)' : 'Desk Pickup'} (
                        {currentWilaya.deskPrice} {settings.currency})
                      </option>
                    </select>
                  </div>
                </div>

                {/* Commune and Detailed Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'البلدية' : 'Commune'}
                    </label>
                    <input
                      type="text"
                      placeholder={language === 'ar' ? 'مثال: باب الزوار' : 'e.g. Downtown'}
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t('form.detailed_address', 'العنوان بالتفصيل')}
                    </label>
                    <input
                      type="text"
                      placeholder={language === 'ar' ? 'حي النخيل عمارة 4 شقة 12' : 'Street & apt'}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Promo Code Box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'هل لديك كود خصم؟' : 'Have a Promo Code?'}
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs uppercase focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-all"
                >
                  {t('action.apply', 'تطبيق')}
                </button>
              </div>

              {/* Total Calculation Card */}
              <div className="bg-slate-50 p-3.5 rounded-2xl space-y-1.5 text-slate-700 text-xs">
                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'سعر المنتجات:' : 'Products Price:'}</span>
                  <span className="font-bold text-slate-900">
                    {subtotal.toLocaleString()} {settings.currency}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>
                      {language === 'ar' ? 'خصم الكوبون' : 'Coupon Discount'} ({appliedPromo.code}):
                    </span>
                    <span>-{discountAmount.toLocaleString()} {settings.currency}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>
                    {language === 'ar' ? 'مصاريف التوصيل:' : 'Delivery Fee:'} (
                    {language === 'ar' ? currentWilaya.nameAr : (currentWilaya.nameEn || currentWilaya.nameAr)}
                    )
                  </span>
                  <span className="font-bold text-slate-900">
                    {isFreeShipping ? (
                      <span className="text-emerald-600 font-bold">
                        {language === 'ar' ? 'مجاناً' : 'FREE'} 🎉
                      </span>
                    ) : (
                      `${finalShippingCost.toLocaleString()} ${settings.currency}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>{language === 'ar' ? 'المبلغ الإجمالي عند الاستلام:' : 'Total Amount (COD):'}</span>
                  <span className="text-emerald-700 text-base">
                    {grandTotal.toLocaleString()} {settings.currency}
                  </span>
                </div>
              </div>

              {/* Anti-Bot & CAPTCHA Verification Component */}
              <SmartCaptcha
                isVerified={isCaptchaVerified}
                onVerify={setIsCaptchaVerified}
                pageContext="cart_checkout"
                customerName={customerName}
                phone={customerPhone}
              />

              {/* Confirm Button */}
              <button
                type="submit"
                className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  isCaptchaVerified
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white shadow-emerald-600/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {isCaptchaVerified ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <Lock className="w-4 h-4 text-emerald-400" />
                )}
                <span>{language === 'ar' ? 'تأكيد الطلب الآن (الدفع عند الاستلام)' : 'Confirm COD Order'}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'شحن مضمون لـ 58 ولاية والدفع بعد استلام وفحص الطرد'
                    : '100% Guaranteed delivery across 58 wilayas'}
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
