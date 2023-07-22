import 'dotenv/config'
import app from './app'
import { FootballDataFactory } from './services/football-data'
import { RedisFactory } from './services/redis'

const port = +process.env.PORT! || 3000

function delay(time: number) {
  console.log('Preload', `Waiting for ${time}s`)
  return new Promise(resolve => setTimeout(resolve, time*1000))
}

const preloadData = async () => {
  await delay(10);
  console.log('Preloading data', 'Preparing preloader')
  const redisClient = RedisFactory.getInstance()
  const footballService = FootballDataFactory.getServiceInstance()

  const lastPreload = await redisClient.get('LAST_PRELOAD_DATE')
  const shouldPreload = !lastPreload // Here you can set a frequency to retrieve again if needed
  if (!shouldPreload) {
    console.log('Preloading data', 'Already Preloaded', lastPreload)
    return
  }

  console.log('Preloading data', 'Retrieving all teams')

  // Get all competition codes
  const competitionCodes = await footballService.getCompetitionCodes()
  redisClient.set('COMPETITION_CODES', JSON.stringify(competitionCodes))

  const competitionPromises = competitionCodes.map(leagueCode => footballService.getCompetitionWithTeams(leagueCode))

  const competitionsRetrieved = []
  while(competitionPromises.length) {
    await delay(60) // API rate limit = 10 requests p/ minute and each competition with team does 2 requests together
    const requestingCompetitions = competitionPromises.splice(0, 5)

    console.log('Preload:', `Requesting ${requestingCompetitions.length} of ${competitionPromises.length} competitions remaining`)
    const currentRetrievedCompetitions = await Promise.all(requestingCompetitions)
    competitionsRetrieved.push(...currentRetrievedCompetitions)
  }

  const allTeams = competitionsRetrieved.map(c => c.teams).flat()

  const cacheAllTeams = redisClient.set('TEAMS', JSON.stringify(allTeams))
  const cacheTeamsByName = allTeams.map(t => redisClient.set(`TEAMS-NAME-${t.name}`, JSON.stringify(t)))
  const cacheAllCompetitions = redisClient.set('COMPETITIONS', JSON.stringify(competitionsRetrieved))
  const cacheCompetitionsByCode = competitionsRetrieved.map(c => redisClient.set(`COMPETITION-CODE-${c.code}`, JSON.stringify(c)))
  const cacheLastPreloadDate = redisClient.set('LAST_PRELOAD_DATE', (new Date).toISOString())

  console.log('Preload:', 'Caching results')
  await Promise.all([
    cacheAllTeams,
    cacheAllCompetitions,
    ...cacheTeamsByName,
    ...cacheCompetitionsByCode,
    cacheLastPreloadDate,
  ])
  console.log('Preload:', 'Done~')

  /* Returns HTTP 403 sometimes. So I'll check by competition codes instead
  const ids = apiTeams.map(team => team.id)
  while (ids.length > 0) {
    await delay(10);
    const requestingIds = ids.splice(0, 10) // API rate limit = 10 requests p/ minute

    console.log('Preload:', 'Requesting', requestingIds, `${requestingIds.length} of ${ids.length} remaining`)
    const results = await Promise.all(requestingIds.map(id => footballService.getTeamById(id)))

    const cachePromises = results.map(team => [
      redisClient.set(`TEAMS-ID-${team.id}`, JSON.stringify(apiTeams)),
      redisClient.set(`TEAMS-NAME-${team.name}`, JSON.stringify(apiTeams)),
    ]).flat()

    await Promise.all(cachePromises)
  }
  */
}

const listener = async () => {

  /* -----  This is just to be fancy =) ----- */
  const lineArg = '\t\t \x1b[33m ----------------------------------------------------------- \x1b[0m \n'
  const args = [
    '\n\n',
    lineArg,
    '\n\t\t\t',
    `\x1b[33m Server is now up and listening on port ${port}! \x1b[0m`,
    '\n\n',
    lineArg,
    `\n\t \x1b[34m Hello Santex! Thanks for letting me to participate in this process =) \x1b[0m`,
    `\n\t\t \x1b[34m Project done by Helcio Pandelo <hmacedo2007@gmail.com> \x1b[0m`,
    '\n\n',
  ]
  console.log(...args)
  /* ---------------------------------------- */

  await preloadData()
}

const server = app.listen(port, listener)

export default server