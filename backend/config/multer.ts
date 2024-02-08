import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDirectory = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const profilePhotosDirectory = path.join(__dirname, '../uploads/profilePhotos');

if (!fs.existsSync(profilePhotosDirectory)) {
    fs.mkdirSync(profilePhotosDirectory);
}

const profileStorage = multer.diskStorage({
    destination: function (_, __, cb) {
        cb(null, profilePhotosDirectory);
    },
    filename: function (_, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

export const uploadProfile = multer({
    storage: profileStorage,
}).single('profileImage');
