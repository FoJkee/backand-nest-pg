import { IsEnum, IsString } from 'class-validator';
import { myStatusView } from '../../sa/models/posts.sa.models';

export class LikesDto {
  @IsEnum(myStatusView)
  @IsString()
  likeStatus: myStatusView;
}
