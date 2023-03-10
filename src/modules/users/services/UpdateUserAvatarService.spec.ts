import AppError from '@shared/errors/AppError'

import { InMemoryUserRepository } from '../repositories/inMemory/InMemoryUserRepository'
import { InMemoryStorageProvider } from '@shared/container/providers/StorageProvider/inMemory/InMemoryStorageProvider'
import { UpdateUserAvatarService } from './UpdateUserAvatarService'

let usersRepository: InMemoryUserRepository
let storageProvider: InMemoryStorageProvider
let updateUserAvatar: UpdateUserAvatarService

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    storageProvider = new InMemoryStorageProvider()

    updateUserAvatar = new UpdateUserAvatarService(
      usersRepository,
      storageProvider
    )
  })

  it('should be able to update user avatar', async () => {
    const user = await usersRepository.create({
      name: 'henrique',
      email: 'fulano@fulano.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'test.jpg',
    })

    expect(user.avatar).toBe('test.jpg')
  })

  it('should not be able to update user avatar with non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'usuariofake',
        avatarFilename: 'test.jpg',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to delete when updating new user avatar', async () => {
    const deleteFile = jest.spyOn(storageProvider, 'deleteFile')

    const user = await usersRepository.create({
      name: 'user1',
      email: 'user1@email.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'test.jpg',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'newtest.jpg',
    })

    // esperamos que a funcao Delete File seja chamada com o parametro newtest.jpg
    expect(deleteFile).toHaveBeenCalledWith('test.jpg')
    expect(user.avatar).toBe('newtest.jpg')
  })
})
