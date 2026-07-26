# Glossary

## Comment

A message submitted beneath a diary entry by a reader authenticated with a
GitHub account.

## Comment thread

The ordered conversation associated with one diary entry, including top-level
comments and replies. It is mapped to the diary entry by the entry's exact
published URL path and supports GitHub reactions.

## Commenter

A reader who signs in through GitHub and posts to a comment thread.

## Signed-out reader

A visitor who can read diary entries and their public comments but cannot post
or reply until authenticated through GitHub.

## Diary entry

A dated Jekyll post published at its own permanent URL. Each diary entry has at
most one associated comment thread, and every published diary entry exposes its
comment section. The page order is diary content, comment section, then the
GitHub edit action.

## Giscus

The embedded comment component that authenticates readers through GitHub and
uses GitHub Discussions as comment storage. It is lazy loaded on diary-entry
pages.

## GitHub Discussion

The repository-hosted record that stores a diary entry's comment thread and is
used for moderation. New Discussions in the comment category are created only
by the repository owner or Giscus; readers contribute comments and replies.

## Thread identity

The exact diary-entry URL path used by Giscus to find or create the entry's
GitHub Discussion. A changed path represents a different thread identity.

## Repository owner

The person who controls the diary repository, configures Giscus, and moderates
its GitHub Discussions.

## Comment composer

The Giscus input shown above existing comments. It requires GitHub
authentication before a reader can submit a comment.
