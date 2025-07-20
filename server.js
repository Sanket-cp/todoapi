const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const todoRoutes = require('./routes/todoroutes.js');
const userRoutes = require('./routes/userroutes.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/todo', todoRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the ToDo List API!');
});



app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
