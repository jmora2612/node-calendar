import { Module } from '@nestjs/common';
import { CalendarSchema } from './schemas/Calendar.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CalendarController } from './controller/calendar.controller';
import { CalendarService } from './service/calendar.service';
import { JwtModule } from '@nestjs/jwt';
const { JWT_KEY } = process.env;
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Calendar', schema: CalendarSchema }]),
    JwtModule.register({
      secret: JWT_KEY,
      signOptions: { expiresIn: '60m', algorithm: 'HS256' },
    }),
  ],
  providers: [CalendarService],
  controllers: [CalendarController],
  exports: [MongooseModule, CalendarService],
})
export class CalendarModule {}
