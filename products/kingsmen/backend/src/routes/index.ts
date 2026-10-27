import { Express } from "express";
import { realmRouter } from "./realms";

export function registerRoutes(app: Express) {
  app.use("/realms", realmRouter);
}
