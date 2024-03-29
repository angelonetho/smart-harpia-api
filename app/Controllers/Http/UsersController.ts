import { HttpContext } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Institution from 'App/Models/Institution'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  // Método para criar um usuário
  public async store({ request, response, bouncer }: HttpContextContract) {
    const userPayLoad = await request.validate(CreateUserValidator)

    await bouncer.authorize('createUser', userPayLoad.institution)

    // Verificando se o e-mail já está em uso
    const userByEmail = await User.findBy('email', userPayLoad.email)

    if (userByEmail) throw new BadRequestException('email already in use', 409)

    const user = await User.create(userPayLoad)

    // Associando a instituição ao usuário
    const institution = await Institution.findOrFail(userPayLoad.institution)
    await user.related('institution').associate(institution)

    return response.created({ user })
  }

  // Método para atualizar os dados de um usuário
  public async update({ request, response, bouncer }: HttpContextContract) {
    const { email, name, imagePath, active, admin } = await request.validate(UpdateUserValidator)
    const id = request.param('id')
    const user = await User.findOrFail(id)

    // Verificando permissões de autorização usando o bouncer
    await bouncer.authorize('updateUser', user)

    const userByEmail = await User.findBy('email', email)

    // Verificando se o novo e-mail já está em uso
    if (userByEmail && userByEmail.id !== user.id)
      throw new BadRequestException('email already in use', 409)

    if (imagePath) {
      user.imagePath = imagePath
    } else {
      user.imagePath = ''
    }

    if (active !== undefined) user.active = active
    if (admin !== undefined) user.admin = admin

    user.email = email
    user.name = name
    await user.save()

    return response.ok({ user })
  }

  // Método para desativar um usuário
  public async deactivate({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('id')
    const user = await User.findOrFail(id)

    // Verificando permissões de autorização usando o bouncer
    await bouncer.authorize('updateUser', user)

    user.active = false
    await user.save()

    return response.noContent()
  }

  // Método para obter um usuário por ID
  public async getUserById({ request, response }: HttpContext) {
    const id = request.param('id')

    const user = await User.findOrFail(id)

    return response.ok({ user })
  }
}
