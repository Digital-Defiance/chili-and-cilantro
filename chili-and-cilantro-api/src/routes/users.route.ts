import { Request, Response, Router } from 'express';
import { UserService } from '../services/userService';
import { validateAccessToken } from '../middlewares/auth0';
import { JwtService } from '../services/jwtService';
import { managementClient } from '../auth0';

export const usersRouter = Router();
const jwtService = new JwtService();

usersRouter.post('/register', async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    await UserService.register(email, username, password);
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
  validateAccessToken,
  async (req: Request, res: Response) => {
    jwtService.authenticateUser(req, res, async (user, auth0User) => {
      if (
        auth0User.email_verified &&
        user.email_verified === false
      ) {
        user.email_verified = true;
        await user.save();
      }
      res
        .status(200)
        .json({ message: 'User validated successfully', user: user });
    });
  },
);

export default usersRouter;