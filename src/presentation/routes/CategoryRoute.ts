import express from "express";
import {CategoryController} from "../controllers/CategoryController";

const router = express.Router();

const categoryController = new CategoryController();

router.get('/:id', categoryController.fetchCategoryById.bind(categoryController));
router.post('/list', categoryController.listCategories.bind(categoryController));
router.delete('/:id', categoryController.deleteCategory.bind(categoryController));
router.post('/', categoryController.createCategory.bind(categoryController));
router.put('/:id', categoryController.updateCategory.bind(categoryController));

export default router;