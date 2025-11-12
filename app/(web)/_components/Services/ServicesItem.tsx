import type { ServicesItemProps } from './Services.types';

export function ServicesItem({ 
  children, 
  title,
  icon,
  className = ''
}: ServicesItemProps) {
  const renderIcon = () => {
    if (!icon) return null;
    
    // If icon is a string, treat it as an emoji or text
    if (typeof icon === 'string') {
      return (
        <div className="text-4xl mb-4">
          {icon}
        </div>
      );
    }
    
    // If icon is a React node, render it directly
    return (
      <div className="mb-4 flex justify-center">
        {icon}
      </div>
    );
  };

  return (
    <div className={`text-center p-6 ${className}`}>
      {renderIcon()}
      <h3 className="text-xl font-semibold text-theme-primary mb-3">
        {title}
      </h3>
      <p className="text-theme-secondary">
        {children}
      </p>
    </div>
  );
}