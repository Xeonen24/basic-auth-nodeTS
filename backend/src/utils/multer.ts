import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = path.join(__dirname, `../../${process.env.UPLOAD_PATH_STRING}`);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const profileStorage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (_, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

export const uploadProfile = multer({
  storage: profileStorage,
}).single("profileImage");
