var AdalContext = require("@navara/nativescript-adal").AdalContext;
var adalContext = new AdalContext(
  "https://login.microsoftonline.com/contoso.onmicrosoft.com",
  "00000000-0000-0000-0000-000000000000",
  "00000002-0000-0000-c000-000000000000"
);

describe("login function", function () {
  it("exists", function () {
    expect(adalContext.login).toBeDefined();
  });
});

describe("getToken function", function () {
  it("exists", function () {
    expect(adalContext.getToken).toBeDefined();
  })
})