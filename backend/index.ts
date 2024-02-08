import express, { Response, Express } from "express";
import dotenv from "dotenv";
import connect from "./config/database";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
dotenv.config();

connect();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5173"],
    exposedHeaders: ["Authorization"],
    credentials: true,
}));

app.use('/uploads', (_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/uploads', express.static('uploads'));

app.get("/", (__, res: Response) => {
    return res.json({
        success: true,
        message: "You seem lost...",
    });
});

app.use("/api/user", userRoutes);

app.listen(PORT, () => { console.log(`Server up at ${PORT}`) });