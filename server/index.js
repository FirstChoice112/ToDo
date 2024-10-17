require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./databas");

const app = express();
app.use(express.json());

const router = require("./routes");
app.use("/api", router);

router.stack.forEach((r) => {
  console.log(r.route.path, r.route.methods);
});

const port = process.env.PORT || 5000;

async function startServer() {
  await connectToMongoDB();
  app.listen(port, () => {
    console.log(`server is running on  http://localhost:${port}`);
  });
}
startServer();
