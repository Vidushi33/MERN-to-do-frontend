import { useMemo } from "react";
import { WEEKDAYS } from "../utils/constants";

const getStartOfWeek = (date: Date) => {
  const monday = new Date(date);
  const day = monday.getDay();

  monday.setDate(monday.getDate() + (day === 0 ? -6 : 1 - day));
  monday.setHours(0, 0, 0, 0);

  return monday;
};

interface IComp {
  selectedDate: Date;
  setSelectedDate: any;
}

const DateComp = ({ selectedDate, setSelectedDate }: IComp) => {
  const days = useMemo(() => {
    const monday = getStartOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-7 gap-1 md:gap-4 lg:gap-8 ">
      {days.map((day, index) => {
        const active =
          day.getDate() === selectedDate.getDate() &&
          day.getMonth() === selectedDate.getMonth() &&
          day.getFullYear() === selectedDate.getFullYear();
        return (
          <button
            key={index}
            className={`border-transparent flex flex-col py-2 items-center justify-center gap-3 relative border-3 ${active ? "text-white bg-primary" : "text-[#C0C0C0]"}`}
            onClick={() => setSelectedDate(day)}
          >
            <span className="text-xs">{WEEKDAYS[day.getDay()]}</span>
            <strong className="font-medium">
              {String(day.getDate()).padStart(2, "0")}
            </strong>
            {active && <span className=" h-1 w-1 rounded-full bg-white" />}
          </button>
        );
      })}
    </div>
  );
};

export default DateComp;
