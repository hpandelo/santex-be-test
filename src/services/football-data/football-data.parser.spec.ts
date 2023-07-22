import { Coach, Player, Team } from './football-data'
import { FootballDataParser } from './football-data.parser'

describe('FootballDataParser', () => {
  it('should parse a Coach correctly', () => {
    const coach = {
      name: 'John Doe',
      dateOfBirth: '1990-01-01',
      nationality: 'England',
    };

    const teamName = 'Test Team';
    const parsedCoach = FootballDataParser.parseCoach(coach as Coach, teamName);

    expect(parsedCoach).toEqual({
      teamName: 'Test Team',
      name: 'John Doe',
      dateOfBirth: '1990-01-01',
      nationality: 'England',
    });
  });

  it('should parse a Player correctly', () => {
    const player = {
      name: 'Jane Smith',
      position: 'Forward',
      dateOfBirth: '1995-05-05',
      nationality: 'Spain',
    };

    const teamName = 'Test Team';
    const parsedPlayer = FootballDataParser.parsePlayer(player as Player, teamName);

    expect(parsedPlayer).toEqual({
      teamName: 'Test Team',
      name: 'Jane Smith',
      position: 'Forward',
      dateOfBirth: '1995-05-05',
      nationality: 'Spain',
    });
  });

  it('should parse a Team correctly', () => {
    const team = {
      id: 1,
      name: 'Test Team',
      tla: 'TTM',
      shortName: 'TT',
      area: { name: 'Test Area' },
      address: 'Test Address',
      coach: {
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        nationality: 'England',
      },
      squad: [
        {
          name: 'Jane Smith',
          position: 'Forward',
          dateOfBirth: '1995-05-05',
          nationality: 'Spain',
        },
        {
          name: 'Bob Johnson',
          position: 'Midfielder',
          dateOfBirth: '1992-02-02',
          nationality: 'USA',
        },
      ],
    };

    const parsedTeam = FootballDataParser.parseTeam(team as Team);

    expect(parsedTeam).toEqual({
      id: 1,
      name: 'Test Team',
      tla: 'TTM',
      shortName: 'TT',
      areaName: 'Test Area',
      address: 'Test Address',
      coach: {
        teamName: 'Test Team',
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        nationality: 'England',
      },
      squad: [
        {
          teamName: 'Test Team',
          name: 'Jane Smith',
          position: 'Forward',
          dateOfBirth: '1995-05-05',
          nationality: 'Spain',
        },
        {
          teamName: 'Test Team',
          name: 'Bob Johnson',
          position: 'Midfielder',
          dateOfBirth: '1992-02-02',
          nationality: 'USA',
        },
      ],
    });
  });
});
