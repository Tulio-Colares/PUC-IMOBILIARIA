import express from 'express';
import { deleteUser, test, updateUser, getUserLists,  getUser } from '../controllers/user.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.get('/test', test);
router.post('/updateToken/:id', verifyToken, updateUser)
router.delete('/deleteToken/:id', verifyToken, deleteUser)
router.get('/list/:id', verifyToken, getUserLists)
router.get('/:id', verifyToken, getUser)

export default router;