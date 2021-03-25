/** EXTERNAL DEPENDENCIES */
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const hbs = require("express-handlebars");

/** ROUTERS */
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");
const ordersRouter = require("./routes/orders");
const { setCors } = require("./middleware/security");

/** INIT */
const app = express();

/** LOGGING */
app.use(logger("dev"));

/**CONNECT TO DB */
/* mongoose.connect("mongodb://localhost:27017/book-shop", */
const url=`mongodb+srv://bookstore_user:${process.env.password_bookstore}@cluster0.jdiqq.mongodb.net/bookstore?retryWrites=true&w=majority`;
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on("error", console.error);
mongoose.connection.on("open", function() {
    console.log("Database connection established...");
});
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");


/** REQUEST PARSERS */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(setCors);

/** STATIC FILES*/
app.use(express.static(path.join(__dirname, "public")));

/** ROUTES */
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/orders", ordersRouter);

/** ERROR HANDLING */
/* app.use(function(req, res, next) {
    const error = new Error("Looks like something broke...");
    error.status = 400;
    next(error);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500).send({
        error: {
            message: err.message
        }
    });
}); */

/** EXPORT PATH */
//module.exports = app;

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("Connected to port " + port);
});