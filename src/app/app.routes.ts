import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { PeterPanComponent } from './peter-pan/peter-pan';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'peter-pan', component: PeterPanComponent },
  { path: '**', redirectTo: '' },
];
