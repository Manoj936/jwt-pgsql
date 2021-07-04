const db = require("../database/db");
const tokenGenerator = require("../utils/jwtGenerator");
const bcrypt = require("bcrypt");
const e = require("express");
class TransactionService {
  static Registration(req, res) {
    try {
      const { username, email, password } = req.body;
      if (
        username == null ||
        username == undefined ||
        email == null ||
        email == undefined ||
        password == null ||
        password == undefined
      ) {
        return res.status(500).json({ message: "Invalid Details" });
      }
      db.tx(async (t) => {
        const checkUser = await t.oneOrNone(
          `SELECT user_email FROM "users" WHERE user_email = '${email}'`
        );
        if (checkUser !== null) {
          return res
            .status(403)
            .json({ status: false, message: "User Already Exist" });
        }
        const saltRounds = 10;
        const genSalt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, genSalt);
        const insertUser = await t.one(`INSERT INTO users(
            user_name, user_password, user_email)
            VALUES ('${username}','${hash}','${email}') returning user_id;`);
        const generateToken = await tokenGenerator(insertUser.user_id);
        return {
          user_id: insertUser.user_id,
          token: generateToken,
        };
      })
        .then((data) => {
          if (data.user_id !== undefined && data.token !== undefined) {
            res
              .status(200)
              .json({ status: true, message: "Success", data: data });
          }
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json({
            message: e.message ? e.message : "Unexpected Error",
          });
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message ? error.message : "Unexpected Error" });
    } finally {
      db.end;
    }
  }

  static Login(req, res) {
    try {
      const { email, password } = req.body;
      if (
        email == undefined ||
        email == "" ||
        email == null ||
        password == undefined ||
        password == "" ||
        password == null
      ) {
        return res.status(500).json({ message: "Invalid form values" });
      }
      db.task(async (transaction) => {
        const isValidUser = await transaction.oneOrNone(
          `SELECT * FROM "users" WHERE user_email = '${email}'`
        );
        if (isValidUser == null) {
          return res
            .status(403)
            .json({ status: false, message: "User Does Not Exist" });
        }
        const isValidPassword = await bcrypt.compare(
          password,
          isValidUser.user_password
        );
        if (isValidPassword) {
          const generateToken = await tokenGenerator(isValidUser.user_id);
          return {
            "user_id": isValidUser.user_id,
            "token": generateToken,
          };
        } else {
          return res.status(403).json({ message: "Password Invalid" });
        }
      })
        .then((data) => {
          if(data.user_id !== undefined && data.token  !== undefined){
            res
            .status(200)
            .json({ status: true, message: "Success", data: data });
          }
        })
        .catch((e) => {
          res
            .status(500)
            .json({ message: e.message ? e.message : "Unexpected Error" });
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message ? error.message : "Unexpected Error" });
    } finally {
      db.end;
    }
  }
}
module.exports = TransactionService;
