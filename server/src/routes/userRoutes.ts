import express, { Request, Response } from "express";

const router = express.Router();

router.post("/users/login", (req: Request, res: Response) => {
  // Authentication
});

router.post("/users", (req: Request, res: Response) => {
  // Registration
});

router.get("/users", (req: Request, res: Response) => {
  // Get Current User
  res.send("Get Current User Endpoint");
});

router.put("/users", (req: Request, res: Response) => {
  // Update User
});

router.get("/profiles/:username", (req: Request, res: Response) => {
  // Get Profile
});

router.post("/profiles/:username/follow", (req: Request, res: Response) => {
  // Follow User
});

router.delete("/profiles/:username/follow", (req: Request, res: Response) => {
  // Unfollow User
});

export { router as userRoutes };
