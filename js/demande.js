/* Jeff Couverture — envoi des demandes de devis et de contact (19/10/2026).
 * Avant cette date, les formulaires visaient Web3Forms avec une cle de modele
 * jamais remplacee (« YOUR_WEB3FORMS_KEY_HERE ») : aucune demande n'arrivait.
 * Les demandes vont desormais au CRM de l'agence (tableau de bord Help AI) :
 * le prospect est cree et l'artisan est prevenu.
 * Appel : window.envoyerDemande(formulaire) -> Promise<boolean>. */
(function () {
  'use strict';
  var URL_RECEPTION = 'https://wodlupbffooqtshgasml.supabase.co/functions/v1/agency-lead-intake';
  var CLIENT = 'jeff-bauer';
  var CLE = '853b9dd7-11e2-4079-8032-deb44e462db8';

  function valeur(form, noms) {
    for (var i = 0; i < noms.length; i++) {
      var champ = form.elements[noms[i]];
      if (champ && String(champ.value || '').trim()) return String(champ.value).trim();
    }
    return '';
  }

  window.envoyerDemande = function (form) {
    // Champ piege : rempli seulement par les robots.
    var piege = form.elements['botcheck'];
    if (piege && (piege.checked || piege.value === 'on' && piege.type !== 'checkbox')) return Promise.resolve(true);
    var p = new URLSearchParams(location.search);
    var prestation = valeur(form, ['service', 'prestation']);
    var commune = valeur(form, ['ville', 'commune']);
    var message = valeur(form, ['message']);
    var corps = {
      client_slug: CLIENT,
      webhook_secret: CLE,
      source: p.get('gclid') || /google/i.test(p.get('utm_source') || '') ? 'google_ads' : 'site',
      nom: valeur(form, ['nom', 'name']),
      telephone: valeur(form, ['tel', 'Téléphone', 'telephone', 'phone']),
      email: valeur(form, ['email']) || null,
      prestation: prestation || null,
      message: [prestation ? 'Prestation : ' + prestation : '', commune ? 'Commune : ' + commune : '', message].filter(Boolean).join('\n'),
      utm_source: p.get('utm_source') || null,
      utm_medium: p.get('utm_medium') || null,
      utm_campaign: p.get('utm_campaign') || null,
      utm_content: p.get('utm_content') || null,
      metadata: { page: location.pathname, ville: commune || null, gclid: p.get('gclid') || null, formulaire: form.id || null }
    };
    // text/plain : requete « simple », pas de pre-verification CORS.
    return fetch(URL_RECEPTION, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(corps),
      keepalive: true
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
  };
})();
