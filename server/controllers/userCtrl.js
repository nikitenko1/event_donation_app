const { User } = require('./../models/User');

const userCtrl = {
  getUser: async (req, res) => {
    try {
      const users = await User.find({ role: 'user' }).sort('-createdAt');
      return res.status(200).json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ msg: 'User not found.' });

      return res.status(200).json({ msg: 'User has been deleted.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;
