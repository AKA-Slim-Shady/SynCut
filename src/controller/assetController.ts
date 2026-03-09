// src/controller/assetController.ts
import { assetService } from "../services/assetService";
import { ffmpegService } from "../services/ffmpeg";
import type { Request, Response } from "express";

export const assetController = {
  postAsset: async (req: Request, res: Response) => {
    try {
      const { fileId, fileName, accessToken } = req.body;

      console.log(`[Asset Controller] Request received for: ${fileName}`);

      let sanitizedFileName = fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

      // 1. Capture the actual saved path returned by the service!
      const downloadedFilePath = await assetService.getAsset(
        fileId as string,
        sanitizedFileName as string,
        accessToken as string,
      );

      // 2. Pass that exact path to FFmpeg
      const outputVideoPath =
        await ffmpegService.resolutionReduce(downloadedFilePath);

      res.status(200).json({
        success: true,
        message: "Asset downloaded locally and proxy generated!",
        rawVideo: downloadedFilePath,
        proxyVideo: outputVideoPath,
      });
    } catch (error: any) {
      console.error("[Asset Controller Error]:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  proxyGen: async (req: Request, res: Response) => {
    const inputVideoPath = req.body.inputVideoPath;
    if (!inputVideoPath) {
      return res
        .status(400)
        .json({ success: false, message: "Input video path is required." });
    }

    try {
      const outputVideoPath =
        await ffmpegService.resolutionReduce(inputVideoPath);

      return res.status(200).json({
        success: true,
        message: "Proxy generated successfully!",
        path: outputVideoPath,
      });
    } catch (error: any) {
      console.error("[Asset Controller Error]:", error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  },
};
