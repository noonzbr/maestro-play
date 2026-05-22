// MaestroPlay Service Worker
const CACHE_NAME = "maestroplay-v2"

// Pre-cache these on install
const PRECACHE = [
  "/",
  "/games",
  "/images/maestroplayer1.png",
  "/images/icons.png",
  "/icons/icon.svg",
  "/audio/concrete-riot.mp3",
  "/audio/sparks-of-vienna.mp3",
]

// ── Install: pre-cache key assets ────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

// ── Activate: purge old caches ────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  )
})

// ── Fetch: smart caching strategy ────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET, cross-origin, and API calls (always go to network)
  if (request.method !== "GET") return
  if (url.origin !== location.origin) return
  if (url.pathname.startsWith("/api/")) return

  // Static assets (images, audio, icons) — Cache First
  const isStatic =
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/audio/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/_next/static/")

  if (isStatic) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
            }
            return response
          })
      )
    )
    return
  }

  // Pages — Network First, fallback to cache for offline
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(() => caches.match(request))
  )
})
