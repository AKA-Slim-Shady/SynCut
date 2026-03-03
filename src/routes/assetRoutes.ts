import { assetController } from "../controller/assetController";
import { Router } from "express";

const assetRouter = Router();

assetRouter.post("/postAsset", assetController.postAsset);
assetRouter.post("/makeProxy", assetController.proxyGen);

export default assetRouter;
