import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeviceEntity } from '../../device/entity/device.entity';
import { BlogsEntity } from '../../sa/entity/blogsEntity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Column({ type: 'varchar', name: 'login' })
  login: string;

  @Column({ type: 'varchar', name: 'password' })
  password: string;

  @Column({ type: 'varchar', name: 'createdat' })
  createdAt: string;

  @Column({ type: 'uuid', name: 'codeconfirmation' })
  codeConfirmation: string;

  @Column({ type: 'boolean', default: false, name: 'isconfirmed' })
  isConfirmed: boolean;

  @OneToMany(() => DeviceEntity, (device) => device.userId)
  devices: DeviceEntity[];

  @OneToMany(() => BlogsEntity, (blog) => blog.userId)
  blogs: BlogsEntity[];
}
