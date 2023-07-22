import { FootballDataFactory } from '../football-data'
import { RedisFactory } from '../redis'

function delay(time: number) {
  console.log('Preload', `Waiting for ${time}s`)
  return new Promise((resolve) => setTimeout(resolve, time * 1000))
}

// Here, we can also add a partial cache to prevent to retrieve everything again when failing
const preloadDataExec = async () => {
  await delay(10)
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

  const competitionPromises = competitionCodes.map((leagueCode) =>
    footballService.getCompetitionWithTeams(leagueCode)
  )

  const competitionsRetrieved = []
  while (competitionPromises.length) {
    await delay(61) // API rate limit = 10 requests p/ minute and each competition with team does 2 requests together
    const requestingCompetitions = competitionPromises.splice(0, 5)

    console.log(
      'Preload:',
      `Requesting ${requestingCompetitions.length} of ${competitionPromises.length} competitions remaining`
    )
    const currentRetrievedCompetitions = await Promise.all(
      requestingCompetitions
    )
    competitionsRetrieved.push(...currentRetrievedCompetitions)
  }

  const allTeams = competitionsRetrieved.map((c) => c.teams).flat()

  const cacheAllTeams = redisClient.set('TEAMS', JSON.stringify(allTeams))
  const cacheTeamsByName = allTeams.map((t) =>
    redisClient.set(`TEAMS-NAME-${t.name}`, JSON.stringify(t))
  )
  const cacheAllCompetitions = redisClient.set(
    'COMPETITIONS',
    JSON.stringify(competitionsRetrieved)
  )
  const cacheCompetitionsByCode = competitionsRetrieved.map((c) =>
    redisClient.set(`COMPETITION-CODE-${c.code}`, JSON.stringify(c))
  )
  const cacheLastPreloadDate = redisClient.set(
    'LAST_PRELOAD_DATE',
    new Date().toISOString()
  )

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

export const preloadData = async () => {
  try {
    await preloadDataExec()
  } catch (error: any) {
    if (error?.response) {
      // NOTE: We can also use the error message to wait before retry
      // You reached your request limit. Wait 60 seconds.
      const { message, errorCode } = error?.response?.data
      console.error(`HTTP ${errorCode}:`, error?.code, message)
    } else if (error.request) {
      // When there is no response from API
      console.error(error.request)
    } else {
      console.error('ERROR:', error.message)
    }

    console.log('Retrying...')
    await preloadData()
  }
}
