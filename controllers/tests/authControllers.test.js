const request = require("supertest");
const server = require("../../server");
const bcrypt = require("bcrypt");
const supabase = require("../../mocks/supabaseClient");
const { Response, Headers } = jest.requireActual("node-fetch");
// describe("album tests", () => {
//     it("should successfully connect to the api", async () => {
//         const res = await request(app).get('/albums');
//         expect(res.statusCode).toEqual(200)
//     }, 10000)
// })

jest.mock("../../mocks/supabaseClient");
jest.mock("bcrypt");

describe("Login tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully login to the application and get a 201 response", async () => {
    const mockedAccessToken = { accessToken: "accesstokenprovided" };
    supabase.rpc.mockResolvedValue({
      data: { email: "heewwwslloy@gmtail.com" },
      error: null,
    });
    bcrypt.compare.mockResolvedValue(true);
    const res = await request(server)
      .post("/users/login")
      .send({ email: "heewwwslloy@gmtail.com", password: "hashedjwfsdfsft" });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should not send anything back to the user if they put the wrong credentials and send a 401", async () => {
    const mockedAccessToken = undefined;
    supabase.rpc.mockResolvedValue({ data: null, error: { error: "message" } });
    bcrypt.compare.mockResolvedValue(false);
    const res = await request(server)
      .post("/users/login")
      .send({ email: "heewwwslloy@gmtail.com", password: "h" });
    expect(res.statusCode).toEqual(401);
  });
});

describe("testing the signup api backend", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  mockedNewUser = {
    email: "newerUserrr@gmail.com",
    password: "receivedPassowrd",
    name: "ali",
    avatar_url: "some.png",
    username: "randomUser",
  };
  // it("should add user to database and return reocrd", async () => {
  //     supabase.rpc.mockResolvedValue({data: mockedNewUser, error: null});
  //     bcrypt.hash.mockResolvedValue("random");
  //     // const res = await request(app).post('/users/signup').send({
  //     //     email: "newUser@gmail.com",
  //     //     password: "random",
  //     //     name: "ali",
  //     //     avatar_url: "some.png",
  //     //     username: "randomUser"
  //     // })
  //     const signUpUser = new Response(
  //         JSON.stringify(mockedNewUser), {status:201, statusText:'it worked', headers:Headers}
  //     )

  //     expect(res.statusCode).toEqual(201);
  //     expect(res.body).toHaveProperty("data");
  // })
  it("should fail when not all fields are given", async () => {
    supabase.rpc.mockResolvedValue({ data: null, error: "error message" });
    bcrypt.hash.mockResolvedValue("random");
    const res = await request(server).post("/users/signup").send({
      name: "ali",
      avatar_url: "some.png",
      username: "randomUser",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("stackTrace");
  });
});
