const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          res.status(401);
          throw new Error("User is not authorized");
        }
        req.user = decoded.user;
        next();
      });
      if (!token) {
        res.status(401);
        throw new Error("User is not authroized or token is missing");
      }
    } catch (e) {
      console.log(e);
    }
  }
});

module.exports = validateToken;
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMzcwYjJjY2ItYjZlZS00ZTAwLWE0NzQtY2EyNjI4OTNjZjkzIiwiZW1haWwiOiJoZWV3d3dzbGxveUBnbXRhaWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkdzEvN0J1bmYxQ1hEcHhhTy5XTVZUdVhqdE9mMWMzUmVJZ3NDREVlY3B3LlVJMjJ3LnBZWmUiLCJuYW1lIjoic29tZW5hbWUiLCJ1c2VybmFtZSI6InJhbmRvbVVzZXIiLCJhdmF0YXJfdXJsIjoic29tZV91cmwifSwiaWF0IjoxNzE5MDcwODA2LCJleHAiOjE3MTkyODY4MDZ9._p2ISKmJARf0hn5nLuHC8umIJIqqDaAuZIua9YyzyZg
