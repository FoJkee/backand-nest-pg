import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'blogs' })
export class BlogsSaEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'varchar' })
  description: string;
  @Column({ type: 'varchar' })
  websiteUrl: string;
  @Column({ type: 'varchar' })
  createdAt: string;
  @Column({ type: 'boolean', default: false })
  isMembership: boolean;
}
