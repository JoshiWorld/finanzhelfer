import { PaymentType } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const paymentRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ 
      title: z.string().min(1),
      paymentDate: z.date(),
      amount: z.number(),
      paymentType: z.enum([PaymentType.HALF, PaymentType.MONTHLY, PaymentType.QUARTER, PaymentType.YEARLY]),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.payment.create({
        data: {
          title: input.title,
          paymentDate: input.paymentDate,
          amount: input.amount,
          paymentType: input.paymentType,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  
  delete: protectedProcedure.input(z.object({
    id: z.number(),
  })).mutation(async ({ ctx, input }) => {
    return ctx.db.payment.delete({
      where: { id: input.id }
    })
  }),

  update: protectedProcedure.input(z.object({
    id: z.number(),
    title: z.string().min(1).optional(),
    paymentDate: z.date().optional(),
    amount: z.number().optional(),
    paymentType: z.enum([PaymentType.HALF, PaymentType.MONTHLY, PaymentType.QUARTER, PaymentType.YEARLY]).optional(),
  })).mutation(async ({ ctx, input }) => {
    return ctx.db.payment.update({
      where: { id: input.id },
      data: {
        title: input.title,
        paymentDate: input.paymentDate,
        amount: input.amount,
        paymentType: input.paymentType,
      }
    })
  }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.payment.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.payment.findMany({
      orderBy: { updatedAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } }
    });
  }),

  getMonth: protectedProcedure.input(z.object({ month: z.string() })).query(async ({ ctx, input }) => {
    const { month } = input;
    if (!month || typeof month !== 'string') {
      throw new Error('Invalid month parameter');
    }
    
    const monthIndex = new Date(month).getMonth();

    const payments = await ctx.db.payment.findMany({
      where: {
        createdBy: { id: ctx.session.user.id }
      },
    });

    return payments.filter(payment => {
      const paymentMonth = new Date(payment.paymentDate).getMonth();
      return paymentMonth === monthIndex;
    }).sort((a, b) => {
      const dayA = new Date(a.paymentDate).getDate();
      const dayB = new Date(b.paymentDate).getDate(); 
      return dayA - dayB; 
    });
  }),
});
