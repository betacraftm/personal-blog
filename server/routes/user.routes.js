import express from 'express'
import {
	updateUser,
	deleteUser,
	signout,
	getUsers,
	getUser,
} from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'
import {
	deleteUserTest,
	getUsersTest,
	updateUserTest,
} from '../tests/auth.controller.test.js'
const router = express.Router()

router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.post('/signout', signout)
router.get('/getusers', verifyToken, getUsers)
router.get('/:userId', getUser)
router.put('/test/update/:userId', updateUserTest)
router.delete('/test/delete/:userId', deleteUserTest)
router.get('/test/getusers', getUsersTest)

export default router
