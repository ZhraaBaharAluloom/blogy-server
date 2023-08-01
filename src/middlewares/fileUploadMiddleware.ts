import multer from "multer";

export const upload = multer({
  dest: "media/",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a pdf file"));
    }
    cb(null, true);
  },
});
