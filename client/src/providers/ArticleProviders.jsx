import { useState, useCallback } from "react";
import { articleService } from "../services";
import { ArticleContext } from "../contexts/ArticleContext";

export const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(null);
  const [articlesCount, setArticlesCount] = useState(0);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);
  const [error, setError] = useState(null);

  const listArticles = useCallback(async (params) => {
    setLoadingList(true);
    setError(null);

    try {
      const { articles: fetchedArticles, articlesCount: total } =
        await articleService.list(params);
      setArticles(fetchedArticles);
      setArticlesCount(total);
      return { articles: fetchedArticles, articlesCount: total };
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoadingList(false);
    }
  }, []);

  const feedArticles = useCallback(async (params) => {
    setLoadingList(true);
    setError(null);

    try {
      const { articles: fetchedArticles, articlesCount: total } =
        await articleService.feed(params);
      setArticles(fetchedArticles);
      setArticlesCount(total);
      return { articles: fetchedArticles, articlesCount: total };
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoadingList(false);
    }
  }, []);

  const getArticle = useCallback(async (slug) => {
    setLoadingItem(true);
    setError(null);

    try {
      const a = await articleService.get(slug);
      setArticle(a);
      return a;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoadingItem(false);
    }
  }, []);

  const createArticle = async (payload) => {
    const created = await articleService.create(payload);
    setArticles((prev) => [created, ...prev]);
    return created;
  };

  const updateArticle = async (slug, payload) => {
    const updated = await articleService.update(slug, payload);
    setArticle(updated);
    setArticles((prev) => prev.map((a) => (a.slug === slug ? updated : a)));
    return updated;
  };

  const deleteArticle = async (slug) => {
    await articleService.delete(slug);
    setArticles((prev) => prev.filter((a) => a.slug !== slug));
    if (article?.slug === slug) setArticle(null);
  };

  const favorite = async (slug) => {
    const updated = await articleService.favorite(slug);
    setArticle(updated);
    setArticles((prev) => prev.map((a) => (a.slug === slug ? updated : a)));
    return updated;
  };

  const unfavorite = async (slug) => {
    const updated = await articleService.unfavorite(slug);
    setArticle(updated);
    setArticles((prev) => prev.map((a) => (a.slug === slug ? updated : a)));
    return updated;
  };

  return (
    <ArticleContext.Provider
      value={{
        articles,
        article,
        articlesCount,
        error,
        loadingList,
        loadingItem,
        listArticles,
        feedArticles,
        getArticle,
        createArticle,
        updateArticle,
        deleteArticle,
        favorite,
        unfavorite,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};
