import { Router } from 'express';

import authRouter from './authRoute';
import userRouter from './userRoutes';
import roleRouter from './roleRoute';
import permissionRouter from './permissionRoute';
import pageRouter from './pageRoute';

const router = Router();

// Mount feature routes
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/roles', roleRouter);
router.use('/permissions', permissionRouter);
router.use('/pages', pageRouter);

export default router;
