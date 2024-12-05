import express from 'express'
import { signup, signin, googleAuth } from '../controllers/auth.controller.js'
import { signupTest } from '../tests/auth.controller.test.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/test/signup', signupTest)
router.post('/signin', signin)
router.post('/google', googleAuth)

export default router
