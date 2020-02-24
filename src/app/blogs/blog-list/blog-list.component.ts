import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { Blog } from '../blog.model';
import { BlogsService } from '../blogs.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})

export class BlogListComponent implements OnInit, OnDestroy {

  blogs: Blog[] = [];
  isLoading = false;
  totalBlogs = 0;
  blogsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private blogsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public blogsService: BlogsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.blogsService.getBlogs(this.blogsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.blogsSub = this.blogsService.getBlogUpdateListener()
      .subscribe((blogData: { blogs: Blog[], blogCount: number }) => {
        this.isLoading = false;
        this.totalBlogs = blogData.blogCount;
        this.blogs = blogData.blogs;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.blogsPerPage = pageData.pageSize;
    this.blogsService.getBlogs(this.blogsPerPage, this.currentPage);
  }

  onDelete(blogId: string) {
    this.isLoading = true;
    this.blogsService.deleteBlog(blogId).subscribe(() => {
      this.blogsService.getBlogs(this.blogsPerPage, this.currentPage);
    }, () => {
        this.isLoading = false;
    });
  }

  edit(blogId: string) {
    this.isLoading = true;
    this.blogsService.updateBlog
  }

  ngOnDestroy() {
    this.blogsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
