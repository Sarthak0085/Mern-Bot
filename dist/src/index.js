import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
import { config } from "dotenv";
config();
const port = process.env.PORT || 7000;
connectToDatabase()
    .then(() => {
    app.listen(port, () => console.log(`App is running on the port: ${port}`));
}).catch((error) => {
    console.log(error);
});
//# sourceMappingURL=index.js.map