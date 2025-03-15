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

describe("test /login endpoint", () => {
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
