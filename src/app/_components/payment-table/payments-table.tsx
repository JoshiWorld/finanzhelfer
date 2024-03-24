import { Payment } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { PaymentsContext } from "./payments-context";

export function PaymentsTable({ payments }: { payments: Payment[] }) {
    const totalAmount = payments.reduce((total, payment) => total + payment.amount, 0);

    return (
      <>
        <Table>
          <TableCaption>Rechnung für diesen Monat.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Beschreibung</TableHead>
              <TableHead>Abrechnungszyklus</TableHead>
              <TableHead>Abrechnungsdatum</TableHead>
              <TableHead className="text-right">Wert</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.title}</TableCell>
                <TableCell>{payment.paymentType}</TableCell>
                <TableCell>
                  {payment.paymentDate.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">{payment.amount} €</TableCell>
                <TableCell className="text-right">
                  <PaymentsContext payment={payment} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Gesamt</TableCell>
              <TableCell className="text-right">{totalAmount} €</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </>
    );
}
