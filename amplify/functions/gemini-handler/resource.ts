import { defineFunction, secret } from "@aws-amplify/backend";

export const geminiHandler = defineFunction({
  entry: "./handler.ts",
  environment: {
    GEMINI_API_KEY: secret("GEMINI_API_KEY"),
    GEMINI_MODEL: secret("GEMINI_MODEL"),
  },
  timeoutSeconds: 30,
});
