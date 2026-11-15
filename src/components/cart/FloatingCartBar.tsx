import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  ChevronUp,
  Sparkles,
  Truck,
  Check
} from 'lucide-react';

interface FloatingCartBarProps {
  onOpenCart: () => void;
  onProceedToCheckout: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  onOpenCart,
  onProceedToCheckout,
}) => {
  const { cart, settings, direction, language } = useStore();

  if (cart.length === 0) return null;

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.selectedPrice * item.quantity,
    0
  );

  const isFreeShipping = subtotal >= (settings.freeShippingThreshold || 8000);
  const remainingForFreeShipping = Math.max(0, (settings.freeShippingThreshold || 8000) - subtotal);

  return (
    <div
      className="fixed bottom-4 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none flex justify-center animate-in slide-in-from-bottom-6 fade-in duration-300"
      dir={direction}
    >
      <div className="pointer-events-auto w-full max-w-2xl bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-3 sm:p-3.5 shadow-2xl border border-slate-800 flex items-center justify-between gap-3 sm:gap-4 transition-all hover:border-slate-700">
        {/* Left: Cart Icon, Avatars & Totals */}
        <div
          onClick={onOpenCart}
          className="flex items-center gap-3 sm:gap-4 cursor-pointer group flex-1 min-w-0"
        >
          {/* Animated Bag Badge */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
              {totalItemsCount}
            </span>
          </div>

          {/* Product Thumbnails stack */}
          <div className="hidden sm:flex items-center -space-x-2 rtl:space-x-reverse shrink-0">
            {cart.slice(0, 3).map((item, idx) => (
              <img
                key={idx}
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-9 h-9 rounded-xl object-cover border-2 border-slate-900 bg-slate-800 shrink-0"
              />
            ))}
            {cart.length > 3 && (
              <div className="w-9 h-9 rounded-xl bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-300">
                +{cart.length - 3}
              </div>
            )}
          </div>

          {/* Item count & Price Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-200">
                {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
                {totalItemsCount} {language === 'ar' ? 'منتج' : 'items'}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-black text-sm sm:text-base text-emerald-400 font-mono">
                {subtotal.toLocaleString()} {settings.currency}
              </span>
              {isFreeShipping ? (
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md">
                  <Truck className="w-3 h-3" />
                  {language === 'ar' ? 'شحن مجاني 🎉' : 'Free shipping'}
                </span>
              ) : (
                <span className="hidden md:inline-block text-[10px] text-slate-400">
                  {language === 'ar'
                    ? `(أضف ${remainingForFreeShipping.toLocaleString()} د.ج للشحن المجاني)`
                    : `(${remainingForFreeShipping.toLocaleString()} for free ship)`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View Cart Button */}
          <button
            onClick={onOpenCart}
            className="px-3 sm:px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <span>{language === 'ar' ? 'عرض السلة' : 'View Cart'}</span>
            <ChevronUp className="w-4 h-4 text-slate-400" />
          </button>

          {/* Checkout Direct Action Button */}
          <button
            onClick={onProceedToCheckout}
            className="px-4 sm:px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 cursor-pointer"
          >
            <span>{language === 'ar' ? 'إتمام الطلب' : 'Checkout'}</span>
            {direction === 'rtl' ? (
              <ArrowLeft className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
