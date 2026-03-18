import multer from "multer";

const upload = multer({ dest: 'uploads/' });

export const multerSingleMid = upload.single('file');
