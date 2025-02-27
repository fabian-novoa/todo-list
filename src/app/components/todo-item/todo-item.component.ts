import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../models/todo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Todo>();
  @Output() toggleComplete = new EventEmitter<Todo>();
  
  onDelete(): void {
    this.delete.emit(this.todo.id);
  }
  
  onEdit(): void {
    this.edit.emit(this.todo);
  }
  
  onToggleComplete(): void {
    this.toggleComplete.emit({
      ...this.todo,
      completed: !this.todo.completed
    });
  }
}