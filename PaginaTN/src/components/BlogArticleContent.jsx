/** Renderiza contenido con párrafos (separados por línea en blanco) y listas con • */
export default function BlogArticleContent({ text }) {
  if (!text?.trim()) return null;

  const blocks = text.split(/\n\n+/).filter((b) => b.trim());

  return (
    <div className="blog-content">
      {blocks.map((block) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => /^[•\-*]\s/.test(l) || /^\d+\.\s/.test(l));

        if (isList) {
          return (
            <ul key={block.slice(0, 40)} className="blog-content-list">
              {lines.map((line) => (
                <li key={line}>{line.replace(/^[•\-*]\s*/, '').replace(/^\d+\.\s*/, '')}</li>
              ))}
            </ul>
          );
        }

        return <p key={block.slice(0, 40)}>{block.replace(/\n/g, ' ')}</p>;
      })}
    </div>
  );
}
