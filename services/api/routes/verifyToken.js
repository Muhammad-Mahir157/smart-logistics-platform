const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  // console.log("This is req header", req.headers.token);
  // console.log("This is req body", req.body);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    // console.log("This is token", token);
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        res.status(403).json("Token is not valid!");
        return;
      }
      // console.log(err);
      req.user = user;
      // console.log("This is user from jwt", user);
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyAuthToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("This is req header", req.headers);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    // console.log("This is token", token);
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      // console.log(err);
      req.user = user;
      // console.log("This is user from jwt", user);
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyDriverAdminAuthToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("This is req header", req.headers);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    // console.log("This is token", token);
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");

      if (user.role == "driver" || user.role == "admin") {
        // console.log(err);
        req.user = user;
        // console.log("This is user from jwt", user);
        next();
      } else {
        res.status(401).json("You are not authenticated!");
      }
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyDriverAuthToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("This is req header", req.headers);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    // console.log("This is token", token);
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");

      if (user.role == "driver") {
        // console.log(err);
        req.user = user;
        // console.log("This is user from jwt", user);
        next();
      } else {
        res.status(401).json("You are not authenticated!");
      }
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyAuthToken,
  verifyDriverAuthToken,
  verifyDriverAdminAuthToken,
};
