import { Router } from "express";
import { getUsers, createUser } from "../controllers/user.controller.js";
const router = Router()


router.get('/users', getUsers)
    .post('/users', createUser)


export default router