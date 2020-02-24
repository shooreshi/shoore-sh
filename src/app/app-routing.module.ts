import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogListComponent } from './blogs/blog-list/blog-list.component';
import { BlogCreateComponent } from './blogs/blog-create/blog-create.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: "", component: BlogListComponent },
  { path: "create", component: BlogCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:blogId", component: BlogCreateComponent, canActivate: [AuthGuard] },
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
