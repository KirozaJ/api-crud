import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  const mockUser = () => {
    return {
      id: 1,
      name: 'Jose',
      email: 'Jose@gmail.com',
    };}

  ///////////////////  Create a mock repository \\\\\\\\\\\\\\\\\\\\\\\\\\

  const mockUsersRepository = {
    create: jest.fn().mockImplementation(User => User),
    save: jest.fn().mockImplementation(User => Promise.resolve({id: Date.now(), ...User})),
    update: jest.fn().mockImplementation((id, user) => Promise.resolve({...user})),
    delete: jest.fn(),
    findOne: jest.fn((id) => Promise.resolve(mockUser())),
    find: jest.fn(() => [
      {
        id: 1,
        name: 'Jose',
        email: 'Jose@gmail.com',
      },
      {
        id: 2,
        name: 'Juan',
        email: 'Juan@gmail.com',
      }
    ]
    )
  }
  
  ///////////////// Set the test module \\\\\\\\\\\\\\\\\\\\\\\

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { 
        provide: getRepositoryToken(User),
        useValue:mockUsersRepository
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  ///////////////// Start Tests\\\\\\\\\\\\\\\\\\\\\

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should make a new user and return it', async () => {
    expect(await service.create(mockUser())).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      email: expect.any(String),
    });
  });

  it('Should update a current user', async () => {
    const user = await service.update(1, mockUser());
    expect(user).toEqual(expect.objectContaining({
      id: expect.any(Number),
      ...mockUser(),
    }));
  });

  it('Should find a user by id', async () => {
    const user = await service.findOne(1);
    expect(user).toEqual(expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      email: expect.any(String),
    }));
  })
  
  it('Should return an array of users', async () => {
    const result: User[] = await service.findall();
    expect(result).toBeInstanceOf(Array);
  });

  it('Should delete a user by id', async () => {
    const remove = await service.delete(1);
    expect(remove);
    expect(mockUsersRepository.delete).toHaveBeenCalledWith(1);
  });
});
