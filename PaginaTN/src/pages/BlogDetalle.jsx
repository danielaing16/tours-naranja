import { Link, useParams } from 'react-router-dom';
import BlogArticleContent from '../components/BlogArticleContent';
import SafeImage from '../components/SafeImage';
import Reveal from '../components/ui/Reveal';
import { PageEmpty, PageLoading } from '../components/ui/PageState';
import { useLanguage } from '../i18n/LanguageContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchBlogPostBySlug } from '../services/blogService';

export default function BlogDetalle() {
  const { ui } = useLanguage();
  const t = ui.blog;
  const { slug } = useParams();
  const { data: post, loading, error } = useAsyncData(() => fetchBlogPostBySlug(slug), [slug]);

  if (loading) {
    return (
      <div className="container page">
        <PageLoading message={t.loadingArticle} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container page">
        <Link to="/blog" className="back-link">
          {t.back}
        </Link>
        <PageEmpty
          title={t.notFoundTitle}
          message={error || t.notFoundMessage}
          action={
            <Link to="/blog" className="btn btn-primary">
              {t.goBlog}
            </Link>
          }
        />
      </div>
    );
  }

  const imagen = post.imagen_url || post.imagen || '';

  return (
    <article className="container page page-motion blog-detail-page">
      <Reveal>
        <Link to="/blog" className="back-link">
          {t.back}
        </Link>
      </Reveal>
      <Reveal delay={100} variant="scale">
        <div className="card blog-article">
          <SafeImage src={imagen} alt={post.titulo} className="blog-article-cover" />
          <div className="blog-article-body">
            <span className="blog-date">{post.fecha}</span>
            <h1 className="page-title blog-article-title">{post.titulo}</h1>
            {post.extracto && <p className="blog-excerpt">{post.extracto}</p>}
            <BlogArticleContent text={post.contenido} />
          </div>
        </div>
      </Reveal>
    </article>
  );
}
