/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export class calendarDTO {
  _id?: mongoose.Types.ObjectId;
  title: string;
  notes: string;
  start: Date;
  end: Date;
  user?: string | mongoose.Types.ObjectId;
}

