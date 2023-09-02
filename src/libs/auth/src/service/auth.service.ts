import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Auth } from '../schemas/Auth.schema';
import { UsersService } from 'src/libs/users/src';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private usersModel: Model<Auth>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  login = async ({ email, password }) => {
    const findUsers = await this.usersService.findUserByEmail(email);

    if (!findUsers) throw 'Este correo no existe';

    const validPassword = bcrypt.compareSync(password, findUsers.password);

    if (!validPassword) throw 'Contraseña incorrecta';

    const token = await this.createToken(findUsers).catch((error) => {
      throw { error, status: HttpStatus.BAD_REQUEST };
    });

    return {
      uid: token.user._id,
      name: token.user.name,
      token: token.access_token,
    };
  };

  createToken = async (payload) => {
    const payloadToJson = payload.toJSON();
    delete payloadToJson.password;

    const access_token = this.jwtService.sign(payloadToJson, {
      expiresIn: '2h',
    });

    return { access_token, user: payloadToJson };
  };

  refreshToken = async (payload) => {
    try {
      const access_token = this.jwtService.sign(payload, {
        expiresIn: '24h',
      });
      if (!access_token) {
        throw new Error();
      }

      return { access_token };
    } catch (err) {
      return err;
    }
  };
}
