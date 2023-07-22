import { JsonType, PrimaryKey, Property } from '@mikro-orm/core'
import { Audit as CoreAudit } from '@undb/integrations'
import { BaseEntity } from './base.js'

export class Audit extends BaseEntity {
  constructor(audit: CoreAudit) {
    super()
    this.id = audit.id.value
    this.timestamp = audit.timestamp.value
    this.op = audit.op
    this.targetId = audit.target.id
    this.targetType = audit.target.type
    this.detail = audit.detail.into()
    this.operatorId = audit.operatorId
  }

  @PrimaryKey()
  id: string

  @Property()
  timestamp: Date

  @Property()
  op: string

  @Property({ nullable: true })
  targetId?: string

  @Property({ nullable: true })
  targetType?: string

  @Property({ type: JsonType })
  detail?: object

  @Property()
  operatorId: string
}
