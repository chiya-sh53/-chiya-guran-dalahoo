/* پس‌زمینهٔ نت سل (کلید سل) برای همهٔ صفحه‌ها
   به هر صفحه این دو خط را اضافه کنید:
   <canvas id="bg" aria-hidden="true"></canvas>   (بعد از <body>)
   <script src="bg.js"></script>                   (پیش از </body>)
   تصاویر لازم: images/clef-teal.png و images/clef-gold.png */
(function () {
  var c = document.getElementById('bg');
  if (!c) return;
  var x = c.getContext('2d');
  var w = 0, h = 0, items = [], imgs = [], loaded = 0;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var running = false;

  ['images/clef-teal.png', 'images/clef-gold.png'].forEach(function (src) {
    var im = new Image();
    im.onload = function () { loaded++; if (loaded === 2) start(); };
    im.onerror = function () { loaded++; if (loaded === 2) start(); };
    im.src = src;
    imgs.push(im);
  });

  function ready() { return imgs.filter(function (i) { return i.naturalWidth > 0; }); }

  function make(initial) {
    var good = ready();
    var size = 26 + Math.random() * 70;
    return {
      img: good[Math.floor(Math.random() * good.length)],
      s: size,
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + size,
      vy: -(0.12 + Math.random() * 0.28),
      sway: 10 + Math.random() * 25,
      phase: Math.random() * 6.283,
      rot: (Math.random() - .5) * 0.7,
      rv: (Math.random() - .5) * 0.002,
      a: 0.09 + Math.random() * 0.15
    };
  }

  function resize() {
    var d = window.devicePixelRatio || 1;
    w = window.innerWidth; h = window.innerHeight;
    c.width = w * d; c.height = h * d;
    x.setTransform(d, 0, 0, d, 0, 0);
    if (!ready().length) return;
    var n = Math.max(8, Math.min(30, Math.floor(w * h / 38000)));
    items = [];
    for (var i = 0; i < n; i++) items.push(make(true));
    if (still) draw(0);
  }

  function draw(t) {
    x.clearRect(0, 0, w, h);
    for (var i = 0; i < items.length; i++) {
      var o = items[i];
      if (!still) {
        o.y += o.vy;
        o.rot += o.rv;
        if (o.y < -o.s * 1.5) { items[i] = o = make(false); }
      }
      var px = o.x + Math.sin(t / 2600 + o.phase) * o.sway;
      x.save();
      x.globalAlpha = o.a;
      x.translate(px, o.y);
      x.rotate(o.rot);
      x.drawImage(o.img, -o.s / 2, -o.s / 2, o.s, o.s);
      x.restore();
    }
    if (!still) requestAnimationFrame(draw);
  }

  function start() {
    if (running || !ready().length) return;
    running = true;
    resize();
    if (!still) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', function () { if (running) resize(); });
})();
