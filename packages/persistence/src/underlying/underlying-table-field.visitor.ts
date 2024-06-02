import {
  ID_TYPE,
  type AutoIncrementField,
  type CreatedAtField,
  type IFieldVisitor,
  type IdField,
  type NumberField,
  type StringField,
  type UpdatedAtField,
} from "@undb/table"
import { AlterTableBuilder, AlterTableColumnAlteringBuilder, CreateTableBuilder, sql } from "kysely"
import type { UnderlyingTable } from "./underlying-table"

export class UnderlyingTableFieldVisitor<TB extends CreateTableBuilder<any, any> | AlterTableBuilder>
  implements IFieldVisitor
{
  constructor(
    private readonly t: UnderlyingTable,
    public tb: TB,
  ) {}

  public atb: AlterTableColumnAlteringBuilder | CreateTableBuilder<any, any> | null = null
  #rawSQL: string[] = []

  get rawSQL() {
    return this.#rawSQL
  }

  private addColumn(c: AlterTableColumnAlteringBuilder | CreateTableBuilder<any, any>) {
    this.atb = c
    this.tb = c as TB
  }

  updatedAt(field: UpdatedAtField): void {
    const tableName = this.t.name
    const c = this.tb.addColumn(field.id.value, "timestamp", (b) => b.defaultTo(sql`(CURRENT_TIMESTAMP)`).notNull())
    this.addColumn(c)

    // TODO: better solution
    const query = `
    CREATE TRIGGER IF NOT EXISTS update_at_update_${tableName} AFTER UPDATE ON \`${tableName}\`
    BEGIN
    	update \`${tableName}\` SET ${field.id.value} = datetime('now') WHERE ${ID_TYPE} = NEW.${ID_TYPE};
    END;
        `
    this.#rawSQL.push(query)
  }
  autoIncrement(field: AutoIncrementField): void {
    const c = this.tb.addColumn(field.id.value, "integer", (b) => b.autoIncrement().primaryKey())
    this.addColumn(c)
  }
  createdAt(field: CreatedAtField): void {
    const c = this.tb.addColumn(field.id.value, "timestamp", (b) => b.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    this.addColumn(c)
  }
  id(field: IdField): void {
    const c = this.tb.addColumn(field.id.value, "varchar(50)", (b) => b.notNull().unique())
    this.addColumn(c)
  }
  string(field: StringField): void {
    const c = this.tb.addColumn(field.id.value, "varchar(255)")
    this.addColumn(c)
  }
  number(field: NumberField): void {
    const c = this.tb.addColumn(field.id.value, "real")
    this.addColumn(c)
  }
}
