import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'posts' })
export class PostsSaEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'title' })
  title: string;

  @Column({ type: 'varchar', name: 'shortdescription' })
  shortDescription: string;

  @Column({ type: 'varchar', name: 'content' })
  content: string;

  @Column({ type: 'uuid', name: 'blogid' })
  blogId: string;

  @Column({ type: 'varchar', name: 'blogname' })
  blogName: string;

  @Column({ type: 'varchar', name: 'createdat' })
  createdAt: string;
}
