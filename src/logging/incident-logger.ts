import { AttackType, IncidentLog, Verdict } from "./incident.ts";
import { logDbModel } from "../helpers/storage/db.ts";
import { logger } from "./logger.ts";

export class IncidentLogger {
  public static async reportAndSave(incident: IncidentLog) {
    if (!Object.values(AttackType).includes(incident.attackType)) {
      throw Error("unknown attack type");
    }

    if (!Object.values(Verdict).includes(incident.verdict)) {
      throw Error("unknown verdict");
    }

    const savedIncident = await logDbModel.create({
      ...incident,
    });

    logger.child(incident).error("incident occured");

    return savedIncident;
  }
}
