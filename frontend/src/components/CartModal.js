// src/components/CartModal.js
import React from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CartModal({ open, onClose, cartItems, removeFromCart }) {
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose(); // Close the modal
        navigate('/checkout'); // Navigate to the checkout page
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="cart-modal-title">
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                borderRadius: '8px',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography id="cart-modal-title" variant="h6" component="h2">
                    Cart Summary
                </Typography>
                <List>
                    {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`${item.name} | Quantity: ${item.quantity}`}
                                    secondary={`Price: $${item.price}`}
                                />
                                <Button
                                    onClick={() => removeFromCart(item._id, 1)}
                                    variant="outlined"
                                    color="secondary"
                                >
                                    Remove
                                </Button>
                            </ListItem>
                        ))
                    ) : (
                        <Typography>No items in cart.</Typography>
                    )}
                </List>
                {cartItems.length > 0 && (
                    <>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Total Price: ${totalPrice}
                        </Typography>
                        <Button
                            onClick={handleCheckout}
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Checkout
                        </Button>
                    </>
                )}
                <Button onClick={onClose} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
}

export default CartModal;
