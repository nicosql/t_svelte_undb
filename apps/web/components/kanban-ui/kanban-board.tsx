import type { Records } from '@egodb/core'
import type { IKanbanField } from '@egodb/core'
import type { MantineTheme } from '@egodb/ui'
import styled from '@emotion/styled'
import type { ITableBaseProps } from '../table/table-base-props'
import { KanbanDateBoard } from './kanban-date-board'
import { KanbanSelectBoard } from './kanban-select-board'

interface IProps extends ITableBaseProps {
  field: IKanbanField
  records: Records
}

const Wrapper = styled.div`
  padding-top: ${({ theme }) => (theme as MantineTheme).spacing.md + 'px'};
`

export const KanbanBoard: React.FC<IProps> = ({ field, table, records }) => {
  if (field.type === 'select') {
    return (
      <Wrapper>
        <KanbanSelectBoard field={field} table={table} records={records} />
      </Wrapper>
    )
  }

  if (field.type === 'date') {
    return (
      <Wrapper>
        <KanbanDateBoard field={field} table={table} records={records} />
      </Wrapper>
    )
  }

  return null
}
