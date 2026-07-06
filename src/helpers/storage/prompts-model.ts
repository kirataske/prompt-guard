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

@Table
export class PromptResultModel extends Model {
  @AllowNull(false)
  @Unique(true)
  @Column(DataType.STRING)
  calculatedHash: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  promptResult: string;

  @HasOne(() => IncidentLogModel)
  incident: ReturnType<() => IncidentLogModel>;
}
