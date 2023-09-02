/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export class calendarDTO {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
}

