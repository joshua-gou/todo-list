import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { CATEGORIES_TOKEN } from 'src/app/core/constants.provider';
import { BackendService } from 'src/app/services/backend/backend.service';
import { Category, USER_ID } from 'src/app/shared';
import { Option, Todo } from "src/app/shared/models";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  fgNew!: FormGroup;
  fgCategory!: FormGroup;

  todos!: Todo[];
  todosSelected!: Todo[];
  categorySelected: Category = Category.All;
  isInitialized: boolean = false;


  constructor(
    private _fb: FormBuilder,
    private _backendService: BackendService,
    @Inject(CATEGORIES_TOKEN) readonly categories: Option[]
  ) { }

  ngOnInit(): void {
    this.fgNew = this._fb.group({
      todo: ['', Validators.required]
    });
    this.fgCategory = this._fb.group({
      category: ['', Validators.required]
    });

    this._backendService.todos$.subscribe(res => {
      this.todos = res.sort((a, b) => b.id - a.id);
      if (res && res.length !== 0) {
        this.isInitialized = true;
      }
    });

    this.fgCategory.controls['category'].setValue(this.categories[0]);

    this.loadTodoList()
  }

  loadTodoList() {
    this._backendService.loadTodoList();
  }

  private addTodo(todoTitle: string) {
    if (this.todos.length === 0) {
      this.todos.push({
        id: 1,
        userId: USER_ID,
        title: todoTitle,
        completed: false
      });

      this._backendService.updateTodoListToLocal(this.todos);
      return;
    }

    const latestTodos = this.todos[0];
    const newTodoId = latestTodos.id + 1;

    this.todos.push({
      id: newTodoId,
      userId: USER_ID,
      title: todoTitle,
      completed: false
    });
    this.todos.sort((a, b) => b.id - a.id);

    this._backendService.updateTodoListToLocal(this.todos);
  }

  onBtnMarkAsCompletedClicked() {
    for (const todoCompleted of this.todosSelected) {
      const originalTodo = this.todos.find(item => item.id == todoCompleted.id);
      if (!originalTodo) { break; }
      originalTodo.completed = true;
    }

    this._backendService.updateTodoListToLocal(this.todos);
  }

  onBtnDeleteClicked() {
    for (const todoDeleted of this.todosSelected) {
      const indexToDelete = this.todos.findIndex(item => item.id == todoDeleted.id);
      if (indexToDelete === -1) { break; }
      this.todos.splice(indexToDelete, 1);
    }

    this._backendService.updateTodoListToLocal(this.todos);
    this.todosSelected.splice(0, this.todosSelected.length);
  }

  onCategorySelectionChange(option: Option) {
    this.categorySelected = option.id;
  }

  onEnterInTxtTitle() {
    const title = this.fgNew.controls['todo'].value;
    this.addTodo(title);

    this.fgNew.reset();
    Object.keys(this.fgNew.controls).forEach(key => {
      this.fgNew.controls[key].setErrors(null);
    })
  }

}
