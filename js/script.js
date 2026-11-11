/* ==========================================================
   Honey Star Resources Limited — site behaviour
   ========================================================== */
(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var nav = document.getElementById('site-nav');
  var navToggle = document.getElementById('nav-toggle');
  var toTop = document.getElementById('to-top');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  navToggle.addEventListener('click', function () {
    setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      navToggle.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1080) setMenu(false);
  });

  /* ---------- Header shadow + back-to-top ---------- */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-scrolled', y > 8);
    toTop.hidden = y < 700;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---------- Highlight the current section in the menu ---------- */
  if ('IntersectionObserver' in window) {
    var linkById = {};
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href.charAt(0) === '#') linkById[href.slice(1)] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
        });
        var active = linkById[entry.target.id];
        if (active) {
          active.classList.add('is-active');
          active.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Object.keys(linkById).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    // Sections without a menu entry clear the highlight when reached.
    ['top', 'values', 'future', 'contact'].forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* ---------- Sector filter ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.sector-tab'));
  var sectors = Array.prototype.slice.call(document.querySelectorAll('.sector'));

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var filter = tab.getAttribute('data-filter');
      tabs.forEach(function (other) {
        var selected = other === tab;
        other.classList.toggle('is-active', selected);
        other.setAttribute('aria-pressed', String(selected));
      });
      sectors.forEach(function (card) {
        card.hidden = filter !== 'all' && card.getAttribute('data-sector') !== filter;
      });
    });
  });

  /* ---------- Gallery albums ----------
     Albums and their pictures are listed in js/albums.js.
     index.html shows one cover per album; album.html shows one album. */
  var albums = Array.isArray(window.HONEYSTAR_ALBUMS) ? window.HONEYSTAR_ALBUMS : [];

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function pictureCount(album) {
    var count = (album.images || []).length;
    return count === 1 ? '1 picture' : count + ' pictures';
  }

  // Covers on the home page: each one links to its album.
  var albumGrid = document.getElementById('album-grid');
  if (albumGrid) {
    albums.forEach(function (album) {
      var link = el('a', 'gallery-item album-cover');
      link.href = 'album.html?album=' + encodeURIComponent(album.id);

      var image = el('img');
      image.src = album.cover || (album.images && album.images[0] ? album.images[0].src : '');
      image.alt = '';
      image.loading = 'lazy';

      var label = el('span', 'album-cover-label');
      label.appendChild(el('span', 'album-cover-title', album.title));
      label.appendChild(el('span', 'album-cover-count', pictureCount(album)));

      link.appendChild(image);
      link.appendChild(label);
      albumGrid.appendChild(el('li')).appendChild(link);
    });

    if (!albums.length) {
      albumGrid.appendChild(el('li', 'gallery-empty', 'No albums yet. Add one in js/albums.js.'));
    }
  }

  // Pictures on the album page, chosen by the ?album= part of the address.
  var albumTitle = document.getElementById('album-title');
  if (albumTitle) {
    var pictureGrid = document.getElementById('gallery-grid');
    var albumDescription = document.getElementById('album-description');
    var albumHint = document.getElementById('album-hint');
    var wantedId = new URLSearchParams(window.location.search).get('album');
    var album = albums.filter(function (item) { return item.id === wantedId; })[0];

    if (!album) {
      albumTitle.textContent = 'Album not found';
      albumHint.textContent = 'This album may have been moved or renamed. Go back to all albums to pick another.';
    } else {
      albumTitle.textContent = album.title;
      document.title = album.title + ' | Honey Star Resources Limited';
      if (album.description) {
        albumDescription.textContent = album.description;
        albumDescription.hidden = false;
      }

      (album.images || []).forEach(function (picture) {
        var link = el('a', 'gallery-item');
        link.href = picture.src;
        if (picture.caption) link.setAttribute('data-caption', picture.caption);

        var image = el('img');
        image.src = picture.src;
        image.alt = picture.alt || '';
        image.loading = 'lazy';

        link.appendChild(image);
        pictureGrid.appendChild(el('li')).appendChild(link);
      });

      if (!(album.images || []).length) {
        albumHint.textContent = 'This album has no pictures yet. Add some in js/albums.js.';
      }
    }
  }

  /* ---------- Picture viewer ----------
     Opens the pictures on the album page full screen. */
  var galleryGrid = document.getElementById('gallery-grid');
  var lightbox = document.getElementById('lightbox');

  if (galleryGrid && lightbox && typeof lightbox.showModal === 'function') {
    var lbImage = document.getElementById('lightbox-image');
    var lbCaption = document.getElementById('lightbox-caption');
    var lbCount = document.getElementById('lightbox-count');
    var lbPrev = document.getElementById('lightbox-prev');
    var lbNext = document.getElementById('lightbox-next');
    var lbClose = document.getElementById('lightbox-close');
    var current = 0;
    var opener = null;

    var galleryItems = function () {
      return Array.prototype.slice.call(galleryGrid.querySelectorAll('.gallery-item'));
    };

    var show = function (index) {
      var items = galleryItems();
      if (!items.length) return;
      current = (index + items.length) % items.length;
      var item = items[current];
      var thumb = item.querySelector('img');
      lbImage.src = item.getAttribute('href');
      lbImage.alt = thumb ? thumb.alt : '';
      lbCaption.textContent = item.getAttribute('data-caption') || '';
      lbCount.textContent = 'Picture ' + (current + 1) + ' of ' + items.length;
      lbPrev.hidden = lbNext.hidden = items.length < 2;
    };

    galleryGrid.addEventListener('click', function (event) {
      var item = event.target.closest('.gallery-item');
      if (!item) return;
      event.preventDefault();
      opener = item;
      show(galleryItems().indexOf(item));
      lightbox.showModal();
      document.body.classList.add('is-lightbox-open');
    });

    lbPrev.addEventListener('click', function () { show(current - 1); });
    lbNext.addEventListener('click', function () { show(current + 1); });
    lbClose.addEventListener('click', function () { lightbox.close(); });

    // Clicking the dark area around the picture closes the viewer.
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox || event.target.classList.contains('lightbox-stage')) lightbox.close();
    });

    lightbox.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });

    lightbox.addEventListener('close', function () {
      document.body.classList.remove('is-lightbox-open');
      lbImage.src = '';
      if (opener) opener.focus();
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(input, hasError) {
      var message = document.getElementById(input.id + '-error');
      input.setAttribute('aria-invalid', String(hasError));
      if (message) {
        message.hidden = !hasError;
        if (hasError) input.setAttribute('aria-describedby', message.id);
        else input.removeAttribute('aria-describedby');
      }
      return !hasError;
    }

    function validate(input) {
      var value = input.value.trim();
      if (input.type === 'email') return setError(input, !EMAIL_PATTERN.test(value));
      if (input.required) return setError(input, value === '');
      return true;
    }

    Array.prototype.forEach.call(form.elements, function (input) {
      if (!input.name) return;
      input.addEventListener('blur', function () {
        if (input.value.trim() !== '' || input.getAttribute('aria-invalid') === 'true') validate(input);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      status.textContent = '';

      var fields = [form.elements.name, form.elements.email, form.elements.message];
      var firstInvalid = null;
      fields.forEach(function (input) {
        if (!validate(input) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // Send the enquiry to send-mail.php, which emails it with PHP mail().
      var submitButton = document.getElementById('cf-submit');
      var buttonLabel = submitButton.textContent;

      var finish = function (ok, message) {
        submitButton.disabled = false;
        submitButton.textContent = buttonLabel;
        status.classList.toggle('is-error', !ok);
        status.textContent = message;
      };

      submitButton.disabled = true;
      submitButton.textContent = 'Sending enquiry…';
      status.classList.remove('is-error');

      fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok && data.ok, message: data.message };
          });
        })
        .then(function (result) {
          finish(result.ok, result.message || (result.ok
            ? 'Enquiry sent. Thank you for contacting Honey Star Resources.'
            : 'The enquiry could not be sent. Try again in a few minutes.'));
          if (result.ok) form.reset();
        })
        .catch(function () {
          // No JSON came back: usually the page is not running on a PHP server.
          finish(false, 'The enquiry could not be sent. Check your connection and try again.');
        });
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
