import {Router} from 'express';
import * as productsController from './products.controller.js'; 

const router=Router(); 

router.get('/',productController.getProducts) 

export default router;