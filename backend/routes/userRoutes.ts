import { getUser, registerNew, login, updateUser } from "../controllers/userController";
import auth from "../middleware/auth";
import { uploadProfile } from "../config/multer";

const router = require('express').Router();

router.post('/register', uploadProfile, registerNew);
router.post('/login', login);
router.get('/user', auth, getUser);
router.put('/updateProfile', auth, uploadProfile, updateUser);

export default router;