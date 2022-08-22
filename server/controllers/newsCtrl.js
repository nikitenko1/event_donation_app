const { News } = require('./../models/News');

const newsCtrl = {
  getNews: async (req, res) => {
    try {
      const news = await News.find().sort('-createdAt');
      return res.status(200).json({ news });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getHomeNews: async (req, res) => {
    try {
      const news = await News.find().sort('-createdAt').limit(2);
      return res.status(200).json({ news });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createNews: async (req, res) => {
    try {
      const { title, content, picture } = req.body;
      if (!title || !content || !picture)
        return res.status(400).json({
          msg: 'Data to add news is not filled in completely.',
        });

      const newNews = new News({ title, content, picture });
      await newNews.save();

      return res.status(200).json({
        msg: 'News saved.',
        news: newNews,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteNews: async (req, res) => {
    try {
      const news = await News.findByIdAndDelete(req.params.id);
      if (!news) return res.status(200).json({ msg: 'News not found.' });

      return res.status(200).json({ msg: 'News has been deleted.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateNews: async (req, res) => {
    try {
      const { title, content, picture } = req.body;
      if (!title || !content || !picture)
        return res.status(400).json({
          msg: 'The data to change the news is not filled in completely.',
        });

      const news = await News.findOneAndUpdate(
        { _id: req.params.id },
        { title, content, picture },
        { new: true }
      );

      return res.status(200).json({
        msg: 'News changed successfully.',
        news,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = newsCtrl;
