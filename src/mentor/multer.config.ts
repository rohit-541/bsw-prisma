import {diskStorage } from "multer";
import { Request } from "express";
import * as path from "path";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export const diskOptions: MulterOptions = {
  storage: diskStorage({
    destination: path.join('..',"public"), // Correct folder path
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const newFileName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
      cb(null, newFileName);
    }
  })
};
