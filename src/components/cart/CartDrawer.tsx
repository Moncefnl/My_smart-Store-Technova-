import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Truck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { Product } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    settings,
    wilayas,
    promos,
    direction,
    language,
    showNotification,
    t,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [selectedWilayaCode, setSelectedWilayaCode] = useState('16');
  const [deliveryType, setDeliveryType] = useState<'home' | 'desk'>('home');

  if (!isOpen) return null;

  const currentWilaya = wilayas.find((w) => w.code === selectedWilayaCode) || wilayas[0];
  const shippingFee = deliveryType === 'home' ? currentWilaya.homePrice : currentWilaya.deskPrice;

  // Calculate totals
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.selectedPrice * item.quantity,
    0
  );

  const isFreeShipping = subtotal >= (settings.freeShippingThreshold || 8000);
  const freeShippingNeeded = Math.max(0, (settings.freeShippingThreshold || 8000) - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / (settings.freeShippingThreshold || 8000)) * 100)
  );

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.value) / 100;
    }
    return Math.min(subtotal, appliedCoupon.value);
  };

  const discountAmount = calculateDiscount();
  const finalShippingCost = isFreeShipping ? 0 : shippingFee;
  const grandTotal = Math.max(0, subtotal - discountAmount + (cart.length > 0 ? finalShippingCost : 0));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const found = promos.find(
      (p) => p.code.toUpperCase() === couponCode.trim().toUpperCase() && p.isActive
    );

    if (!found) {
      showNotification('رمز الكوبون غير صالح أو غير نشط', 'error');
      return;
    }

    if (found.minOrderValue && subtotal < found.minOrderValue) {
      showNotification(
        `الحد الأدنى لتطبيق هذا الكوبون هو ${found.minOrderValue.toLocaleString()} ${settings.currency}`,
        'error'
      );
      return;
    }

    setAppliedCoupon(found);
    showNotification(`تم تطبيق خصم الكوبون ${found.code} بنجاح 🎉`, 'success');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    showNotification('تم إلغاء الكوبون', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" dir={direction}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 ${direction === 'rtl' ? 'left-0' : 'right-0'} max-w-full flex pl-0 sm:pl-10`}>
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {language === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {totalItemsCount}{' '}
                    {language === 'ar'
                      ? totalItemsCount === 1
                        ? 'منتج واحد'
                        : 'منتجات مختارة'
                      : 'items in cart'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-slate-400 hover:text-rose-600 px-2 py-1 rounded-lg transition-colors"
                    title={language === 'ar' ? 'تفريغ السلة' : 'Clear cart'}
                  >
                    {language === 'ar' ? 'تفريغ' : 'Clear'}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="mt-4 bg-emerald-50/70 border border-emerald-100/80 rounded-2xl p-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  {isFreeShipping
                    ? language === 'ar'
                      ? '🎉 تهانينا! حصلت على توصيل مجاني'
                      : '🎉 Congratulations! You unlocked Free Shipping'
                    : language === 'ar'
                    ? `تبقّى ${freeShippingNeeded.toLocaleString()} ${settings.currency} للشحن المجاني`
                    : `Add ${freeShippingNeeded.toLocaleString()} ${settings.currency} for Free Shipping`}
                </span>
                <span className="font-mono font-black text-emerald-700 text-[11px]">
                  {freeShippingProgress}%
                </span>
              </div>
              <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-800 text-base">
                    {language === 'ar' ? 'سلة التسوق فارغة حالياً' : 'Your cart is empty'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    {language === 'ar'
                      ? 'تصفح قائمة المنتجات المميزة واختر ما يناسبك واطلب فوراً مع الدفع عند الاستلام!'
                      : 'Explore our popular collection and add items to your cart!'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  {language === 'ar' ? 'تصفح المنتجات الآن' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.variantName || 'default'}-${idx}`}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex gap-3 group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                  />

                  {/* Info & Actions */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.variantName)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors opacity-80 group-hover:opacity-100"
                          title={language === 'ar' ? 'حذف من السلة' : 'Remove item'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variantName && (
                        <span className="inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1">
                          {item.variantName}
                        </span>
                      )}

                      <div className="font-black text-slate-900 text-xs mt-1">
                        {item.selectedPrice.toLocaleString()} {settings.currency}
                      </div>
                    </div>

                    {/* Quantity Stepper & Line Total */}
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.variantName
                            )
                          }
                          className="p-1 text-slate-600 hover:bg-white rounded-lg transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.variantName
                            )
                          }
                          className="p-1 text-slate-600 hover:bg-white rounded-lg transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-black text-emerald-700">
                        {(item.selectedPrice * item.quantity).toLocaleString()} {settings.currency}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Wilaya Quick Shipping Estimator */}
            {cart.length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-slate-600" />
                    {language === 'ar' ? 'حساب مصاريف التوصيل' : 'Delivery Destination'}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-mono">
                    {isFreeShipping
                      ? language === 'ar' ? 'مجاني 🎉' : 'FREE 🎉'
                      : `${shippingFee.toLocaleString()} ${settings.currency}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedWilayaCode}
                    onChange={(e) => setSelectedWilayaCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none"
                  >
                    {wilayas.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.code} - {language === 'ar' ? w.nameAr : (w.nameEn || w.nameAr)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="home">
                      {language === 'ar' ? 'للمنزل' : 'Home'} ({currentWilaya.homePrice} {settings.currency})
                    </option>
                    <option value="desk">
                      {language === 'ar' ? 'للمكتب' : 'Desk'} ({currentWilaya.deskPrice} {settings.currency})
                    </option>
                  </select>
                </div>
              </div>
            )}

            {/* Coupon Code Section */}
            {cart.length > 0 && (
              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold">{appliedCoupon.code}</span>
                      <span className="text-[11px] text-emerald-700">
                        (-{discountAmount.toLocaleString()} {settings.currency})
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-rose-600 hover:underline font-bold"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder={language === 'ar' ? 'هل لديك كود خصم؟' : 'Promo Code'}
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!couponCode.trim()}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition-all"
                    >
                      {language === 'ar' ? 'تطبيق' : 'Apply'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3">
              {/* Pricing Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'مجموع المنتجات:' : 'Subtotal:'}</span>
                  <span className="font-bold text-slate-900">
                    {subtotal.toLocaleString()} {settings.currency}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>{language === 'ar' ? 'الخصم المطبق:' : 'Discount:'}</span>
                    <span>-{discountAmount.toLocaleString()} {settings.currency}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'مصاريف التوصيل:' : 'Shipping:'}</span>
                  <span className="font-bold text-slate-900">
                    {isFreeShipping ? (
                      <span className="text-emerald-600 font-bold">
                        {language === 'ar' ? 'مجاناً' : 'FREE'}
                      </span>
                    ) : (
                      `${finalShippingCost.toLocaleString()} ${settings.currency}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-100">
                  <span>{language === 'ar' ? 'المجموع النهائي (الدفع عند الاستلام):' : 'Grand Total (COD):'}</span>
                  <span className="text-emerald-700 text-base">
                    {grandTotal.toLocaleString()} {settings.currency}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <span>{language === 'ar' ? 'إتمام الطلب الآن (الدفع عند الاستلام)' : 'Proceed to Checkout (COD)'}</span>
                {direction === 'rtl' ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {language === 'ar'
                    ? 'دفع آمن 100% عند استلام الطلب ومعاينة المنتج'
                    : '100% Secure Cash on Delivery'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
