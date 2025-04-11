const express = require("express")
const EventRouter = express.Router();
const {createEventInformation,updateEventLocation,updateOrganiser,updateEvent,updateTicket,publishEvent,getEvent,showAllEvents, deleteEvent} = require("../controllers/eventController");
const upload = require('../middleware/upload');



EventRouter.post('/createevent', createEventInformation);
EventRouter.put('/updateeventlocation/:id', updateEventLocation);
EventRouter.put('/updateorganiser/:id', upload.single('organiser_logo'), updateOrganiser);
EventRouter.put('/updateevent/:id',upload.array("images", 10), updateEvent);
EventRouter.put('/updateticket/:id', updateTicket);
EventRouter.put('/publishevent/:id',upload.single("event_banner"), publishEvent);
EventRouter.get('/show-event/:id', getEvent);   
EventRouter.get('/showallevents', showAllEvents);
EventRouter.delete('/deleteevent/:id', deleteEvent);



module.exports = EventRouter;   