// src/components/CartModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

function CartModal({ open, onClose, cartItems, incrementQuantity, decrementQuantity, removeFromCart }) {
    const [animationClass, setAnimationClass] = useState("modal-open");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setAnimationClass(open ? "modal-open" : "modal-close");
    }, [open]);

    const handleCheckout = () => {
        setConfirmOpen(true);
    };

    const handleConfirmCheckout = () => {
        setConfirmOpen(false);
        onClose();
        toast.success("Payment successful! Thank you for your purchase.");
        setTimeout(() => {
            navigate('/confirmation');
        }, 2000);
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    return (
        <>
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
                            cartItems.map((item) => (
                                <ListItem key={item._id} divider>
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
                                        <IconButton color="error" onClick={() => removeFromCart(item._id)}>
                                            <DeleteIcon />
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

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmOpen}
                onClose={handleCloseConfirm}
                aria-labelledby="confirm-checkout-title"
                aria-describedby="confirm-checkout-description"
            >
                <DialogTitle id="confirm-checkout-title">Confirm Checkout</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-checkout-description">
                        Are you sure you want to proceed with the checkout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmCheckout} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CartModal;
