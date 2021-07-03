const db = require("../database/db");
const bcrypt = require("bcrypt");
const tokenGenerator = require("../utils/jwtGenerator");
class AuthController {
  static getUsers(req, res) {
    try {
      const query = 'SELECT * FROM "users"';
      db.any(query).then((users) => {
        res.status(200).json({ message: "Success", Allusers: users });
      });
    } catch (e) {
      res.status(500).json({ message: e.message ? e.message : "Failed" });
    } finally {
      db.end;
    }
  }
  //Registration
  static addUser(req, res) {
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
      const checkUserQuery = `SELECT user_email FROM "users" WHERE user_email = '${email}'`;
      db.any(checkUserQuery).then((user) => {
        console.log(user);
        if (user.length > 0) {
          return res
            .status(403)
            .json({ status: false, message: "User Already Exist" });
        } else {
          const saltRounds = 10;
          bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
              if (hash) {
                const insertQuery = `INSERT INTO users(
                            user_name, user_password, user_email)
                            VALUES ('${username}','${hash}','${email}') returning user_id;`;
                db.one(insertQuery)
                  .then(async (data) => {
                    const token = await tokenGenerator(data.user_id);
                    res.status(200).json({
                      status: true,
                      message: "succsessfully registred",
                      userid: data.user_id,
                      token: token,
                    });
                  })
                  .catch((e) => {
                    res.status(200).json({
                      status: false,
                      message: `Unexpected Error Occured , ${e}`,
                    });
                  });
              } else {
                return res.status(500).json({ message: e.message });
              }
            });
          });
        }
      });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    } finally {
      db.end;
    }
  }

  static login(req, res) {
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
      //check wheater valid user or not
      const checkUserQuery = `SELECT * FROM "users" WHERE user_email = '${email}'`;
      db.oneOrNone(checkUserQuery)
        .then(async (data) => {
          if (data !== null) {
            const passwordTestRes = await bcrypt.compare(
              password,
              data.user_password
            );
            if (passwordTestRes) {
              const token = await tokenGenerator(data.user_id);
              return res.status(200).json({
                status: true,
                message: "Logged in successfully",
                token: token,
                userid: data.user_id,
                date : new Date().toLocaleDateString()
              });
            } else {
              return res.status(401).json({
                status: false,
                message: "Password Invalid",
              });
            }
          } else {
            return res
              .status(403)
              .json({ status: false, message: "User Does Not Exist" });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
    } finally {
    }
  }
}

module.exports = AuthController;
