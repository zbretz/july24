
const Agenda = require('agenda');

const agenda = new Agenda({ db: { address: 'mongodb+srv://zach:zach@rideshare.uulxsfp.mongodb.net/agenda' } });

console.log('agewnda start 1')

// define job
agenda.define('send event reminder', async job => {
//   const { eventId } = job.attrs.data;
//   const event = await Event.findById(eventId);
//   if (!event) return;

 return null

//   console.log(`Sent reminder for event "${null}"`);
});

module.exports = agenda;

