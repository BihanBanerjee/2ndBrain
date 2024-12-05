import express from 'express';
import { verifyToken } from '../utils/verifyUser';
import { deleteLink, getLink, postLink } from '../controllers/brain.controller';

const router = express.Router();

router.post('/share', verifyToken, postLink);
router.delete('/share', verifyToken, deleteLink);
router.get('/:shareLink', getLink);

export default router;