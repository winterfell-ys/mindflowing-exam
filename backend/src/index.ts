import express from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";

AppDataSource.initialize()
  .then(() => {
    const app = express();
    app.use(express.json());

    app.use("/api", userRoutes);
    app.use("/api", taskRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("Database connection failed:", error));
