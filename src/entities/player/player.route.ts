import { Router } from 'express'
import { PlayerFactory } from './player.factory'

const ROUTES = {
  'BY_LEAGUECODE': '/players/:leagueCode',
}

const router = Router()
const controller = PlayerFactory.getControllerInstance()

router.get(ROUTES.BY_LEAGUECODE, controller.getByLeagueCode.bind(controller))

export const PlayerRouter = router
