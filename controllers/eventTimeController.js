const EventTime = require('../models/eventTimeSchema');





const createEventTime = async (req, res) => {
    try {
      const eventData = req.body;


      console.log("event time", eventData)
  
      if (!eventData.day || !eventData.date || !eventData.sessions) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const event = new EventTime(eventData);
      await event.save();
  
      res.status(201).json({ message: 'Event time saved successfully', data: event });
    } catch (err) {
      console.error('Create EventTime Error:', err);
      res.status(500).json({ message: 'Server error while saving event time', error: err.message });
    }
  };
  
  // Update an existing EventTime by ID
  const updateEventTime = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const updatedEvent = await EventTime.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true
      });
  
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event time not found' });
      }
  
      res.status(200).json({ message: 'Event time updated successfully', data: updatedEvent });
    } catch (err) {
      console.error('Update EventTime Error:', err);
      res.status(500).json({ message: 'Server error while updating event time', error: err.message });
    }
  };

  const viewEventTime = async (req, res) => {
    try {
      const eventTimes = await EventTime.find();
  
      if (!eventTimes || eventTimes.length === 0) {
        return res.status(404).json({ message: 'No event times found' });
      }
  
      res.status(200).json({ message: 'Event times retrieved successfully', data: eventTimes });
    } catch (err) {
      console.error('View EventTime Error:', err);
      res.status(500).json({ message: 'Server error while retrieving event times', error: err.message });
    }
  }

  const vieSingleEvent = async (req, res) => {

    try {
      const { id } = req.params;
  
      const eventTime = await EventTime.findById(id);
  
      if (!eventTime) {
        return res.status(404).json({ message: 'Event time not found' });
      }
  
      res.status(200).json({ message: 'Event time retrieved successfully', data: eventTime });
    } catch (err) {
      console.error('View Single EventTime Error:', err);
      res.status(500).json({ message: 'Server error while retrieving event time', error: err.message });
    }
  }
  
  module.exports = {
    createEventTime,
    updateEventTime,
    viewEventTime,
    vieSingleEvent
  };



