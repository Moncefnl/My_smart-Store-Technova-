import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerReview } from '../../types';
import { Star, Plus, Check, Trash2, ShieldCheck, Eye, EyeOff, MessageSquare, ThumbsUp } from 'lucide-react';

export const ReviewsTab: React.FC = () => {
  const { reviews, products, addReview, approveReview, deleteReview } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [productId, setProductId] = useState('');
  const [wilaya, setWilaya] = useState('16 - الجزائر العاصمة');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80');

  const openAddModal = () => {
    setCustomerName('');
    setProductId(products[0]?.id || '');
    setWilaya('16 - الجزائر العاصمة');
    setRating(5);
    setComment('منتج ممتاز جداً وجودة تفوق التوقعات، والتوصيل سريع وتعامل محترم.');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === productId) || products[0];
    addReview({
      productId: product.id,
      productName: product.name,
      customerName,
      wilaya,
      rating,
      comment,
      verifiedPurchase: true,
      isApproved: true,
      avatar,
    });
    setIsModalOpen(false);
  };

  return (
    <div id="reviews-tab-content" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">إدارة آراء وتقييمات الزبائن</h3>
          <p className="text-xs text-slate-500">
            مراجعة تقييمات العملاء الواردة من المتجر، الموافقة على نشرها، أو إضافة تجارب زبائن يدويًا.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة رأي زبون يدوياً</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3.5 transition-all ${
              rev.isApproved ? 'border-slate-200/80' : 'border-amber-300 bg-amber-50/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.customerName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-slate-900">{rev.customerName}</h4>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>مشتري حقيقي</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">{rev.wilaya} • {rev.date}</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">
              "{rev.comment}"
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[200px]">
                المنتج: {rev.productName}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => approveReview(rev.id, !rev.isApproved)}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors ${
                    rev.isApproved
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {rev.isApproved ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{rev.isApproved ? 'إخفاء عن المتجر' : 'نشر في المتجر'}</span>
                </button>

                <button
                  onClick={() => deleteReview(rev.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  title="حذف التقييم"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-slate-900 text-base">إضافة رأي زبون جديد</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الزبون</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  placeholder="مثال: ياسمين قادري"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المنتج المعني بالتقييم</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الولاية</label>
                  <input
                    type="text"
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">التقييم بالنجوم</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-amber-600"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 نجوم)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 نجوم)</option>
                    <option value={3}>⭐⭐⭐ (3 نجوم)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نص التعليق والتجربة</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>نشر التقييم فوراً</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
