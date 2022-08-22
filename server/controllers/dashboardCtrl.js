const { Donor } = require('./../models/Donor');
const { History } = require('./../models/History');
const { Event } = require('./../models/Event');

const dashboardCtrl = {
  getHomeDashboard: async (req, res) => {
    try {
      const donorActive = await Donor.find({
        status: 'verified',
      }).countDocuments();
      const registryDonation = await History.find().countDocuments();
      const numberEvent = await Event.find().countDocuments();

      return res.status(200).json({
        donorActive,
        registryDonation,
        numberEvent,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getDonorDashboard: async (req, res) => {
    try {
      const events = await Event.find({
        user: req.user._id,
        $year: { createdAt: new Date().toISOString() }, // expected output: 2011-10-05T14:48:00.000Z
      });
      const eventMonth = [];
      const monthlyEvent = [];

      events.forEach((item) => {
        const monthName = new Intl.DateTimeFormat('en-US', {
          month: 'long', // →  December
        }).format(item.createdAt);

        if (!eventMonth.includes(monthName)) {
          eventMonth.push(monthName);
          monthlyEvent.push({ month: monthName, count: 0 });
        }
      });

      events.forEach((item) => {
        const monthName = new Intl.DateTimeFormat('en-US', {
          month: 'long',
        }).format(item.createdAt);
        monthlyEvent.forEach((data) => {
          if (data.month === monthName) {
            data.count++;
          }
        });
      });
      return res.status(200).json({ monthlyEvent });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = dashboardCtrl;
