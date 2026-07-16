class AppConfig {
  // daily limits for generating responses.
  // TODO: including blocked responses, leave it as is?
  public readonly genAiDailyWindowInMs: number = 24 * 60 * 60 * 1000; // 24 hours.
  public readonly genAiDailyRequestsPerIp: number = 20; // Gemini's Free Tier Requests Per Day.

  // limits for generating responses (per minute).
  // TODO: same as for daily limits.
  public readonly genAiMinuteWindowInMs: number = 60 * 1000; // 1 minute.
  public readonly genAiRequestsPerMinute: number = 5; // Gemini's Free Tier Requests Per Minute.

  // limits for obtaining incident logs.
  // TODO: adjust according to client's requests frequency.
  public readonly incidentRequestWindowInMs: number = 15 * 60 * 1000; // 15 minutes (recommended value: express-rate-limit)
  public readonly incidentRequestsPerIp: number = 100; // (recomended value: express-rate-limit)

  // which headers express-rate-limit should return if rate limit hits;
  // even if not tested, consider as mutually exclusive settings;
  public readonly useStandartHeaders: boolean = true;
  public readonly useLegacyHeaders: boolean = false;

  // genai preferences.

  // which Gemini model is used for generating content;
  // https://ai.google.dev/gemini-api/docs/interactions-overview#supported-models-agents;
  public readonly geminiModel = "gemini-2.5-flash";

  // how much symbols user have per prompt.
  public readonly promptSymbolsMaxCount: number = 1000;

  // storage preferences

  // wipes out data from db and creates tables.
  // TODO: isnt removing db file would be simpler? something to ponder about.
  public readonly resetOnStartup: boolean = false;

  // which hash function is used for calculating stored user prompt.
  // hashing is used for faster existing prompt results lookup.
  // 'sha256' is default, you can use 'md5' or 'sha1' for smaller hash sizes
  public readonly hashFunction = "sha256";

  // environment variables
  // TODO: port probably should have been set here and not as env. variable.
  public readonly applicationPort: number;
  public readonly detectorModelUrl: string;
  public readonly geminiApiKey: string;

  private static _instance: AppConfig;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    const { APPLICATION_PORT, DETECTOR_MODEL_URL, GEMINI_API_KEY } =
      process.env;

    if (!APPLICATION_PORT || !DETECTOR_MODEL_URL || !GEMINI_API_KEY) {
      throw Error(
        "required environment variables are absent, refer to .env.example for adding missing variables.",
      );
    }

    const appPortParsed = Number(APPLICATION_PORT);

    if (isNaN(appPortParsed)) {
      throw Error(
        "application port should be a number, please fix your environment variables.",
      );
    }

    this.applicationPort = appPortParsed;
    this.detectorModelUrl = DETECTOR_MODEL_URL;
    this.geminiApiKey = GEMINI_API_KEY;
  }
}

export const appConfig = AppConfig.Instance;
