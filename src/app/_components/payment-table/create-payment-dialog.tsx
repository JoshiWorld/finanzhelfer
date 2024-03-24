"use client"

import { PaymentType } from "@prisma/client";
import { CalendarIcon } from "@radix-ui/react-icons";
import { SetStateAction, useState } from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { format } from "date-fns";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export function CreatePaymentDialog() {
    const router = useRouter();
    const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.MONTHLY);
    const [paymentDate, setPaymentDate] = useState<Date>(new Date());
    const [title, setTitle] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);

    const handlePaymentTypeChange = (value: PaymentType) => {
        setPaymentType(value);
    }

    const handleTitleChange = (event: {
      target: { value: SetStateAction<string | undefined> };
    }) => {
      setTitle(event.target.value);
    };

    const handleAmountChange = (event: {
      target: { value: SetStateAction<number | undefined> };
    }) => {
      setAmount(event.target.value);
    };

    const createPayment = api.payment.create.useMutation({
      onSuccess: () => {
        router.refresh();
        setTitle("");
        setAmount(0);
      },
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createPayment.mutate({
            title: title,
            amount: parseFloat(amount),
            paymentType: paymentType,
            paymentDate: paymentDate
        });
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          >
            Zahlung hinzufügen
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Zahlung hinzufügen</DialogTitle>
            <DialogDescription>
              Hier kannst du eine neue Zahlung hinzufügen
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
                    onSelect={setPaymentDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createPayment.isLoading} onClick={handleSubmit}>
              {createPayment.isLoading ? "Wird hinzugefügt..." : "Hinzufügen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}
