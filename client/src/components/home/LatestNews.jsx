import { useState, useEffect } from 'react';
import { getDataAPI } from './../../utils/fetchData';
import NewsCard from './NewsCard';

const LatestNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    getDataAPI('news/home').then((res) => {
      setNews(res.data.news);
    });
  }, []);

  return (
    <div className="px-14">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-2xl text-sky-500">Latest News</h1>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-8 mt-7">
        {news.map((item) => (
          <NewsCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default LatestNews;
