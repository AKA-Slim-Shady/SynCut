//index.ts
import express from "express";
import homeRouter from "./src/routes/homeRoutes";
import assetRouter from "./src/routes/assetRoutes";
import cors from "cors";

const app = express();
const port = 8080;

app.use(
  express.json(),
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
  homeRouter,
  assetRouter,
);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
