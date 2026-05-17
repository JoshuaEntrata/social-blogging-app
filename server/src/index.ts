import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { articleRoutes, userRoutes } from "./routes";
import initDB from "./database/init";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
initDB();
app.use("/api", articleRoutes);
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
