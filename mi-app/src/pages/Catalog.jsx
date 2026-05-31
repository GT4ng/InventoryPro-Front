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

  const filteredProducts = products ? products.filter(p => {
    const coincideTexto = p.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.model.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideCat = selectedCategory === '' || p.category === selectedCategory;
    return coincideTexto && coincideCat;
  }) : [];

  
};

export default Catalog;
