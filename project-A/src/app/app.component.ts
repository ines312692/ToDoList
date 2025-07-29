import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { TasksComponent } from './tasks/tasks.component';
import { User } from './user/user.model';
import { ApiService } from './service/ApiService';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, HeaderComponent, UserComponent, TasksComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  users: User[] = [];
  selectedUserId?: string;
  title = 'todo-app';
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  protected loadUsers() {
    this.loading = true;
    this.error = null;

    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Failed to load users. Please make sure the backend server is running.';
        this.loading = false;
      }
    });
  }

  get username() {
    return this.users.find(p => p.id === this.selectedUserId)?.name;
  }

  onSelectUser(id: string) {
    this.selectedUserId = id;
  }
}
