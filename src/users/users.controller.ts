import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Get all users
    @Get()
    async findAll(): Promise<User[]> {
        const users = await this.usersService.findall();
     //   console.log(users);
        return users;
    }

    // Get one user by id
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        // Find the user id 
        const user = await this.usersService.findOne(id);
        // Throw error if not found
        if (!user) {
            throw new Error('User not found');
        } else {
            return user;
        }
    }

    // Create a new user
    @Post()
    async create(@Body() user: User): Promise<User> {
        return await this.usersService.create(user);
    }

    // Update an existing user
    @Put(':id')
    async update(@Param('id') id: number, @Body() user: User): Promise<User> {
        return this.usersService.update(id, user);
    }

    // Delete an user by id
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void | string> {
        // Find the user by id
        const user = await this.usersService.findOne(id);
        // Return error if not found
        if (!user) return 'User not found';
        // Delete the user
        return await this.usersService.delete(id);
    }
}
