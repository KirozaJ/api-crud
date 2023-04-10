import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity'


describe('UsersController', () => {
  let controller: UsersController;

  ////////////////// Define our mock user object \\\\\\\\\\\\\\\\\\\\\\\
  const mockUser = () => {
    return {
      id: 1,
      name: 'Jose',
      email: 'Jose@gmail.com',
    };}

  ////////////////// Define a mock user service \\\\\\\\\\\\\\\\\\\\\\\
  const mockUsersService = {
    create: jest.fn(user => {
      return {
        id: Date.now(),
        ...user
      }
    }),
    update: jest.fn((id, user) => ({
      id, 
      ...user
    })),
    delete: jest.fn((id) => ({
      id
    })),
    findOne: jest.fn((id) => {
      return {id}
    }), 
    findall: jest.fn(() => [
      {name: 'test', email: 'test@example.com'},
      {name: 'test2', email: 'test2@example.com'}
    ])
  };

  beforeEach(async () => {
    ////////////////// Create a new test module \\\\\\\\\\\\\\\\\\\\
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();
    ////////////////// Instance of the user controller \\\\\\\\\\\\\\\\\
    controller = module.get<UsersController>(UsersController);
    
  });
   ////////////////// Start tests \\\\\\\\\\\\\\\\\\\\\\\\\

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should create a new user', async () => {
    const user = await controller.create(mockUser());
    expect(user).toEqual({
      name: expect.any(String),
      id: expect.any(Number),
      email: expect.any(String),
    });
  })

  it('Should modify a current user', async () => {
    const user = await controller.update(1, mockUser());

    expect(user).toEqual({
      id: 1,
      ...mockUser()
    });
  })

  it('Should remove a user', async () => {
    await controller.delete(2);
    expect(mockUsersService.delete).toBeCalledWith(2);
  });

  it('Should return an array of users', async () => {
    const result: User[] = await controller.findAll();
    expect(result).toBeInstanceOf(Array);
  });

  it ('Should return an user', async () => 
  { 
    const result = await controller.findOne(mockUser().id);
    expect(result).toBeInstanceOf(Object);
  })
});
  
