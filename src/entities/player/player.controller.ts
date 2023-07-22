import { Request, Response } from 'express'
import { StatusCodes } from "http-status-codes"
import { BasePerson, Competition } from '../../services/football-data/football-data'
import { RedisClient } from '../../services/redis'

export class PlayerController {
  constructor(
    private redisClient: RedisClient
  ) {}

  public async getByLeagueCode(req: Request, res: Response) {
    const { leagueCode } = req.params
    const { team } = req.query
    const teamQuery = (''+team)?.replace(/[\"]/g, '').trim()

    const COMPETITION_CODE = `COMPETITION-CODE-${leagueCode}`
    const cachedCompetition = await this.redisClient.get(COMPETITION_CODE)

    if (!cachedCompetition) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Competition not found', leagueCode })
    }

    const competition: Competition = JSON.parse(cachedCompetition!)
    const allPlayers = competition.teams
        .map(team => !team.squad.length ? [ team.coach ] : team.squad)
        .flat()

    if (!teamQuery) {
      return res
        .status(StatusCodes.OK)
        .json({
          competition: {
              name: competition.name,
              code: competition.code,
              totalPlayers: allPlayers.length,
          },
          players: allPlayers,
        })
    }

    const teamPlayers = allPlayers.filter((p: BasePerson) => p.teamName === teamQuery)
    return res
      .status(StatusCodes.OK)
      .json({
        team: {
          name: teamQuery,
          totalPlayers: teamPlayers.length
        },
        competition: {
            name: competition.name,
            code: competition.code,
            totalPlayers: allPlayers.length,
        },
        players: teamPlayers,
      })
    }
}
