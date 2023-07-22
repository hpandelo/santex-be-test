import { RedisClientType } from '@redis/client'
import 'dotenv/config'
import { createClient } from 'redis'


export class RedisFactory {
  private static instance: RedisClientType

  public static getInstance(): RedisClientType {
    if (!RedisFactory.instance) {
      const { REDIS_USER, REDIS_PASS, REDIS_HOST, REDIS_PORT } = process.env

      RedisFactory.instance = createClient({
        url: `redis://${REDIS_USER}:${REDIS_PASS}@${REDIS_HOST}:${REDIS_PORT}`
      })

      RedisFactory.instance.connect().then(() => {
        console.log('Redis connection established')
      })
    }

    return RedisFactory.instance
  }
}