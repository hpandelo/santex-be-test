import { Router } from 'express'
import { TeamFactory } from './team.factory'

const ROUTES = {
  'ALL': '/teams',
  'BY_NAME': '/teams/:teamName',
}

const router = Router()
const controller = TeamFactory.getControllerInstance()

router.get(ROUTES.ALL, controller.getAll.bind(controller))

router.get(ROUTES.BY_NAME, controller.getByName.bind(controller))

export const TeamRouter = router
