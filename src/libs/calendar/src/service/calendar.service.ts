import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { calendarDTO } from 'src/shared/dtos/libs/calendarDTO';
import { Calendar } from '../schemas/Calendar.schema';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel('Calendar') private calendarModel: Model<Calendar>,
  ) {}

  async create(users: calendarDTO) {
    const findOne = await this.calendarModel.findOne({
      $or: [{ name: users.name }, { email: users.email }],
    });
    if (findOne) {
      throw 'Ya existe un registro con este nombre o descripcion.';
    } else {
      return await new this.calendarModel(users).save();
    }
  }
}
