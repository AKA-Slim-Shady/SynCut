import { assetController } from "../controller/assetController";
import { Router } from "express";

const assetRouter = Router();

assetRouter.post("/postAsset", assetController.postAsset);

export default assetRouter;
