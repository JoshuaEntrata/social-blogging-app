import express from "express";
import dotenv from "dotenv";
import { articleRoutes, userRoutes } from "./routes";

const app = express();
const PORT = 5000;
dotenv.config();

app.use(express.json());
app.use("/api", articleRoutes);
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
