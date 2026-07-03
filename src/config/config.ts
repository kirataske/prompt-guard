class AppConfig {
  // rate limits settings
  public readonly requestsWindowInMs: number = 15 * 60 * 1000;
  public readonly requestsPerIp: number = 1000;
  public readonly useStandartHeaders: boolean = true;
  public readonly useLegacyHeaders: boolean = false;

  // form preferences
  public readonly promptSymbolsMaxCount: number = 1000;

  // environment variables
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

    if (isNaN(Number(APPLICATION_PORT))) {
      throw Error(
        "application port should be a number, please fix your environment variables.",
      );
    }

    this.applicationPort = Number(APPLICATION_PORT);
    this.detectorModelUrl = DETECTOR_MODEL_URL;
    this.geminiApiKey = GEMINI_API_KEY;
  }
}

export const appConfig = AppConfig.Instance;
