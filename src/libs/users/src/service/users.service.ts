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

    if (findOne?.email === email) throw 'Ya existe un registro con este email.';

    const saveUser = await new this.usersModel(users).save();
    const token = await this.createToken({
      _id: saveUser._id,
      name: saveUser.name,
    }).catch((error) => {
      throw { error, status: HttpStatus.BAD_REQUEST };
    });

    return {
      _id: token.user._id,
      name: token.user.name,
      token: token.access_token,
    };
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
    const { name, email, password } = users;
    const findOne = await this.usersModel.findOne({ _id: id });
    const salt = bcrypt.genSaltSync();
    users = { ...users, password: bcrypt.hashSync(users.password, salt) };
    if (findOne) {
      const findOneUsers = await this.usersModel.findOne({
        $or: [{ name }, { email }],
        _id: { $ne: id },
      });

      if (findOneUsers?.email === users.email)
        throw 'Ya existe un registro con este email.';
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
          throw 'El correo ingresado no existe.';
        })();
  }

  async createToken(payload) {
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '2h',
    });

    return { access_token, user: payload };
  }
}
