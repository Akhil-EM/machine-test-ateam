import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
const uploadPath = join(__dirname, '../../uploads', 'images');
// Configure multer storage and file naming
export const multerConfig = {
  storage: diskStorage({
    destination: uploadPath,
    filename: (req, file, callback) => {
      const uniqueSuffix = uuidv4();
      const extension = extname(file.originalname);
      callback(null, `${uniqueSuffix}${extension}`);
    },
  }),
};