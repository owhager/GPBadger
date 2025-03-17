const request = require("supertest"); //used to test express server
const mysql = require("mysql2");

// mock out mysql version used in server.js
jest.mock("mysql2");


//mock out db connection as if successful
const mockDb = {
    connect: jest.fn((callback) => callback(null)), 
    query: jest.fn(),
};

mysql.createConnection.mockReturnValue(mockDb); // return successful mocked connection

const { app } = require("../../database/server"); //get app from server.js

describe("test GET /login endpoint", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("if no email in call should return 400 error", async () => {
        const res = await request(app).get("/login");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "email is required in search" });
    });

    test("if no email found should return 404 error", async () => {
        //mock out blank return
        mockDb.query.mockImplementation((sql, values, callback) => {
            callback(null, []);
        });

        const response = await request(app).get("/login").query({ email: "fake missing email" });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "user with that email not found :(" });
    });

    test("should return db record if email found", async () => {
        const mockUser = [{ id: 1, email: "testname@gmail.com", password: "testpass", first_name: "test name", last_name: "last name" }];
        //mock return w mock user
        mockDb.query.mockImplementation((sql, values, callback) => {
            callback(null, mockUser);
        });

        const response = await request(app).get("/login").query({ email: "testname@gmail.com" });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });
});

describe("test DELETE /login endpoint", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("if no email query param, should return 400", async () => {
        const res = await request(app).delete("/login");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "email is required to delete an account" });
    });

    test("if user does not exist, should return 404", async () => {
        mockDb.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 0 });
        });

        const res = await request(app).delete("/login").query({ email: "null@gmail.com" });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "user not found - no deletion!" });
    });

    test("if user successfully delete, return 200", async () => {
        mockDb.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const res = await request(app).delete("/login").query({ email: "user@gmail.com" });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "user successfully deleted!" });
    });
});

describe("test PUT /login endpoint", () => {
    test("if no email provided in req body, return 400", async () => {
        const res = await request(app).put("/login").send({ newPassword: "newpassy" });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "email is required to update user!" });
    });

    test("if no update fields in req body, should return 400", async () => {
        const res = await request(app).put("/login").send({ email: "fakeemail@gmail.com" });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "please provide a user param field to update!" });
    });

    test("if user record doesn't exist, should return 404", async () => {
        mockDb.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 0 });
        });

        const res = await request(app).put("/login").send({ email: "DNE@gmail.com", newPassword: "newpassy" });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "user not found - nothing updated!" });
    });

    test("if user record updated, should return 200", async () => {
        mockDb.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const res = await request(app).put("/login").send({ email: "fakeuser@gmail.com", newPassword: "newpassy" });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "user password successfully updated!" });
    });
});

