import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { generateMockTrackingData } from '../../data/mockData';
import {
  X,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Building2,
  Copy,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Navigation,
  Sparkles
} from 'lucide-react';

interface LiveTrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

export const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({ order, onClose }) => {
  const { showNotification } = useStore();

  if (!order) return null;

  const trackingData = generateMockTrackingData(order, order.shippingCompany || 'Yalidine Express');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('تم نسخ رقم التتبع إلى الحافظة 📋', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
                  تتبع مباشر للطرود
                </span>
                <span className="text-xs bg-emerald-500/80 border border-emerald-300/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping" />
                  مباشر عبر API
                </span>
              </div>
              <h2 className="text-xl font-bold mt-1">
                تتبع الشحنة للطلب {order.orderNumber}
              </h2>
            </div>
          </div>

          {/* Tracking Number Card */}
          <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-white/80">رقم بوليصة الشحن (Tracking Number):</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-lg font-bold tracking-wider">{trackingData.trackingNumber}</span>
                <button
                  onClick={() => copyToClipboard(trackingData.trackingNumber)}
                  className="p-1 rounded-md hover:bg-white/20 text-white/90 hover:text-white transition-colors"
                  title="نسخ رقم التتبع"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-white/80">شركة التوصيل:</p>
                <p className="font-bold text-sm">{trackingData.courierName}</p>
              </div>
              <a
                href={`https://yalidine.com/suivi/?tracking=${trackingData.trackingNumber}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-white text-emerald-800 rounded-lg text-xs font-bold hover:bg-slate-100 flex items-center gap-1 transition-colors"
              >
                <span>موقع الشركة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">الحالة الحالية للشحنة</p>
                <p className="text-base font-bold text-slate-800">{trackingData.statusText}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-600">
              <div>
                <span className="text-xs text-slate-400 block">المبلغ للتحصيل (COD):</span>
                <span className="font-bold text-emerald-700 font-mono text-base">{trackingData.totalToCollect.toLocaleString()} دج</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">الوصول التقديري:</span>
                <span className="font-semibold text-slate-700">{trackingData.estimatedDelivery}</span>
              </div>
            </div>
          </div>

          {/* Customer & Destination Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                معلومات المستلم والوجهة
              </h3>
              <div className="space-y-1.5 text-sm">
                <p className="font-semibold text-slate-800">{trackingData.recipientName}</p>
                <p className="text-slate-600 font-mono text-xs">{trackingData.recipientPhone}</p>
                <p className="text-slate-600 text-xs">
                  <span className="font-medium text-slate-700">الولاية والبلدية:</span> {trackingData.recipientWilaya} {order.commune ? `- ${order.commune}` : ''}
                </p>
                <p className="text-slate-500 text-xs">{trackingData.recipientAddress}</p>
                <div className="mt-2 inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-medium">
                  {trackingData.shippingType === 'home' ? 'توصيل لباب المنزل (À Domicile)' : 'استلام من مكتب الشركة (Stop Desk)'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                مركز التوزيع والاتصال
              </h3>
              <div className="space-y-2 text-xs text-slate-600">
                <p className="text-slate-700">
                  <strong className="text-slate-900">هاتف خدمة عملاء الشاحن:</strong> {trackingData.courierPhone}
                </p>
                <p className="text-slate-700">
                  <strong className="text-slate-900">تحديث الحالة:</strong> متزامن تلقائياً عبر بروتوكول الويب هوك (Webhooks)
                </p>
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    يقوم موزع الشحنة بالاتصال بالزبون هاتفياً قبل ساعة من الوصول لضمان الاستلام وتسليم المبلغ.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Events */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              مراحل تحرك الطرد (Journal de Suivi)
            </h3>

            <div className="relative border-r-2 border-slate-200 mr-4 space-y-6 pr-6">
              {trackingData.events.map((event, index) => {
                const isCompleted = event.status === 'completed';
                const isCurrent = event.status === 'current';

                return (
                  <div key={event.id} className="relative group">
                    {/* Circle Node */}
                    <div
                      className={`absolute -right-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-white border-amber-500 text-amber-600 shadow-md animate-pulse'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    {/* Event Content */}
                    <div
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-amber-50/70 border-amber-200 shadow-sm'
                          : isCompleted
                          ? 'bg-slate-50 border-slate-200/80'
                          : 'bg-white border-dashed border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h4 className={`text-sm font-bold ${isCurrent ? 'text-amber-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'}`}>
                          {event.title}
                        </h4>
                        <span className="text-xs font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {event.date} - {event.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-1.5">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              const text = `مرحباً ${order.customerName}، شحنتك رقم ${order.orderNumber} مع ${trackingData.courierName} تحت رقم التتبع ${trackingData.trackingNumber}. يمكنك تتبعها عبر: https://yalidine.com/suivi/?tracking=${trackingData.trackingNumber}`;
              window.open(`https://wa.me/213${order.phone.replace(/^0/, '')}?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>إرسال رابط التتبع للزبون عبر واتساب 💬</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
