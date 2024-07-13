const request = require("supertest");
const app = require("../../server");
const dotenv = require("dotenv").config();
const supabase = require("../../mocks/supabaseClient");

jest.mock("../../mocks/supabaseClient");

beforeEach(() => {
  jest.clearAllMocks();
});

const token = process.env.TEST_TOKEN;
it("successfully enters an album page and receives album images correlating to the album", async () => {
  const albumid = 3;
  const response = await request(app)
    .get(`/albums/${albumid}/images`)
    .set("Authorization", `Bearer: ${token}`);
  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
  const images = response.body;
  images.forEach((obj) => {
    expect(obj).toHaveProperty("id");
    expect(obj).toHaveProperty("description");
    expect(obj).toHaveProperty("name");
    expect(obj).toHaveProperty("album_id");
  });
});

it("creates an album image for a selected album", async () => {
    const albumid = 3;
    const response = await request(app)
    .post(`/albums/${albumid}/images`)
    .set("Authorization", `Bearer: ${token}`)
    .send({name: "llama.png", description: "a llama jumping on the moon with little gravity"})
    expect(response.statusCode).toBe(200);
    //testing if the object returned has the properties.
    const obj = response.body;
    expect(obj).toHaveProperty("id");
    expect(obj).toHaveProperty("description");
    expect(obj).toHaveProperty("name");
    expect(obj).toHaveProperty("album_id");
    
});

it("does not create an album image for a non-existent album", async () => {
    const albumid = 37;
    const response = await request(app)
    .post(`/albums/${albumid}/images`)
    .set("Authorization", `Bearer: ${token}`)
    .send({name: "llama.png", description: "a llama jumping on the moon with little gravity"})
    expect(response.statusCode).toBe(400);
    //testing if the object returned has the properties.
    const obj = (response.body);
    expect(obj).toHaveProperty('details')
});


it('successfully deletes an image from an album based on the imageid', async () => {
    const imageid=7
    const response = await request(app)
    .delete(`/albums/${3}/images`)
    .set("Authorization", `Bearer: ${token}`)
    .send({imageid});
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Album Deleted Successfully")
})

it('handles correctly deleting an image from an album with non existent imageid', async () => {
    const imageid=531
    const response = await request(app)
    .delete(`/albums/${3}/images`)
    .set("Authorization", `Bearer: ${token}`)
    .send({imageid});
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("ImageID provided does not exist.")
})