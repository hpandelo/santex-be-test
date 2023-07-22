import { AxiosInstance } from "axios"
import { Competition, Team } from "./football-data"
import { FootballDataParser } from './football-data.parser'

export class FootballDataService {
  constructor(private api: AxiosInstance) {}

  async getCompetitionWithTeams(leagueCode: string): Promise<Competition> {
    const [ competition, teams ] = await Promise.all([
      this.getCompetitionByCode(leagueCode),
      this.getTeamsFromCompetition(leagueCode)
    ])

    const result = ({...competition, teams })
    return result
  }

  async getCompetitionCodes(): Promise<string[]> {
    const { data: { competitions } } = await this.api.get<{ competitions: Competition[] }>(`/competitions`)
    return competitions.map(c => c.code)
  }

  async getCompetitionByCode(leagueCode: string): Promise<Omit<Competition, 'teams'>> {
    const { data: { name, code, area } } = await this.api.get<Competition>(`/competitions/${leagueCode}`)
    return ({ name, area, code, areaName: area?.name })
  }

  async getTeamsFromCompetition(leagueCode: string): Promise<Team[]> {
    const {
      data: { teams },
    } = await this.api.get<{ teams: Team[] }>(`/competitions/${leagueCode}/teams`)

    const parsedTeam = teams.map(FootballDataParser.parseTeam)
    return parsedTeam
  }

  async getTeams(): Promise<Team[]> {
    const {
      data: { teams },
    } = await this.api.get<{ teams: Team[] }>(`/teams/?limit=500`) // Without squad
    console.log(teams.length, 'teams retrieved form API')
    const parsedTeam = teams.map(FootballDataParser.parseTeam)
    return parsedTeam
  }

  async getTeamById(id: number): Promise<Team> {
    const {
      data: team,
    } = await this.api.get<Team>(`/teams/${id}`) // With squad. But some of them returns HTTP 403

    console.log(`Team ${team.name} (${id}) retrieved form API`)
    const parsedTeam = FootballDataParser.parseTeam(team)
    return parsedTeam
  }
}
