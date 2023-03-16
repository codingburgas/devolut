import multer from "multer";
import nextConnect from "next-connect";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect();

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatars");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname
    );
  },
});

let upload = multer({
  storage: storage,
});

let uploadFile = upload.single("file");
handler.use(uploadFile);
handler.post(async (req, res) => {
  res.status(200).send();
});

export default handler;
