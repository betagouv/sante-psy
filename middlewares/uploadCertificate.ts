import multer from 'multer';

// TODO put in env var
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const uploadCertificate = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
});

export default uploadCertificate;
