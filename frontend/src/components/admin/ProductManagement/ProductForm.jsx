import React, { useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import { validateProduct } from '../../../utils/validation';
import { formatPrice } from '../../../utils/formatters';

const ProductForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form data
    const { isValid, errors: validationErrors } = validateProduct(formData);
    if (!isValid) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
      setErrors({});
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.name && <span className="text-red-500">{errors.name}</span>}
      </div>

      <div>
        <label className="block mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="4"
        />
        {errors.description && <span className="text-red-500">{errors.description}</span>}
      </div>

      <div>
        <label className="block mb-1">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          className="w-full p-2 border rounded"
        />
        {errors.price && <span className="text-red-500">{errors.price}</span>}
      </div>

      <div>
        <label className="block mb-1">Stock</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.stock && <span className="text-red-500">{errors.stock}</span>}
      </div>

      <div>
        <label className="block mb-1">Category</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a category</option>
          {/* Categories will be mapped here */}
        </select>
        {errors.category_id && <span className="text-red-500">{errors.category_id}</span>}
      </div>

      <div>
        <label className="block mb-1">Image</label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          className="w-full p-2 border rounded"
        />
        {errors.image && <span className="text-red-500">{errors.image}</span>}
      </div>

      {errors.submit && (
        <div className="text-red-500">{errors.submit}</div>
      )}

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Save Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
