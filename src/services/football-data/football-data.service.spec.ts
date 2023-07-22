import { Team } from './football-data'
import { FootballDataService } from './football-data.service'

const mockAxiosInstance = {
  get: jest.fn(),
} as any

const competitionData = {
  name: 'Premier League',
  areaName: 'England',
  code: 'PL',
  area: { name: 'England' },
}

describe('FootballDataService', () => {
  let footballDataService: FootballDataService

  beforeEach(() => {
    footballDataService = new FootballDataService(mockAxiosInstance)
    jest.clearAllMocks()
  })

  it('should fetch a competition with teams', async () => {
    const leagueCode = 'PL'

    const teamsData = [
      {
        id: 1,
        name: 'Team A',
        coach: {
          name: 'John Doe',
          dateOfBirth: expect.any(String),
          nationality: 'EUA',
          teamName: 'Team A',
        },
        squad: [],
        address: '123 Main Street',
        areaName: 'North',
        shortName: 'TAA',
        tla: 'TMA',
      },
      {
        id: 2,
        name: 'Team B',
        coach: {
          name: 'Jane Smith',
          dateOfBirth: expect.any(String),
          nationality: 'EUA',
          teamName: 'Team B',
        },
        squad: [],
        address: '123 Other Street',
        areaName: 'South',
        shortName: 'TBB',
        tla: 'TMB',
      },
    ]

    mockAxiosInstance.get
      .mockResolvedValueOnce({ data: competitionData })
      .mockResolvedValueOnce({
        data: {
          teams: [
            { ...teamsData[0], area: { name: 'North' } },
            { ...teamsData[1], area: { name: 'South' } },
          ],
        },
      })

    const result = await footballDataService.getCompetitionWithTeams(leagueCode)

    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2)
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      `/competitions/${leagueCode}`
    )
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      `/competitions/${leagueCode}/teams`
    )

    expect(result).toEqual({
      ...competitionData,
      teams: teamsData,
    })
  })

  it('should fetch competition codes', async () => {
    const competitionCodes = ['PL', 'BL', 'SA']

    mockAxiosInstance.get.mockResolvedValueOnce({
      data: { competitions: [{ code: 'PL' }, { code: 'BL' }, { code: 'SA' }] },
    })

    const result = await footballDataService.getCompetitionCodes()

    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1)
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/competitions')

    expect(result).toEqual(competitionCodes)
  })

  it('should fetch competition by code', async () => {
    const leagueCode = 'PL'

    mockAxiosInstance.get.mockResolvedValueOnce({ data: competitionData })

    const result = await footballDataService.getCompetitionByCode(leagueCode)

    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1)
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      `/competitions/${leagueCode}`
    )

    expect(result).toEqual({
      name: 'Premier League',
      code: 'PL',
      area: { name: 'England' },
      areaName: 'England',
    })
  })

  it('should fetch teams from a competition', async () => {
    const leagueCode = 'PL'
    const teamsData = [
      { id: 1, name: 'Team A', coach: { name: 'John Doe' }, squad: [] },
      { id: 2, name: 'Team B', coach: { name: 'Jane Smith' }, squad: [] },
    ]

    mockAxiosInstance.get.mockResolvedValueOnce({ data: { teams: teamsData } })

    const result = await footballDataService.getTeamsFromCompetition(leagueCode)

    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1)
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      `/competitions/${leagueCode}/teams`
    )

    expect(result).toHaveLength(2)
    expect(result).toBeInstanceOf(Array<Team>)
  })

  it('should fetch all teams', async () => {
    const teamsData = [
      {
        id: 1,
        name: 'Team A',
        coach: {
          name: 'John Doe',
          dateOfBirth: expect.any(String),
          nationality: 'EUA',
          teamName: 'Team A',
        },
        squad: [],
        address: '123 Main Street',
        areaName: 'North',
        shortName: 'TAA',
        tla: 'TMA',
      },
      {
        id: 2,
        name: 'Team B',
        coach: {
          name: 'Jane Smith',
          dateOfBirth: expect.any(String),
          nationality: 'EUA',
          teamName: 'Team B',
        },
        squad: [],
        address: '123 Other Street',
        areaName: 'South',
        shortName: 'TBB',
        tla: 'TMB',
      },
    ]

    mockAxiosInstance.get.mockResolvedValueOnce({
      data: {
        teams: [
          { ...teamsData[0], area: { name: 'North' } },
          { ...teamsData[1], area: { name: 'South' } },
        ],
      },
    })

    const result = await footballDataService.getTeams()

    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1)
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/teams/?limit=500')

    expect(result).toEqual(teamsData)
  })

  it('should fetch a team by id', async () => {
    const teamId = 1
    const teamData = {
      id: teamId,
      name: 'Team A',
      coach: {
        name: 'John Doe',
        dateOfBirth: expect.any(String),
        nationality: 'EUA',
        teamName: 'Team A',
      },
      squad: [],
      address: '123 Main Street',
      areaName: 'North',
      shortName: 'TAA',
      tla: 'TMA',
    }

    mockAxiosInstance.get.mockResolvedValueOnce({
      data: {
        ...teamData,
        someExtraStuff: 'blablabla',
        area: { name: 'North' },
      },
    })

    const result = await footballDataService.getTeamById(teamId)

    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1)
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/teams/${teamId}`)

    expect(result).toEqual(teamData)
  })
})
