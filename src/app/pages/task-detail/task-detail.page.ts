import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel,
  IonButton, IonInput, IonList, IonToggle, IonSelect, IonSelectOption, IonSpinner
} from '@ionic/angular/standalone';

import { FirestoreService } from 'src/app/core/services/firestore-service';
import { Task } from 'src/app/core/models/task.model';
import { Category } from 'src/app/core/models/category.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonLabel, IonInput, IonList, IonButton, IonToggle,
    IonSelect, IonSelectOption, IonSpinner
  ]
})
export class TaskDetailPage implements OnInit {

  task: Task = null;
  isNew = false;

  categories: Category[] = [];
  cargando = false;

  constructor(

    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly firestoreService: FirestoreService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.loadCategories();

    if (id === 'new') {
      this.isNew = true;
      this.task = {
        id: this.firestoreService.createIdDoc(),
        title: '',
        done: false,
        categoryId: null
      };
    } else {
      this.isNew = false;
      this.loadTask(id);
    }
  }

  loadCategories() {
    this.firestoreService.getCollectionChanges<Category>('Category')
      .subscribe({
        next: (cats) => {
          this.categories = cats;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error cargando categorías', err)
      });
  }

  loadTask(id: string) {
    this.cargando = true;

    this.firestoreService.getDocument<Task>(`Task/${id}`).then(doc => {
      if (doc.exists()) {
        this.task = { id, ...doc.data() };

        setTimeout(() => this.cdr.detectChanges(), 50);
      }
      this.cargando = false;
    });
  }

  async save() {
    this.cargando = true;

    if (this.isNew) {
      await this.firestoreService.createDocumentID(this.task, 'Task', this.task.id);
    } else {
      await this.firestoreService.updateDocumentID(this.task, 'Task', this.task.id);
    }

    this.cargando = false;
    this.router.navigate(['/tasks']);
  }

  cancelar() {
    this.router.navigate(['/tasks']);
  }
}
