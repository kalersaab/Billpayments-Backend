import { compare, hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';
import userSchema from '@/models/users.model';
import { model, InferSchemaType, Model } from 'mongoose';
import { CreateUserDto, LoginUserDto } from '@/dtos/users.dto';
import { sign } from 'jsonwebtoken';
import { EXPIRES_IN, SECRET_KEY } from '@/config';

@Service()
export class UserService {
  private _user: Model<InferSchemaType<typeof userSchema>>
  constructor() {
    this._user = model('user', userSchema);
  }
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this._user.find();
    return users; 
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await this._user.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto) {
    const findUser: User = await this._user.findOne({ email: userData.email });
    if (findUser) {
      throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    const hashedPassword = await hash(userData.password, 10);
    const createUserData = new this._user({ ...userData, password: hashedPassword });
    await createUserData.save();

    return createUserData;
  }

  public async updateUser(userId: string, userData: CreateUserDto){
    if (userData.email) {
      const findUser: User = await this._user.findOne({ email: userData.email });
      if (findUser && findUser._id != userId) throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById = await this._user.findByIdAndUpdate(userId, { userData });
    if (!updateUserById) throw new HttpException(409, "User doesn't exist");

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await this._user.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return deleteUserById;
  }
  public async login (userData: LoginUserDto) {
    const { username, password } = userData
    if(!username || !password) throw new HttpException(400, 'username and password are required')
    const findUser: User = await this._user.findOne({ username: username });
    if (!findUser) throw new HttpException(409, `User doesn't exist`);
   const isPasswordMatching: boolean = await compare(password, findUser.password);
   if (!isPasswordMatching) throw new HttpException(409, 'Password is incorrect');
   const token = sign({ username: findUser.username, id: findUser._id }, SECRET_KEY, { expiresIn: EXPIRES_IN });
   return { token }
  }
}
