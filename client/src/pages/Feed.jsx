function Feed({ articles }) {
  console.log("articles", articles);
  return (
    <>
      <h3>Feed</h3>
      <div>
        {Array.isArray(articles) &&
          articles.map((article) => (
            <div key={article.id}>{article.content}</div>
          ))}
      </div>
    </>
  );
}

export default Feed;
