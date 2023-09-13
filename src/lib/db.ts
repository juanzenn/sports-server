import { PrismaClient } from "@prisma/client";

const db = new PrismaClient().$extends({
  name: "Filter deleted records",
  query: {
    exercise: {
      async findMany({ query }) {
        query({ where: { is_deleted: false } });
      },
    },
  },
});

export { db };
