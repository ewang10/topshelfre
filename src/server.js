const { PORT = 3000 } = process.env;
const app = require('./app');

const listener = () => console.log(`Server running on port ${PORT}`);

app.listen(PORT, listener);
