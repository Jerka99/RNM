const http = require("http");
const connection = require("./database");

const handleGetRequest = (req, res) => {
  const sql = "SELECT * FROM usersbase";
  connection.query(sql, (err, data) => {
    if (err) throw err;

    return res.end(JSON.stringify(data));
  });
};

const handlePostRequest = (req, res) => {
  if (req.url === "/signup") {
    const sql =
      "INSERT INTO usersbase (`email`, `password`, `name`, `secondname`) VALUES (?)";
    let body = "";
    req
      .on("data", (chunk) => {
        //chunk is buffer
        body += chunk.toString();
      })
      .on("end", () => {
        const values = Object.values(JSON.parse(body));

        connection.query(sql, [values], (err, data) => {
          if (err) {
            if (err.errno == 1062) {
              return res.end(JSON.stringify("email already in use"));
            } else {
              throw err;
            }
          } else {
            return res.end(JSON.stringify(data));
          }
        });
      });
  } else if (req.url === "/signin") {
    let body = "";
    req
      .on("data", (chunk) => {
        body += chunk.toString();
      })
      .on("end", () => {
        const [email, password] = Object.values(JSON.parse(body));

        const sql = `SELECT * FROM usersbase WHERE email = "${email}" AND password = "${password}"`;
        connection.query(sql, (err, data) => {
          if (err) {
            res.end({ err: err });
          } else {
            if (data.length > 0) {
              res.end(JSON.stringify(data));
            } else {
              res.end(JSON.stringify("wrong username/password"));
            }
          }
        });
      });
  }
};

const handleDeleteRequest = () =>{

}

const server = http.createServer((req, res) => {
  const { method } = req;
  // Set CORS headers

  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");
  switch (method) {
    case "GET":
      return handleGetRequest(req, res);
    case "POST":
      return handlePostRequest(req, res);
    default:
      throw new Error(`Unsupported request method: ${method}`);
  }
});

server.listen(4000, "127.0.0.1", () => {
  const { address, port } = server.address();
  connection.connect((err) => {
    if (err) throw err;
    console.log(
      `database is connected, server's adress n' port ${address}:${port}`
    );
  });
});
