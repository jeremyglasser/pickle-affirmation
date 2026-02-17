# Pickle Affirmation
This repository provides a web application that delivers pickle-themed affirmations, built with Vue.js and AWS Amplify.

## Overview
This application is designed to provide a moment of positivity with a pickle-themed twist. Built with Vue.js and powered by AWS Amplify Gen 2, it demonstrates a modern full-stack architecture with a premium frontend experience.

## Features
- **Daily Affirmations**: Encouraging messages to keep you going.
- **Full-Screen Immersion**: A sleek, focused design that puts the pickle front and center.
- **Premium Aesthetics**: Modern typography and smooth animations for a high-quality experience.
- **Amplify Backend**: Seamlessly integrated with AWS Amplify Gen 2 for data and authentication.
- **Interactive UI**: Change affirmations with a single click.

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/vue/start/quickstart/#deploy-a-fullstack-app-to-aws) of our documentation.

## Local Development

### 1. Prerequisites
Ensure you have the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed and configured with your credentials.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Amplify Sandbox
The sandbox provides an isolated backend environment for your local development.
```bash
npx ampx sandbox
```

### 4. Configure Secrets
For backend functions (like the Auth pre-sign-up trigger) and the bridged environment in production, you must set your secrets in the Amplify Secret Store. Run these commands in your terminal:

```bash
# Required for the AI Chat API
npx ampx sandbox secret set GEMINI_API_KEY
npx ampx sandbox secret set GEMINI_MODEL

# Required for Admin access control
npx ampx sandbox secret set ADMIN_WHITELIST

# Optional / Project Metadata
npx ampx sandbox secret set GEMINI_PROJECT_NUMBER
```

> **Note**: When prompted, paste the corresponding values from your `.env.local` file. This securely stores the values in AWS SSM Parameter Store so your Lambda functions can access them.

### 5. Running the Frontend
Once the sandbox is running and secrets are set, start the Vue.js dev server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.