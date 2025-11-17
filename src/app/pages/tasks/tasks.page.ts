import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonList, IonIcon, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel,
  IonButton, IonButtons, IonSpinner, IonFabButton, IonFab, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { Task } from '../../core/models/task.model';
import { FirestoreService } from 'src/app/core/services/firestore-service';
import { IoniconsModule } from 'src/app/core/modules/ionicons.module';
import { Category } from 'src/app/core/models/category.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonList, IonIcon, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel,
    IonButton, IonButtons, IonSpinner, IonFabButton, IonFab, IoniconsModule, IonSelect, IonSelectOption
  ]
})
export class TasksPage {

  taskList: Task[] = [];
  filteredTasks: Task[] = [];
  categories: Category[] = [];

  selectedCategory: string = 'all';

  newTask: Task;
  cargando: boolean = false;

  constructor(private readonly firestoreService: FirestoreService,
     private readonly router: Router) {
    this.initTask();
  }

  initTask() {
    this.newTask = {
      id: this.firestoreService.createIdDoc(),
      title: null,
      done: false,
      categoryId: null
    }
  }

  ionViewWillEnter() {
    this.firestoreService.getCollectionChanges<Category>('Category')
      .subscribe(cats => this.categories = cats);

    this.firestoreService.getCollectionChanges<Task>('Task')
      .subscribe(tasks => {
        this.taskList = tasks;
        this.applyFilter();
      });
  }

  async edit(task: Task) {
    this.router.navigate(['/task', task.id]);
  }

  async complete(task: Task) {
    if (!task.done) {
      this.cargando = true;
      task.done = true;
      await this.firestoreService.updateDocumentID(task, 'Task', task.id);
      this.cargando = false;
    }
  }

  async delete(task: Task) {
    this.cargando = true;
    await this.firestoreService.deleteDocumentID('Task', task.id);
    this.cargando = false;
  }

  goToNewTask() {
    this.router.navigate(['/task', 'new']);
  }

  goToCategories() {
    this.router.navigate(['/categories']);
  }

  applyFilter() {
    if (this.selectedCategory === 'all') {
      this.filteredTasks = this.taskList;
      return;
    }

    this.filteredTasks = this.taskList.filter(
      t => t.categoryId === this.selectedCategory
    );
  }

  changeFilter() {
    this.applyFilter();
  }

  trackById(index: number, item: Category) {
    return item.id;
  }

  getCategoryName(categoryId: string | null): string {
    if (!categoryId) return 'Sin categoría';
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  }
}