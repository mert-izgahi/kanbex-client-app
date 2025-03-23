"use client";

import { TbCalendar } from "react-icons/tb";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import dayjs from "dayjs";
import { useState } from "react";
interface DatePickerProps {
    value?: Date;
    onChange: (value: Date) => void;
}

function DatePicker({ value, onChange }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild >
                <Button variant="outline" className="flex w-full justify-start h-9">
                    <TbCalendar className="mr-2 h-4 w-4" />
                    {value ? dayjs(value).format("DD/MM/YYYY") : "Select date"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Calendar mode="single" selected={value} onSelect={(e) => {
                    setIsOpen(false)
                    if (e) onChange(e)
                }} />
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker