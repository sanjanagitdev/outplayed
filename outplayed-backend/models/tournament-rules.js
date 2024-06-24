import mongoose from "mongoose";
const Schema = mongoose.Schema;
//creating mongo database schema
const tournamentRulesSchema = new Schema({
    gameType: {
        type: String,
        // required: true,
    },
    tournamentRule: {
        type: String,
        required: true,
    },
});
const tournamentRulesModel = mongoose.model("tournamentrules", tournamentRulesSchema);
export default tournamentRulesModel;
