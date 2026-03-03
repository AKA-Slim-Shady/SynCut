// src/services/assetService.ts
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

export const assetService = {
  getAsset: async (fileId: string, fileName: string, accessToken: string) => {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

    console.log(`[Asset Service] Fetching ${fileName} from Google Drive...`);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`Drive API Error: ${response.statusText}`);
    }

    // 1. Ensure the /assets directory exists on your local machine
    const dirPath = join(process.cwd(), "videos");
    await mkdir(dirPath, { recursive: true });

    // 2. Define the save path
    const filePath = join(dirPath, `${fileId}-${fileName}`);

    // 3. Save the file using Bun's ultra-fast native writer
    await Bun.write(filePath, await response.arrayBuffer());

    console.log(`[Asset Service] Success! Saved to ${filePath}`);
    return filePath;
  },
};
