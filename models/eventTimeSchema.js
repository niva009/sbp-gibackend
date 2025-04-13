const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const speakerSchema = new Schema({
  name: String,
  designation: String,
}, { _id: false });

const topicSchema = new Schema({
  title: String,
  speaker: speakerSchema,
}, { _id: false });

const sessionSchema = new Schema({
  timeSlot: String,
  sessionTitle: String,
  sessionNote: String,
  chairpersons: [String],
  topics: [topicSchema],
}, { _id: false });

const dayScheduleSchema = new Schema({
  day: String, // e.g., 'Day 1'
  date: String, // e.g., '10 May 2025'
  sessions: [sessionSchema],
});

module.exports = mongoose.models.EventTime || mongoose.model('EventTime', dayScheduleSchema);
