import express from 'express'
import { deleteUser, getMonthlyUserData, getuser, getusers, test, updateUser } from '../controllers/user.controllers.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/test', test)


router.get('/getusers', verifyToken, getusers)

router.get('/getMonthlyUserData', verifyToken, getMonthlyUserData)

router.put('/update/:userId', verifyToken, updateUser)

router.delete('/delete/:userId', verifyToken, deleteUser)


router.get('/:userId', getuser)











export default router;