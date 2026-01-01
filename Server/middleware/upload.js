import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
          destination: function (req, file, cb) {
                    const uploadDir = 'uploads/';
                    if (!fs.existsSync(uploadDir)) {
                              fs.mkdirSync(uploadDir, { recursive: true });
                    }
                    cb(null, uploadDir);
          },
          filename: function (req, file, cb) {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
          }
});

const fileFilter = (req, file, cb) => {
          const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
          if (allowedTypes.includes(file.mimetype)) {
                    cb(null, true);
          } else {
                    cb(new Error('Unsupported file type. Allowed: JPG, PNG, PDF, DOC, DOCX'), false);
          }
};

const upload = multer({
          storage: storage,
          fileFilter: fileFilter,
          limits: {
                    fileSize: 10 * 1024 * 1024 // 10MB
          }
});

export default upload;
