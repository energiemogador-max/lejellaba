window.NOVA_CONTACT = {
  // Modifiez ces numéros pour mettre à jour tout le site instantanément
  whatsapp: "212709344943",
  phoneDisplay: "07 09 34 49 43"
};

function applyNovaContact() {
  if (!window.NOVA_CONTACT) return;
  var wa = window.NOVA_CONTACT.whatsapp;
  var phone = window.NOVA_CONTACT.phoneDisplay;

  // 1. Liens avec classes dynamiques
  document.querySelectorAll('a.dyn-wa-link').forEach(function(el) {
    if (!el.href.includes(wa)) {
      var url = new URL(el.href, window.location.href);
      var text = url.searchParams.get('text') || '';
      el.href = 'https://wa.me/' + wa + (text ? '?text=' + encodeURIComponent(text) : '');
    }
  });

  document.querySelectorAll('a.dyn-tel-link').forEach(function(el) {
    el.href = 'tel:+' + wa;
  });

  // 2. Boutons d'appel classiques
  document.querySelectorAll('a.call').forEach(function(el) {
    el.href = 'tel:+' + wa;
    el.innerHTML = '📞 ' + phone;
  });

  // 3. Spans dynamiques créés pour remplacer le texte brut
  document.querySelectorAll('.dyn-phone').forEach(function(el) {
    el.textContent = phone;
  });
  
  document.querySelectorAll('.dyn-wa-num').forEach(function(el) {
    el.textContent = wa;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyNovaContact);
} else {
  applyNovaContact();
}
