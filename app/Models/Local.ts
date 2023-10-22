import { BaseModel, belongsTo, BelongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import City from './City'
import Instituition from './Instituition'
import Mdev from './Mdev'

export default class Local extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public instituitionId: number

  @belongsTo(() => Instituition)
  public instituition: BelongsTo<typeof Instituition>

  @column()
  public cityId: number

  @belongsTo(() => City)
  public city: BelongsTo<typeof City>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Mdev)
  public mdevs: HasMany<typeof Mdev>
}
