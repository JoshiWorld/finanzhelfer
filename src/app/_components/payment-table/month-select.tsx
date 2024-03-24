"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function MonthSelect({
  month,
  onSelect,
}: {
  month: string;
  onSelect: (value: string) => void;
}) {
  const handleSelectChange = (value: string) => {
    onSelect(value);
  };

  return (
    <Select defaultValue={month} onValueChange={handleSelectChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Monat auswählen" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Januar</SelectItem>
        <SelectItem value="2">Februar</SelectItem>
        <SelectItem value="3">März</SelectItem>
        <SelectItem value="4">April</SelectItem>
        <SelectItem value="5">Mai</SelectItem>
        <SelectItem value="6">Juni</SelectItem>
        <SelectItem value="7">Juli</SelectItem>
        <SelectItem value="8">August</SelectItem>
        <SelectItem value="9">September</SelectItem>
        <SelectItem value="10">Oktober</SelectItem>
        <SelectItem value="11">November</SelectItem>
        <SelectItem value="12">Dezember</SelectItem>
      </SelectContent>
    </Select>
  );
}
