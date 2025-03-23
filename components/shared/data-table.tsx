"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { TbChevronUp, TbChevronDown } from "react-icons/tb"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { ScrollArea } from "../ui/scroll-area"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    sortableIds?: string[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
    sortableIds = [],
}: DataTableProps<TData, TValue>) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const initialSortBy = searchParams.get("sortBy") || "";
    const initialSortOrder = searchParams.get("sortOrder") || "asc";

    const [sortBy, setSortBy] = useState<string>(initialSortBy);
    const [sortOrder, setSortOrder] = useState<string>(initialSortOrder);
    const [sortIcon, setSortIcon] = useState(<TbChevronUp />);

    const handleSort = (columnId: string) => {
        const newSortOrder = sortBy === columnId && sortOrder === "asc" ? "desc" : "asc";
        const newSortIcon = newSortOrder === "asc" ? <TbChevronUp /> : <TbChevronDown />;
        setSortBy(columnId);
        setSortOrder(newSortOrder);
        setSortIcon(newSortIcon);

        const params = new URLSearchParams(searchParams.toString());
        params.set("sortBy", columnId);
        params.set("sortOrder", newSortOrder);

        router.push(`${pathname}?${params.toString()}`);
    };


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="h-full w-full grid grid-cols-1 overflow-x-auto">
            <Table className="overflow-x-auto w-full">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        <div className={cn("flex flex-row items-center gap-2")}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}

                                            {sortableIds.includes(header.id) && (
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size={"icon"} type="button" onClick={() => handleSort(header.id)} className="p-1">
                                                        {sortIcon}
                                                    </Button>


                                                </div>
                                            )}
                                        </div>
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="flex-1">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
