import { Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import { FieldConstraintVO, baseFieldConstraint } from "../../field-constraint.vo"

export const currencyFieldConstraint = baseFieldConstraint
  .partial()
  .merge(
    z.object({
      min: z.number(),
      max: z.number(),
    }),
  )
  .partial()
  .refine((v) => v.min === undefined || v.max === undefined || v.min <= v.max, {
    message: "min should be less than or equal to max",
  })

export type ICurrencyFieldConstraint = z.infer<typeof currencyFieldConstraint>

export class CurrencyFieldConstraint extends FieldConstraintVO<ICurrencyFieldConstraint> {
  constructor(dto: ICurrencyFieldConstraint) {
    super({
      required: dto.required,
      min: dto.min,
      max: dto.max,
    })
  }
  override get schema() {
    let base: z.ZodTypeAny = z.number().nonnegative()
    if (this.props.min) {
      base = base.and(z.number().min(this.props.min))
    }
    if (this.props.max) {
      base = base.and(z.number().max(this.props.max))
    }
    if (!this.props.required) {
      base = base.optional().nullable()
    }

    return base
  }

  override get mutateSchema() {
    return Some(this.schema)
  }

  override fromFormField(formField: FormFieldVO) {
    return new CurrencyFieldConstraint({
      ...this.props,
      required: this.props.required ?? formField.required,
    }) as this
  }
}
