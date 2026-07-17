require('dotenv').config();

const express = require('express');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');

const app = express();
app.use(express.json());

// Middleware to enable CORS
app.use(cors());

// user routes
app.use('/users', userRoutes);

// products routes
app.use('/products', productRoutes);



// Error handling middleware
// This should be placed after all other routes
app.use(errorHandler);

app.listen(process.env.PORT, () => console.log(`Server is running on http://${process.env.DOMAIN}:${process.env.PORT}`));