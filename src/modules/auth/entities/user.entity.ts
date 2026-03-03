import { BaseModel } from '@/commons/class/base-entity-model';
import { compare, hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User extends BaseModel {
  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  role: Role;

  async comparePassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }

  async hashPassword(): Promise<void> {
    try {
      const saltRounds = 12;
      const hashedPassword = await hash(this.password, saltRounds);
      this.password = hashedPassword;
    } catch (error) {
      throw new Error('Error hashing password');
    }
  }
}
