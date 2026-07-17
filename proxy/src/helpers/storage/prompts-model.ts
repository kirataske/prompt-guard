import { IncidentLogModel } from "./log-model.ts";
import {
  AllowNull,
  Column,
  Table,
  Unique,
  Model,
  DataType,
  HasOne,
} from "sequelize-typescript";

/**
 * database model for storing prompt results.
 */
@Table
export class PromptResultModel extends Model {
  /**
   * calculated hash of user prompt.
   */
  @AllowNull(false)
  @Unique(true)
  @Column(DataType.STRING)
  calculatedHash: string;

  /**
   * response of external model of prompt.
   */
  @AllowNull(false)
  @Column(DataType.TEXT)
  promptResult: string;

  // sequelize relation api related thing.
  @HasOne(() => IncidentLogModel)
  incident: ReturnType<() => IncidentLogModel>;
}
