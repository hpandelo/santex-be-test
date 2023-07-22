import { Coach, Player, Team } from './football-data'

export class FootballDataParser {

    public static parseCoach = (c: Coach, teamName: string): Coach => ({
      teamName,
      name: c?.name ?? '',
      dateOfBirth: c?.dateOfBirth ?? '',
      nationality: c?.nationality ?? '',
    })

    public static parsePlayer = (p: Player, teamName: string): Player => ({
      teamName,
      name: p?.name ?? '',
      position: p?.position ?? '',
      dateOfBirth: p?.dateOfBirth ?? '',
      nationality: p?.nationality ?? '',
    })

    public static parseTeam = (t: Team): Team => ({
      id: t.id ?? '',
      name: t.name ?? '',
      tla: t.tla ?? '',
      shortName: t.shortName ?? '',
      areaName: t.area?.name! ?? '',
      address: t.address ?? '',
      coach: FootballDataParser.parseCoach(t.coach, t.name), // Isn't so clear if coach shouldn't be retrieved when there are players in squad
      squad: t.squad?.map((s) => FootballDataParser.parsePlayer(s, t.name)),
    })
}