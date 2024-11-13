// src/productService.js
import api from './api';

export const getProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const addProduct = async (productData) => {
    const response = await api.post('/products', productData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const getProductById = async (productId) => {
    try {
        const response = await api.get(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
};

// Function to add a product to the wishlist
export const addToWishlist = async (productId) => {
    try {
        const response = await api.post('/user/wishlist', { productId });
        return response.data;
    } catch (error) {
        console.error('Error adding product to wishlist:', error);
        throw error;
    }
};

// Updated function to remove a product from the wishlist
export const removeFromWishlist = async (productId) => {
  try {
      const response = await api({
          method: 'delete',
          url: '/user/wishlist',
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          data: { productId }, // Explicitly setting data for delete request
      });
      return response.data;
  } catch (error) {
      console.error('Error removing product from wishlist:', error);
      throw error;
  }
};

// Assign the functions to a variable
const productService = {
    getProducts,
    addProduct,
    getProductById,
    addToWishlist,
    removeFromWishlist,
};

// Export the variable
export default productService;
