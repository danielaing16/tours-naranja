import BlogCard from '../components/BlogCard';
import PageHeader from '../components/ui/PageHeader';
import Reveal from '../components/ui/Reveal';
import { PageEmpty, PageLoading } from '../components/ui/PageState';
import { useLanguage } from '../i18n/LanguageContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchBlogPosts } from '../services/blogService';

export default function Blog() {
  const { ui } = useLanguage();
  const t = ui.blog;
  const { data: posts, loading, error } = useAsyncData(() => fetchBlogPosts(), []);

  return (
    <div className="container page page-motion">
      <PageHeader badge={t.badge} title={t.title} subtitle={t.subtitle} />

      {loading && <PageLoading message={t.loading} />}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && (posts?.length ?? 0) === 0 && (
        <PageEmpty title={t.emptyTitle} message={t.emptyMessage} />
      )}
      {!loading && !error && (posts?.length ?? 0) > 0 && (
        <div className="grid-3">
          {posts.map((b, i) => (
            <Reveal key={b.id} variant="scale" delay={i * 80}>
              <BlogCard post={b} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
