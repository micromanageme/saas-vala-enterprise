// @ts-nocheck
/**
 * SaaS Vala Enterprise - Database Client (stub)
 *
 * Prisma client is intentionally NOT imported at module top-level.
 * The generated client (.prisma/client) is missing/invalid in this
 * environment, and importing it causes the SSR worker to fail with
 * "No such module assets/.prisma/client/default" during routing.
 *
 * This stub returns a Proxy that throws only when an API route actually
 * tries to use the database — keeping the UI fully functional.
 */

const notReady = () => {
  throw new Error(
    "Database is not configured in this environment. Run `prisma generate` and provide DATABASE_URL.",
  );
};

const stub: any = new Proxy(
  {},
  {
    get: (_t, prop) => {
      if (prop === "then") return undefined; // not a thenable
      if (prop === "$disconnect" || prop === "$connect") return async () => {};
      // Model accessors (prisma.user.findMany, etc.) — return another proxy
      return new Proxy(
        {},
        {
          get: () => notReady,
        },
      );
    },
  },
);

export const prisma = stub;
export default stub;
