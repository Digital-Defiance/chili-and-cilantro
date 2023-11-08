import { Request, Response, Router } from 'express';
import { UserService } from '../services/user';
import { validateAccessToken } from '../middlewares/auth0';
import { JwtService } from '../services/jwt';

export const usersRouter = Router();

usersRouter.post('/register', async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    const userService = new UserService();
    await userService.register(email, username, password);
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
    try {
      const jwtService = new JwtService();
      jwtService.authenticateUserAsync(req, res, async (user, auth0User) => {
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
    }
    catch (error) {
      res.status(400).json(error);
    }
  });

export default usersRouter;