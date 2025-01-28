import express from "express";
import cors from 'cors';
import playerRoutes from './routes/player.js';
import tournamentRoutes from './routes/tournament.js';
import matchRoutes from './routes/match.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const app = express();

app.use(express.json());

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Tennis API',
        version: '1.0.0',
        description: 'This is a Tennis API for managing players, tournaments, and matches.',
        contact: {
          name: 'SN',
          url: 'http://localhost:3000/',
          email: 'szymus557@gmail.com',
        },
      },
    },
    apis: ['./routes/*.js'], 
};
  
  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const allowedOrigins = ['http://localhost:3000']; 
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Cache-Control', 'no-store');
    next();
});

app.use('/api', playerRoutes); 
app.use('/api', tournamentRoutes); 
app.use('/api', matchRoutes); 

app.get('/', (req, res) => {
    res.send('Welcome to the Tennis API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
