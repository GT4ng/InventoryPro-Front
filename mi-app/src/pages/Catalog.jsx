import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

const Catalog = () => {
  const { products, addProduct, updateProduct, deleteProduct, currentUser } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const categories = ['CPU', 'GPU', 'RAM', 'Almacenamiento', 'Motherboard'];
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const form = new FormData(e.target);
    const productPayload = {
      brand: form.get('brand').trim(),
      model: form.get('model').trim(),
      category: form.get('category'),
      price: parseFloat(form.get('price')),
      minStock: parseInt(form.get('minStock')),
      specs: form.get('specs').trim()
    };

    if (selectedProduct) {
      updateProduct(selectedProduct.id, productPayload);
    } else {
      addProduct({
        ...productPayload,
        stock: parseInt(form.get('stock') || 0)
      });
    }

    setIsCrudModalOpen(false);
  };
  const filteredProducts = products.filter(p => {
    const coincideTexto = p.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.model.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideCat = selectedCategory === '' || p.category === selectedCategory;
    return coincideTexto && coincideCat;
  });
  return (
    <div className="space-y-6 text-slate-100 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
          <input
            type="text"
            placeholder="Buscar por marca o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-100 focus:border-blue-500 outline-none flex-1 min-w-[200px]"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-100 focus:border-blue-500 outline-none"
          >
            <option value="">Todas las Categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => { setSelectedProduct(null); setIsCrudModalOpen(true); }}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-5 rounded-lg text-sm transition duration-200 cursor-pointer"
          >
            Nuevo Componente
          </button>
        )}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Componente</th>
                <th className="py-4 px-6">Categoría</th>
                <th className="py-4 px-6">Existencias</th>
                <th className="py-4 px-6">Stock Mínimo</th>
                <th className="py-4 px-6">Precio Unitario</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No hay componentes de hardware en el catálogo.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-750/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">{p.brand} {p.model}</td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-mono font-bold ${p.stock <= p.minStock ? 'text-red-400' : 'text-slate-200'}`}>
                        {p.stock} uds
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">{p.minStock} uds</td>
                    <td className="py-4 px-6 font-mono text-slate-200">${p.price.toFixed(2)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => { setSelectedProduct(p); setIsDetailModalOpen(true); }}
                          className="bg-slate-700 hover:bg-slate-650 text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-md cursor-pointer"
                        >
                          Ficha
                        </button>
                        <button
                          onClick={() => { setSelectedProduct(p); setIsCrudModalOpen(true); }}
                          className="bg-blue-600/10 hover:bg-blue-650 text-blue-400 hover:text-white border border-blue-500/20 text-xs font-semibold py-1.5 px-3 rounded-md cursor-pointer"
                        >
                          Editar
                        </button>
                        {currentUser?.role === 'admin' && (
                          <button
                            onClick={() => { if (window.confirm(`¿Eliminar ${p.brand} ${p.model}?`)) deleteProduct(p.id); }}
                            className="bg-red-600/10 hover:bg-red-650 text-red-500 hover:text-white border border-red-500/20 text-xs font-semibold py-1.5 px-3 rounded-md cursor-pointer"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isCrudModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-base font-bold text-white">
                {selectedProduct ? 'Editar Componente' : 'Registrar Componente'}
              </h3>
              <button onClick={() => setIsCrudModalOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">
                &times;
              </button>
            </div>
            
            <form key={selectedProduct ? selectedProduct.id : 'new'} onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Marca</label>
                  <input required name="brand" type="text" defaultValue={selectedProduct ? selectedProduct.brand : ''} placeholder="Ej. AMD" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Modelo</label>
                  <input required name="model" type="text" defaultValue={selectedProduct ? selectedProduct.model : ''} placeholder="Ej. Ryzen 7" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Categoría</label>
                  <select required name="category" defaultValue={selectedProduct ? selectedProduct.category : ''} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500">
                    <option value="">Seleccione...</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Precio ($)</label>
                  <input required name="price" type="number" step="0.01" min="0.01" defaultValue={selectedProduct ? selectedProduct.price : ''} placeholder="0.00" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Stock Mínimo</label>
                  <input required name="minStock" type="number" min="1" defaultValue={selectedProduct ? selectedProduct.minStock : ''} placeholder="3" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Stock Inicial</label>
                  <input required={!selectedProduct} disabled={!!selectedProduct} name="stock" type="number" min="0" defaultValue={selectedProduct ? selectedProduct.stock : '0'} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none disabled:opacity-50 disabled:cursor-not-allowed focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Especificaciones</label>
                <textarea required name="specs" rows="3" defaultValue={selectedProduct ? selectedProduct.specs : ''} placeholder="Especificaciones técnicas..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500 resize-none"></textarea>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-slate-700">
                <button type="button" onClick={() => setIsCrudModalOpen(false)} className="bg-slate-700 hover:bg-slate-650 text-slate-200 font-semibold px-4 py-2 rounded-lg text-sm cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg text-sm cursor-pointer">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {isDetailModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Ficha Técnica</h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">
                &times;
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xl font-bold text-white">{selectedProduct.brand} {selectedProduct.model}</h4>
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium inline-block mt-2">
                  {selectedProduct.category}
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-700/60 p-4 rounded-lg">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Especificaciones</span>
                <p className="text-slate-200 text-sm leading-relaxed">{selectedProduct.specs}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center border-t border-slate-700 pt-5">
                <div>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Stock</span>
                  <span className="text-base font-bold text-slate-200">{selectedProduct.stock} uds</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Mínimo</span>
                  <span className="text-base font-bold text-slate-400">{selectedProduct.minStock} uds</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Precio</span>
                  <span className="text-base font-bold text-emerald-400">${selectedProduct.price.toFixed(2)}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-700 flex justify-end">
                <button onClick={() => setIsDetailModalOpen(false)} className="bg-slate-700 hover:bg-slate-650 text-slate-200 font-semibold px-5 py-2 rounded-lg text-sm cursor-pointer">
                  Cerrar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;