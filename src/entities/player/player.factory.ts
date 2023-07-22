import { RedisFactory } from '../../services/redis'
import { PlayerController } from './player.controller'

export class PlayerFactory {
  private static controllerInstance: PlayerController

  public static getControllerInstance(): PlayerController {
    if (!PlayerFactory.controllerInstance) {
      const redisClient = RedisFactory.getInstance()
      PlayerFactory.controllerInstance = new PlayerController(redisClient)
    }

    return PlayerFactory.controllerInstance
  }
}