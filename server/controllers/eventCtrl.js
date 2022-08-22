const { Event } = require('./../models/Event');
const { Donor } = require('./../models/Donor');
const { History } = require('./../models/History');

const Pagination = (req) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 3;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const eventCtrl = {
  getFilteredEvents: async (req, res) => {
    const { skip, limit } = Pagination(req);

    const categoryQuery = [];
    if (req.query.category) {
      if (typeof req.query.category === 'string') {
        categoryQuery.push(req.query.category);
      } else {
        for (let i = 0; i < req.query.category.length; i++) {
          categoryQuery.push(req.query.category[i]);
        }
      }
    }

    const locationQuery = [];
    if (req.query.location) {
      if (typeof req.query.location === 'string') {
        locationQuery.push(req.query.location);
      } else {
        for (let i = 0; i < req.query.location.length; i++) {
          locationQuery.push(req.query.location[i]);
        }
      }
    }

    const dataAggregation = [
      {
        $lookup: {
          from: 'donors',
          localField: 'user',
          foreignField: 'user',
          as: 'donor',
        },
      },
      { $unwind: '$donor' },
      { $skip: skip },
      { $limit: limit },
    ];
    // { $count: <string> } <string> is the name of the output field which has the count as its value.
    const countAggregation = [{ $count: 'count' }];

    if (categoryQuery.length !== 0) {
      dataAggregation.unshift({
        // The $in operator selects the documents where the value of a field
        // equals any value in the specified arrays
        $match: {
          category: { $in: categoryQuery },
        },
      });
      countAggregation.unshift({
        $match: {
          category: { $in: categoryQuery },
        },
      });
    }

    if (locationQuery.length !== 0) {
      dataAggregation.unshift({
        // The $in operator selects the documents where the value of a field
        // equals any value in the specified arrays
        $match: {
          location: { $in: locationQuery },
        },
      });

      countAggregation.unshift({
        $match: {
          location: { $in: locationQuery },
        },
      });
    }

    if (req.query.sort) {
      if (req.query.urutkan === 'latest') {
        dataAggregation.push({ $sort: { createdAt: -1 } });
        countAggregation.push({ $sort: { createdAt: -1 } });
      } else {
        const year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let date = new Date().getDate();

        if (month.toString().length === 1) {
          month = `0${month}`;
        }
        if (date.toString().length === 1) {
          date = `0${date}`;
        }

        dataAggregation.push({
          $match: {
            date: new Date(`${year}-${month}-${date}T00:00:00.000+00:00`),
          },
        });

        countAggregation.push({
          $match: {
            date: new Date(`${year}-${month}-${date}T00:00:00.000+00:00`),
          },
        });
      }
    }
    try {
      const data = await Event.aggregate([
        {
          $facet: {
            totalData: dataAggregation,
            totalCount: countAggregation,
          },
        },
        // Example                               Results
        // { $arrayElemAt: [ [ 1, 2, 3 ], 0 ] }     1
        {
          $project: {
            count: { $arrayElemAt: ['$totalCount.count', 0] },
            totalData: 1,
          },
        },
      ]);
      const events = data[0].totalData;
      const eventsCount = data[0].count;

      let totalPage = 0;

      if (eventsCount % limit === 0) {
        totalPage = eventsCount / limit;
      } else {
        totalPage = Math.floor(eventsCount / limit) + 1;
      }

      return res.status(200).json({ events, totalPage });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  createEvent: async (req, res) => {
    try {
      const {
        name,
        location,
        date,
        expireRegistration,
        category,
        timeStart,
        timesUp,
        capacity,
        description,
        picture,
      } = req.body;

      if (
        !name ||
        !location ||
        !date ||
        !category ||
        !expireRegistration ||
        !timeStart ||
        !timesUp ||
        !description ||
        !capacity ||
        !picture
      )
        return res.status(400).json({
          msg: 'Please provide every field.',
        });

      const findDonor = await Donor.findOne({
        user: req.user._id,
        status: 'verified',
      });
      if (!findDonor)
        return res
          .status(400)
          .json({ msg: 'Donor profile has not been verified.' });

      const newEvent = new Event({
        user: req.user._id,
        name,
        location,
        date,
        expireRegistration,
        category,
        timeStart,
        timesUp,
        capacity,
        description,
        picture,
      });
      await newEvent.save();

      return res.status(200).json({
        msg: 'Event saved successfully.',
        event: newEvent,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  searchEvent: async (req, res) => {
    try {
      const events = await Event.aggregate([
        {
          $match: { name: { $regex: req.query.event } },
        },
        {
          $lookup: {
            from: 'donors',
            localField: 'user',
            foreignField: 'user',
            as: 'donor',
          },
        },
        { $unwind: '$donor' },
      ]);
      return res.status(200).json({ events });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const findEvent = await Event.find({
        id: req.params.id,
        user: req.user._id,
      });
      if (!findEvent) return res.status(404).json({ msg: 'Event not found.' });

      const event = await Event.findByIdAndDelete(req.params.id);
      if (!event) return res.status(404).json({ msg: 'Event not found.' });

      return res.status(200).json({ msg: 'Event data has been deleted.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getEventByDonor: async (req, res) => {
    try {
      const events = await Event.aggregate([
        { $match: { user: req.user._id } },
        {
          $lookup: {
            from: 'histories',
            let: { history_id: '$registrant' },
            pipeline: [
              { $match: { $expr: { $in: ['$_id', '$$history_id'] } } },
              {
                $lookup: {
                  from: 'users',
                  localField: 'user',
                  foreignField: '_id',
                  as: 'user',
                },
              },
              { $unwind: '$user' },
            ],
            as: 'registrant',
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      return res.status(200).json({ events });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getEventByUser: async (req, res) => {
    try {
      const events = await History.find({ user: req.user._id })
        .sort('-createdAt')
        .populate('event');
      return res.status(200).json({ events });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getEvent: async (req, res) => {
    try {
      const events = await Event.aggregate([
        {
          $lookup: {
            from: 'donors',
            localField: 'user',
            foreignField: 'user',
            as: 'donor',
          },
        },
        {
          $lookup: {
            from: 'histories',
            let: { history_id: '$registrant' },
            pipeline: [
              { $match: { $expr: { $in: ['$_id', '$$history_id'] } } },
              {
                $lookup: {
                  from: 'users',
                  localField: 'user',
                  foreignField: '_id',
                  as: 'user',
                },
              },
              { $unwind: '$user' },
            ],
            as: 'registrant',
          },
        },
        {
          $unwind: '$donor',
        },
        { $sort: { createdAt: -1 } },
      ]);
      return res.status(200).json({ events });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //  post collection --> {
  //     "title" : "my first post",
  //     "author" : "Jim",
  //     "likes" : 5
  // },

  //   comment collection --> {
  //     "postTitle" : "my first post",
  //     "comment" : "great read",
  //     "likes" : 3
  //  },

  //   db.posts.aggregate([
  //     { $lookup:
  //         {
  //            from: "comments",
  //            localField: "title",
  //            foreignField: "postTitle",
  //            as: "comments"
  //         }
  //     }
  // ])

  //   This query returns the following..
  // {
  //     "title" : "my first post",
  //     "author" : "Jim",
  //     "likes" : 5,
  //     "comments" : [
  //         {
  //             "postTitle" : "my first post",
  //             "comment" : "great read",
  //             "likes" : 3
  //         }
  //     ]
  // },
  getHomeEvents: async (req, res) => {
    try {
      const events = await Event.aggregate([
        { $match: { expireRegistration: { $gt: new Date() } } },
        {
          $lookup: {
            from: 'donors',
            localField: 'user',
            foreignField: 'user',
            as: 'donor',
          },
        },
        {
          $unwind: '$donor',
        },
        { $sort: { createdAt: -1 } },
        { $limit: 4 },
      ]);
      return res.status(200).json({ events });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  registerEvent: async (req, res) => {
    try {
      const checkRegisterEligibility = await History.findOne({
        user: req.user._id,
        event: req.params.id,
      });
      if (checkRegisterEligibility)
        return res
          .status(400)
          .json({ msg: 'You have already registered for this event.' });
      const nowDate = new Date();

      const checkMaxRegisterDate = await Event.findOne({ _id: req.params.id });
      if (nowDate > checkMaxRegisterDate.expireRegistration)
        return res
          .status(400)
          .json({ msg: 'Registration for this event is closed.' });

      const newHistory = new History({
        user: req.user._id,
        event: req.params.id,
      });

      const event = await Event.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { registrant: newHistory._id },
        },
        { new: true }
      );
      await newHistory.save();

      if (!event) return res.status(404).json({ msg: 'Event not found.' });

      return res.status(200).json({ msg: 'Event registration is successful.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateEvent: async (req, res) => {
    try {
      const {
        name,
        location,
        date,
        expireRegistration,
        category,
        timeStart,
        timesUp,
        capacity,
        description,
        picture,
      } = req.body;
      if (
        !name ||
        !location ||
        !date ||
        !expireRegistration ||
        !category ||
        !timeStart ||
        !timesUp ||
        !description ||
        !capacity ||
        !picture
      )
        return res.status(400).json({
          msg: 'The data to change the event is not filled in completely.',
        });

      const findDonor = await Donor.findOne({
        user: req.user._id,
        status: 'verified',
      });
      if (!findDonor)
        return res
          .status(400)
          .json({ msg: 'Donor profile has not been verified.' });

      const event = await Event.findOneAndUpdate(
        { _id: req.params.id },
        {
          name,
          location,
          date,
          expireRegistration,
          category,
          timeStart,
          timesUp,
          capacity,
          description,
          picture,
        },
        { new: true }
      );
      if (!event) return res.status(404).json({ msg: 'Event not found.' });

      return res.status(200).json({
        msg: 'The event data has been changed successfully.',
        event,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = eventCtrl;
