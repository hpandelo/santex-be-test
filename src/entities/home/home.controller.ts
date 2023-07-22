import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

export class HomeController {
  public home(_req: Request, res: Response) {
    return res
      .status(StatusCodes.OK)
      .json({ message: "Welcome, to Jurassic Park" })
  }
}
