import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { calendarDTO } from 'src/shared/dtos/libs/calendarDTO';
import { Calendar } from '../schemas/Calendar.schema';
import mongoose, { Model } from 'mongoose';
@Injectable()
export class CalendarService {
  constructor(
    @InjectModel('Calendar') private calendarModel: Model<Calendar>,
  ) {}

  async create(data: calendarDTO) {
    const { start, end, user } = data;
    data.user = new mongoose.Types.ObjectId(user);
    data.start = new Date(start);
    data.end = new Date(end);

    const newDate = new Date(data.start);
    const newDateEnd = new Date(data.end);

    const findOne = await this.findOneDate(data.user, newDate, newDateEnd);

    if (findOne) throw 'Ya hay un evento en esta fecha y hora';

    return await new this.calendarModel(data).save();
  }

  async update(id, calendar: calendarDTO) {
    const { start, end, user } = calendar;
    calendar.start = new Date(start);
    calendar.end = new Date(end);
    const newDate = new Date(calendar.start);
    const newDateEnd = new Date(calendar.end);
    const findOne = await this.calendarModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (findOne) {
      const findOneDate = await this.findOneDate(
        findOne.user,
        newDate,
        newDateEnd,
        findOne._id,
      );

      if (findOneDate) throw 'Ya hay un evento en esta fecha y hora';

      return await this.calendarModel
        .findByIdAndUpdate(id, calendar, { new: true })
        .exec();
    }
  }

  async findOneDate(user, newDate, newDateEnd, id?) {
    const find = {
      user: user,
      $or: [
        {
          $and: [
            { start: { $lte: newDate }, end: { $gte: newDate } },
            { start: { $lte: newDateEnd }, end: { $gte: newDateEnd } },
          ],
        },
        {
          $and: [
            { start: { $lte: newDate }, end: { $gte: newDate } },
            { start: { $lte: newDateEnd }, end: { $lte: newDateEnd } },
            { end: { $gte: newDate } },
          ],
        },
        {
          $and: [
            { start: { $gte: newDate }, end: { $lte: newDate } },
            { start: { $lte: newDateEnd }, end: { $gte: newDateEnd } },
          ],
        },
      ],
    };

    if (id) {
      Object.assign(find, { _id: { $ne: id } });
    }
    return await this.calendarModel.findOne(find);
  }
}
