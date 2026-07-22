/* Open Vandaag wanneer een gebruiker op een blijvende Koers-melding tikt. */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const fallbackUrl = `${self.registration.scope}#/`;
  let targetUrl = fallbackUrl;
  try {
    const requestedUrl = new URL(event.notification.data?.url || fallbackUrl);
    if (requestedUrl.href.startsWith(self.registration.scope)) targetUrl = requestedUrl.href;
  } catch {
    // Een ongeldige of niet-Koers-URL opent nooit buiten de eigen app-scope.
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (windowClients) => {
      const sameScopeClient = windowClients.find((client) => client.url.startsWith(self.registration.scope));
      if (sameScopeClient) {
        if ('navigate' in sameScopeClient) await sameScopeClient.navigate(targetUrl);
        return sameScopeClient.focus();
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
