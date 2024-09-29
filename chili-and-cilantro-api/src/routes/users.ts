import { Request, Response, Router } from 'express';
import { JwtService } from '../services/jwt';
import { UserService } from '../services/user';
import { authenticateToken } from '../middlewares/authenticate-token';
import { UserModel } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { ICreateUserBasics } from '@chili-and-cilantro/chili-and-cilantro-lib';

export const usersRouter = Router();

usersRouter.post('/register', async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    const userService = new UserService();
    await userService.newUser({
      username: username.trim(),
      email: email.trim(),
    } as ICreateUserBasics, password);
    res.status(201).json({
      message: 'User created successfully',
      email: email,
      username: username,
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

usersRouter.post(
  '/validate',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userService = new UserService();
      const jwtService = new JwtService();
      if (!req.user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(500).json({ message: 'User not found' });
      }
      res
        .status(200)
        .json({ message: 'User validated successfully', user: user });
    } catch (error) {
      res.status(400).json(error);
    }
  },
);

export default usersRouter;
