import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';
import { useLanguage } from '../i18n/LanguageContext';

export default function BlogCard({ post, variant = 'default' }) {
  const { ui } = useLanguage();
  const imagen = post.imagen_url || post.imagen || '';
  const extracto = post.extracto || post.resumen || '';
  const isMini = variant === 'mini';

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`card blog-card${isMini ? ' blog-card-mini' : ''}`}
    >
      <SafeImage src={imagen} alt={post.titulo} />
      <div className={isMini ? undefined : 'blog-body'}>
        <span className="blog-date">{post.fecha}</span>
        <h3>{post.titulo}</h3>
        {!isMini && extracto && <p>{extracto}</p>}
        {!isMini && <span className="link-orange">{ui.blog.readMore}</span>}
      </div>
    </Link>
  );
}
