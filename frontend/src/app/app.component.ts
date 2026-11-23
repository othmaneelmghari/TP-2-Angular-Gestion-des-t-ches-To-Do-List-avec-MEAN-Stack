import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from './models/task.model';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule], // Angular Forms (template-driven, ngModel)
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  newTitle = '';
  newDescription = '';
  error = '';

  // Gestion de l'édition en ligne
  editingId: string | null = null;
  editTitle = '';
  editDescription = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  // Lire : charger toutes les tâches
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => { this.tasks = tasks; this.error = ''; },
      error: () => (this.error = "Impossible de contacter l'API (backend démarré ?)")
    });
  }

  // Créer : ajouter une tâche
  addTask(): void {
    const title = this.newTitle.trim();
    if (!title) return;
    this.taskService.addTask({ title, description: this.newDescription.trim() }).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.newTitle = '';
        this.newDescription = '';
      },
      error: () => (this.error = "Erreur lors de l'ajout de la tâche")
    });
  }

  // Modifier : marquer terminée / non terminée
  toggleCompleted(task: Task): void {
    this.taskService.updateTask(task._id!, { completed: !task.completed }).subscribe({
      next: (updated) => (task.completed = updated.completed),
      error: () => (this.error = 'Erreur lors de la mise à jour')
    });
  }

  // Modifier : passer en mode édition
  startEdit(task: Task): void {
    this.editingId = task._id!;
    this.editTitle = task.title;
    this.editDescription = task.description ?? '';
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  // Modifier : enregistrer le nouveau contenu
  saveEdit(task: Task): void {
    const title = this.editTitle.trim();
    if (!title) return;
    this.taskService
      .updateTask(task._id!, { title, description: this.editDescription.trim() })
      .subscribe({
        next: (updated) => {
          task.title = updated.title;
          task.description = updated.description;
          this.editingId = null;
        },
        error: () => (this.error = 'Erreur lors de la modification')
      });
  }

  // Supprimer
  deleteTask(task: Task): void {
    this.taskService.deleteTask(task._id!).subscribe({
      next: () => (this.tasks = this.tasks.filter((t) => t._id !== task._id)),
      error: () => (this.error = 'Erreur lors de la suppression')
    });
  }
}
