import { CronJob } from "cron";
import tournamentModel from "../models/tournament";
import { GetDiffrenceInMinutes } from "../functions";
import { StartCheckAnNotifyMembers } from "../functions/tournament";

const returnCron = (io) => {
    // @hourly
    // This Cron job function for check which tournament is going to be start today
    // and how many minutes left to start the tournament
    const job = new CronJob("1 * * * * *", async () => {
        try {
            const GetDataFive = await tournamentModel
                .find({
                    $and: [{ tournamentStarted: false }, { tournamentEnd: false }],
                })
                .lean();
            const FiveMinutesDiffrence = GetDataFive.filter(
                (el) => GetDiffrenceInMinutes(el.tournamentStart) <= 5
            );
            if (FiveMinutesDiffrence.length > 0) {
                for (let key in GetDataFive) {
                    await StartCheckAnNotifyMembers(GetDataFive[key], io);
                }
            }
        } catch (error) {
            return error;
        }
    });
    // Here we start this cron job
    job.start();
};
export { returnCron };
