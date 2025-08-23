import express from "express"
import multer from "multer";
import{initializeUpload,uploadChunk,completeUpload, uploadToDb} from "../controllers/multipartupload.controller.js"
const upload = multer();
const router = express.Router()

// Route for initializing upload
router.post("/initialize",upload.none(),initializeUpload);
// Route for uploading individual chunks
router.post("/",upload.single("chunk"),uploadChunk);
// Route for completing the upload
router.post("/complete",completeUpload);
// Route for uploading videoDetails to db
router.post("/uploadToDB",uploadToDb);

export default router;