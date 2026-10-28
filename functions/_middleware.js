// Anciennes pages remplacées par leurs prestations actuelles ; paramètres conservés.
const anciennesPages = {
  '/blog-entretien-toiture': '/nettoyage',
  '/entretien-toiture-montauban': '/nettoyage',
  '/blog-zinguerie': '/zinguerie',
  '/zinguerie-un-element-cle-pour-une-toiture-etanche-a-montauban': '/zinguerie'
};
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const destination = anciennesPages[url.pathname.replace(/\/$/, '')];
  const www = url.hostname === 'www.jeff-couverture.fr';
  if (destination || www) {
    if (destination) url.pathname = destination;
    if (www) url.hostname = 'jeff-couverture.fr';
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
