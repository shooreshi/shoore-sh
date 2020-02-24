const Blog = require("../models/blog");

exports.createBlog = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    author: req.userData.userId
  });
  blog.save().then(createdBlog => {
    res.status(201).json({
      message: "Blog added successfully!",
      blog: {
        ...createdBlog,
        id: createdBlog._id,
      }
    });
  })
    .catch(error => {
      res.status(500).json({
        message: "Blog creation failed!"
      });
    });
}

exports.updateBlog = (req, res, next) => {
  let imagePath = req.body.imagePath;
  console.log(req.body);

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const blog = new Blog({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    author: req.userData.userId
  });
  Blog.updateOne({ _id: req.params.id, author: req.userData.userId }, blog)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update post!"
      });
    });
}

exports.getBlogs = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const blogQuery = Blog.find();
  let fetchedBlogs;
  if (pageSize && currentPage) {
    blogQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  blogQuery
    .then(documents => {
      fetchedBlogs = documents;
      return Blog.count();
    }).then(count => {
      res.status(200).json({
        message: "Blogs fetched successfully!",
        blogs: fetchedBlogs,
        maxBlogs: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Getting blogs failed!"
      });
    });
}

exports.getBlog = (req, res, next) => {
  Blog.findById(req.params.id).then(blog => {
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found!' })
    }
  }).catch(error => {
    res.status(500).json({
      message: "Getting blog failed!"
    });
  });
}

exports.deleteBlog = (req, res, next) => {
  Blog.deleteOne({ _id: req.params.id, author: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: 'Blog deleted!' });
    } else {
      res.status(401).json({ message: 'Not authorized!' });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "Deleting blog failed!"
      });
    });
};

