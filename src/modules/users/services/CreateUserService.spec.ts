import { UserRepositoryInMemory } from '../repositories/in-memory/UserRepositoryInMemory'
import { CreateUserService } from '../services/CreateUserService'
import AppError from '../../../shared/errors/AppError'

let fakeUsersRepository: UserRepositoryInMemory
let createUser: CreateUserService

describe('Create User', () => {
  beforeEach(() => {
    fakeUsersRepository = new UserRepositoryInMemory()
    createUser = new CreateUserService(fakeUsersRepository)
  })

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'user1',
      email: 'user1@email.com',
      password: '123456',
    })
    expect(user).toHaveProperty('id')
  })

  it('should be not able to create a new user with same email from another one', async () => {
    const user = await createUser.execute({
      name: 'user1',
      email: 'user1@email.com',
      password: '123456',
    })

    expect(user).toHaveProperty('id')

    await expect(
      createUser.execute({
        name: 'user1',
        email: 'user1@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
