import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent, TodoFormComponent, HttpClientModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  selectedTodo: Todo | null = null;
  loading = false;
  error = '';
  
  constructor(private todoService: TodoService) { }
  
  ngOnInit(): void {
    this.loadTodos();
  }
  
  loadTodos(): void {
    this.loading = true;
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load todos';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  onSaveTodo(todo: Todo): void {
    this.loading = true;
    
    if (todo.id) {
      // Update existing todo
      this.todoService.updateTodo(todo).subscribe({
        next: (updatedTodo) => {
          this.todos = this.todos.map(t => 
            t.id === updatedTodo.id ? updatedTodo : t
          );
          this.loading = false;
          this.selectedTodo = null;
        },
        error: (err) => {
          this.error = 'Failed to update todo';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      // Create new todo
      this.todoService.createTodo(todo).subscribe({
        next: (newTodo) => {
          this.todos = [...this.todos, newTodo];
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to create todo';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
  
  onDeleteTodo(id: string): void {
    this.loading = true;
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to delete todo';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  onEditTodo(todo: Todo): void {
    this.selectedTodo = todo;
  }
  
  onCancelEdit(): void {
    this.selectedTodo = null;
  }
  
  onToggleComplete(todo: Todo): void {
    this.loading = true;
    this.todoService.updateTodo(todo).subscribe({
      next: (updatedTodo) => {
        this.todos = this.todos.map(t => 
          t.id === updatedTodo.id ? updatedTodo : t
        );
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update todo';
        this.loading = false;
        console.error(err);
      }
    });
  }
}