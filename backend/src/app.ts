import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import announcementRoutes from "./routes/announcementRoutes";

const app: Application = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("School Management API is running");
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/announcements", announcementRoutes);

export default app;
