import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { PostReactionModule } from './post-reaction/post-reaction.module';
import { CommentReactionModule } from './comment-reaction/comment-reaction.module';
import { FriendRequestModule } from './friend-request/friend-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('db_host'),
        port: +(config.get('db_port')),
        username: config.get('db_username'),
        password: config.get('db_password'),
        database: config.get('db_name'),
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    UsersModule,
    AuthModule,
    PostModule,
    CommentModule,
    PostReactionModule,
    CommentReactionModule,
    FriendRequestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
