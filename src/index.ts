import { Elysia, t } from "elysia";
import { db } from "./lib/db";

const app = new Elysia()
  .group("/exercise", (app) =>
    app
      .get("/", async () => {
        return (await db.exercise.findMany()) || [];
      })
      .post(
        "/",
        async ({ set, body }) => {
          const exercise = await db.exercise.create({
            data: { name: body.name, body_part_id: body.body_part_id },
          });

          set.status = 201;
          return exercise;
        },
        { body: t.Object({ name: t.String(), body_part_id: t.Number() }) }
      )
      .put(
        "/:id",
        async ({ set, body, params }) => {
          const exercise = await db.exercise.findUnique({
            where: { id: params.id },
          });

          if (!exercise) {
            set.status = 404;
            return;
          }

          await db.exercise.update({
            where: { id: params.id },
            data: { name: body.name, body_part_id: body.body_part_id },
          });

          set.status = 200;
          return exercise;
        },
        {
          body: t.Object({ name: t.String(), body_part_id: t.Number() }),
          params: t.Object({ id: t.Number() }),
        }
      )
      .delete(
        "/:id",
        async ({ set, params }) => {
          const exercise = await db.exercise.findUnique({
            where: { id: params.id },
          });

          if (!exercise) {
            set.status = 404;
            return;
          }

          await db.exercise.update({
            where: { id: params.id },
            data: { is_deleted: true, deleted_at: new Date() },
          });

          set.status = 200;
          return exercise;
        },
        { params: t.Object({ id: t.Number() }) }
      )
  )
  .get("/body-parts", async () => {
    const allBodyParts = (await db.bodyPart.findMany()) || [];
    return allBodyParts;
  })
  .listen(8080);

console.log(`App running on port ${app.server?.port}`);
