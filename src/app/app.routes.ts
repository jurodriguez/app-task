import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories/categories.page').then(m => m.CategoriesPage)
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./pages/tasks/tasks.page').then(m => m.TasksPage)
  },
  {
    path: 'task/:id',
    loadComponent: () =>
      import('./pages/task-detail/task-detail.page').then(m => m.TaskDetailPage)
  }
];
