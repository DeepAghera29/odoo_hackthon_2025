import { useState, useEffect } from 'react';
import api from '../config/api';

export const useClothingItems = (options = {}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [options.category, options.search, options.page, options.limit]);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (options.category) params.append('category', options.category);
      if (options.search) params.append('search', options.search);
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      if (options.status) params.append('status', options.status);

      const endpoint = options.ownerId ? '/users/items' : '/items';
      const response = await api.get(`${endpoint}?${params}`);
      
      setItems(response.data.items);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to fetch items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (itemData) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(itemData).forEach(key => {
        if (key !== 'images' && key !== 'tags') {
          formData.append(key, itemData[key]);
        }
      });

      // Append tags as JSON
      if (itemData.tags) {
        itemData.tags.forEach(tag => {
          formData.append('tags', tag);
        });
      }

      // Append images
      if (itemData.images) {
        itemData.images.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await api.post('/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newItem = response.data.item;
      setItems(prev => [newItem, ...prev]);
      
      return { success: true, item: newItem };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create item';
      return { success: false, error: message };
    }
  };

  const updateItem = async (itemId, updates) => {
    try {
      const response = await api.put(`/items/${itemId}`, updates);
      const updatedItem = response.data.item;
      
      setItems(prev => prev.map(item => 
        item._id === itemId ? updatedItem : item
      ));
      
      return { success: true, item: updatedItem };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update item';
      return { success: false, error: message };
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/items/${itemId}`);
      setItems(prev => prev.filter(item => item._id !== itemId));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete item';
      return { success: false, error: message };
    }
  };

  const toggleFavorite = async (itemId) => {
    try {
      const response = await api.post(`/items/${itemId}/favorite`);
      return { success: true, isFavorited: response.data.isFavorited };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to toggle favorite';
      return { success: false, error: message };
    }
  };

  return {
    items,
    loading,
    error,
    pagination,
    addItem,
    updateItem,
    deleteItem,
    toggleFavorite,
    refetch: fetchItems,
  };
};