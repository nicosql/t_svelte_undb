import { Checkbox } from '@egodb/ui'

export const BoolValue: React.FC<{ value: boolean }> = ({ value }) => {
  return <Checkbox h="100%" lh={1} readOnly checked={value} />
}
