import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular//common/http";
import { map } from "rxjs/operators";
import { Router } from '@angular/router';

import { environment } from "../../environments/environment";
import { Blog } from "./blog.model";

const BACKEND_URL = environment.apiUrl + "/blogs/";

@Injectable({ providedIn: "root" })
export class BlogsService {
  private blogs: Blog[] = [];
  private blogsUpdated = new Subject<{ blogs: Blog[], blogCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getBlogs(blogsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${blogsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string, blogs: any, maxBlogs: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(blogData => {
          return {
            blogs: blogData.blogs.map(blog => {
              return {
                title: blog.title,
                content: blog.content,
                id: blog._id,
                imagePath: blog.imagePath,
                author: blog.author
              };
            }),
            maxBlogs: blogData.maxBlogs
          };
        }))
      .subscribe(transformedBlogData => {
        this.blogs = transformedBlogData.blogs;
        this.blogsUpdated.next({
          blogs: [...this.blogs],
          blogCount: transformedBlogData.maxBlogs
        });
      });
  }

  getBlogUpdateListener() {
    return this.blogsUpdated.asObservable();
  }

  getBlog(id: string) {
    console.log(id);
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      author: string;
    }>(
      BACKEND_URL + id
    );
  }

  addBlog(title: string, content: string, image: File) {
    const blogData = new FormData();
    blogData.append("title", title);
    blogData.append("content", content);
    blogData.append("image", image, title);
    console.log(title);
    console.log(content);
    this.http
      .post<{ message: string, blog: Blog }>(
        BACKEND_URL,
        blogData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateBlog(id: string, title: string, content: string, image: File | string) {
    let blogData: Blog | FormData;
    if (typeof (image) === "object") {
      blogData = new FormData();
      blogData.append("id", id);
      blogData.append("title", title);
      blogData.append("content", content);
      blogData.append("image", image, title);
    } else {
      blogData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        author: null
      };
    }
    this.http
      .put(BACKEND_URL + id, blogData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteBlog(blogId: string) {
    return this.http.delete(BACKEND_URL + blogId);
  }
}
