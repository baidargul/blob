import prisma from "@/lib/prisma";

async function main() {
  const categories = [
    { name: "sales", description: "Revenue from sales" },
    { name: "purchase", description: "Expenses on purchases" },
    { name: "salary", description: "Employee salaries" },
    { name: "rent", description: "Office or warehouse rent" },
    {
      name: "utilities",
      description: "Electricity, internet, and other bills",
    },
    { name: "maintenance", description: "Repair and maintenance costs" },
    { name: "miscellaneous", description: "Other unclassified transactions" },
  ];

  for (const category of categories) {
    await prisma.transactionCategory.upsert({
      where: { name: category.name },
      update: {}, // If already exists, do nothing
      create: {
        name: category.name,
        description: category.description,
      },
    });
  }

  console.log("Default transaction categories added!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
