const express = require("express"),
  cors = require("cors"),
  helmet = require("helmet"),
  morgan = require("morgan"),
  rateLimit = require("express-rate-limit"),
  swaggerUi = require("swagger-ui-express"),
  swaggerSpec = require("./docs/swagger");


const authRoutes = require("./routes/auth.route"),
  bookRoutes = require("./routes/book.routes"),
  ticketRoutes = require("./routes/ticket.routes"),
  adminRoutes = require("./routes/admin.routes"),
  { notFound, errorHandler } = require("./middleware/errorHandler");


const app = express();
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get("/health", (req, res) =>
  res.json({
    success: true,
    service: "Author Support API",
    status: "healthy",
  }),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);


module.exports = app;
