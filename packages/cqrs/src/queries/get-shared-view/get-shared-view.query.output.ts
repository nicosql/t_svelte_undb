import { queryRecords, queryTable } from '@undb/core'
import { z } from 'zod'

export const getSharedViewQueryOutput = z.object({
  table: queryTable,
  records: queryRecords,
})
