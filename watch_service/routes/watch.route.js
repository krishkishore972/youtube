import express from "express"
import watchVideo from "../controllers/watch.controller.js"
import getAllVideos from "../controllers/home.controller.js"

const router = express.Router();

router.get("/home", getAllVideos);
router.get("/:id",watchVideo);


export default router;
