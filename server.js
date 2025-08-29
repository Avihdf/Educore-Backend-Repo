const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();


const allowedOrigins = [
  'https://educore-beta.vercel.app',   // Your main frontend
  'http://localhost:5173',            // Local dev frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked CORS request from origin: ${origin}`);
      callback(new Error('CORS Not Allowed'));
    }
  },
  credentials: true
}));

// app.use(cors({
//   origin: "https://l6cbhrkx-5173.inc1.devtunnels.ms",
//   credentials: true
// }));


app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/thumbnails', express.static(path.join(__dirname, 'public/thumbnails')));
app.use('/coursesuploads', express.static(path.join(__dirname, 'public/coursesuploads')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


const authRoutes = require('./routes/auth');
const userData=require('./routes/userData')
const student=require('./routes/Educator/studentlist');
const dashboard=require('./routes/Educator/dashboard')

//Exports Educator Routes
const educatorupdate=require('./routes/Educator/educatorprofile')
const addcourse=require('./routes/Educator/addcourse')
const courselist=require('./routes/Educator/courses')


//Exports Student's Routes
const studentprofile=require('./routes/Student/studentprofile')
const coursedata=require('./routes/Student/coursedetails')
const payment=require('./routes/Student/payment')
const enrollment=require('./routes/Student/courseenrollenment')
const courseplayer=require('./routes/Student/courseplayer')


mongoose.connect(process.env.MONGO_URI, {}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
})

// mongoose.connect(process.env.MONGO_COMPASS_URI, {}).then(() => {
//     console.log('Connected to MongoDB Compass');
// }).catch((err) => {
//     console.error('Error connecting to MongoDB:', err);
// })


app.use('/api/auth', authRoutes);
app.use('/api',userData)


//Educator Panel API    
app.use('/api',student);
app.use('/api',dashboard);
app.use('/api/educator',educatorupdate)
app.use('/api',addcourse)
app.use('/api',courselist)


//Student's API
app.use('/api/student',studentprofile)
app.use('/api/student',coursedata)
app.use('/api/payment',payment)
app.use('/api',enrollment)
app.use('/api',courseplayer)



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});