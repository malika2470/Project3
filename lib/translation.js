import { Translate } from '@google-cloud/translate/build/src/v2';
import path from 'path';
import { readFileSync } from 'fs';

const credentialsPath = path.join(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);
const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));

const translate = new Translate({ credentials });

const detectLanguage = async (text) => {
  const [detection] = await translate.detect(text);
  return detection.language;
};

const translateText = async (text, targetLanguage) => {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error('Error during translation:', error);
    throw error;
  }
};

export { detectLanguage, translateText };


