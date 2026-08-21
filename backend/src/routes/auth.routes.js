import { Router } from 'express';
import { login, register, getCurrentUser } from '../controllers/auth.controller.js';
import { checkAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', checkAuth, getCurrentUser);

export default router;
