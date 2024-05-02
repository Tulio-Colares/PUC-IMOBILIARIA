import express from 'express';
import { createList } from '../controllers/list.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/createToken', verifyToken, createList);

export default router;