import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginValidation } from '../validations/AuthValidation';
import { Response } from 'express';
import { URLS } from 'src/shared/urls/libs/urls';
import { AuthService } from '../service/auth.service';

@ApiTags('Auth')
@Controller()
//@ApiBearerAuth('JWT-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(URLS.login)
  async login(@Body() login: LoginValidation, @Res() res: Response) {
    await this.authService
      .login(login)
      .then((result: any) => {
        const response = {
          status: 'success',
          data: result,
          message: 'Usuario logeado de forma exitosa.',
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

  @Post(URLS.refreshToken)
  async refreshToken(@Body() login: LoginValidation, @Res() res: Response) {
    await this.authService
      .refreshToken(login)
      .then((result: any) => {
        const response = {
          status: 'success',
          data: result,
          message: 'Refresh del token exitoso.',
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
