const app = require("./server/app");
const connectDatabase = require("./server/config/db");
const seedDefaults = require("./server/config/seed");

const port = process.env.PORT || 5000;

async function startServer() {
  await connectDatabase();
  await seedDefaults();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
