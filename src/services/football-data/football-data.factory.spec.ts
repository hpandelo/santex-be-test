import axios from 'axios'
import { FootballDataFactory } from './football-data.factory'
import { FootballDataService } from './football-data.service'

// Mock the axios.create function
jest.mock('axios')
const mockedAxios = jest.mocked(axios)

describe('FootballDataFactory', () => {
  afterEach(() => {
    // Reset the serviceInstance of FootballDataFactory after each test
    FootballDataFactory['serviceInstance'] = undefined as any
  })

  it('should create a new FootballDataService instance when getServiceInstance is called for the first time', () => {
    const mockAxiosClient = axios.create()

    // Mock the axios.create function to return the mockAxiosClient
    mockedAxios.create.mockReturnValueOnce(mockAxiosClient)

    const originalEnv = JSON.stringify(process.env)
    Object.assign(process.env, {
      FOOTBALL_DATA_API_URL: 'https://api.football-data.org/v2/',
      FOOTBALL_DATA_API_TOKEN: 'test-api-token',
    })

    const serviceInstance = FootballDataFactory.getServiceInstance()

    // Verify that the mockAxiosClient is passed to the FootballDataService constructor
    expect(serviceInstance['api']).toBe(mockAxiosClient)

    // Verify that the same serviceInstance is returned
    expect(serviceInstance).toBeInstanceOf(FootballDataService)

    process.env = JSON.parse(originalEnv)
  })

  it('should reuse the existing FootballDataService instance when getServiceInstance is called multiple times', () => {
    const mockAxiosClient = axios.create()

    // Mock the axios.create function to return the mockAxiosClient
    mockedAxios.create.mockReturnValueOnce(mockAxiosClient)

    // Call getServiceInstance twice
    const serviceInstance1 = FootballDataFactory.getServiceInstance()
    const serviceInstance2 = FootballDataFactory.getServiceInstance()

    expect(serviceInstance1).toBeInstanceOf(FootballDataService)
    expect(serviceInstance2).toBeInstanceOf(FootballDataService)

    // Verify that the same serviceInstance is returned on both calls
    expect(serviceInstance1).toBe(serviceInstance2)
  })
})
