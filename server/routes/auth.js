import express from 'express';
import {google, signUp, signIn, signOut} from '../controllers/auth.js';

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/google", google);
router.post("/signout", signOut);

export default router;