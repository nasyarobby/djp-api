const DJPApi = require("djp-api");
const f = jest.mock('fastify');

describe("Test main functions", () => {

    test("default props", () => {
        const Server = new DJPApi()
        expect(Server.port).toBe(3000)
        expect(Server.app.register.mock.calls.length).toBe(2);
        expect(Server.app.decorateReply.mock.calls[0][0]).toBe("box");
        expect(Server.app.register.mock.calls[0][1].specification.path).toMatch(/.*defaultSwagger.json/g);
    })

    test("if set, set port properly", () => {
        const Server = new DJPApi({ port: 3001 })
        expect(Server.port).toBe(3001)
    })

    test("if set, specificationFilePath set properly", () => {
        const Server = new DJPApi({specificationFilePath: "test"})
        expect(Server.specification).toBe("test")
    })

})
