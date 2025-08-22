import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import Rating from '../../common/Rating/Rating';
import { formatPrice } from '../../../utils/formatters';

const ProductCard = ({ product, showAdminControls = false, onEdit, onDelete }) => {
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const {
    id,
    name,
    price,
    image,
    description,
    averageRating,
    reviewCount,
    inStock,
    discount
  } = product;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation
    addToCart(id, 1);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    onEdit(product);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    onDelete(id);
  };

  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <Link to={`/products/${id}`} className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {/* Product Image */}
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
            {discount}% OFF
          </div>
        )}

        {/* Stock Status */}
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="text-white font-medium px-4 py-2 bg-black bg-opacity-50 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col">
        {/* Product Info */}
        <div>
          <h3 className="text-sm font-medium text-gray-900">{name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center justify-between">
          <div>
            {discount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(price)}
                </span>
                <span className="text-lg font-medium text-gray-900">
                  {formatPrice(discountedPrice)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-medium text-gray-900">
                {formatPrice(price)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center">
            <Rating
              value={averageRating}
              size="sm"
              readOnly
            />
            {reviewCount > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({reviewCount})
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {inStock && (
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add to Cart
            </button>
          )}

          {showAdminControls && isAdmin && (
            <>
              <button
                onClick={handleEdit}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
