import React from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

const HolidayItem = ({ holiday }) => {
  return (
    <div className="p-4 bg-white rounded-lg border border-[#E0E0E0] hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-red-600">{holiday.title}</h3>
          <p className="text-[#757575]">{holiday.date}</p>
          {holiday.description && (
            <p className="mt-1 text-sm text-[#424242]">{holiday.description}</p>
          )}
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
          {holiday.isRecurring ? '반복' : '비반복'}
        </span>
      </div>
    </div>
  );
};

export default HolidayItem;