const request = require("supertest");
const app = require("../../server");
const dotenv = require("dotenv").config();
const supabase = require("../../mocks/supabaseClient");

jest.mock("../../mocks/supabaseClient")

describe("successfully GET albums page", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   })

  it("should successfully enter the albums page", async () => {
    const token = process.env.TEST_TOKEN;
    const res = await request(app)
      .get("/albums")
      .set("authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });

  it("should return an array of albums specific to the user if exists", async () => {
   supabase.rpc.mockResolvedValue([{id:1, user_id:"370b2ccb-b6ee-4e00-a474-ca262895cf93", albumname:"returnedalbum1"}]); 
    const token = process.env.TEST_TOKEN;
    const res = await request(app)
      .get("/albums")
      .set("authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("albumname");
    }
  });
});

describe("successfully CREATE album", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   })
   it("should create a new album and return the new record", async () => {
      supabase.rpc.mockResolvedValue([{id:54, user_id:"370b2ccb-b6ee-4e00-a474-ca262895cf93", albumname:"returnedalbum54"}]); 
      const id = "370b2ccb-b6ee-4e00-a474-ca262893cf93"
      const token = process.env.TEST_TOKEN;
      const res = await request(app)
      .post("/albums")
      .set("authorization", `Bearer ${token}`)
      .send({albumName: "newAlbum", userid: id});
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("albumname")
   });

   it("should delete the selected album based on ID and user_id", async() => {
      supabase.rpc.mockResolvedValue("Confirmation or Error message"); 
      const albumid = 12
      const userid = "370b2ccb-b6ee-4e00-a474-ca262893cf93"
      const token = process.env.TEST_TOKEN;
      const res = await request(app)
      .delete("/albums")
      .set("authorization", `Bearer ${token}`)
      .send({userid:userid, albumid:albumid})
      expect(res.statusCode).toEqual(204);
      //expect(res.body).toHaveProperty("message")
      //fix the response that we get and handle errors better especially with teh 204 stuff. this is 
      //more about getting the code to handle all situations more gracefully than tryna get  it to work. 
   })
})

// begin delete from albums where (albums.id = albumid AND albums.user_id = userid); end;