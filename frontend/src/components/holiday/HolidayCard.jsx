import React from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

const HolidayCard = ({ holiday }) => {
  const { title, date, description } = holiday;

  // Format the date to show day of week
  const formattedDate = format(parseISO(date), 'yyyy년 MM월 dd일 (eee)', { locale: ko });

  return (
    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-1 mr-3">
          <span className="text-red-600 dark:text-red-300">📅</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-red-800 dark:text-red-200">
            {title}
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {formattedDate}
          </p>
          {description && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HolidayCard;