// src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Container, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getProducts } from '../productService';

function ProductList({ addToCart }) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState({});
    const [quantities, setQuantities] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data.products);
                setFilteredProducts(data.products);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle search input change
    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        filterAndSortProducts(query, sortOption);
    };

    // Handle sorting based on selected option
    const handleSortChange = (event) => {
        const sortValue = event.target.value;
        setSortOption(sortValue);
        filterAndSortProducts(searchQuery, sortValue);
    };

    // Filter and sort products based on search query and sort option
    const filterAndSortProducts = (query, sortValue) => {
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
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product._id] || 1; // Default to 1 if quantity not set
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

    if (loading) {
        return <p>Loading products...</p>;
    }

    return (
        <Container>
            {/* Search Field */}
            <TextField
                label="Search Products"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={searchQuery}
                onChange={handleSearchChange}
            />

            {/* Sorting Dropdown */}
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortOption} onChange={handleSortChange}>
                    <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                    <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                    <MenuItem value="nameAsc">Name: A to Z</MenuItem>
                    <MenuItem value="nameDesc">Name: Z to A</MenuItem>
                </Select>
            </FormControl>

            {/* Product List */}
<List>
    {filteredProducts.map((product) => (
        <ListItem key={product._id} divider>
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
                label="Quantity" // Set label to "Quantity"
                InputProps={{ inputProps: { min: 1 } }}
                style={{ width: '60px', marginRight: '10px' }}
            />
            <Button
                variant="contained"
                color="primary"
                startIcon={<ShoppingCartIcon />}
                onClick={() => handleAddToCart(product)}
                disabled={addedToCart[product._id]}
            >
                {addedToCart[product._id] ? "Added!" : "Add to Cart"}
            </Button>
        </ListItem>
    ))}
</List>

        </Container>
    );
}

export default ProductList;
