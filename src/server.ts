import 'dotenv/config'
import app from './app'
import { preloadData } from './services/preloader'

const port = +process.env.PORT! || 3000

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