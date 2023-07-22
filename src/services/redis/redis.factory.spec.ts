import { RedisClientType } from '@redis/client'
import { createClient } from 'redis'
import { RedisFactory } from './redis.factory'

// Mock the redis createClient function
jest.mock('redis')
const mockedCreateClient = jest.mocked(createClient)

describe('RedisFactory', () => {
  afterEach(() => {
    // Reset the instance of RedisFactory after each test
    RedisFactory['instance'] = undefined as any
  })

  it('should create a new RedisClient instance when getInstance is called for the first time', () => {
    const mockRedisClient: Partial<RedisClientType> = {
      connect: jest.fn(() => Promise.resolve()),
    }

    const originalEnv = JSON.stringify(process.env)
    Object.assign(process.env, {
      REDIS_USER: 'testuser',
      REDIS_PASS: 'testpass',
      REDIS_HOST: 'localhost',
      REDIS_PORT: '6379',
    })

    // Mock the redis.createClient function to return the mockRedisClient
    mockedCreateClient.mockReturnValueOnce(mockRedisClient as any)

    const redisClient = RedisFactory.getInstance()

    // Verify that the mockRedisClient is returned as the instance
    expect(redisClient).toBe(mockRedisClient)

    // Verify that the redis.createClient function is called with the correct URL
    expect(mockedCreateClient).toHaveBeenCalledWith({
      url: 'redis://testuser:testpass@localhost:6379',
    })

    process.env = JSON.parse(originalEnv)
  })

  it('should reuse the existing RedisClient instance when getInstance is called multiple times', () => {
    const mockRedisClient: Partial<RedisClientType> = {
      connect: jest.fn(() => Promise.resolve()),
    }

    // Mock the redis.createClient function to return the mockRedisClient
    mockedCreateClient.mockReturnValueOnce(mockRedisClient as any)

    // Call getInstance twice
    const redisClient1 = RedisFactory.getInstance()
    const redisClient2 = RedisFactory.getInstance()

    // Verify that the same mockRedisClient is returned on both calls
    expect(redisClient1).toBe(mockRedisClient)
    expect(redisClient2).toBe(mockRedisClient)

    // Verify that the redis.createClient function is only called once
    expect(mockedCreateClient).toHaveBeenCalledTimes(1)
  })
})
