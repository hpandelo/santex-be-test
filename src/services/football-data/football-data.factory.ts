import axios from 'axios'
import 'dotenv/config'
import { FootballDataService } from './football-data.service'

export class FootballDataFactory {
  private static serviceInstance: FootballDataService

  public static getServiceInstance(): FootballDataService {
    if (!FootballDataFactory.serviceInstance) {
      const { FOOTBALL_DATA_API_URL, FOOTBALL_DATA_API_TOKEN } = process.env

      const axiosClient = axios.create({
        baseURL: FOOTBALL_DATA_API_URL!,
        // timeout: 1000,
        headers: {
          'Accept': 'application/json',
          'X-Auth-Token': FOOTBALL_DATA_API_TOKEN!
        }
      })

      FootballDataFactory.serviceInstance = new FootballDataService(axiosClient)
    }

    return FootballDataFactory.serviceInstance
  }
}