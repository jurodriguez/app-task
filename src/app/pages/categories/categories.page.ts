import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonList, IonItem,
  IonLabel, IonCard, IonInput, IonSpinner, IonIcon
} from '@ionic/angular/standalone';
import { Category } from 'src/app/core/models/category.model';
import { FirestoreService } from 'src/app/core/services/firestore-service';
import { IoniconsModule } from 'src/app/core/modules/ionicons.module';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons,
    IonList, IonItem, IonLabel, IonCard, IonInput, IonSpinner, IonIcon, IoniconsModule]
})
export class CategoriesPage {
  categories: Category[] = [];

  newCategory: Category;
  cargando: boolean = false;

  constructor(private readonly firestoreService: FirestoreService, private readonly router: Router) {
    this.initCategory();
  }

  initCategory() {
    this.newCategory = {
      id: this.firestoreService.createIdDoc(),
      name: null
    }
  }

  ionViewWillEnter() {
    this.firestoreService.getCollectionChanges<Category>('Category').subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error al obtener las categorías:', error);
      }
    })
  }

  async save() {
    this.cargando = true;
    await this.firestoreService.createDocumentID(this.newCategory, 'Category', this.newCategory.id);
    this.cargando = false;
    this.initCategory();
  }

  async edit(cat: Category) {
    this.newCategory = cat;
  }

  async delete(cat: Category) {
    this.cargando = true;
    await this.firestoreService.deleteDocumentID('Category', cat.id);
    this.cargando = false;
  }

  goToTasks() {
    this.router.navigate(['/tasks']);
  }
}