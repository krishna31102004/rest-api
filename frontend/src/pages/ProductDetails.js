// src/pages/ProductDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../productService';
import { Container, Typography, Avatar } from '@mui/material';



function ProductDetails() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(productId);
                setProduct(data.product);
            } catch (error) {
                console.error('Failed to fetch product details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) return <p>Loading...</p>;

    return product ? (
        <Container>
            <Typography variant="h4" gutterBottom>{product.name}</Typography>
            <Avatar
                variant="square"
                src={product.productImage ? `http://localhost:3000/${product.productImage}` : "https://via.placeholder.com/150"}
                alt={product.name}
                sx={{ width: 200, height: 200, mb: 2 }}
            />
            <Typography variant="body1" gutterBottom>Price: ${product.price}</Typography>
            <Typography variant="body2">{product.description || 'No description available.'}</Typography>
        </Container>
    ) : (
        <p>Product not found</p>
    );
}

export default ProductDetails;
