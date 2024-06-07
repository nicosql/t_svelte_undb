import { singleton } from "@undb/di"
import { None, Option, Some } from "@undb/domain"
import {
  TableIdSpecification,
  type ITableDTO,
  type ITableQueryRepository,
  type TableComositeSpecification,
  type TableId,
} from "@undb/table"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { tables } from "../tables"
import { TableDbQuerySpecHandler } from "./table-db.query-spec-handler"
import { TableMapper } from "./table.mapper"

@singleton()
export class TableQueryRepository implements ITableQueryRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
  ) {}

  public get mapper() {
    return new TableMapper()
  }

  async find(spec: Option<TableComositeSpecification>): Promise<ITableDTO[]> {
    const qb = this.db.select().from(tables).$dynamic()

    const result = await new TableDbQuerySpecHandler(qb).handle(spec)

    return result.map((r) => this.mapper.toDTO(r))
  }

  async findOneById(id: TableId): Promise<Option<ITableDTO>> {
    const tbs = await this.db.select().from(tables)
    const qb = this.db.select().from(tables).$dynamic()

    const spec = Some(new TableIdSpecification(id))
    const tb = await new TableDbQuerySpecHandler(qb).handle(spec).limit(1)

    return tb.length ? Some(this.mapper.toDTO(tb[0])) : None
  }
}
