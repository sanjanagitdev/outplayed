import { verifyJwt, verifyJwtAdmin } from '../functions/index';
export const userAuthCheck = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      let token = req.headers.authorization.split(' ')[1];
      const isTokenValid = await verifyJwt(token);
      if (isTokenValid) {
        req.body.tokenData = isTokenValid;
        next();
      } else {
        res.send({
          code: 400,
          msg: 'Authentication is required',
        });
      }
    } else {
      res.send({
        code: 400,
        msg: 'Authentication is required',
      });
    }
  } catch (e) {
    res.send({
      code: 444,
      msg: 'Some error has occured!',
    });
  }
};

export const adminAuthCheck = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      let token = req.headers.authorization.split(' ')[1];

      const isTokenValid = await verifyJwtAdmin(token);

      if (isTokenValid) {
        req.body.tokenData = isTokenValid;
        next();
      } else {
        res.send({
          code: 400,
          msg: 'Authentication is required',
        });
      }
    } else {
      res.send({
        code: 400,
        msg: 'Authentication is required',
      });
    }
  } catch (e) {
    res.send({
      code: 400,
      msg: 'Authentication is required',
    });
  }
};

export const checkForLoggedIn = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      let token = req.headers.authorization.split(' ')[1];
      const isTokenValid = await verifyJwt(token);
      if (isTokenValid) {
        req.body.userid = isTokenValid.userid;
        next();
      } else {
        req.body.userid = null;
        next();
      }
    } else {
      req.body.userid = null;
      next();
    }
  } catch (e) {
    req.body.userid = null;
    next();
  }
};

export const userAuthCheckFirst = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      let token = req.headers.authorization.split(' ')[1];
      const isTokenValid = await verifyJwt(token);
      if (isTokenValid) {
        req.body.tokenData = isTokenValid;
        next();
      } else {
        res.send({
          code: 400,
          msg: 'Authentication is required',
        });
      }
    } else {
      res.send({
        code: 400,
        msg: 'Authentication is required',
      });
    }
  } catch (e) {
    res.send({
      code: 444,
      msg: 'Some error has occured!',
    });
  }
};
