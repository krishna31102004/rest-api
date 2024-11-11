import productService from './productService.js';

const { getProducts } = productService;

const testGetProducts = async () => {
  try {
    const products = await getProducts();
    console.log('Fetched products:', products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

// Run the test function
testGetProducts();
