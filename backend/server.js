require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`OpenAI Key loaded: ${process.env.AZURE_OPENAI_KEY ? 'Yes' : 'No'}`);
});
