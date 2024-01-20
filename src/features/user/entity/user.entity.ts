import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceEntity } from '../../device/entity/device.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Column({ type: 'varchar', name: 'login' })
  login: string;

  @Column({ type: 'varchar', name: 'password' })
  password: string;

  @Column({ type: 'timestamp', name: 'createdat' })
  createdAt: Date;

  @Column({ type: 'uuid', name: 'codeconfirmation' })
  codeConfirmation: string;

  @Column({ type: 'boolean', default: false, name: 'isconfirmed' })
  isConfirmed: boolean;

  @OneToMany(() => DeviceEntity, (d) => d.users)
  devices: DeviceEntity[];
}
