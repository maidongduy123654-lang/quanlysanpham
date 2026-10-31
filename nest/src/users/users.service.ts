import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  email: string;
  password: string; 
}

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId = 1;

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async create(email: string, hashedPassword: string): Promise<User> {
    const user = { id: this.nextId++, email, password: hashedPassword };
    this.users.push(user);
    return user;
  }
}