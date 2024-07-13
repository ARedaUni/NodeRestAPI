const supabase = require("../config/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

exports.signUp = asyncHandler(async (req, res) => {
  const { email, password, name, avatar_url, username } = req.body;
  if (!email || !password || !username) {
    res.status(400);
    throw new Error("All fields are mandatroy");
  }
  //hash password

  const hashedPassword = await bcrypt.hash(password, 10);
  const sendObject = {
    email,
    password: hashedPassword,
    username,
    name,
    avatar_url,
  };
  const { data, error } = await supabase.rpc("add_a_user", sendObject);
  const token = jwt.sign(sendObject, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "360h",
  });
  if (error) {
    res.status(400).send(error);
    throw new Error(JSON.stringify(error, null, 2));
  }
  res.status(201).send({ data, token });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const { data, error } = await supabase.rpc("login", { p_email: email });
  
  if (error) throw new Error(JSON.stringify(error, null, 2));
  if (data && (await bcrypt.compare(password, data.password))) {
    const token = jwt.sign(
      {
        user: {
          id: data.id,
          email: data.email,
          password: data.password,
          name: data.name,
          username: data.username,
          avatar_url: data.avatar_url,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3600m" }
    );
    const options = {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, 
    };
    res.cookie('token', token, options)
    res.status(201).json({ data, token });
  } else {
    res.status(401);
    throw new Error("Wrong email or password");
  }
});
