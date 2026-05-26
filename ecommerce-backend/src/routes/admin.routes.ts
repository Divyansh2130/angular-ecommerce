import { Router } from 'express';
import {
  createInventoryProduct,
  deleteInventoryProduct,
  getInventory,
  getInventoryOptions,
  updateInventoryProduct,
} from '../controllers/admin.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate, authorizeRoles('admin'));

router.get('/inventory/options', getInventoryOptions);
router.get('/inventory', getInventory);
router.post('/inventory', createInventoryProduct);
router.patch('/inventory/:id', updateInventoryProduct);
router.delete('/inventory/:id', deleteInventoryProduct);

export default router;
