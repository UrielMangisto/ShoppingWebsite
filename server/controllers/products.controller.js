// server/controllers/products.controller.js
import mongoose from 'mongoose';
import { Image } from '../models/image.model.js';
import { findAllProducts, findProductById, createProductRow, updateProductPartial, deleteProductById } from '../models/products.model.js';

// Helper function to transform product data for response
const transformProductForResponse = (product) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: parseFloat(product.price),
    stock: product.stock,
    category_id: product.category_id,
    category_name: product.category_name,
    image_url: product.image_id ? `${baseUrl}/api/images/${product.image_id}` : null,
    average_rating: product.average_rating ? parseFloat(product.average_rating) : null,
    review_count: parseInt(product.review_count) || 0,
    created_at: product.created_at,
    updated_at: product.updated_at
  };
};

export const getAllProducts = async (req, res, next) => {
  try {
    // Extract filters from query parameters
    const filters = {
      search: req.query.search,
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      minRating: req.query.minRating,
      inStock: req.query.inStock,
      sortBy: req.query.sortBy,
      limit: req.query.limit ? parseInt(req.query.limit) : null,
      offset: req.query.offset !== undefined ? parseInt(req.query.offset) : null
    };

    // Remove undefined values (but keep offset=0 as it's valid)
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined || filters[key] === null || filters[key] === '') {
        delete filters[key];
      }
    });

    const products = await findAllProducts(filters);
    
    // Transform products for response
    const transformedProducts = products.map(transformProductForResponse);
    
    res.json(transformedProducts);
  } catch (error) {
    next(error);
  }
};

export const search = async (req, res, next) => {
  try {
    const { query, categoryId } = req.query;
    const products = await findAllProducts({ query, categoryId });
    const transformedProducts = products.map(transformProductForResponse);
    res.json(transformedProducts);
  } catch (e) {
    next(e);
  }
};

export const recommend = async (req, res, next) => {
  try {
    const products = await findAllProducts({ recommended: true });
    const transformedProducts = products.map(transformProductForResponse);
    res.json(transformedProducts);
  } catch (e) {
    next(e);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    let imageId = null;
    
    // אם יש תמונה, שמור אותה ב-MongoDB
    if (req.file) {
      const imageDoc = new Image({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
        size: req.file.size
      });
      
      const savedImage = await imageDoc.save();
      imageId = savedImage._id.toString();
    }
    
    // צור את המוצר עם ה-image_id
    const productData = {
      ...req.body,
      image_id: imageId
    };
    
    const productId = await createProductRow(productData);
    res.status(201).json({ 
      message: 'Product created', 
      productId,
      imageId: imageId || null
    });
  } catch (e) {
    next(e);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    let updateData = { ...req.body };
    
    // אם יש תמונה חדשה, שמור אותה ב-MongoDB
    if (req.file) {
      const imageDoc = new Image({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
        size: req.file.size
      });
      
      const savedImage = await imageDoc.save();
      updateData.image_id = savedImage._id.toString();
    }
    
    const updated = await updateProductPartial(req.params.id, updateData);
    res.json({ 
      message: 'Product updated', 
      updated,
      newImageId: updateData.image_id || null
    });
  } catch (e) {
    next(e);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const affectedRows = await deleteProductById(req.params.id);
    
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully', affectedRows });
  } catch (e) {
    next(e);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const transformedProduct = transformProductForResponse(product);
    res.json(transformedProduct);
  } catch (e) {
    next(e);
  }
};
