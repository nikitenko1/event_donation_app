const { Donor } = require('./../models/Donor');
const { User } = require('./../models/User');
const { Event } = require('./../models/Event');

const donorCtrl = {
  completeProfile: async (req, res) => {
    try {
      const { name, owner, slogan, email, address } = req.body;
      if (!name || !owner || !slogan || !email || !address)
        return res.status(400).json({
          msg: 'The name, owner, slogan, and address fields must be filled in.',
        });

      const findUser = await User.findOne({ email });
      if (findUser)
        return res.status(400).json({ msg: 'Pre-registered email address.' });

      await User.findOneAndUpdate(
        { _id: req.user._id },
        { email },
        { new: true }
      );

      const newDonor = new Donor({
        name,
        owner,
        slogan,
        address,
        user: req.user._id,
      });
      await newDonor.save();

      return res.status(200).json({ msg: 'Donor profile successfully sent.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUnverifiedDonor: async (req, res) => {
    try {
      const donors = await Donor.find({ status: 'not verified' })
        .sort('-createdAt')
        .populate('user');
      return res.status(200).json({ donors });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  verifiedDonor: async (req, res) => {
    try {
      const updatedDonor = await Donor.findOneAndUpdate(
        { _id: req.params.id },
        { status: 'verified' },
        { new: true }
      );
      if (!updatedDonor)
        return res.status(404).json({ msg: 'Donor not found.' });

      return res.status(200).json({ msg: 'Verified donor.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  rejectDonor: async (req, res) => {
    try {
      await Donor.findOneAndDelete({ _id: req.params.id });

      return res
        .status(200)
        .json({ msg: 'Donor confirmation request has been rejected.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteDonor: async (req, res) => {
    try {
      const donor = await Donor.findByIdAndDelete(req.params.id);
      await User.findByIdAndDelete(donor.user);
      await Event.deleteMany({ user: donor.user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getVerifiedDonor: async (req, res) => {
    try {
      const donors = await Donor.find({ status: 'verified' });
      return res.status(200).json({ donors });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getDonorByUser: async (req, res) => {
    try {
      const donor = await Donor.findOne({ user: req.user._id });
      if (!donor) return res.status(404).json({ msg: 'Donor not found.' });

      return res.status(200).json({ donor });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = donorCtrl;
