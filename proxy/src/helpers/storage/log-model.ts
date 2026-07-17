import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import { PromptResultModel } from "./prompts-model.ts";

/**
 * database model for storing incidents.
 */
@Table
export class IncidentLogModel extends Model {
  @AllowNull(false)
  @Column(DataType.STRING)
  sessionId: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  userIp?: string;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  happenedAt: string;

  @AllowNull(false)
  @Default("low")
  @Column(DataType.STRING)
  severity: string;

  @AllowNull(false)
  @Default("none")
  @Column(DataType.STRING)
  attackType: string;

  @AllowNull(false)
  @Default("none")
  @Column(DataType.STRING)
  verdict: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  segment: string;

  // storing prompt id for relation reasons.
  @ForeignKey(() => PromptResultModel)
  userPromptId: number;

  // sequelize relation api related thing.
  @BelongsTo(() => PromptResultModel)
  userPrompt: ReturnType<() => PromptResultModel>;
}
