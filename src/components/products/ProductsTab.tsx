import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductSection } from '../../types';
import { ProductsAllView } from './ProductsAllView';
import { ProductAddForm } from './ProductAddForm';
import { InventoryManagerView } from './InventoryManagerView';
import {
  Package,
  PlusCircle,
  Warehouse,
  Boxes,
  Tag,
  AlertTriangle
} from 'lucide-react';

export const ProductsTab: React.FC = () => {
  const {
    products,
    productSection,
    setProductSection,
    t,
    language
  } = useStore();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Statistics for badges in tabs
  const outOrLowStockCount = products.filter((p) => p.stock <= 10).length;

  // Handle Edit Product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductSection('add');
  };

  // Handle Navigate to Add Product (fresh form)
  const handleNavigateToAdd = () => {
    setEditingProduct(null);
    setProductSection('add');
  };

  // Handle Navigate to Inventory Manager
  const handleNavigateToInventory = () => {
    setProductSection('inventory');
  };

  // Handle Success or Cancel from Add/Edit Form
  const handleFormDone = () => {
    setEditingProduct(null);
    setProductSection('all');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Sub-Tabs */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <Package className="w-6 h-6 text-emerald-600" />
            <span>
              {productSection === 'all'
                ? language === 'ar'
                  ? 'إدارة كافة المنتجات'
                  : 'All Products Overview'
                : productSection === 'add'
                ? editingProduct
                  ? language === 'ar'
                    ? `تعديل المنتج (${editingProduct.name})`
                    : `Edit Product (${editingProduct.name})`
                  : language === 'ar'
                  ? 'إضافة منتج جديد'
                  : 'Add New Product'
                : language === 'ar'
                ? 'مدير المخزون وتتبع الكميات'
                : 'Inventory Manager'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {productSection === 'all'
              ? language === 'ar'
                ? 'استعراض إحصائيات المنتجات، تصفية التصنيفات، وتعديل حالات العرض والظهور في المتجر.'
                : 'Overview, statistics, category filters, and publication status.'
              : productSection === 'add'
              ? language === 'ar'
                ? 'إدخال تفاصيل المنتج، الأسعار، التكاليف، الصور، والمميزات التسويقية.'
                : 'Enter pricing, product information, gallery images, and marketing copy.'
              : language === 'ar'
              ? 'مراقبة كميات المخزن، تنبيهات النقص، والتعديل الفوري للقطع المتوفرة لكل منتج.'
              : 'Live inventory stock adjustments, restock shortcuts, and depletion alerts.'}
          </p>
        </div>

        {/* Navigation Sub-Tabs Pills */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl self-stretch md:self-auto gap-1">
          {/* Tab 1: الكل */}
          <button
            id="product-subtab-all"
            onClick={() => {
              setEditingProduct(null);
              setProductSection('all');
            }}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
              productSection === 'all'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>{language === 'ar' ? 'الكل' : 'All'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                productSection === 'all'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {products.length}
            </span>
          </button>

          {/* Tab 2: إضافة منتج */}
          <button
            id="product-subtab-add"
            onClick={handleNavigateToAdd}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
              productSection === 'add'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>
              {editingProduct
                ? language === 'ar'
                  ? 'تعديل منتج'
                  : 'Edit Product'
                : language === 'ar'
                ? 'إضافة منتج'
                : 'Add Product'}
            </span>
          </button>

          {/* Tab 3: مدير المخزون */}
          <button
            id="product-subtab-inventory"
            onClick={handleNavigateToInventory}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
              productSection === 'inventory'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>{language === 'ar' ? 'مدير المخزون' : 'Inventory'}</span>
            {outOrLowStockCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-mono font-bold flex items-center gap-0.5">
                <AlertTriangle className="w-2.5 h-2.5" />
                {outOrLowStockCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Render Active Sub-View */}
      {productSection === 'all' && (
        <ProductsAllView
          onEditProduct={handleEditProduct}
          onNavigateToAdd={handleNavigateToAdd}
          onNavigateToInventory={handleNavigateToInventory}
        />
      )}

      {productSection === 'add' && (
        <ProductAddForm
          initialProduct={editingProduct}
          onSuccess={handleFormDone}
          onCancel={handleFormDone}
        />
      )}

      {productSection === 'inventory' && (
        <InventoryManagerView
          onEditProduct={handleEditProduct}
          onNavigateToAdd={handleNavigateToAdd}
        />
      )}
    </div>
  );
};
