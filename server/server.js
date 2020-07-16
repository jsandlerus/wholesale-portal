const express = require("express");
const app = express();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./modules/db");
const helmet = require("helmet");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const passport = require("./modules/passport");
const sessionMiddleware = require("./modules/session-middleware");
const userRouter = require("./routes/user.router");
const gcRouter = require("./routes/goCardless.router");
const orderRouter = require("./routes/order.router");
const productRouter = require("./routes/product.router");
const adminProductRouter = require("./admin-routes/product.router");
const docuSignRouter = require("./modules/docuSign");

ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjY4MTg1ZmYxLTRlNTEtNGNlOS1hZjFjLTY4OTgxMjIwMzMxNyJ9.eyJUb2tlblR5cGUiOjUsIklzc3VlSW5zdGFudCI6MTU5NDg1MTQwNywiZXhwIjoxNTk0ODgwMjA3LCJVc2VySWQiOiI5ZDRkYWE1NC05N2VmLTQ3NTAtOWFhZS00YmEzNDIyZmYwMGEiLCJzaXRlaWQiOjEsInNjcCI6WyJzaWduYXR1cmUiLCJjbGljay5tYW5hZ2UiLCJvcmdhbml6YXRpb25fcmVhZCIsInJvb21fZm9ybXMiLCJncm91cF9yZWFkIiwicGVybWlzc2lvbl9yZWFkIiwidXNlcl9yZWFkIiwidXNlcl93cml0ZSIsImFjY291bnRfcmVhZCIsImRvbWFpbl9yZWFkIiwiaWRlbnRpdHlfcHJvdmlkZXJfcmVhZCIsImR0ci5yb29tcy5yZWFkIiwiZHRyLnJvb21zLndyaXRlIiwiZHRyLmRvY3VtZW50cy5yZWFkIiwiZHRyLmRvY3VtZW50cy53cml0ZSIsImR0ci5wcm9maWxlLnJlYWQiLCJkdHIucHJvZmlsZS53cml0ZSIsImR0ci5jb21wYW55LnJlYWQiLCJkdHIuY29tcGFueS53cml0ZSJdLCJhdWQiOiJmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgiLCJhenAiOiJmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgiLCJpc3MiOiJodHRwczovL2FjY291bnQtZC5kb2N1c2lnbi5jb20vIiwic3ViIjoiOWQ0ZGFhNTQtOTdlZi00NzUwLTlhYWUtNGJhMzQyMmZmMDBhIiwiYW1yIjpbImludGVyYWN0aXZlIl0sImF1dGhfdGltZSI6MTU5NDg1MTQwNSwicHdpZCI6IjU5NTk3YWQ0LWU2ZWItNDYzNi1hZjdmLTYyZTZhYmQxMzU0ZSJ9.LAFCi8SZVxxMjgjagkFLBiRyMPU7iRjd2p9qtEWxfvQcb3C02W0XBdBZb9a8IDrAu8VrJVE_VvU6O_SPBmwMFwfOe9twFS875o0R2STp957HciScmVlfMSllBj0xFt3dzGawqRod5J2mUVWbfUPKQlIRnMX-Otpumv5RDlh8zXG4gXHe5q0HdabJ0mmJZybBkVAEoCISyKaWfwspWwBkUZFvruT3leEtt1f-orEyV498D1-s6qNNnLJoimpnNU_cIrDqHob8BzfbR43uQrIOi82hM9450_uTqwKWYhSo7iAmul9K3o9ULNRwadjh56rxIF46i_TI7VrqwQ9N9AgzkQ";
ACCOUNT_ID = "2b2855d4-d642-4325-8cc0-9fe35d5cb650";
USER_FULLNAME = "John Travolta :D";
USER_EMAIL = "jsandler.aol@gmail.com";

dataList = [{ACCESS_TOKEN, ACCOUNT_ID, USER_FULLNAME, USER_EMAIL}];
console.log(dataList);
docuSignRouter(dataList);
dotenv.config();

connectDB();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("build"));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

/*Routers*/
app.use("/auth", userRouter);
app.use("/gc", gcRouter);
app.use("/orders", orderRouter);
app.use("/products", productRouter);
//app.use("/docuSign", docuSignRouter);

/*AdminRouters*/
app.use("/admin-products", adminProductRouter);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

server.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
