import { HomeController } from './home.controller'

export class HomeFactory {
  private static controllerInstance: HomeController

  public static getControllerInstance(): HomeController {
    if (!HomeFactory.controllerInstance) {
      HomeFactory.controllerInstance = new HomeController()
    }

    return HomeFactory.controllerInstance
  }
}