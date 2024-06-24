import passport from "passport";
import { Strategy as OpenIDStrategy } from "passport-openid";
import steamConfig from "../config/steam.json";
const passportService = () => {
  passport.use(
    new OpenIDStrategy(steamConfig, (identifier, done) => {
      process.nextTick(() => {
        const user = {
          identifier,
          steamID: identifier.match(/\d+$/)[0],
        };
        return done(null, user);
      });
    })
  );
};
export { passportService };
