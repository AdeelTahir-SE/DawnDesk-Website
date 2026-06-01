update public.blog_posts
set content = jsonb_set(content, '{content}', to_jsonb('## A calmer starting point

DawnDesk is built around a command center that keeps active work visible without turning every screen into noise. The dashboard highlights connected workspaces, saved prompts, recent operations, and useful shortcuts so users can move into the right tool quickly.

### What stays visible

- Active workspaces
- Saved prompts and templates
- Recent operations
- Shortcuts into the tools you use most

```mermaid
graph LR
  Dashboard --> Projects
  Dashboard --> Notes
  Dashboard --> Prompts
  Dashboard --> CreativeTools[Photo and Video]
```

The goal is simple: fewer disconnected windows, more visible context.'::text), true)
where slug = 'calmer-command-center';

update public.blog_posts
set content = jsonb_set(content, '{content}', to_jsonb('## Keep assets close to planning

Creative work often lives beside planning work. DawnDesk keeps photo and video editing close to notes, project context, and prompt workflows so assets can be prepared and reused without jumping between disconnected tools.

### A practical flow

1. Import the source asset.
2. Edit it in the right DawnDesk workspace.
3. Save the output beside the project or note that needs it.

```js
const output = {
  workspace: "photo-editor",
  status: "ready",
  linkedProject: "launch-assets"
};
```

That structure makes the final asset easier to find later.'::text), true)
where slug = 'creative-asset-workflow';

update public.blog_posts
set content = jsonb_set(content, '{content}', to_jsonb('## What we are improving next

Upcoming DawnDesk work focuses on stronger sync, better workspace handoffs, practical collaboration features, and smoother documentation around each sub-app. The goal is to make the suite easier to trust in daily work.

### Focus areas

- Clearer connected workspace status
- Better handoffs between sub apps
- More useful documentation pages
- Smoother content management from the admin panel

```mermaid
flowchart TD
  Plan[Plan work] --> Create[Create assets]
  Create --> Organize[Organize outputs]
  Organize --> Reuse[Reuse in future work]
```

Each release should make the product feel more coherent, not just larger.'::text), true)
where slug = 'what-is-coming-next';
