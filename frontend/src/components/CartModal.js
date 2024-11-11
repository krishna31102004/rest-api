// src/components/CartModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function CartModal({ open, onClose, cartItems, incrementQuantity, decrementQuantity }) {
    const [animationClass, setAnimationClass] = useState("modal-open");
    const navigate = useNavigate();

    // Handle animation class change based on modal state
    useEffect(() => {
        if (open) {
            setAnimationClass("modal-open");
        } else {
            setAnimationClass("modal-close");
        }
    }, [open]);

    const handleCheckout = () => {
        onClose(); // Close the modal
        navigate('/checkout'); // Navigate to the checkout page
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="cart-modal-title">
            <Box
                className={animationClass}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography id="cart-modal-title" variant="h6" component="h2">
                    Cart Summary
                </Typography>
                <List>
                    {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={item.name}
                                    secondary={`Price: $${item.price}`}
                                />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={() => decrementQuantity(item._id)}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography>{item.quantity}</Typography>
                                    <IconButton onClick={() => incrementQuantity(item._id)}>
                                        <AddIcon />
                                    </IconButton>
                                </div>
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
