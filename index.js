const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error, log } = require("console");

app.use(express.json());
app.use(cors());

//database connection with MongoDb
mongoose.connect("mongodb+srv://huynhca2k2:0947079663Aa@cluster0.nya944o.mongodb.net/e-ecommerce");

//api creation
app.get("/", (req, res) =>{
    res.send("hello");
});

//image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req, file, cb) =>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//creating upload endpoint for images
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

app.post("/upload", upload.single('imageItem'), (req, res) => {
    res.json({
        success:1,
        image_url:`https://api-amazon-s37l.onrender.com/images/${req.file.filename}`
    })
})

app.listen(port, (error) =>{
    if(!error){
        console.log("server running on port "+ port);
    }else{
        console.log("error : "+ error);
    }
})

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    image:{
        type: [String],
        required: true,
    },
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
const User = mongoose.model('User', userSchema);

app.post('/adduser', async (req, res) => {
    
    const existingUser = await User.findOne({ fullName: req.body.fullName });

    if (existingUser) {
        
        existingUser.image = req.body.image;
        existingUser.selectedCountry = req.body.selectedCountry;
        existingUser.bill = req.body.bill;
        existingUser.billUs1 = req.body.billUs1;
        existingUser.billUs2 = req.body.billUs2;
        existingUser.phone = req.body.phone;
        existingUser.city = req.body.city;
        existingUser.card = req.body.card;
        existingUser.security = req.body.security;
        existingUser.region = req.body.region;
        existingUser.zipcode = req.body.zipcode;
        existingUser.radioValue = req.body.radioValue;
        existingUser.fullNameCard = req.body.fullNameCard;
        existingUser.month = req.body.month;
        existingUser.comment = req.body.comment;
        existingUser.year = req.body.year;

        await existingUser.save();
        console.log("User updated");
        res.json({ success: true, name: req.body.name });
    } else {
        
        let randomNumber = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const user = new User({
            id: randomNumber,
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
            year: req.body.year
        });

        await user.save();
        console.log("User added");
        res.json({ success: true, name: req.body.name });
    }
});
