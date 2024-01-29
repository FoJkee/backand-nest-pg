import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

//todo refactor
@Entity({ name: 'devices' })
export class DeviceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'deviceid' })
  deviceId: string;

  @Column({ type: 'varchar', name: 'devicename' })
  title: string;

  @Column({ type: 'varchar', name: 'ip' })
  ip: string;

  @Column({ type: 'uuid', name: 'userid' })
  userId: string;

  @Column({ type: 'varchar', name: 'lastactivedate' })
  lastActiveDate: string;

  // @ManyToOne(() => UserEntity, (user) => user.devices)
  // user: UserEntity;
}
