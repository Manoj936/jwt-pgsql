const db = require("../database/db");
const bcrypt = require("bcrypt");
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
                  .then((data) => {
                    res.status(200).json({
                      status: true,
                      message: "succsessfully registred",
                      userid: data.user_id,
                    });
                  })
                  .catch((e) => {
                    console.status(200).json({
                      status: false,
                      message: "Unexpected Error Occured",
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
    }
  }
}

module.exports = AuthController;
