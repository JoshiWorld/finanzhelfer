"use client";

import { type Payment, type PaymentType } from "@prisma/client";
import { CalendarIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { type SetStateAction, useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "~/components/ui/select";
import { format } from "date-fns";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";
import { toast } from "sonner";

export function PaymentsContext({payment}: {payment: Payment}) {
  const router = useRouter();
  const [paymentType, setPaymentType] = useState<PaymentType>(
    payment.paymentType,
  );
  const [paymentDate, setPaymentDate] = useState<Date>(payment.paymentDate);
  const [title, setTitle] = useState<string>(payment.title);
  const [amount, setAmount] = useState<number>(payment.amount);
  const paymentBackup: Payment = payment;

  const handlePaymentTypeChange = (value: PaymentType) => {
    setPaymentType(value);
  };

  const handleTitleChange = (event: {
    target: { value: SetStateAction<string | undefined> };
  }) => {
    // @ts-expect-error | event.target.value can not undefined
    setTitle(event.target.value);
  };

  const handleAmountChange = (event: {
    target: { value: SetStateAction<number | undefined> };
  }) => {
    // @ts-expect-error | event.target.value can not undefined
    setAmount(event.target.value);
  };

  const editPayment = api.payment.update.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    editPayment.mutate({
      id: payment.id,
      title: title,
      amount: parseFloat(amount.toString()),
      paymentType: paymentType,
      paymentDate: paymentDate,
    });
  };

  const deletePayment = api.payment.delete.useMutation({
    onSuccess: () => {
      router.refresh();

      toast("Zahlung erfolgreich gelöscht", {
        description: "Titel: " + payment.title + " | ID: " + payment.id,
        action: {
          label: "Rückgängig",
          onClick: () => undoDeletePayment(paymentBackup),
        },
      });
    },
  });

  const handleDeletePayment = () => {
    deletePayment.mutate({
      id: payment.id
    });
  }

  const createPayment = api.payment.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const undoDeletePayment = (paymentBackup: Payment) => {
    createPayment.mutate({
      title: paymentBackup.title,
      amount: paymentBackup.amount,
      paymentType: paymentBackup.paymentType,
      paymentDate: paymentBackup.paymentDate,
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Menü öffnen</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(payment.id.toString())}
          >
            ID kopieren
          </DropdownMenuItem>

          <Dialog>
            <DropdownMenuItem onClick={(e) => e.preventDefault()}>
              <DialogTrigger>Bearbeiten</DialogTrigger>
            </DropdownMenuItem>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Zahlung bearbeiten</DialogTitle>
                <DialogDescription>
                  Hier kannst du eine Zahlung bearbeiten
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Titel
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Amazon"
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Betrag
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    // @ts-expect-error | onChange is always correct
                    onChange={handleAmountChange}
                    placeholder="20€"
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentType" className="text-right">
                    Abrechnung
                  </Label>
                  <Select
                    onValueChange={handlePaymentTypeChange}
                    value={paymentType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Abrechnungszyklus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="YEARLY">Jährlich</SelectItem>
                        <SelectItem value="QUARTER">Vierteljährlich</SelectItem>
                        <SelectItem value="MONTHLY">Monatlich</SelectItem>
                        <SelectItem value="HALF">Halbjährlich</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentDate" className="text-right">
                    Zahltag
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !paymentDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {paymentDate ? (
                          format(paymentDate, "PPP")
                        ) : (
                          <span>Datum auswählen</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={paymentDate}
                        // @ts-expect-error | onSelect is always correct
                        onSelect={setPaymentDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={editPayment.isLoading}
                  // @ts-expect-error | onClick is always correct
                  onClick={handleSubmit}
                >
                  {editPayment.isLoading ? "Wird gespeichert..." : "Speichern"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDeletePayment}>
            <span className="text-red-600">Löschen</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
