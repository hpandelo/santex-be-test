import { RedisFactory } from '../../services/redis'
import { TeamController } from './team.controller'

export class TeamFactory {
  private static controllerInstance: TeamController

  public static getControllerInstance(): TeamController {
    if (!TeamFactory.controllerInstance) {
      const redisClient = RedisFactory.getInstance()
      TeamFactory.controllerInstance = new TeamController(redisClient)
    }

    return TeamFactory.controllerInstance
  }
}