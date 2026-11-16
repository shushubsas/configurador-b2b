/*
 * SHU-SHU® · Configurador B2B — LÓGICA (etapa 1: pasos y selección)
 * ------------------------------------------------------------------
 * No editar para cambiar productos o precios: eso va en shushu-config.js.
 * JavaScript sin dependencias. Todo queda dentro de window.ShushuB2B.
 *
 * Módulos:
 *   Steps    — arma la lista de pasos según el producto elegido.
 *   State    — selección actual del cliente.
 *   Render   — dibuja cada paso y el resumen lateral.
 *   App      — conecta todo y maneja la navegación.
 * Próximas etapas: Pricing (2), Logo + Mockup (3), WhatsApp (4).
 */
(function () {
  'use strict';

  var MOUNT_ID = 'shushu-b2b';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------------- Steps ---------------- */
  var Steps = {
    // Opciones de un paso que aplican al producto elegido.
    optionsFor: function (step, productId) {
      return (step.options || []).filter(function (o) {
        return !o.availableFor || !productId || o.availableFor.indexOf(productId) !== -1;
      });
    },
    // Lista completa: producto + pasos configurables con opciones + cantidad + resumen.
    build: function (config, productId) {
      var list = [{ id: 'producto', title: 'Tipo de producto', kind: 'product' }];
      (config.steps || []).forEach(function (s) {
        if (!productId || Steps.optionsFor(s, productId).length) list.push(s);
      });
      list.push({ id: 'cantidad', title: 'Cantidad', kind: 'quantity' });
      list.push({ id: 'resumen', title: 'Resumen', kind: 'summary' });
      return list;
    }
  };

  /* ---------------- State ---------------- */
  function createState(config) {
    return {
      config: config,
      current: 0,
      productId: null,
      selections: {}, // stepId -> optionId
      quantity: null,

      product: function () {
        var id = this.productId;
        return (config.products || []).filter(function (p) { return p.id === id; })[0] || null;
      },
      steps: function () { return Steps.build(config, this.productId); },
      isComplete: function (step) {
        if (step.kind === 'product') return !!this.productId;
        if (step.kind === 'quantity') return !!this.quantity;
        if (step.kind === 'summary') return false;
        return !!this.selections[step.id];
      },
      setProduct: function (id) {
        this.productId = id;
        // Descarta selecciones que ya no aplican al nuevo producto.
        var self = this;
        (config.steps || []).forEach(function (s) {
          var sel = self.selections[s.id];
          if (sel && !Steps.optionsFor(s, id).some(function (o) { return o.id === sel; })) {
            delete self.selections[s.id];
          }
        });
      },
      // Primer paso al que se puede saltar (todos los anteriores completos).
      furthestReachable: function () {
        var steps = this.steps();
        for (var i = 0; i < steps.length; i++) if (!this.isComplete(steps[i])) return i;
        return steps.length - 1;
      }
    };
  }

  /* ---------------- Render ---------------- */
  var Render = {
    header: function (config) {
      return '' +
        '<header class="shb2b-hero">' +
          '<p class="shb2b-eyebrow">' + esc(config.brand) + ' · Venta mayorista</p>' +
          '<p class="shb2b-lead">Configurá tu producción paso a paso y obtené tu cotización.</p>' +
          (config.examplePrices ? '<p class="shb2b-notice" role="note">Datos y precios de ejemplo — no válidos para cotizar.</p>' : '') +
        '</header>';
    },

    progress: function (state) {
      var steps = state.steps();
      var reach = state.furthestReachable();
      return '<ol class="shb2b-progress" aria-label="Pasos">' + steps.map(function (s, i) {
        var cls = 'shb2b-progress-item' +
          (i === state.current ? ' is-current' : '') +
          (state.isComplete(s) ? ' is-done' : '');
        var disabled = i > reach ? ' disabled' : '';
        return '<li class="' + cls + '"><button type="button" data-goto="' + i + '"' + disabled +
          (i === state.current ? ' aria-current="step"' : '') + '>' +
          '<span class="shb2b-progress-num">' + (i + 1) + '</span>' +
          '<span class="shb2b-progress-label">' + esc(s.title) + '</span></button></li>';
      }).join('') + '</ol>';
    },

    optionCard: function (name, value, label, sub, checked, swatch) {
      return '<label class="shb2b-option' + (swatch ? ' shb2b-option--color' : '') + '">' +
        '<input type="radio" name="' + esc(name) + '" value="' + esc(value) + '"' + (checked ? ' checked' : '') + '>' +
        '<span class="shb2b-option-body">' +
          (swatch ? '<span class="shb2b-swatch" style="background:' + esc(swatch) + '"></span>' : '') +
          '<span class="shb2b-option-label">' + esc(label) + '</span>' +
          (sub ? '<span class="shb2b-option-sub">' + esc(sub) + '</span>' : '') +
        '</span></label>';
    },

    stepBody: function (state, step) {
      var config = state.config;
      if (step.kind === 'product') {
        return '<div class="shb2b-options" role="radiogroup" aria-label="Tipo de producto">' +
          config.products.map(function (p) {
            return Render.optionCard('producto', p.id, p.label, p.description, state.productId === p.id);
          }).join('') + '</div>';
      }
      if (step.kind === 'quantity') {
        return '<div class="shb2b-options shb2b-options--qty" role="radiogroup" aria-label="Cantidad">' +
          config.quantities.map(function (q) {
            return Render.optionCard('cantidad', q, q.toLocaleString(config.locale) + ' u.', '', state.quantity === q);
          }).join('') + '</div>';
      }
      if (step.kind === 'summary') return Render.summaryList(state, true);
      var opts = Steps.optionsFor(step, state.productId);
      return '<div class="shb2b-options' + (step.kind === 'color' ? ' shb2b-options--color' : '') +
        '" role="radiogroup" aria-label="' + esc(step.title) + '">' +
        opts.map(function (o) {
          return Render.optionCard(step.id, o.id, o.label, '', state.selections[step.id] === o.id, step.kind === 'color' ? o.swatch : null);
        }).join('') + '</div>';
    },

    summaryList: function (state, full) {
      var config = state.config;
      var product = state.product();
      var rows = [['Producto', product ? product.label : '—']];
      state.steps().forEach(function (s) {
        if (s.kind === "product" || s.kind === "quantity" || s.kind === "summary") return;
        var sel = state.selections[s.id];
        var opt = (s.options || []).filter(function (o) { return o.id === sel; })[0];
        rows.push([s.title, opt ? opt.label : '—']);
      });
      rows.push(['Cantidad', state.quantity ? state.quantity.toLocaleString(config.locale) + ' u.' : '—']);
      if (full && product && product.productionDays) {
        rows.push(['Producción estimada', product.productionDays.min + '–' + product.productionDays.max + ' días hábiles']);
      }
      return '<dl class="shb2b-summary-list">' + rows.map(function (r) {
        return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>';
      }).join('') + '</dl>' +
        (full ? '<p class="shb2b-muted">La cotización con precios, el logo y el mockup se suman en las próximas etapas.</p>' : '');
    },

    main: function (state) {
      var steps = state.steps();
      var step = steps[state.current];
      var isFirst = state.current === 0;
      var isLast = state.current === steps.length - 1;
      var canNext = state.isComplete(step);
      return '' +
        '<section class="shb2b-step" aria-labelledby="shb2b-step-title">' +
          '<p class="shb2b-step-count">Paso ' + (state.current + 1) + ' de ' + steps.length + '</p>' +
          '<h3 id="shb2b-step-title" class="shb2b-step-title" tabindex="-1">' + esc(step.title) + '</h3>' +
          (step.help ? '<p class="shb2b-muted">' + esc(step.help) + '</p>' : '') +
          Render.stepBody(state, step) +
          '<div class="shb2b-nav">' +
            (isFirst ? '<span></span>' : '<button type="button" class="shb2b-btn shb2b-btn--ghost" data-action="prev">Anterior</button>') +
            (isLast ? '' : '<button type="button" class="shb2b-btn" data-action="next"' + (canNext ? '' : ' disabled') + '>Siguiente</button>') +
          '</div>' +
        '</section>';
    },

    aside: function (state) {
      return '<aside class="shb2b-aside" aria-label="Tu configuración">' +
        '<h3 class="shb2b-aside-title">Tu configuración</h3>' +
        Render.summaryList(state, false) +
        '</aside>';
    }
  };

  /* ---------------- App ---------------- */
  function mount(root, config) {
    var state = createState(config);
    root.classList.add('shb2b');

    function draw(focusTitle) {
      root.innerHTML =
        Render.header(config) +
        Render.progress(state) +
        '<div class="shb2b-layout">' + Render.main(state) + Render.aside(state) + '</div>';
      if (focusTitle) {
        var t = root.querySelector('#shb2b-step-title');
        if (t) t.focus({ preventScroll: true });
      }
    }

    function go(i) {
      var max = state.furthestReachable();
      state.current = Math.max(0, Math.min(i, max, state.steps().length - 1));
      draw(true);
      var top = root.getBoundingClientRect().top + window.pageYOffset - 80;
      if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: 'smooth' });
    }

    root.addEventListener('change', function (e) {
      var input = e.target;
      if (input.type !== 'radio') return;
      if (input.name === 'producto') state.setProduct(input.value);
      else if (input.name === 'cantidad') state.quantity = parseInt(input.value, 10);
      else state.selections[input.name] = input.value;
      draw(false);
      var again = root.querySelector('input[name="' + input.name + '"][value="' + input.value + '"]');
      if (again) again.focus();
    });

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn || btn.disabled) return;
      if (btn.dataset.goto != null) go(parseInt(btn.dataset.goto, 10));
      else if (btn.dataset.action === 'next') go(state.current + 1);
      else if (btn.dataset.action === 'prev') go(state.current - 1);
    });

    draw(false);
    return state;
  }

  function init() {
    var root = document.getElementById(MOUNT_ID);
    var config = window.SHUSHU_B2B_CONFIG;
    if (!root) return;
    if (!config || !config.products || !config.products.length) {
      root.innerHTML = '<p>El configurador no está disponible en este momento.</p>';
      return;
    }
    window.ShushuB2B = { state: mount(root, config), Steps: Steps, version: '0.1.0' };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
