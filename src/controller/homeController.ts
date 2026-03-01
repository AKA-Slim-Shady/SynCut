//homeController.ts
import type { Request, Response, NextFunction } from "express";
import { homeService } from "../services/homeService";

export const homeController = {
  getWelcomeMessage: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await homeService.getHomeData();
      res.send(data.message);
    } catch (error) {
      next(error);
    }
  },
};
