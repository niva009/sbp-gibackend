const express = require('express');
const router = express.Router();



    const { createEventTime, updateEventTime ,viewEventTime,vieSingleEvent } = require('../controllers/eventTimeController');


router.post('/event-time', createEventTime);

router.put('/event-time/:id', updateEventTime);

router.get('/event-time', viewEventTime);

router.get('/event-time/:id', vieSingleEvent);


module.exports = router;
