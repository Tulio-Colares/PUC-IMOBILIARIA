import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/list.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/createToken', verifyToken, createListing);
router.delete('/deleteToken/:id', verifyToken, deleteListing);
router.post('/updateToken/:id', verifyToken, updateListing);
router.get('/getToken/:id', getListing);
router.get('/getToken', getListings);

export default router;
