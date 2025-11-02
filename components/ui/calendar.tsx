"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";

import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  numberOfMonths = 1,
  showOutsideDays = true,
  weekStartsOn = 1,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      numberOfMonths={numberOfMonths}
      showOutsideDays={showOutsideDays}
      // `weekStartsOn` is 0..6; keep Monday as default but allow override via props
      weekStartsOn={weekStartsOn as 0 | 1 | 2 | 3 | 4 | 5 | 6}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
