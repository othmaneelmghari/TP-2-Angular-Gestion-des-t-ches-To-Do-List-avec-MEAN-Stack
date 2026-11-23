// Point d'entrée du serveur Express
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo-mean';

// Middlewares
app.use(cors());          // autorise Angular (localhost:4200) à appeler l'API
app.use(express.json());  // parse le JSON des requêtes

// Routes
app.use('/tasks', taskRoutes);
app.get('/', (req, res) => res.json({ message: 'API To-Do List opérationnelle' }));

// Connexion à MongoDB puis démarrage du serveur
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connecté :', MONGO_URI);
    app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB :', err.message);
    process.exit(1);
  });
