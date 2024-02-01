// export class QueryDto {
//   @IsString()
//   sortBy: string = 'createdAt';
//   @IsString()
//   sortDirection: string = 'desc';
//   @IsNumber()
//   @IsOptional()
//   @Type(() => Number)
//   pageNumber: number = 1;
//   @IsNumber()
//   @IsOptional()
//   @Type(() => Number)
//   pageSize: number = 10;
// }
//
// export const pagination = (queryDto: QueryDto) => {
//   const sortBy = queryDto.sortBy ? queryDto.sortBy.toString() : 'createdAt';
//   const pageSize = queryDto.pageSize ? +queryDto.pageSize : 10;
//   const pageNumber = queryDto.pageNumber ? +queryDto.pageNumber : 1;
//   const sortDirection =
//     queryDto.sortDirection && queryDto.sortDirection.toString() === 'asc'
//       ? 'asc'
//       : 'desc';
//   return { sortBy, pageSize, pageNumber, sortDirection };
// };

export class PaginationView<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;
  constructor(
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T,
  ) {
    this.pagesCount = pagesCount;
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.items = items;
  }
}

export class PaginationModelsView {
  constructor(
    public pageNumber: number,
    public pageSize: number,
    public sortBy: string,
    public sortDirection: string,
    public searchLoginTerm?: string,
    public searchEmailTerm?: string,
    public searchNameTerm?: string,
  ) {}
}
