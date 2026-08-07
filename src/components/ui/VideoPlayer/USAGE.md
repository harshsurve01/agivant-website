# VideoPlayer — usage reference

This file is documentation only, not part of the shipped component.

## Target consumer shape (e.g. EpisodePlayer)

```tsx
import { VideoPlayer } from "@/components/ui/VideoPlayer";

export function EpisodePlayer({ episode }: { episode: Episode }) {
  return (
    <VideoPlayer
      source={{ provider: "youtube", id: episode.youtubeId }}
      poster={episode.posterUrl}
      title={episode.title}
    />
  );
}
```

`EpisodePlayer` contains zero YouTube-specific logic — no script tags, no
`YT.Player`, no iframe. It only knows the provider-agnostic `VideoSource`
shape defined by `VideoPlayerProps`.

## Adding a new provider later (e.g. Vimeo)

1. Add the union member to `VideoSource` in `VideoPlayer.types.ts`:
   `| { provider: "vimeo"; id: string }`
2. Create `providers/vimeo/VimeoAdapter.ts` implementing `ProviderAdapter`
   (same shape as `YouTubeAdapter.ts` — `init()` resolves a
   `PlayerController`).
3. Add one case to the `getAdapter` switch in `VideoPlayer.tsx`.

No change to `EpisodePlayer`, `index.ts`'s public exports, or any other
consumer. The TypeScript exhaustiveness check in `getAdapter` will flag
if step 3 is missed.

## Design tokens

CSS Modules in this component read color/spacing/radius values from CSS
custom properties (e.g. `var(--color-surface-glass, ...)`) with inline
fallbacks. Before shipping, reconcile these variable names against the
project's actual token sheet and remove the fallback values so any drift
from the real tokens fails loudly instead of silently falling back.
