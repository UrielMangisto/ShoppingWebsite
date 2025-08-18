// server/controllers/categories.controller.js
import {
  findAllCategories, findCategoryById,
  createCategoryRow, updateCategoryRow, deleteCategoryRow
} from '../models/categories.model.js';

export const getCategories = async (req, res, next) => {
  try { res.json(await findAllCategories()); } catch (e) { next(e); }
};

export const getCategory = async (req, res, next) => {
  try {
    const c = await findCategoryById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Category not found' });
    res.json(c);
  } catch (e) { next(e); }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });
    const id = await createCategoryRow(name);
    res.status(201).json({ message: 'Category created', categoryId: id });
  } catch (e) { next(e); }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const n = await updateCategoryRow(req.params.id, name);
    if (!n) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated' });
  } catch (e) { next(e); }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const n = await deleteCategoryRow(req.params.id);
    if (!n) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (e) { next(e); }
};
