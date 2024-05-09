import express from 'express';
import { createList,  deleteList, updateList } from '../controllers/list.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/createToken', verifyToken, createList);
router.delete('/deleteToken/:id', verifyToken, deleteList);
router.post('/update/:id', verifyToken, updateList);

export default router;