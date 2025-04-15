import express from "express";
import { articleRoutes, userRoutes } from "./routes";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/api", articleRoutes);
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
