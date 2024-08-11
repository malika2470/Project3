const { Translate } = require('@google-cloud/translate').v2;
const path = require('path');
const { readFileSync } = require('fs');

const credentialsPath = path.join(__dirname, 'path-to-your-credentials-file.json'); // Update this with the actual path to your credentials file
const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));

const translate = new Translate({ credentials });

const detectLanguage = async (text) => {
  const [detection] = await translate.detect(text);
  return detection.language;
};

const translateText = async (text, targetLanguage) => {
  const [translation] = await translate.translate(text, targetLanguage);
  return translation;
};

module.exports = { detectLanguage, translateText };






