import cors from "cors";
import express from "express";
import { registerRoutes } from "./routes";
import { errorHandler } from "./middleware/error-handler";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

registerRoutes(app);

app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 4000);

app.listen(PORT, () => {
  console.log(`Kingsman backend listening on port ${PORT}`);
});
