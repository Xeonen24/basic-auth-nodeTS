import express, { Response, Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect";
import router from "./routes/index";
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    exposedHeaders: ["Authorization"],
    credentials: true,
  })
);

app.get("/", (__, res: Response) => {
  return res.json({
    success: true,
    message: "You seem lost...",
  });
});

app.use("/api/user", router.user);

const startServer = async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
