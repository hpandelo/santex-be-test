import { Request, Response } from 'express'
import { StatusCodes } from "http-status-codes"
import { RedisClient } from '../../services/redis'

export class TeamController {
  constructor(
    private redisClient: RedisClient
  ) {}

  public async getAll(req: Request, res: Response) {
    const cachedTeams = await this.redisClient.get('TEAMS') || ''
    const teams = JSON.parse(cachedTeams!)

    return res
      .status(StatusCodes.OK)
      .json({ teams })
  }

  public async getByName(req: Request, res: Response) {
    const { teamName } = req.params

    const TEAM_NAME_CODE = `TEAMS-NAME-${teamName}`

    // We could only filter by TEAMS cache, but since we can do it faster, why not?
    const cachedTeam = await this.redisClient.get(TEAM_NAME_CODE)
    const team = JSON.parse(cachedTeam!)

    return res
      .status(StatusCodes.OK)
      .json({ team })
  }
}
