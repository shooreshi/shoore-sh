import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BlogsService } from '../blogs.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Blog } from '../blog.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.css']
})
export class BlogCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  blog: Blog;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private blogId: string;
  private authStatusSub: Subscription;

  constructor(
    public blogsService: BlogsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: mimeType
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("blogId")) {
        this.mode = "edit";
        this.blogId = paramMap.get("blogId");
        this.isLoading = true;
        this.blogsService.getBlog(this.blogId).subscribe(blogData => {

          this.isLoading = false;
          this.blog = {
            id: blogData._id,
            title: blogData.title,
            content: blogData.content,
            imagePath: blogData.imagePath,
            author: blogData.author
          };
          this.form.setValue({
            title: this.blog.title,
            content: this.blog.content,
            image: this.blog.imagePath
          });
        });

      } else {
        this.mode = "create";
        this.blogId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveBlog() {
    console.log(this.form.value.image);
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.blogsService.addBlog(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.blogsService.updateBlog(
        this.blogId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

