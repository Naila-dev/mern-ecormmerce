import React from 'react';
import PropTypes from 'prop-types';
import styles from './ProductList.module.css'; // Import the CSS module

function ProductList({ products, onEdit, onDelete, onAddToCart, currentUserId }) {
    // A separate component for a single product item improves readability and reusability.
    const ProductItem = ({ product }) => (
        <div className="col-md-6 col-lg-4 col-xl-3 mb-4">
            <div className={`card h-100 ${styles.card}`}>
                {/* Using a placeholder image service. Replace with product.imageUrl if you have one */}
                <img 
                    src={`https://placehold.co/600x400/EEE/31343C?text=${encodeURIComponent(product.name)}`} 
                    className={`card-img-top ${styles.cardImg}`} 
                    alt={product.name} 
                />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-muted flex-grow-1">{product.description}</p>
                    <h6 className="card-subtitle mb-2">KES {product.price.toFixed(2)}</h6>
                    {product.seller && <small className="text-muted d-block mb-3"><i>Seller: {product.seller.username}</i></small>}
                    
                    <div className="mt-auto">
                        {product.seller && currentUserId === product.seller._id ? (
                            <div className="d-grid gap-2">
                                <button onClick={() => onEdit(product)} className="btn btn-outline-primary">Edit</button>
                                <button onClick={() => onDelete(product._id)} className="btn btn-outline-danger">Delete</button>
                            </div>
                        ) : (
                            <button onClick={() => onAddToCart(product._id)} className="btn btn-success w-100">Add to Cart</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <h3>All Products</h3>
            <div className="row">
                {products.length === 0 ? (
                    <div className="col">
                        <div className="alert alert-info">No products have been added yet.</div>
                    </div>
                ) : (
                    products.map((product) => (
                        <ProductItem key={product._id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
}

// Adding PropTypes helps catch bugs by ensuring components receive the right type of props.
ProductList.propTypes = {
    products: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onAddToCart: PropTypes.func.isRequired,
    currentUserId: PropTypes.string
};

export default ProductList;