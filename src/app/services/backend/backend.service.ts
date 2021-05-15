import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KEY_TODOS, URL_SERVER_TODOS } from 'src/app/shared';
import { Todo } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private _todos = new BehaviorSubject<Todo[]>([]);
  todos$ = this._todos.asObservable();

  constructor(
    private _httpClient: HttpClient,
  ) { }

  loadTodoList() {
    const URL = URL_SERVER_TODOS;

    const todosLocal = this.loadTodoListFromLocal();
    if (todosLocal) {
      this._todos.next(JSON.parse(todosLocal));
      return;
    }

    this._httpClient.get<Todo[]>(URL, {}).subscribe(res => {
      const partialResult = res.slice(0, 10);
      localStorage.setItem(KEY_TODOS, JSON.stringify(partialResult));
      this._todos.next(partialResult);
    })
  }

  updateTodoListToLocal(updatedTodos: Todo[]) {
    if (updatedTodos.length === 0) {
      localStorage.removeItem(KEY_TODOS);
      return;
    }

    localStorage.setItem(KEY_TODOS, JSON.stringify(updatedTodos));
  }

  private loadTodoListFromLocal(): string | null {
    return localStorage.getItem(KEY_TODOS);
  }


}
