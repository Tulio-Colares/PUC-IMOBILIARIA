import express from 'express';
import { createList,  deleteList } from '../controllers/list.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/createToken', verifyToken, createList);
router.delete('/deleteToken/:id', verifyToken, deleteList);

export default router;