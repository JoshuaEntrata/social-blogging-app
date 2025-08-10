import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { articleRoutes, userRoutes } from "./routes";

const app = express();
const PORT = 5000;
dotenv.config();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", articleRoutes);
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
