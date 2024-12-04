import express from 'express'
import { google, signin, signup,signout } from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/signout', signout)
router.post('/google', google)


export default router;