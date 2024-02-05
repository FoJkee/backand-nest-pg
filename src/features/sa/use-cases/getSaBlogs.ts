// import { BlogQueryDto } from '../dto/blogs.sa.dto';
// import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
// import { PaginationModelsView } from '../../../setting/pagination.model';
// import { BlogsSaService } from '../api/blogs.sa.service';

// export class GetSaBlogs {
//   constructor(public readonly blogQueryDto: BlogQueryDto) {}
// }
//
// @QueryHandler(GetSaBlogs)
// export class GetSaBlogsHandler implements IQueryHandler<GetSaBlogs> {
//   constructor(private readonly blogsSaService: BlogsSaService) {}
//   async execute(query: GetSaBlogs) {
//     const paginationBlogs: PaginationModelsView = {
//       pageNumber: query.blogQueryDto.pageNumber || 1,
//       pageSize: query.blogQueryDto.pageSize || 10,
//       searchNameTerm: query.blogQueryDto.searchNameTerm || '',
//       sortBy: query.blogQueryDto.sortBy || 'createdAt',
//       sortDirection:
//         query.blogQueryDto.sortDirection === 'asc' ? 'asc' : 'desc',
//     };
//     return await this.blogsSaService.getSaBlogs(paginationBlogs);
//   }
// }
