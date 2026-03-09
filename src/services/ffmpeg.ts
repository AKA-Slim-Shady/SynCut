// src/services/assetService.ts (bottom section)

export const ffmpegService = {
  resolutionReduce: async (inputVideoPath: string) => {
    const outputPath = inputVideoPath.replace(/\.[^/.]+$/, "") + "_proxy.mp4";

    const command = [
      "ffmpeg",
      "-y", // FIX 1: Automatically overwrite files so the process doesn't hang!
      "-i",
      inputVideoPath, // FIX 2: Actually use the variable passed into the function
      "-vf",
      "scale=-2:360",
      "-c:v",
      "libx264",
      "-crf",
      "23",
      "-c:a",
      "copy",
      outputPath,
    ];

    console.log(`[FFmpeg] Starting proxy generation: ${command.join(" ")}`);

    const process = Bun.spawn(command, {
      stderr: "pipe",
    });

    const stderr = await new Response(process.stderr).text();
    const exitCode = await process.exited;

    if (exitCode !== 0) {
      throw new Error(`FFmpeg failed: ${stderr}`);
    }

    console.log(`[FFmpeg] Proxy created successfully at: ${outputPath}`);
    return outputPath;
  },
};
