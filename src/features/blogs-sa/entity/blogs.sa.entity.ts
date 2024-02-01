import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'blogs' })
export class BlogsSaEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'description' })
  description: string;

  @Column({ type: 'varchar', name: 'websiteurl' })
  websiteUrl: string;

  @Column({ type: 'varchar', name: 'createdat' })
  createdAt: string;

  @Column({ type: 'boolean', default: false, name: 'ismembership' })
  isMembership: boolean;
}
