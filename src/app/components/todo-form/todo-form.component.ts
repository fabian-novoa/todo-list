import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo } from '../../models/todo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit {
  @Input() todo: Todo | null = null;
  @Output() saveTodo = new EventEmitter<Todo>();
  @Output() cancelEdit = new EventEmitter<void>();
  
  todoForm!: FormGroup;
  
  constructor(private fb: FormBuilder) { }
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.todoForm = this.fb.group({
      title: [this.todo?.title || '', [Validators.required]],
      description: [this.todo?.description || ''],
      completed: [this.todo?.completed || false]
    });
  }
  
  onSubmit(): void {
    if (this.todoForm.valid) {
      const formValue = this.todoForm.value;
      const updatedTodo: Todo = {
        ...formValue,
        id: this.todo?.id
      };
      this.saveTodo.emit(updatedTodo);
      this.todoForm.reset();
    }
  }
  
  onCancel(): void {
    this.cancelEdit.emit();
    this.todoForm.reset();
  }
}