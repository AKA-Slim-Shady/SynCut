// src/controller/assetController.ts
import { assetService } from "../services/assetService";
import type { Request, Response } from "express";

export const assetController = {
  postAsset: async (req: Request, res: Response) => {
    try {
      const { fileId, fileName, accessToken } = req.body;

      console.log(`[Asset Controller] Request received for: ${fileName}`);

      // Strip dangerous characters from the filename
      let sanitizedFileName = fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

      await assetService.getAsset(
        fileId as string,
        sanitizedFileName as string,
        accessToken as string,
      );

      res
        .status(200)
        .json({ success: true, message: "Asset downloaded locally!" });
    } catch (error: any) {
      console.error("[Asset Controller Error]:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
