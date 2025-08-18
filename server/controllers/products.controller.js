// server/controllers/products.controller.js
import mongoose from 'mongoose';
import { Image } from '../models/image.model.js';
import { getProducts, searchProducts, recommendProducts, createProduct as createProductService, updateProduct as updateProductService, deleteProduct as deleteProductService, getProductById } from '../services/products.service.js';



export const getAllProducts = async (req, res, next) => {
  try {
    console.log('[Controller] Incoming request to getAllProducts:', req.query);
    const { page, limit } = req.query;
    const offset = page && limit ? (page - 1) * limit : null;
    const products = await getProducts({ limit, offset });
    console.log('[Controller] Products fetched successfully:', products);
    res.json(products);
  } catch (e) {
    console.error('[Controller] Error in getAllProducts:', e);
    next(e);
  }
};

export const search = async (req, res, next) => {
  try {
    const products = await searchProducts(req.query);
    res.json(products);
  } catch (e) {
    next(e);
  }
};

export const recommend = async (req, res, next) => {
  try {
    const products = await recommendProducts();
    res.json(products);
  } catch (e) {
    next(e);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await createProductService(req.body);
    res.status(201).json({ message: 'Product created', product });
  } catch (e) {
    next(e);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updated = await updateProductService(req.params.id, req.body);
    res.json({ message: 'Product updated', updated });
  } catch (e) {
    next(e);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await deleteProductService(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (e) {
    next(e);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (e) {
    next(e);
  }
};
