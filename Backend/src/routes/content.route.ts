import express from 'express';
import { createContent, deleteContent, getContent } from '../controllers/content.controller';
import { verifyToken } from '../utils/verifyUser';

const router = express.Router();

router.post('/createContent', verifyToken, createContent);
router.get('/getContent', verifyToken, getContent);
router.delete('/deleteContnet', verifyToken, deleteContent);

export default router;