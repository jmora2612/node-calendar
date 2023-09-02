/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type CalendarDocument = Calendar & Document;

@Schema()
export class Calendar {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  notes: string;

  @Prop({ required: true, type: Date })
  start: Date;

  @Prop({ required: true, type: Date })
  end: Date;

  // @Prop({ required: true, type: String })
  // bgColor: string;

  @Prop({ type: mongoose.Types.ObjectId, required: true, index: true })
  user: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CalendarSchema = SchemaFactory.createForClass(Calendar);
