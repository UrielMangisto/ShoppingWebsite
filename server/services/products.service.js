import { findAllProducts, findProductById, createProductRow, updateProductPartial, deleteProductById } from '../models/products.model.js';
import { ProductDTO } from '../dtos/product.dto.js';

export const getProducts = async ({ limit, offset }) => {
  console.log('[Service] Fetching products with limit and offset:', { limit, offset });
  const products = await findAllProducts(limit && offset != null ? { limit, offset } : {});
  console.log('[Service] Products fetched from model:', products);
  return products.map(product => new ProductDTO(product));
};

export const searchProducts = async ({ query, categoryId }) => {
  const products = await findAllProducts({ query, categoryId });
  return products.map(product => new ProductDTO(product));
};

export const recommendProducts = async () => {
  const products = await findAllProducts({ recommended: true });
  return products.map(product => new ProductDTO(product));
};

export const createProduct = async (productData) => {
  return await createProductRow(productData);
};

export const updateProduct = async (productId, patch) => {
  return await updateProductPartial(productId, patch);
};

export const deleteProduct = async (productId) => {
  return await deleteProductById(productId);
};

export const getProductById = async (id) => {
  const product = await findProductById(id);
  return product ? new ProductDTO(product) : null;
};
