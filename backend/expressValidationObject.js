var { body } = require("express-validator");

const expressvalidation = {
  email: body("email").isEmail().withMessage("Not a valid e-mail address"),
  password: body("password")
    .isLength({ min: 6, max: 15 })
    .withMessage("Not a valid password, required 6 - 15 symbols")
    .custom((value) => !/\s/.test(value))
    .withMessage("No spaces are allowed in the password"),
  passwordConfirmation: body("passwordConfirmation")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords do not match"),
  name: body("name")
    .isLength({ min: 1, max: 15 })
    .withMessage("Minimal name length is 1 character")
    .isLength({ max: 15 })
    .withMessage("Maximal second name length is 15 characters")
    .custom((value) => !/\s/.test(value))
    .withMessage("No spaces are allowed in the name"),
  secondname: body("secondname")
    .isLength({ min: 1 })
    .withMessage("Minimal second name length is 1 character")
    .isLength({ max: 15 })
    .withMessage("Maximal second name length is 15 characters")
    .custom((value) => !/\s/.test(value))
    .withMessage("No spaces are allowed in the second name"),
};

module.exports = expressvalidation;
