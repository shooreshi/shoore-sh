import { NgModule } from '@angular/core';

import { BlogCreateComponent } from '../blogs/blog-create/blog-create.component';
import { BlogListComponent } from '../blogs/blog-list/blog-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    BlogListComponent,
    BlogCreateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class BlogsModule { }
