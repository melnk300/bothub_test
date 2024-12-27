import express from "express";
import {CategoryController} from "../controllers/CategoryController";

const router = express.Router();
let categoryController = new CategoryController();

router.post('/', categoryController.createCategory);
router.get('/:id', categoryController.findCategoryById);
router.delete('/:id', categoryController.deleteCategory);
router.put('/:id', categoryController.updateCategory);
router.get('/', categoryController.listCategories);

export default router;
