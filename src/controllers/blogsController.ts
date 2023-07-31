import { Controller, Get, Post, Req, Res } from "@decorators/express";
import { Request, Response } from "express";
import passport from "passport";
import sdk from "api";

import Blog from "../entities/blogs";
import config from "../config";

const api = sdk("@writesonic/v2.2#43xnsflcadmm1b");
api.auth(config.keys.api_key);

@Controller("/blogs")
class BlogController {
  @Get("/")
  async getAllBlogs(@Req() req: Request, @Res() res: Response) {
    try {
      const blogsList = await Blog.createQueryBuilder("blog")
        .leftJoinAndSelect("blog.user", "user")
        .select([
          "blog.id",
          "blog.title",
          "blog.photo",
          "blog.intro",
          "blog.outlines",
          "blog.content",
          "user.id",
          "user.profileImg",
          "user.username",
        ])
        .getMany();
      return res.status(200).json(blogsList);
    } catch (error) {
      console.log(
        "🚀 ~ file: blogsController.ts:12 ~ BlogController ~ getAllBlogs ~ error:",
        error
      );
    }
  }

  @Get("/:id")
  async getABlog(@Req() req: Request, @Res() res: Response) {
    try {
      const blogId = req.params.id;
      const foundBlog = await this.getBlogById(blogId);
      return res.status(200).json(foundBlog[0]);
    } catch (error) {
      console.log(
        "🚀 ~ file: blogsController.ts:12 ~ BlogController ~ getAllBlogs ~ error:",
        error
      );
    }
  }

  @Post("/")
  async createBlog(@Req() req: Request, @Res() res: Response) {
    try {
      return passport.authenticate(
        "jwt",
        { session: false },
        async (err: any, user: any) => {
          if (err || !user) {
            return res.status(401).json({ message: "Authentication failed" });
          }

          let newBlog = new Blog();
          newBlog.title = req.body.title.replace(/\b\w/g, (match: String) =>
            match.toUpperCase()
          );
          newBlog.photo =
            req.body.photo ||
            `https://satireklappe.de/wp-content/uploads/2023/01/10.jpg`;

          newBlog.user = user.id;
          // Get the intro text
          const blogIntro = await this.getIntroText(req.body.title);

          // Get the outlines
          const blogOutlines = await this.getOutlines(
            req.body.title,
            blogIntro
          );

          // Generate the article
          if (req.body.title && blogIntro && blogOutlines) {
            const articleData = await this.generateArticle(
              req.body.title,
              blogIntro,
              blogOutlines
            );
            // Save the article data to the new blog object
            newBlog.intro = blogIntro;
            newBlog.outlines = blogOutlines;
            newBlog.content = articleData;

            // Save the new blog to the database
            const createdBlog = await newBlog.save();
            const foundBlog = await this.getBlogById(createdBlog.id);
            return res.status(201).json(foundBlog[0]);
          }
        }
      )(req, res);
    } catch (error) {
      return res.status(422);
    }
  }

  getBlogById(blogId: any) {
    return Blog.createQueryBuilder("blog")
      .where({ id: blogId })
      .leftJoin("blog.user", "user") // bar is the joined table
      .select([
        "blog.id",
        "blog.title",
        "blog.photo",
        "blog.intro",
        "blog.outlines",
        "blog.content",
        "user.id",
        "user.profileImg",
        "user.username",
      ])
      .getMany();
  }

  async getIntroText(title: string): Promise<string> {
    const { data } = await api.blogIntros_V2BusinessContentBlogIntros_post(
      {
        blog_title: title,
      },
      { engine: "good", language: "en", num_copies: 1 }
    );
    return data[0].text;
  }

  // Function to get the outlines
  async getOutlines(title: string, intro: string): Promise<string[]> {
    const { data } = await api.blogOutlines_V2BusinessContentBlogOutlines_post(
      {
        blog_title: title,
        blog_intro: intro,
      },
      { engine: "good", language: "en", num_copies: 1 }
    );
    return data[0]?.text?.split("\n");
  }

  // Function to generate the article
  async generateArticle(
    title: string,
    intro: string,
    outlines: string[]
  ): Promise<any> {
    const { data } =
      await api.aiArticleWriterV3_V2BusinessContentAiArticleWriterV3_post(
        {
          article_title: title,
          article_intro: intro,
          article_sections: outlines,
        },
        { engine: "premium", language: "en", num_copies: 1 }
      );
    return data;
  }
}

export default BlogController;
