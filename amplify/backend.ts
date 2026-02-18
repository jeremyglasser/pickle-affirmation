import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

import { geminiHandler } from './functions/gemini-handler/resource';

defineBackend({
  auth,
  data,
  geminiHandler,
});
