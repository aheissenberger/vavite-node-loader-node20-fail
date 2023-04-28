
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

export const apiPath = '/api/trpc';

const createContextExpress = ({
    req,
    res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context

export const createContext =  createContextExpress
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

interface User {
    id: string;
    name: string;
}

const userList: User[] = [
    {
        id: '1',
        name: 'KATT',
    },
];

export const appRouter = t.router({
    userById: t.procedure
        // The input is unknown at this time.
        // A client could have sent us anything
        // so we won't assume a certain data type.
        .input((val: unknown) => {

            // If the value is of type string, return it.
            // TypeScript now knows that this value is a string.
            if (typeof val === 'string') return val;

            // Uh oh, looks like that input wasn't a string.
            // We will throw an error instead of running the procedure.
            throw new Error(`Invalid input: ${typeof val}`);
        })
        .query((req) => {
            const { input } = req;
            const user = userList.find((u) => u.id === input);

            return user;
        }),
    userError: t.procedure
        // The input is unknown at this time.
        // A client could have sent us anything
        // so we won't assume a certain data type.
        .input((val: unknown) => {

            // If the value is of type string, return it.
            // TypeScript now knows that this value is a string.
            if (typeof val === 'string') return val;

            // Uh oh, looks like that input wasn't a string.
            // We will throw an error instead of running the procedure.
            throw new Error(`Invalid input: ${typeof val}`);
        })
        .query((req) => {

            const { input } = req;
            const user = userList.find((u) => u.id === input);
            return user;
        }),

});

export const trpc =trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  })