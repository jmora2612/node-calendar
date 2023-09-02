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
} from '@nestjs/common';

import {
  AuthValidation,
  AuthUpdateValidation,
} from '../validations/CalendarValidation';
import { Response } from 'express';
import { URLS } from 'src/shared/urls/libs/urls';
import { CalendarService } from '../service/calendar.service';

@ApiTags('Calendar')
@Controller('')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @ApiOperation({})
  @ApiBody({ type: AuthValidation })
  @Post(URLS.createCalendar)
  async create(@Body() createdAuth: AuthValidation, @Res() res: Response) {
    await this.calendarService
      .create(createdAuth)
      .then((result: any) => {
        const response = {
          status: 'success',
          data: result,
          message: 'Usuario creado de forma exitosa.',
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
