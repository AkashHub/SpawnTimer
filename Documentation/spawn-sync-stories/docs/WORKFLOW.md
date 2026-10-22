# Workflow: how stories flow through builder and tester agents

## Roles

- **You (human/orchestrator):** pick stories, start agents, merge PRs, complete `H-` stories.
- **Builder agent:** implements one story on its branch, opens a PR, sets `status: testing`.
- **Tester agent:** independently verifies the branch against the story's acceptance criteria. Never fixes code.

## Statuses (front matter `status:`)

`ready` -> `in-progress` -> `testing` -> `done` (or `blocked`). Only `ready` and `done` need to be on `main`; the middle states are labels you may set while working.

## Loop

1. `pnpm stories:next` lists `ready` stories whose dependencies are all `done` on `main`. Stories in the same wave are independent and can run in parallel (they are designed not to edit the same files).
2. Start a **builder** with `prompts/builder.md`, replacing `{{STORY}}` with the story path.
3. When the PR is open, start a **tester** with `prompts/tester.md` on the same branch.
4. Tester passes: the tester commits `status: done` to the branch. You review the diff quickly and merge.
5. Tester fails: send the tester's report to the builder as "fix these criteria". Allow at most 2 fix rounds, then investigate yourself (usually the story was ambiguous; fix the story and re-run).
6. After merging, re-run `pnpm stories:next`.

## Rules of thumb

- Merge in dependency order. Rebase builder branches on `main` before testing if `main` moved.
- `H-` stories are human tasks; `pnpm stories:next` lists them separately. Do them when they unblock something (see their `depends_on` and which stories depend on them).
- Suggested first moves: INF-001 -> INF-002/003/005/007 in parallel -> INF-004 -> LIB-001... Run `pnpm stories:next` rather than memorising this.
- To validate the design's key assumptions early (10 s period, stable offsets), prioritize the LAB stories and then H-006.
- Parallel stories never edit the same source file (checked when the stories were generated), but several may add dependencies, so `package.json` and `pnpm-lock.yaml` can conflict. Resolve by rebasing onto `main`, keeping both sets of changes in `package.json`, and re-running `pnpm install` to regenerate the lockfile.
- If a story keeps failing, the story is probably wrong. Edit the story (it is just a file), commit to `main`, and re-run.

## Adding a story

Copy `stories/_TEMPLATE.md` to `stories/<EPIC>/<ID>-<slug>.md`, fill it in, run `pnpm stories:validate`.
