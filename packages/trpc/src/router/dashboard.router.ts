import {
  CreateWidgeCommand,
  RelayoutWidgesCommand,
  createWidgeCommandInput,
  relayoutWidgesCommandInput,
} from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createDashboardRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    createWidge: procedure
      .input(createWidgeCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new CreateWidgeCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    relayoutWidges: procedure
      .input(relayoutWidgesCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new RelayoutWidgesCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
