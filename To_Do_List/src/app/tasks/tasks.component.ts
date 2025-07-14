import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { NewTask, Task } from './task.model';
import { NewTaskComponent } from './new-task/new-task.component';
import { ApiService } from '../service/ApiService';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskComponent, NewTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit, OnChanges {
  @Input({ required: true }) username?: string;
  @Input({ required: true }) userId?: string;

  isAddingTask = false;
  selectedUserTasks: Task[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUserTasks();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && !changes['userId'].firstChange) {
      this.loadUserTasks();
    }
  }

  protected loadUserTasks() {
    if (!this.userId) return;

    this.loading = true;
    this.error = null;

    this.apiService.getTasks(this.userId).subscribe({
      next: (tasks) => {
        this.selectedUserTasks = tasks;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.error = 'Failed to load tasks';
        this.loading = false;
      }
    });
  }

  onStartAddTask() {
    this.isAddingTask = true;
  }

  onCompleteTask(id: string) {
    this.apiService.deleteTask(id).subscribe({
      next: () => {
        // Recharger les tâches après suppression
        this.loadUserTasks();
      },
      error: (err) => {
        console.error('Error deleting task:', err);
        this.error = 'Failed to delete task';
      }
    });
  }

  onCancelAddTask() {
    this.isAddingTask = false;
  }

  onAddTask(newTask: NewTask) {
    if (!this.userId) return;

    const taskData = {
      title: newTask.title,
      summary: newTask.summary,
      date: newTask.date,
      userId: this.userId
    };

    this.apiService.createTask(taskData).subscribe({
      next: (createdTask) => {
        // Recharger les tâches après création
        this.loadUserTasks();
        this.isAddingTask = false;
      },
      error: (err) => {
        console.error('Error creating task:', err);
        this.error = 'Failed to create task';
      }
    });
  }
}
