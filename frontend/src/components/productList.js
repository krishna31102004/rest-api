// src/components/ProductList.js
import React, { useEffect, useState, useCallback } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button,
    Container,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Pagination,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { toast } from 'react-toastify';
import productService from '../productService';
import ProductModal from './ProductModal';

function ProductList({ addToCart }) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState({});
    const [quantities, setQuantities] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    
    // Modal state
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalQuantity, setModalQuantity] = useState(1); // Quantity for the modal product
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getProducts();
                setProducts(data.products);
                setFilteredProducts(data.products);
            } catch (error) {
                toast.error('Failed to fetch products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const filterAndSortProducts = useCallback((query, sortValue) => {
        let updatedProducts = products.filter((product) =>
            product.name.toLowerCase().includes(query)
        );

        if (sortValue === 'priceAsc') {
            updatedProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'priceDesc') {
            updatedProducts.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'nameAsc') {
            updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortValue === 'nameDesc') {
            updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFilteredProducts(updatedProducts);
    }, [products]);

    useEffect(() => {
        filterAndSortProducts(debouncedSearchQuery, sortOption);
    }, [debouncedSearchQuery, sortOption, filterAndSortProducts]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product._id] || 1;
        addToCart(product, quantity);
        setAddedToCart((prevState) => ({
            ...prevState,
            [product._id]: true,
        }));
        setTimeout(() => {
            setAddedToCart((prevState) => ({
                ...prevState,
                [product._id]: false,
            }));
        }, 1500);
    };

    const handleQuantityChange = (productId, value) => {
        const quantity = Math.max(1, parseInt(value) || 1);
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: quantity,
        }));
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalQuantity(quantities[product._id] || 1);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
    };

    if (loading) {
        return <p>Loading products...</p>;
    }

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <Container>
            <TextField
                label="Search Products"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortOption} onChange={handleSortChange}>
                    <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                    <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                    <MenuItem value="nameAsc">Name: A to Z</MenuItem>
                    <MenuItem value="nameDesc">Name: Z to A</MenuItem>
                </Select>
            </FormControl>

            {currentProducts.length > 0 ? (
                <List>
                    {currentProducts.map((product) => (
                        <ListItem key={product._id} divider button onClick={() => openModal(product)}>
                            <ListItemAvatar>
                                <Avatar
                                    variant="square"
                                    src={product.productImage ? `http://localhost:3000/${product.productImage}` : "https://via.placeholder.com/150"}
                                    alt={product.name}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={product.name}
                                secondary={`Price: ${product.price ? `$${product.price}` : 'N/A'}`}
                            />
                            <TextField
                                type="number"
                                value={quantities[product._id] || 1}
                                onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                label="Quantity"
                                InputProps={{ inputProps: { min: 1 } }}
                                style={{ width: '60px', marginRight: '10px' }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<ShoppingCartIcon />}
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleAddToCart(product);
                                }}
                                disabled={addedToCart[product._id]}
                            >
                                {addedToCart[product._id] ? "Added!" : "Add to Cart"}
                            </Button>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <p>No products found matching your search criteria.</p>
            )}

            <Pagination
                count={Math.ceil(filteredProducts.length / productsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
            />

            {/* Product Modal */}
            <ProductModal 
                open={isModalOpen} 
                onClose={closeModal} 
                product={selectedProduct} 
                addToCart={addToCart} 
                quantity={modalQuantity}
                setQuantity={setModalQuantity} 
            />
        </Container>
    );
}

export default ProductList;
