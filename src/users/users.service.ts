import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){}
  create(createUserDto: CreateUserDto) {
    const newUser = this.prisma.user.create({data: createUserDto})
    return newUser
  }

  findAll() {
    const allUsers = this.prisma.user.findMany();
    return allUsers
  }

  findOne(id: string) {
    const foundUser = this.prisma.user.findUnique({where: {id}})
    if(!foundUser) throw NotFoundException
    return foundUser
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = this.prisma.user.update({where: {id}, data: updateUserDto})
    return updateUser
  }

  remove(id: string) {
    const deleteUser = this.prisma.user.delete({where: {id}})

    return deleteUser
  }
}
