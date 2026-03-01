//homeRoutes.ts
import { Router } from "express";
import { homeController } from "../controller/homeController";

const homeRouter = Router();

homeRouter.get("/", homeController.getWelcomeMessage);

export default homeRouter;
