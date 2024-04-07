import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, './uploads')
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date().toString() + file.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
});

const upload = multer({ storage: storage });

export default upload;
