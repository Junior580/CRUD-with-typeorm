import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import { ensureAuthenticated } from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import { ProvidersController } from '../controllers/ProvidersController'
import { ProviderMonthAvailabilityController } from '../controllers/ProviderMonthAvailabilityController'
import { ProviderDayAvailabilityController } from '../controllers/ProviderDayAvailabilityController'

export const providersRouter = Router()

const providersController = new ProvidersController()
const providerMonthAvailabilityController =
  new ProviderMonthAvailabilityController()
const providerDayAvailabilityController =
  new ProviderDayAvailabilityController()

providersRouter.use(ensureAuthenticated)

providersRouter.get('/', providersController.handle)
providersRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthAvailabilityController.handle
)
providersRouter.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerDayAvailabilityController.handle
)
