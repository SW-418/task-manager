import supertest from "supertest"
import { ExpressApplication } from "../src/app";

test("Should sign up new user", async () => {
    await supertest(ExpressApplication)
        .post("/users")
        .send({
            firstName: "Jeff",
            surname: "Jefferson",
            email: "test@test.com",
            password: "test@test.com"
        }).expect(201)
})