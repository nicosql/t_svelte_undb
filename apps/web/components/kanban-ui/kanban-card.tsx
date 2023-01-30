import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, Group, Stack, useEgoUITheme } from '@egodb/ui'
import type { SortableProps } from '../sortable.interface'
import type { ITableBaseProps } from '../table/table-base-props'
import type { Record } from '@egodb/core'
import type { CSSProperties } from 'react'
import { FieldIcon } from '../field-inputs/field-Icon'
import { useSetAtom } from 'jotai'
import { editRecordFormDrawerOpened } from '../edit-record-form/drawer-opened.atom'
import { editRecordValuesAtom } from '../edit-record-form/edit-record-values.atom'
import { FieldValueFactory } from '../field-value/field-value.factory'

interface IProps extends ITableBaseProps {
  record: Record
}

export const KanbanCard: React.FC<IProps & SortableProps> = ({
  table,
  record,
  attributes,
  listeners,
  setNodeRef,
  style,
}) => {
  const setOpened = useSetAtom(editRecordFormDrawerOpened)
  const setValues = useSetAtom(editRecordValuesAtom)

  return (
    <Card
      py="sm"
      withBorder
      shadow="md"
      radius="xs"
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation()
        setOpened(true)
        setValues({ id: record.id.value, values: record.values.valueJSON })
      }}
    >
      <Stack spacing={8} sx={(theme) => ({ fontSize: theme.fontSizes.sm })}>
        {Object.entries(record.values.valueJSON).map(([key, value]) => {
          const field = table.schema.getFieldById(key)
          if (field.isNone()) return null
          const f = field.unwrap()
          return (
            <Group spacing="xs" key={key}>
              <FieldIcon type={f.type} color="gray" />
              <FieldValueFactory field={f} value={value} />
            </Group>
          )
        })}
      </Stack>
    </Card>
  )
}

export const SortableKanbanCard: React.FC<IProps> = ({ table, record }) => {
  const { attributes, listeners, setNodeRef, isDragging, transform, transition } = useSortable({
    id: record.id.value,
    data: {
      type: 'card',
    },
  })

  const theme = useEgoUITheme()

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.5 : undefined,
    boxShadow: isDragging ? theme.shadows.xl : theme.shadows.sm,
  }

  return (
    <KanbanCard
      table={table}
      record={record}
      attributes={attributes}
      listeners={listeners}
      setNodeRef={setNodeRef}
      style={style}
    />
  )
}
