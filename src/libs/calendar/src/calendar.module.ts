import { Module } from '@nestjs/common';
import { CalendarSchema } from './schemas/Calendar.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CalendarController } from './controller/calendar.controller';
import { CalendarService } from './service/calendar.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Calendar', schema: CalendarSchema }]),
  ],
  providers: [CalendarService],
  controllers: [CalendarController],
  exports: [MongooseModule, CalendarService],
})
export class CalendarModule {}
