import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';

import {
  CalendarValidation,
  CalendarUpdateValidation,
} from '../validations/CalendarValidation';
import { Response } from 'express';
import { URLS } from 'src/shared/urls/libs/urls';
import { CalendarService } from '../service/calendar.service';
import { AuthGuard } from 'src/shared/guard/calendar-guard.guard';

@ApiTags('Calendar')
@Controller('')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-authenticate')
  @ApiOperation({})
  @ApiBody({ type: CalendarValidation })
  @Post(URLS.createCalendar)
  async create(
    @Body() createdCalendar: CalendarValidation,
    @Res() res: Response,
  ) {
    await this.calendarService
      .create(createdCalendar)
      .then((result: any) => {
        const response = {
          status: 'success',
          data: result,
          message: 'Evento creado de forma exitosa.',
        };
        res.status(200).send(response);
      })
      .catch((error) => {
        const response = {
          status: 'error',
          message: error,
        };
        res.status(500).send(response);
      });
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-authenticate')
  @ApiOperation({})
  @ApiBody({ type: CalendarUpdateValidation })
  @Put(URLS.updateCalendar)
  async update(
    @Param('id') _id: string,
    @Body() updateValidation: CalendarUpdateValidation,
    @Res() res: Response,
    @Request() req,
  ) {
    await this.calendarService
      .update(_id, updateValidation, req)
      .then((result: any) => {
        const response = {
          status: 'success',
          data: result,
          message: 'Evento actualizado de forma exitosa.',
        };
        res.status(200).send(response);
      })
      .catch((error) => {
        const response = {
          status: 'error',
          message: error,
        };
        res.status(500).send(response);
      });
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-authenticate')
  @ApiOperation({})
  @Get(URLS.listCalendar)
  async getCalendarEvent(@Param('user') user: string, @Res() res: Response) {
    await this.calendarService
      .findAll(user)
      .then((result) => {
        const response = {
          status: 'success',
          data: result,
          message: 'Evento eliminado de forma exitosa.',
        };
        res.status(200).send(response);
      })
      .catch((error) => {
        const response = {
          status: 'error',
          message: error,
        };
        res.status(500).send(response);
      });
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-authenticate')
  @Delete(URLS.deleteCalendar)
  async deleteCalendarEvent(
    @Param('id') _id: string,
    @Res() res: Response,
    @Request() req,
  ) {
    await this.calendarService
      .deleteCalendarEvent(_id, req)
      .then((result) => {
        const response = {
          status: 'success',
          data: result,
        };
        res.status(200).send(response);
      })
      .catch((error) => {
        const response = {
          status: 'error',
          message: error,
        };
        res.status(500).send(response);
      });
  }
}
