import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariant } from '../../types';
import {
  Package,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  Save,
  CheckCircle2,
  DollarSign,
  Tag,
  Warehouse,
  ListPlus,
  Layers,
  HelpCircle,
  Eye,
  Sliders,
  Check,
  AlertCircle
} from 'lucide-react';

interface ProductAddFormProps {
  initialProduct?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// Professional sample presets for Algerian e-commerce market
const SAMPLE_IMAGE_PRESETS = [
  {
    name: 'ساعة ذكية فاخرة',
    category: 'إلكترونيات وساعات',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  },
  {
    name: 'سماعات بلوتوث لاسلكية',
    category: 'إلكترونيات',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  },
  {
    name: 'عطر فاخر رجالي/نسائي',
    category: 'عطور ومستحضرات تجميل',
    url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
  },
  {
    name: 'حذاء رياضي مريح',
    category: 'أزياء وأحذية',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
  },
  {
    name: 'حقيبة يد جلدية أصلية',
    category: 'حقائب وإكسسوارات',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
  },
  {
    name: 'ماكينة حلاقة وتشذيب ذكية',
    category: 'العناية الشخصية',
    url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800',
  },
];

export const ProductAddForm: React.FC<ProductAddFormProps> = ({
  initialProduct,
  onSuccess,
  onCancel,
}) => {
  const {
    addProduct,
    updateProduct,
    categories,
    addCategory,
    settings,
    showNotification,
    language
  } = useStore();

  const isEditing = Boolean(initialProduct);

  // Form State
  const [name, setName] = useState(initialProduct?.name || '');
  const [category, setCategory] = useState(
    initialProduct?.category || (categories[0]?.name ?? 'عام')
  );
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);

