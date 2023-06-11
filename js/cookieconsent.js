$(document).ready(function () {
  "use strict";

  var cc = initCookieConsent();

  cc.run({
    current_lang: Cookies.get("lang"),
    autoclear_cookies: true,                   // default: false
    page_scripts: true,                        // default: false
    gui_options: {
      consent_modal: {
          layout: 'box',                       // box/cloud/bar
          position: 'bottom center',           // bottom/middle/top + left/right/center
          transition: 'zoom'                   // zoom/slide
      },
      settings_modal: {
          layout: 'box',                       // box/bar
          transition: 'zoom'                   // zoom/slide
      }
    },

    // mode: 'opt-in'                          // default: 'opt-in'; value: 'opt-in' or 'opt-out'
    // delay: 0,                               // default: 0
    // auto_language: null                     // default: null; could also be 'browser' or 'document'
    // autorun: true,                          // default: true
    // force_consent: false,                   // default: false
    // hide_from_bots: true,                   // default: true
    // remove_cookie_tables: false             // default: false
    // cookie_name: 'cc_cookie',               // default: 'cc_cookie'
    // cookie_expiration: 182,                 // default: 182 (days)
    // cookie_necessary_only_expiration: 182   // default: disabled
    // cookie_domain: location.hostname,       // default: current domain
    // cookie_path: '/',                       // default: root
    // cookie_same_site: 'Lax',                // default: 'Lax'
    // use_rfc_cookie: false,                  // default: false
    // revision: 0,                            // default: 0

    onFirstAction: function (user_preferences, cookie) {
      //Currently we only have one cookie which can be selected that's why we just try to get the first item in the array
      //We can enhance this in the future when we include more 3rd party stuff...
      let rejected = user_preferences.rejected_categories[0];

      if (rejected) {
        disable_analytics();
      }
    },

    onAccept: function (cookie) {
      //Check if GA is already disabled by user
      let ga = Cookies.get("ga-disable-G-9FDJYXMY95");

      if (ga) {
        Object.keys(Cookies.get()).forEach(function (cookieName) {
          if(cookieName.startsWith('_ga')) {
            Cookies.remove(cookieName);
          }
        });
      }
    },

    onChange: function (cookie, changed_preferences) {
      // ...
    },

    languages: {
      de: {
        consent_modal: {
          title: "Wir nutzen Cookies!",
          description:
            'Hallo, diese Website verwendet essenzielle Cookies, um ihren ordnungsgemäßen Betrieb sicherzustellen, sowie Tracking-Cookies, um zu verstehen, wie Du mit ihr interagierst. Letztere werden nur nach Einwilligung gesetzt. <button type="button" data-cc="c-settings" class="cc-link">Zur Auswahl</button>',
          primary_btn: {
            text: "Alle akzeptieren",
            role: "accept_all", // 'accept_selected' or 'accept_all'
          },
          secondary_btn: {
            text: "Alle ablehnen",
            role: "accept_necessary", // 'settings' or 'accept_necessary'
          },
        },
        settings_modal: {
          title: "Cookie Einstellungen",
          save_settings_btn: "Einstellungen speichern",
          accept_all_btn: "Alle akzeptieren",
          reject_all_btn: "Alle ablehnen",
          close_btn_label: "Schließen",
          cookie_table_headers: [
            { col1: "Name" },
            { col2: "Domain" },
            { col3: "Beschreibung" },
          ],
          blocks: [
            {
              title: "Cookie Nutzung 📢",
              description:
                'Wir verwenden Cookies, um die grundlegenden Funktionen der Website sicherzustellen und Dein Online-Erlebnis zu verbessern. Du kannst jederzeit für jede Kategorie wählen, ob Du zustimmen oder ablehnen möchtest. Für weitere Details zu Cookies und anderen sensiblen Daten lese bitte unsere vollständige <a href="dataprivacy.html" class="cc-link">Datenschutzrichtlinie</a>.',
            },
            {
              title: "Notwendige Cookies",
              description:
                "Diese Cookies sind für das reibungslose Funktionieren unserer Website unerlässlich. Ohne diese Cookies würde die Website nicht richtig funktionieren.",
              toggle: {
                value: "necessary",
                enabled: true,
                readonly: true, // cookie categories with readonly=true are all treated as "necessary cookies"
              },
            },
            {
              title: "Analyse Cookies",
              description:
                "Diese Cookies erlauben uns zu analysieren, wie Du unsere Webseite nutzt.",
              toggle: {
                value: "analytics", // your cookie category
                enabled: true,
                readonly: false,
              },
              cookie_table: [
                // list of all expected cookies
                {
                  col1: "^_ga", // match all cookies starting with "_ga"
                  col2: "google.com",
                  col3: "Google Analytics",
                  is_regex: true,
                },
              ],
            },
            {
              title: "Weitere Informationen",
              description:
                'Bei Fragen zu unseren Cookies und Deinen Wahlmöglichkeiten wende Dich bitte an <a class="cc-link" href="index.html#contact">uns</a>.',
            },
          ],
        },
      },
      en: {
        consent_modal: {
          title: "We use cookies!",
          description:
            'Hi, this website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent. <button type="button" data-cc="c-settings" class="cc-link">Let me choose</button>',
          primary_btn: {
            text: "Accept all",
            role: "accept_all", // 'accept_selected' or 'accept_all'
          },
          secondary_btn: {
            text: "Reject all",
            role: "accept_necessary", // 'settings' or 'accept_necessary'
          },
        },
        settings_modal: {
          title: "Cookie preferences",
          save_settings_btn: "Save settings",
          accept_all_btn: "Accept all",
          reject_all_btn: "Reject all",
          close_btn_label: "Close",
          cookie_table_headers: [
            { col1: "Name" },
            { col2: "Domain" },
            { col3: "Description" },
          ],
          blocks: [
            {
              title: "Cookie usage 📢",
              description:
                'We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="dataprivacy.html" class="cc-link">privacy policy</a>.',
            },
            {
              title: "Strictly necessary cookies",
              description:
                "These cookies are essential for the proper functioning of our website. Without these cookies, the website would not work properly",
              toggle: {
                value: "necessary",
                enabled: true,
                readonly: true, // cookie categories with readonly=true are all treated as "necessary cookies"
              },
            },
            {
              title: "Analytics cookies",
              description:
                "These cookies allow us to analyize how you are using our website.",
              toggle: {
                value: "analytics", // your cookie category
                enabled: true,
                readonly: false,
              },
              cookie_table: [
                // list of all expected cookies
                {
                  col1: "^_ga", // match all cookies starting with "_ga"
                  col2: "google.com",
                  col3: "Google Analytics",
                  is_regex: true,
                },
              ],
            },
            {
              title: "More information",
              description:
                'For any queries in relation to our policy on cookies and your choices, please <a class="cc-link" href="index.html#contact">contact us</a>.',
            },
          ],
        },
      },
    },
  });

  //Language switch event
  $("#switch-lang").click(function (event) {
    cc.updateLanguage(Cookies.get("lang"));  
  });
});
