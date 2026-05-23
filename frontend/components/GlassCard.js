export default function GlassCard({ children, className = "" }) {
  return ( <div className={`glass-panel rounded-2xl p-6 shadow-2xl relative overflow-hidden ${className}`}>{children}</div> );
}