  const [price, setPrice] = useState<number | ''>(initialProduct?.price ?? 4500);
  const [compareAtPrice, setCompareAtPrice] = useState<number | ''>(
    initialProduct?.compareAtPrice ?? 6500
  );
  const [costPrice, setCostPrice] = useState<number | ''>(
    initialProduct?.costPrice ?? 2200
  );
  const [stock, setStock] = useState<number | ''>(initialProduct?.stock ?? 45);
  const [sku, setSku] = useState(
    initialProduct?.sku || `DZ-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [badge, setBadge] = useState(initialProduct?.badge || 'الأكثر طلباً 🔥');

  // Media
  const [imageUrl, setImageUrl] = useState(
    initialProduct?.images?.[0] ||
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
  );
  const [additionalImages, setAdditionalImages] = useState<string[]>(
    initialProduct?.images?.slice(1) || []
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Description & Features
  const [description, setDescription] = useState(
    initialProduct?.description ||
      'منتج أصلي عالي الجودة مصمم لتلبية احتياجاتك اليومية بأعلى معايير المتانة والأداء، مع ضمان استبدال وتوصيل سريع لكافة الـ 58 ولاية والدفع عند الاستلام.'
  );
  const [features, setFeatures] = useState<string[]>(
    initialProduct?.features?.length
      ? initialProduct.features
      : [
          'جودة أصلية ممتازة ومضمونة 100%',
          'توصيل سريع ومجاني حتى باب منزلك في 58 ولاية',
          'الدفع نقداً عند استلام ومعاينة المنتج',
          'ضمان استبدال وإرجاع سهل خلال 7 أيام',
        ]
  );
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Variants
  const [hasVariants, setHasVariants] = useState<boolean>(
    Boolean(initialProduct?.variants && initialProduct.variants.length > 0)
  );
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialProduct?.variants || [
      { id: 'v1', name: 'اللون الأسود الملكي', price: 4500, stock: 20 },
      { id: 'v2', name: 'اللون الفضي العصري', price: 4500, stock: 25 },
    ]
  );
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantPrice, setNewVariantPrice] = useState<number | ''>(4500);
  const [newVariantStock, setNewVariantStock] = useState<number | ''>(15);

  // Settings
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured ?? true);
  const [isPublished, setIsPublished] = useState(initialProduct?.isPublished ?? true);

  // AI Marketing Generator State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Calculated Profit
  const numPrice = typeof price === 'number' ? price : 0;
  const numCost = typeof costPrice === 'number' ? costPrice : 0;
  const calculatedProfit = numPrice - numCost;
  const marginPercentage = numPrice > 0 ? Math.round((calculatedProfit / numPrice) * 100) : 0;
  const discountPercentage =
    typeof compareAtPrice === 'number' && compareAtPrice > numPrice
      ? Math.round(((compareAtPrice - numPrice) / compareAtPrice) * 100)
      : 0;

  // Add Feature
  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFeatures([...features, newFeatureInput.trim()]);
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Add Variant
  const handleAddVariant = () => {
    if (!newVariantName.trim()) return;
    const v: ProductVariant = {
      id: `var-${Date.now()}`,
      name: newVariantName.trim(),
      price: typeof newVariantPrice === 'number' ? newVariantPrice : numPrice,
      stock: typeof newVariantStock === 'number' ? newVariantStock : 10,
    };
    setVariants([...variants, v]);
    setNewVariantName('');
    setNewVariantPrice(numPrice);
    setNewVariantStock(10);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  // Add Gallery Image
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setAdditionalImages([...additionalImages, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  // Add new Category quickly
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory({
      name: newCategoryName.trim(),
      slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-'),
      icon: 'Tag',
      itemCount: 1,
      image: imageUrl,
    });
    setCategory(newCategoryName.trim());
    setNewCategoryName('');
    setShowAddCategoryInput(false);
    showNotification(`تم إنشاء وتعيين القسم "${newCategoryName}" بنجاح`, 'success');
  };

  // AI Marketing Description Generator
  const handleGenerateAIMarketing = () => {
    if (!name.trim()) {
      showNotification('يرجى كتابة اسم المنتج أولاً لتوليد النص التسويقي بدقة', 'error');
      return;
    }

    setIsGeneratingAI(true);
    setTimeout(() => {
      setIsGeneratingAI(false);
      setDescription(
        `اكتشف تجربة الاستخدام الاستثنائية مع ${name} الأصلي! صُمم خصيصاً ليمنحك الأناقة والعملية الفائقة بأفضل سعر في السوق الجزائري. يتميز بجودة تصنيع متينة ومواد ممتازة تدوم طويلاً، ومثالي للاستخدام اليومي أو كهدية فاخرة لأحبابك.`
      );
      setFeatures([
        `منتج أصلي 100% عالي الجودة مع ضمان حقيقي`,
        `تصميم عصري وجذاب ومريح في الاستخدام اليومي`,
        `توصيل سريع حتى باب منزلك في كافة الـ 58 ولاية`,
        `الدفع عند الاستلام مع إمكانية فتح الطرد والمعاينة قبل الدفع`,
        `تخفيض استثنائي ولفترة محدودة مع توفر كميات محددة فقط`,
      ]);
      setBadge('تخفيض حصري 30% 🔥');
      showNotification('تم توليد الوصف التسويقي ومميزات المنتج بالذكاء الاصطناعي بنجاح!', 'success');
    }, 600);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showNotification('يرجى إدخال اسم المنتج', 'error');
      return;
    }

    const finalImages = [imageUrl, ...additionalImages].filter(Boolean);

    const productData = {
      name: name.trim(),
      category,
      price: typeof price === 'number' ? price : 0,
      compareAtPrice: typeof compareAtPrice === 'number' ? compareAtPrice : undefined,
      costPrice: typeof costPrice === 'number' ? costPrice : 0,
      stock: typeof stock === 'number' ? stock : 0,
      sku: sku.trim() || `DZ-${Math.floor(1000 + Math.random() * 9000)}`,
      images: finalImages.length > 0 ? finalImages : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      description: description.trim(),
      features: features.filter(Boolean),
      variants: hasVariants && variants.length > 0 ? variants : undefined,
      badge: badge.trim() || undefined,
      isFeatured,
      isPublished,
    };

    if (isEditing && initialProduct) {
      updateProduct(initialProduct.id, productData);
      showNotification('تم تحديث بيانات المنتج بنجاح!', 'success');
    } else {
      addProduct(productData);
      showNotification('تمت إضافة المنتج الجديد إلى المتجر بنجاح!', 'success');
    }

    onSuccess();
  };

  return (
    <form id="product-add-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Header with Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title={language === 'ar' ? 'الرجوع للقائمة' : 'Back'}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <span>
                {isEditing
                  ? language === 'ar'
                    ? `تعديل المنتج: ${initialProduct?.name}`
                    : `Edit Product: ${initialProduct?.name}`
                  : language === 'ar'
                  ? 'إضافة منتج جديد للمتجر'
                  : 'Add New Product'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'ar'
                ? 'املأ بيانات المنتج، التسعير، المخزون والصور لنشره فوراً للزبائن.'
                : 'Fill in product details, pricing, inventory, and images to publish.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-sm transition-all active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>
              {isEditing
                ? language === 'ar'
                  ? 'حفظ التعديلات'
                  : 'Save Changes'
                : language === 'ar'
                ? 'نشر المنتج الآن'
                : 'Publish Product'}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Basic Product Info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="font-black text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? 'المعلومات الأساسية للمنتج' : 'Basic Information'}</span>
            </h4>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                {language === 'ar' ? 'اسم المنتج الكامل *' : 'Product Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={
                  language === 'ar'
                    ? 'مثال: ساعة ذكية ألترا مقاومة للماء مع شاشة AMOLED وسوار إضافي'
                    : 'e.g. Ultra Smart Watch with AMOLED Display'
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Category & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black text-slate-700">
                    {language === 'ar' ? 'التصنيف / القسم *' : 'Category *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryInput(!showAddCategoryInput)}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    {showAddCategoryInput ? 'إلغاء' : '+ قسم جديد'}
                  </button>
                </div>

                {showAddCategoryInput ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="اسم القسم الجديد..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                    >
                      إضافة
                    </button>
                  </div>
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Promotional Badge */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  {language === 'ar' ? 'شارة العرض الترويجي (Badge)' : 'Promotional Badge'}
                </label>
                <input
                  type="text"
                  placeholder="مثال: الأكثر طلباً 🔥 أو تخفيض 30%"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* SKU / Barcode */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                {language === 'ar' ? 'رمز المنتج التعريفي (SKU / Barcode)' : 'SKU / Barcode'}
              </label>
              <input
                type="text"
                placeholder="DZ-9821"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 2. Pricing & Profit Margin */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="font-black text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? 'التسعير وهامش الربحية' : 'Pricing & Profit Margins'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Selling Price */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  {language === 'ar' ? 'سعر البيع للزبون (د.ج) *' : 'Selling Price (DZD) *'}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black font-mono text-emerald-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Compare at Price */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  {language === 'ar' ? 'السعر قبل الخصم (مشطوب) (د.ج)' : 'Compare At Price (DZD)'}
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="6500"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-mono text-slate-500 line-through focus:outline-none focus:border-emerald-500"
                />
                {discountPercentage > 0 && (
                  <span className="text-[10px] font-bold text-rose-600 mt-1 block">
                    خصم {discountPercentage}% ظاهر للزبون 🏷️
                  </span>
                )}
              </div>

              {/* Cost Price */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  {language === 'ar' ? 'سعر الشراء / التكلفة (د.ج)' : 'Cost Price (DZD)'}
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="2200"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-mono text-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Profit Margin Breakdown Box */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                  %
                </div>
                <div>
                  <span className="text-xs font-black text-emerald-950 block">
                    {language === 'ar' ? 'صافي الربح المتوقع لكل قطعة:' : 'Expected Net Profit per item:'}
                  </span>
                  <span className="text-xs text-emerald-800 font-medium">
                    {language === 'ar'
                      ? 'يتم حسابه تلقائياً من الفارق بين سعر البيع وتكلفة المنتج'
                      : 'Calculated from selling price minus cost'}
                  </span>
                </div>
              </div>

              <div className="text-left font-mono">
                <span className="text-base font-black text-emerald-700 block">
                  +{calculatedProfit.toLocaleString()} {settings.currency}
                </span>
                <span className="text-[11px] font-bold text-emerald-600">
                  ({marginPercentage}% {language === 'ar' ? 'هامش ربح' : 'Margin'})
                </span>
              </div>
            </div>
          </div>

          {/* 3. Description & AI Marketing Generator */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>{language === 'ar' ? 'الوصف ومميزات البيع (Copywriting)' : 'Description & Features'}</span>
              </h4>

              <button
                type="button"
                onClick={handleGenerateAIMarketing}
                disabled={isGeneratingAI}
                className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-black flex items-center gap-1.5 border border-purple-200 transition-all active:scale-95"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                <span>
                  {isGeneratingAI
                    ? language === 'ar'
                      ? 'جاري التوليد...'
                      : 'Generating...'
                    : language === 'ar'
                    ? '✨ توليد نص تسويقي ذكي'
                    : '✨ AI Marketing Copy'}
                </span>
              </button>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                {language === 'ar' ? 'وصف المنتج بالتفصيل' : 'Product Description'}
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب وصفاً جذاباً يشرح مزايا المنتج واستخداماته..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Key Bullet Features */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                {language === 'ar' ? 'أبرز مميزات ونقاط القوة للمنتج (Bulleted Features)' : 'Key Features'}
              </label>

              <div className="space-y-2 mb-3">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Feature */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="أضف ميزة جديدة (مثال: شاشة مقاومة للخدش)..."
                  value={newFeatureInput}
                  onChange={(e) => setNewFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Product Variants (Colors / Sizes) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ar' ? 'المتغيرات والألوان والمقاسات' : 'Variants & Options'}</span>
              </h4>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <span>{language === 'ar' ? 'تفعيل المتغيرات للمنتج' : 'Enable Variants'}</span>
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => setHasVariants(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>
            </div>

            {hasVariants && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {variants.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="font-black text-slate-900">{v.name}</span>
                      </div>

                      <div className="flex items-center gap-4 font-mono">
                        <span className="text-slate-600">
                          {v.price.toLocaleString()} {settings.currency}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {v.stock} قطعة
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(v.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Variant Form */}
                <div className="bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200/70 grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      اسم المتغير (اللون / المقاس)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: مقاس XL أو أسود ملكي"
                      value={newVariantName}
                      onChange={(e) => setNewVariantName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      السعر (د.ج)
                    </label>
                    <input
                      type="number"
                      value={newVariantPrice}
                      onChange={(e) =>
                        setNewVariantPrice(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        الكمية
                      </label>
                      <input
                        type="number"
                        value={newVariantStock}
                        onChange={(e) =>
                          setNewVariantStock(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="self-end px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 1 COLUMN: Media, Stock Quantity & Display Settings */}
        <div className="space-y-6">
          {/* 1. Main Media & Image Gallery */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="font-black text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? 'صور ووسائط المنتج' : 'Product Images'}</span>
            </h4>

            {/* Main Image Preview */}
            <div className="w-full aspect-square rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative group">
              <img
                src={imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg backdrop-blur-xs">
                الصورة الرئيسية
              </div>
            </div>

            {/* Image URL input */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                {language === 'ar' ? 'رابط الصورة الرئيسية (URL) *' : 'Main Image URL *'}
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Sample Preset Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-2">
                {language === 'ar' ? 'أو اختر صورة جاهزة للتجربة السريعة:' : 'Quick Sample Presets:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      if (!name) setName(preset.name);
                      setCategory(preset.category);
                    }}
                    className="w-full aspect-square rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-500 transition-all relative group"
                    title={preset.name}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold text-center p-1">
                      {preset.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Gallery Images */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-black text-slate-700 mb-2">
                {language === 'ar' ? 'معرض الصور الإضافية' : 'Additional Images'}
              </label>

              {additionalImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {additionalImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-full aspect-square rounded-xl overflow-hidden border border-slate-200 relative group"
                    >
                      <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="رابط صورة إضافية..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 2. Stock Quantity & Inventory Settings */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="font-black text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
              <Warehouse className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? 'الكمية والمخزون' : 'Stock & Inventory'}</span>
            </h4>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                {language === 'ar' ? 'الكمية المتوفرة في المخزن *' : 'Available Stock Quantity *'}
              </label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-base font-black font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {typeof stock === 'number' && stock <= 10
                  ? '⚠️ تنبيه: هذه الكمية ستظهر كـ "مخزون منخفض" في التنبيهات'
                  : 'تتبع المخزون مفعل تلقائياً مع كل طلب جديد'}
              </span>
            </div>
          </div>

          {/* 3. Visibility & Homepage Toggles */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="font-black text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? 'إعدادات النشر والعرض' : 'Publish Settings'}</span>
            </h4>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-black text-slate-800 block">
                    {language === 'ar' ? 'نشر فوري في المتجر' : 'Publish to Storefront'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {language === 'ar' ? 'إظهار المنتج فوراً للزوار' : 'Visible to all customers'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-black text-slate-800 block">
                    {language === 'ar' ? 'منتج مميز في الرئيسية' : 'Feature on Homepage'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {language === 'ar' ? 'إظهاره في قسم الأكثر طلباً' : 'Featured in hero sections'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
