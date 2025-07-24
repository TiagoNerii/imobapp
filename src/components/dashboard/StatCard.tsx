import React from 'react';
import { cn } from '../../utils/cn';
import { Card } from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  iconColor = 'bg-primary-100 text-primary-800',
  className,
}) => {
  return (
    <Card className={cn("hover:border-primary-200", className)}>
      <div className="p-6">
        <div className="flex items-center">
          <div className={cn(
            "flex-shrink-0 rounded-full p-3 mr-4",
            iconColor
          )}>
            {icon}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
            
            {change && (
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-sm font-medium",
                  change.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {change.isPositive ? '+' : ''}{change.value}%
                </span>
                <span className="text-sm text-gray-500 ml-1">em relação ao mês anterior</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;