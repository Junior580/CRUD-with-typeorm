import AppError from '@shared/errors/AppError'
import { User } from '../infra/typeorm/entities/Users'
import { IUsersRepository } from '../repositories/interfaces/IUserRepository'
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface ICreateUserRequest {
  name: string
  email: string
  password: string
}

type ICreateUserResponse = User

export class CreateUserService {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private hashProvider: IHashProvider,
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    name,
    email,
    password,
  }: ICreateUserRequest): Promise<ICreateUserResponse> {
    const userExists = await this.usersRepository.findOneByEmail(email)

    if (userExists) {
      throw new AppError('User already exists', 400)
    }

    const hashedPass = await this.hashProvider.generateHash(password)

    const user = this.usersRepository.create({
      email,
      name,
      password: hashedPass,
    })

    await this.cacheProvider.invalidatePrefix('providers-list')

    return user
  }
}
