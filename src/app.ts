import express from 'express'
import { HomeRouter } from './entities/home'
import { PlayerRouter } from './entities/player'
import { TeamRouter } from './entities/team'

const app = express();

app.use(express.json())

app.use(HomeRouter)
app.use(PlayerRouter)
app.use(TeamRouter)

export default app
