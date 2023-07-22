import { Router } from 'express'
import { HomeFactory } from './home.factory'

const ROUTES = {
  'MAIN': '/',
}

const router = Router()
const controller = HomeFactory.getControllerInstance()

router.get(ROUTES.MAIN, controller.home.bind(controller))

export const HomeRouter = router
