import { IsEnum } from 'class-validator';
import { ReactionName } from '../enums/reaction-name.enum';

export class PostReactionDto {
    @IsEnum(ReactionName, {
        message: 'reactionName must be one of: like, love, happy, celebrate, insightful, funny',
    })
    reactionName: ReactionName;
}
