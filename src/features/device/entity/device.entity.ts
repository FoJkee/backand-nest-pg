import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity({ name: 'devices' })
export class DeviceEntity {
  @PrimaryColumn({ type: 'uuid', name: 'userid' })
  userId: string;

  @Column({ type: 'uuid', name: 'deviceid' })
  deviceId: string;

  @Column({ type: 'varchar', name: 'devicename' })
  deviceName: string;

  @Column({ type: 'varchar', name: 'ip' })
  ip: string;

  @Column({ type: 'timestamp', name: 'lastactivedate' })
  lastActiveDate: Date;

  @ManyToOne(() => UserEntity, (u) => u.devices)
  @JoinColumn({ name: 'userid' })
  users: UserEntity;
}
