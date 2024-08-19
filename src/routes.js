import { Router } from 'express'
import TokenController from './app/controlles/TokenController.js'

const routes = new Router()

routes.post('/tokenFeed', TokenController.store)
routes.get('/feedInsta', TokenController.index)

export default routes