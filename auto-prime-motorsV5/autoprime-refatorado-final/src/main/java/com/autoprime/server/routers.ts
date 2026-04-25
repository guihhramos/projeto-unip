import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  getAllFuncionarios,
  getFuncionarioById,
  createFuncionario,
  deleteFuncionario,
  updateFuncionario,
} from "./db";

const FuncionarioInput = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  setor: z.string().min(1, "Setor é obrigatório"),
  salario: z.number().min(0, "Salário deve ser maior que 0"),
  dataAdmissao: z.date(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  funcionarios: router({
    list: publicProcedure.query(async () => {
      return await getAllFuncionarios();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getFuncionarioById(input.id);
      }),

    create: publicProcedure
      .input(FuncionarioInput)
      .mutation(async ({ input }) => {
        return await createFuncionario(input);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteFuncionario(input.id);
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          nome: z.string().optional(),
          cpf: z.string().optional(),
          email: z.string().email().optional(),
          telefone: z.string().optional(),
          setor: z.string().optional(),
          salario: z.number().optional(),
          dataAdmissao: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateFuncionario(id, data);
      }),
  }),
});

export type AppRouter = typeof appRouter;
