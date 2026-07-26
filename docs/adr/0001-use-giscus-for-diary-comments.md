# ADR 0001: Use Giscus for diary comments

- Status: Accepted
- Date: 2026-07-26

## Context

The diary is a static Jekyll site hosted on GitHub Pages. Readers must use a
GitHub account to comment on a diary entry. Building a custom authentication,
comment-storage, and moderation service would introduce a separate backend.

## Decision

Embed Giscus on individual diary-entry pages. Giscus will authenticate
commenters through GitHub and store each entry's comment thread in GitHub
Discussions in the diary repository.

The repository owner will enable GitHub Discussions, install or authorize the
Giscus GitHub App for the repository, and configure the selected discussion
category.

The selected category will be restricted so that only the repository owner and
Giscus can create top-level Discussions. Readers can comment and reply within
the diary threads Giscus creates.

Each diary entry will map to its discussion by the entry's exact URL path.
Changing a published permalink therefore requires preserving or deliberately
migrating its discussion association.

Comments will be enabled on every diary entry. There will be no per-entry
front-matter flag for enabling or disabling them.

Comment threads will be publicly readable. A GitHub sign-in is required only
for posting a comment or reply.

The Giscus embed will use lazy loading so its external resources load only when
the reader approaches the comment section.

On an entry page, the comment section will appear immediately after the diary
content and before the existing "Edit this diary on GitHub" action.

GitHub reactions will be enabled on the mapped Discussion so readers can react
without posting a written comment.

The Giscus embed will use its standard light theme to match the diary's
light-only visual design.

The comment composer will appear above existing comments.

The section will be introduced with the heading "Comments" and the explanatory
copy: "Read the conversation below. Sign in with GitHub to comment or reply."

## Consequences

- A reader needs a GitHub account and must authorize Giscus before commenting.
- Comments and moderation remain visible and manageable in GitHub Discussions.
- Readers cannot use the comment category to start unrelated Discussions.
- The static site does not store credentials, sessions, or comment data.
- Comment availability depends on GitHub Discussions and Giscus.
- Diary permalinks become part of comment-thread identity and should remain
  stable after publication.
- Publishing a diary entry always exposes its comment section.
- Signed-out readers can follow the conversation but cannot contribute.
- Comment loading does not block the diary entry's initial render.
- GitHub Discussions is enabled on the repository.
- The Giscus GitHub App is authorized for the repository.

## Open decisions

- No open product decisions remain.

## Configuration

- Repository: `faryao/public-diary`
- Repository ID: `R_kgDOTb8gyw`
- Category: `Announcements`
- Category ID: `DIC_kwDOTb8gy84DCBbb`
- Mapping: exact pathname with strict matching
- Reactions: enabled
- Composer position: top
- Theme and language: light, English
- Loading: lazy
- Discussion metadata messages: disabled because the site has no consumer for
  them
