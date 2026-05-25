export function PageLoading({ message = 'Cargando…' }) {
  return (
    <div className="page-state" role="status">
      <div className="skeleton-grid">
        {[1, 2, 3].map((n) => (
          <div key={n} className="skeleton-card" />
        ))}
      </div>
      <p className="page-state-text">{message}</p>
    </div>
  );
}

export function PageError({ title = 'No pudimos cargar', message, hint, action }) {
  return (
    <div className="page-state page-state-error" role="alert">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {hint && <p className="hint">{hint}</p>}
      {action}
    </div>
  );
}

export function PageEmpty({ title = 'Sin resultados', message, action }) {
  return (
    <div className="page-state page-state-empty">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
