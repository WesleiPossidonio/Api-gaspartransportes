import { Router } from 'express'
import TokenController from './app/controlles/TokenController.js'
import SendMail from './app/controlles/SendMail.js'

const routes = new Router()

routes.post('/tokenFeed', TokenController.store)
routes.get('/feedInsta', TokenController.index)
routes.put('/updateToken/:id', TokenController.update)

routes.post('/sendMail', SendMail.store)

export default routes