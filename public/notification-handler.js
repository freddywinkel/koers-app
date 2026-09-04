/* Open de snelle check-in wanneer een gebruiker op een Koers-melding tikt. */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const fallbackUrl = `${self.registration.scope}#/check-in?manual=1`;
  const scopeUrl = new URL(self.registration.scope);
  const isInsideScope = (value) => {
    try {
      const candidate = new URL(value, scopeUrl);
      return candidate.origin === scopeUrl.origin && candidate.pathname.startsWith(scopeUrl.pathname);
    } catch {
      return false;
    }
  };
  const normalizeCheckinUrl = (value) => {
    const candidate = new URL(value, scopeUrl);
    if (candidate.hash === '#/check-in') candidate.hash = '#/check-in?manual=1';
    return candidate.href;
  };
  let targetUrl = fallbackUrl;
  const requestedUrl = event.notification.data?.url || fallbackUrl;
  if (isInsideScope(requestedUrl)) targetUrl = normalizeCheckinUrl(requestedUrl);

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (windowClients) => {
      const sameScopeClient = windowClients.find((client) => isInsideScope(client.url));
      if (sameScopeClient) {
        if ('navigate' in sameScopeClient) await sameScopeClient.navigate(targetUrl);
        return sameScopeClient.focus();
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
