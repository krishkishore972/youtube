import expres from 'express'
import sendMessageToKafka from '../controllers/kafkapublisher.controller.js';

const router = expres.Router();

router.post('/',sendMessageToKafka);

export default router;

