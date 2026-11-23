// Modèle Mongoose : structure d'une tâche stockée dans MongoDB
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    // Titre de la tâche (obligatoire)
    title: { type: String, required: [true, 'Le titre est obligatoire'], trim: true },
    // Description facultative (affichée sous le titre dans l'interface)
    description: { type: String, default: '', trim: true },
    // Statut : false par défaut (non terminée)
    completed: { type: Boolean, default: false }
  },
  { timestamps: true } // ajoute createdAt et updatedAt automatiquement
);

module.exports = mongoose.model('Task', taskSchema);
