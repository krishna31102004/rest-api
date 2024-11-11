// productService.js
import api from './api.js';
// src/productService.js

// Use getProfile and updatePassword directly where needed
// If these functions aren't needed in productService.js, you can remove the import entirely


// Function to get all products
export const getProducts = async () => {
  try {
    const response = await api.get('/products'); // Ensures /products path is appended to base URL
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Function to add a new product
export const addProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};
