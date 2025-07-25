export const editFileName = (req, file, callback) => {
  callback(null, `${Date.now()}-${file.originalname}`);
};
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};