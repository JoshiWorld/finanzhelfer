"use client";

import { useState } from "react";
import { MonthSelect } from "./month-select";
import { PaymentsTable } from "./payments-table";
import { type Payment } from "@prisma/client";

export function InvoicesTable({ payments }: { payments: Payment[] }) {
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString(),
  );

  const handleMonthSelect = (value: string) => {
    setSelectedMonth(value);
  };

  const monthIndex = new Date(selectedMonth).getMonth();

  return (
    <div className="w-full max-w-6xl">
      <MonthSelect month={selectedMonth} onSelect={handleMonthSelect} />
      <PaymentsTable
        payments={payments
          .filter((payment) => {
            const paymentMonth = new Date(payment.paymentDate).getMonth();
            return paymentMonth === monthIndex;
          })
          .sort((a, b) => {
            const dayA = new Date(a.paymentDate).getDate();
            const dayB = new Date(b.paymentDate).getDate();
            return dayA - dayB;
          })}
      />
    </div>
  );
}