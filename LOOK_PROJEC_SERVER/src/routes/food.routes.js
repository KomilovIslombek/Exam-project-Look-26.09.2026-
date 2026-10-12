import { Router } from "express";
import {getFoods, getFoodById} from "../controllers/food.controller.js"

const router = Router()

router.get('/foods', getFoods)
router.get('/foods/:id', getFoodById)

export default router