import { Request, Response } from "express";

import multer from "multer";

const storage = multer.diskStorage({
  destination: "./media",
  filename: (req, file, cb) => {
    cb(null, `${+new Date()}${file.originalname}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error("Please upload a pdf file"));
  }
  console.log("first");
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: fileFilter,
}).single("profileImg");
