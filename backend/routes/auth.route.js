import express from 'express';
import { signupController, loginController, logoutController, authCheck } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js' 

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);

router.get('/authCheck', protectRoute, authCheck);


export default router