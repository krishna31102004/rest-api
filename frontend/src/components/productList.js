// src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Container, TextField } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getProducts } from '../productService';

function ProductList({ addToCart }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState({});
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data.products);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
            <List>
                {products.map((product) => (
                    <ListItem key={product._id} divider>
                        <ListItemAvatar>
                            <Avatar
                                variant="square"
                                src="https://via.placeholder.com/150"
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
