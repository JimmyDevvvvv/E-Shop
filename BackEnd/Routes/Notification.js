const express = require('express');
const notificationController = require('../controllers/Notification'); // Adjust path
const { authenticateToken ,authorizeAdmin}= require('../MiddleWare/Authentication_Handler');

const router = express.Router();

router.post('/create', authenticateToken, notificationController.createNotification);
router.get('/get', authenticateToken, notificationController.getNotifications);
router.delete('/delete/:notificationId', authenticateToken, notificationController.deleteNotification);

module.exports = router;
