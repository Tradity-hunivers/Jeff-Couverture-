// Redirection permanente www.jeff-couverture.fr -> jeff-couverture.fr (19/10/2026).
// Le domaine www pointait vers l'ancien hebergement OVH (erreur 503).
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === 'www.jeff-couverture.fr') {
    url.hostname = 'jeff-couverture.fr';
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
