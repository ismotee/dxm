const Draft = require("../draft.js");

describe("Draft", () => {
  describe("new Draft()", () => {
    test("then new Draft object is made and having testsDraft and componentDraft", () => {
      const draft = new Draft();
      expect(draft).toBeTruthy();
      expect(draft.testsDraft).toBeTruthy();
      expect(draft.componentDraft).toBeTruthy();
    });
  });

  describe("create(settings)", () => {
    describe("given settings {}", () => {
      test("then should throw error", () => {
        const draft = new Draft();
        const exit = jest.spyOn(process, "exit").mockImplementation(() => {});
        const error = jest.spyOn(console, "error").mockImplementation(() => {});
        const settings = {};
        draft.create(settings);
        expect(error).toHaveBeenCalledWith(
          new Error("Settings has no name attribute.")
        );
        expect(exit).toHaveBeenCalledWith(1);
      });
    });
    describe("given settings {name: 'Test'}", () => {
      test("then should throw error", () => {
        const draft = new Draft();
        const settings = { name: "Test" };
        const exit = jest.spyOn(process, "exit").mockImplementation(() => {});
        const error = jest.spyOn(console, "error").mockImplementation(() => {});
        draft.create(settings);
        expect(error).toHaveBeenCalledWith(
          new Error("Settings has no type attribute.")
        );
        expect(exit).toHaveBeenCalledWith(1);
      });
    });
  });
});
