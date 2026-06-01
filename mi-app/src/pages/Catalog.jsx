import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

const Catalog = () => {
  const { products, addProduct, updateProduct, deleteProduct, currentUser } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // null = Modo Creación, Objeto = Modo Edición o Detalles

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

  const filteredProducts = products ? products.filter(p => {
    const coincideTexto = p.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.model.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideCat = selectedCategory === '' || p.category === selectedCategory;
    return coincideTexto && coincideCat;
  }) : [];

  return (
    <div className="animar-aparicion">
      
      <div className="barra-filtros">
        <div className="entradas-filtros">
          <input
            type="text"
            placeholder="Buscar por marca o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="campo-entrada"
            style={{ minWidth: '200px', flex: 1 }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="campo-seleccion"
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
            className="boton boton-primario"
          >
            Nuevo Componente
          </button>
        )}
      </div>

      <div className="contenedor-tabla desplazamiento-horizontal">
        <table className="tabla-personalizada">
          <thead>
            <tr>
              <th>Componente</th>
              <th>Categoría</th>
              <th>Existencias</th>
              <th>Stock Mínimo</th>
              <th>Precio Unitario</th>
              <th className="alineacion-derecha">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-mutado)', padding: '32px 0' }}>
                  No hay componentes de hardware en el catálogo.
                </td>
              </tr>
            ) : (
              filteredProducts.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 'bold', color: 'white' }}>{p.brand} {p.model}</td>
                  <td>
                    <span className="etiqueta etiqueta-azul">
                      {p.category}
                    </span>
                  </td>
                  <td>
                    <span 
                      style={{ 
                        fontFamily: 'monospace', 
                        fontWeight: 'bold', 
                        color: p.stock <= p.minStock ? 'var(--rojo)' : 'var(--color-texto)' 
                      }}
                    >
                      {p.stock} uds
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--color-mutado)' }}>{p.minStock} uds</td>
                  <td style={{ fontFamily: 'monospace' }}>${p.price.toFixed(2)}</td>
                  <td className="alineacion-derecha">
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => { setSelectedProduct(p); setIsDetailModalOpen(true); }}
                        className="boton boton-secundario"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Ficha
                      </button>
                      <button
                        onClick={() => { setSelectedProduct(p); setIsCrudModalOpen(true); }}
                        className="boton boton-primario"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Editar
                      </button>
                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={() => { if (window.confirm(`¿Eliminar ${p.brand} ${p.model}?`)) deleteProduct(p.id); }}
                          className="boton boton-peligro"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
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

      {isCrudModalOpen && (
        <div className="capa-modal">
          <div className="contenido-modal animar-aparicion">
            <div className="cabecera-modal">
              <h3>{selectedProduct ? 'Editar Componente' : 'Registrar Componente'}</h3>
              <button onClick={() => setIsCrudModalOpen(false)} className="cerrar-modal">
                &times;
              </button>
            </div>
            
            <form key={selectedProduct ? selectedProduct.id : 'new'} onSubmit={handleSubmit} className="cuerpo-modal">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="grupo-formulario">
                  <label>Marca</label>
                  <input required name="brand" type="text" defaultValue={selectedProduct ? selectedProduct.brand : ''} placeholder="Ej. AMD" className="campo-entrada" />
                </div>
                <div className="grupo-formulario">
                  <label>Modelo</label>
                  <input required name="model" type="text" defaultValue={selectedProduct ? selectedProduct.model : ''} placeholder="Ej. Ryzen 7" className="campo-entrada" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="grupo-formulario">
                  <label>Categoría</label>
                  <select required name="category" defaultValue={selectedProduct ? selectedProduct.category : ''} className="campo-seleccion">
                    <option value="">Seleccione...</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="grupo-formulario">
                  <label>Precio ($)</label>
                  <input required name="price" type="number" step="0.01" min="0.01" defaultValue={selectedProduct ? selectedProduct.price : ''} placeholder="0.00" className="campo-entrada" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="grupo-formulario">
                  <label>Stock Mínimo</label>
                  <input required name="minStock" type="number" min="1" defaultValue={selectedProduct ? selectedProduct.minStock : ''} placeholder="3" className="campo-entrada" />
                </div>
                <div className="grupo-formulario">
                  <label>Stock Inicial</label>
                  <input required={!selectedProduct} disabled={!!selectedProduct} name="stock" type="number" min="0" defaultValue={selectedProduct ? selectedProduct.stock : '0'} className="campo-entrada" />
                </div>
              </div>

              <div className="grupo-formulario">
                <label>Especificaciones</label>
                <textarea required name="specs" rows="3" defaultValue={selectedProduct ? selectedProduct.specs : ''} placeholder="Especificaciones técnicas..." className="campo-texto"></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--color-borde)', paddingTop: '16px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsCrudModalOpen(false)} className="boton boton-secundario">
                  Cancelar
                </button>
                <button type="submit" className="boton boton-primario">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedProduct && (
        <div className="capa-modal">
          <div className="contenido-modal animar-aparicion" style={{ maxWidth: '400px' }}>
            <div className="cabecera-modal">
              <h3>Ficha Técnica</h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="cerrar-modal">
                &times;
              </button>
            </div>
            <div className="cuerpo-modal" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{selectedProduct.brand} {selectedProduct.model}</h4>
                <span className="etiqueta etiqueta-azul" style={{ marginTop: '8px' }}>
                  {selectedProduct.category}
                </span>
              </div>
              
              <div style={{ backgroundColor: 'var(--color-fondo)', border: '1px solid var(--color-borde)', padding: '16px', borderRadius: '8px' }}>
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: 'var(--color-mutado)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Especificaciones
                </span>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#e2e8f0' }}>{selectedProduct.specs}</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center', borderTop: '1px solid var(--color-borde)', paddingTop: '16px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-mutado)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Stock</span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#e2e8f0' }}>{selectedProduct.stock} uds</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-mutado)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Mínimo</span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-mutado)' }}>{selectedProduct.minStock} uds</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-mutado)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Precio</span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--verde)' }}>${selectedProduct.price.toFixed(2)}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-borde)', paddingTop: '16px' }}>
                <button onClick={() => setIsDetailModalOpen(false)} className="boton boton-secundario">
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
