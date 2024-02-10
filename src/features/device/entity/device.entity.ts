import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

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

  @Column({ type: 'varchar', name: 'lastactivedate' })
  lastActiveDate: string;

  @ManyToOne(() => UserEntity, (user) => user.devices)
  @JoinColumn({ name: 'userid' })
  userId: string;
}
