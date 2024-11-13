import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQueryMyProjects } from "@/hooks/api/project/useQueryMyProjects";
import usePagination from "@/hooks/use-pagination";
import { MyProjectModel } from "@/models/my-project";
import { flexRender, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback, useState } from "react";
import { columns } from "./columns";

export const MyProjectsList = () => {
  const router = useRouter();
  const [search, setSearch] = useQueryState("search");
  const [defferSearch, setDefferSearch] = useState(search ?? "");

  const [_currentPage, setCurrentPage] = useQueryState("page", parseAsInteger);
  const currentPage = _currentPage ?? 1;
  const { data: projectList } = useQueryMyProjects({
    search: defferSearch,
    page: currentPage,
    perPage: 5,
  });

  const debounceSearch = useCallback(debounce((value: string) => {
    setDefferSearch(value);
    setCurrentPage(1);
  }, 300), []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setSearch(search);
    debounceSearch(search);
  }

  const table = useReactTable({
    data: projectList?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { pages, hasNext, hasPrev } = usePagination({ currentPage, totalPages: projectList?.totalPages });

  const handleRowClick = (row: Row<MyProjectModel>) => {
    router.push(`/my-projects/${row.getValue("id")}`);
  }

  return (
    <div className="overflow-auto max-w-full flex flex-col gap-2 p-1">
      <div>
        <Input placeholder="Search projects" className="w-[320px]" value={search ?? ""} onChange={handleSearch}/>
      </div>
      <div className="rounded-md border overflow-auto w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="hover:bg-neutral-200 cursor-pointer">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                  onClick={() => handleRowClick(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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

      <Pagination>
        <PaginationContent>
          {hasPrev && (
            <PaginationItem>
              <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
            </PaginationItem>
          )}

          {pages.map((page) => (
            <PaginationItem key={page.value}>
              {page.value === undefined ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink isActive={page.isActive} onClick={() => setCurrentPage(page.value!)}>
                  {page.value}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {hasNext && (
            <PaginationItem>
              <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};
