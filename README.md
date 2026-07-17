# Open Pages — public diary

A calendar-first, one-diary-per-day journal for GitHub Pages. Every day has one place on the vertical timeline, whether it was written or missed.

## Publish it

1. Create a **public** GitHub repository named `public-diary`.
2. In `_config.yml`, replace `YOUR_GITHUB_USERNAME` with your GitHub username and change the title/author if you like. If you use a different repository name, update both `repository_name` and `baseurl` there.
3. Upload this entire folder to the repository's `main` branch.
4. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`. Save.
5. GitHub will publish it at `https://faryao.github.io/public-diary/`.

## Write and publish

On the diary, click **Open today's diary**. If today's page exists, GitHub opens that same file for editing; otherwise it creates the canonical `YYYY-MM-DD-diary.md` file from a ready-made template. Click **Commit changes** to publish. Unwritten days in the timeline can also be filled later using their GitHub links.

File names must start with a date: `YYYY-MM-DD-short-title.md`. Keep the metadata between the two `---` lines.

## Preview locally (optional)

If Ruby and Bundler are installed:

```sh
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000/public-diary/`.
