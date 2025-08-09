import { NextFunction, Request, Response } from 'express';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { HttpException } from '@/exceptions/HttpException';

export class UserController {
   private user: UserService;
      constructor() {
        this.user = new UserService();
      }

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.user.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: User = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const createUserData = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: `${req?.body?.email} created Successfully`, status:201 });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData = req.body;
      const updateUserData = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: User = await this.user.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
  public loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      if (!userData.email ||!userData.password) {
        throw new HttpException(400, 'Missing username or password');
      }
      const loginUser = await this.user.login(userData);

      res.status(200).json({ data: loginUser, message: `${userData.email} login successfully` });
      if(!loginUser){
        res.status(404).json({ data: [], message: 'user not found' });
      }
    } catch (error) {
      next(new HttpException(500, error.message));
    }
  }
   public getLoginUserData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginUserId = req.user.id;
      const findLoginUserData = await this.user.meApi(loginUserId);
      if(!findLoginUserData){
        res.status(404).json({ message: "Not found",status:404});
      }
      res.status(200).json({ message: "profile get successfully",status:200, data: findLoginUserData});
    } catch (error) {
      next(new HttpException(500, error.message ||'Something went wrong'));
    }
  };
}
