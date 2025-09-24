import { getUser, registerNew, login, updateUser } from "../controllers/userController";
import auth from "../middleware/auth";
import { Router } from "express";

const router = Router();

router.post("/register", registerNew);
router.post("/login", login);
router.get("/", auth, getUser);
router.put("/updateProfile", auth, updateUser);

export default router;
