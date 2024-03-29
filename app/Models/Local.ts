import { BaseModel, belongsTo, BelongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Institution from './Institution'
import Mdev from './Mdev'

export default class Local extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public institutionId: number

  @belongsTo(() => Institution)
  public institution: BelongsTo<typeof Institution>

  @column()
  public ibgeCode: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Mdev)
  public mdevs: HasMany<typeof Mdev>
}
