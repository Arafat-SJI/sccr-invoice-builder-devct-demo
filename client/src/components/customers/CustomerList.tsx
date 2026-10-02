import * as React from "react";
import { Customer } from "@/lib/api/customer.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

export interface CustomerListProps {
  customers: Customer[];
  loading?: boolean;
  error?: string | null;
  onAdd: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerList({ customers, loading, error, onAdd, onEdit, onDelete }: CustomerListProps) {
  const hasCustomers = customers && customers.length > 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading customers…</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customers</CardTitle>
          <Button onClick={onAdd}>Add New Customer</Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!hasCustomers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <p className="text-sm text-muted-foreground">You haven’t added any customers yet.</p>
          <Button onClick={onAdd}>Add New Customer</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Customers</CardTitle>
        <Button onClick={onAdd}>Add New Customer</Button>
      </CardHeader>
      <CardContent>
        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {customers.map((c) => (
            <div key={c.id} className="rounded-md border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{c.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{c.email}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button size="icon" variant="ghost" aria-label={`Edit ${c.name}`} onClick={() => onEdit(c)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label={`Delete ${c.name}`} onClick={() => onDelete(c)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {(c.phone || c.address) && (
                <div className="mt-2 space-y-1 text-sm">
                  {c.phone && <p><span className="text-muted-foreground">Phone:</span> {c.phone}</p>}
                  {c.address && <p className="line-clamp-2"><span className="text-muted-foreground">Address:</span> {c.address}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Name</TableHead>
                  <TableHead className="min-w-[220px]">Email</TableHead>
                  <TableHead className="min-w-[140px]">Phone</TableHead>
                  <TableHead className="min-w-[260px]">Address</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone || "—"}</TableCell>
                    <TableCell>
                      {c.address ? <span className="line-clamp-2 block max-w-[520px]">{c.address}</span> : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button size="icon" variant="ghost" aria-label={`Edit ${c.name}`} onClick={() => onEdit(c)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" aria-label={`Delete ${c.name}`} onClick={() => onDelete(c)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
