import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './libs/auth/src';
import { CalendarModule } from './libs/calendar/src';
import { UsersModule } from './libs/users/src';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://127.0.0.1:27017/calendar',
      }),
    }),
    AuthModule,
    CalendarModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
