import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { usersDTO } from 'src/shared/dtos/libs/usersDTO';
import { Users } from '../schemas/Users.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private usersModel: Model<Users>,
    private jwtService: JwtService,
  ) {}

  async create(users: usersDTO) {
    const { name, email, password } = users;
    const salt = bcrypt.genSaltSync();
    const findOne = await this.usersModel.findOne({
      $or: [{ name }, { email }],
    });

    users.password = bcrypt.hashSync(password, salt);

    if (findOne) {
      throw 'Ya existe un registro con este nombre o descripcion.';
    } else {
      const saveUser = await new this.usersModel(users).save();
      return await this.createToken(saveUser).catch((error) => {
        throw { error, status: HttpStatus.BAD_REQUEST };
      });
    }
  }

  async findAll(request) {
    const query = {};
    const { name, email } = request;
    if (name) {
      query['name'] = name;
    }
    if (email) {
      query['email'] = email;
    }

    const findUsers = await this.usersModel.find(query);

    return findUsers.length
      ? findUsers
      : (() => {
          throw 'No hay usuarios disponibles.';
        })();
  }

  async update(id, users: usersDTO) {
    const findOne = await this.usersModel.findOne({ _id: id });
    const salt = bcrypt.genSaltSync();
    users = { ...users, password: bcrypt.hashSync(users.password, salt) };
    if (findOne) {
      return await this.usersModel
        .findByIdAndUpdate(id, users, { new: true })
        .exec();
    } else {
      throw 'No existe el registro solicitado.';
    }
  }

  async findOne(id) {
    const findUsers = await this.usersModel.findOne({ _id: id });

    return findUsers
      ? findUsers
      : (() => {
          throw 'El registro solicitado no existe.';
        })();
  }

  async findUserByEmail(email) {
    const findUsers = await this.usersModel.findOne({ email });

    return findUsers
      ? findUsers
      : (() => {
          throw 'El registro solicitado no existe.';
        })();
  }

  async createToken(payload) {
    const payloadToJson = payload.toJSON();
    delete payloadToJson.password;

    const access_token = this.jwtService.sign(payloadToJson, {
      expiresIn: '2h',
    });

    return { access_token, user: payloadToJson };
  }
}
