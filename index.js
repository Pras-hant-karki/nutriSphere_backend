require("dotenv").config();
const app = require("./app");

const port = process.env.PORT;
// const port = 3001;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
