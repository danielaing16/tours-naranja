/** Logo oficial Tours Naranja — PaginaTN/public/logo.png */
export default function LogoMark({ size = 40, className = '' }) {
  return (
    <img
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      className={`logo-mark${className ? ` ${className}` : ''}`}
      decoding="async"
      aria-hidden="true"
    />
  );
}
