require("dotenv").config({
    path: process.env.NODE_ENV === "development" ? ".env.development" : ".env"
});
const express = require('express');
const app = express();
const { userModel } = require("./models/user.model");
const connectDB = require("./config/dbconfig");
const PORT = process.env.PORT || 1234;
const helmet = require("helmet");
const { rateLimiter } = require("./utils/rate.limiter.helper");
const cors = require('cors')


app.set("trust proxy", 1);


// connect to DB
connectDB();

app.use(cors())

// app.use(cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
// }));

app.use(helmet({
    crossOriginResourcePolicy: false
}));
app.use(express.json());

// rate limiting middleware
app.use(rateLimiter);



app.get("/", (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            message: "Blog API server is up and running"
        });
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message || "Internal server error"
        })
    }
})

app.use("/api/v1/auth", require("./routes/v1/auth.routes"));
app.use("/api/v1/blogs", require("./routes/v1/blog.routes"));
app.use("/api/v1/comments", require("./routes/v1/comment.routes"));
app.use("/api/v1/users", require("./routes/v1/user.routes"));


app.listen(PORT, (error) => {
    if (error) {
        console.log("Error during starting the server", error);
    } else {
        console.log(`server is running on http://localhost:${PORT} `);
    }

})