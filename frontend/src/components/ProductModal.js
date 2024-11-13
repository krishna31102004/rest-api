// src/components/ProductModal.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Avatar, TextField } from '@mui/material';

function ProductModal({ open, onClose, product, addToCart, quantity, setQuantity }) {
    if (!product) return null;

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        setQuantity(value);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        onClose(); // Close the modal after adding to cart
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{product.name}</DialogTitle>
            <DialogContent>
                <Avatar
                    variant="square"
                    src={product.productImage ? `http://localhost:3000/${product.productImage}` : "https://via.placeholder.com/150"}
                    alt={product.name}
                    style={{ width: 150, height: 150, marginBottom: 20 }}
                />
                <Typography variant="body1" gutterBottom>
                    {product.description ? product.description : "No description available"}
                </Typography>
                <Typography variant="h6" color="primary">
                    Price: {product.price ? `$${product.price}` : "N/A"}
                </Typography>
                <TextField
                    type="number"
                    label="Quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    InputProps={{ inputProps: { min: 1 } }}
                    sx={{ mt: 2, width: '100px' }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
                <Button onClick={handleAddToCart} color="primary" variant="contained">
                    Add to Cart
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProductModal;
