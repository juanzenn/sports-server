import { BodyPart, BodyPartCategory, PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const CATEGORIES: Pick<BodyPartCategory, "name">[] = [
    { name: "Upper Body" },
    { name: "Lower Body" },
    { name: "Other" },
  ];
  const BODY_PARTS: Pick<BodyPart, "name" | "body_part_category_id">[] = [
    { name: "Chest", body_part_category_id: 1 },
    { name: "Back", body_part_category_id: 1 },
    { name: "Shoulders", body_part_category_id: 1 },
    { name: "Biceps", body_part_category_id: 1 },
    { name: "Triceps", body_part_category_id: 1 },
    { name: "Forearms", body_part_category_id: 1 },
    { name: "Quads", body_part_category_id: 2 },
    { name: "Hamstrings", body_part_category_id: 2 },
    { name: "Calves", body_part_category_id: 2 },
    { name: "Glutes", body_part_category_id: 2 },
    { name: "Abs", body_part_category_id: 3 },
  ];

  await db.$transaction([
    db.bodyPartCategory.createMany({ data: CATEGORIES }),
    db.bodyPart.createMany({ data: BODY_PARTS }),
  ]);

  console.table(
    await db.bodyPartCategory.findMany({
      include: { body_part: true },
    })
  );
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
