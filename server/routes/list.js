import express from 'express';
import { createList, getList, updateList, deleteList, getLists } from '../controllers/list.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/createToken', verifyToken, createList);
router.get('/getToken/:id', getList);
router.post('/updateToken/:id', verifyToken, updateList);
router.delete('/deleteToken/:id', verifyToken, deleteList);
router.get('/get', getLists);


export default router;