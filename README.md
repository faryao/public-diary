# Open Pages — public diary

A minimal one-diary-per-day journal for GitHub Pages. Write entries in GitHub's web editor, commit them, and they publish automatically on a vertical timeline.

## Publish it

1. Create a **public** GitHub repository named `public-diary`.
2. In `_config.yml`, replace `YOUR_GITHUB_USERNAME` with your GitHub username and change the title/author if you like. If you use a different repository name, update both `repository_name` and `baseurl` there.
3. Upload this entire folder to the repository's `main` branch.
4. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`. Save.
5. GitHub will publish it at `https://faryao.github.io/public-diary/`.

## Write and publish

On the diary, click **Open today's diary**. If today's page exists, GitHub opens it for editing; otherwise it creates one from a ready-made template. Click **Commit changes** to publish. This keeps exactly one diary file for each day.

File names must start with a date: `YYYY-MM-DD-short-title.md`. Keep the metadata between the two `---` lines.

## Preview locally (optional)

If Ruby and Bundler are installed:

```sh
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000/public-diary/`.
