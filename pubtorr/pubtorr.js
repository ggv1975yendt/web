(function () {
    'use strict';

    function translate() {
      Lampa.Lang.add({
        lme_parser: {
          ru: 'Каталог парсеров',
          en: 'Parsers catalog',
          uk: 'Каталог парсерів',
          zh: '解析器目录' // Chinese translation
        },
        lme_parser_description: {
          ru: 'Нажмите для выбора парсера из ',
          en: 'Click to select a parser from the ',
          uk: 'Натисніть для вибору парсера з ',
          zh: '单击以从可用的 '
        },
        lme_pubtorr: {
          ru: 'Каталог TorrServer',
          en: 'TorrServer catalog',
          uk: 'Каталог TorrServer',
          zh: '解析器目录' // Chinese translation
        },
        lme_pubtorr_description: {
          ru: 'Бесплатные серверы от проекта LME',
          en: 'Free servers from the LME project',
          uk: 'Безкоштовні сервери від проєкту LME',
          zh: '来自 LME 项目的免费服务器 '
        }
      });
    }
    var Lang = {
      translate: translate
    };

    var parsersInfo = [{
      base: 'My_number_1',
      name: 'My_number_1',
      settings: {
        url: '188.119.113.252:9117',
        key: '1',
        parser_torrent_type: 'jackett'
      }
    }, {
      base: 'My_number_2',
      name: 'My_number_2',
      settings: {
        url: '188.119.113.252:9117',
        key: '1',
        parser_torrent_type: 'jackett'
      }
    }];

    //TODO: Rework
    /***
    Lampa.Controller.listener.follow('toggle', (e) => {
        if (e.name === 'select') {
            checkAlive("parser");
        }
    });
    ***/

    function changeParser() {
      var jackettUrlTwo = Lampa.Storage.get("jackett_url_two");
      var selectedParser = parsersInfo.find(function (parser) {
        return parser.base === jackettUrlTwo;
      });
      if (selectedParser) {
        var settings = selectedParser.settings;
        Lampa.Storage.set(settings.parser_torrent_type === 'prowlarr' ? "prowlarr_url" : "jackett_url", settings.url);
        Lampa.Storage.set(settings.parser_torrent_type === 'prowlarr' ? "prowlarr_key" : "jackett_key", settings.key);
        Lampa.Storage.set("parser_torrent_type", settings.parser_torrent_type);
      } else {
        console.warn("Jackett URL not found in parsersInfo");
      }
    }
    var s_values = parsersInfo.reduce(function (prev, _ref) {
      var base = _ref.base,
        name = _ref.name;
      prev[base] = name;
      return prev;
    }, {
      no_parser: 'Не выбран'
    });
    function parserSetting() {
      Lampa.SettingsApi.addParam({
        component: 'parser',
        param: {
          name: 'jackett_url_two',
          type: 'select',
          values: s_values,
          "default": 'no_parser'
        },
        field: {
          name: "<div class=\"settings-folder\" style=\"padding:0!important\"><div style=\"font-size:1.0em\">".concat(Lampa.Lang.translate('lme_parser'), "</div></div>"),
          description: "".concat(Lampa.Lang.translate('lme_parser_description'), " ").concat(parsersInfo.length)
        },
        onChange: function onChange(value) {
          changeParser();
          Lampa.Settings.update();
        },
        onRender: function onRender(item) {
          $('.settings-param__value p.parserName').remove();
          changeParser();
          setTimeout(function () {
            $('div[data-children="parser"]').on('hover:enter', function () {
              Lampa.Settings.update();
            });
            if (Lampa.Storage.field('parser_use')) {
              item.show();
              $('.settings-param__name', item).css('color', 'f3d900');
              $('div[data-name="jackett_url_two"]').insertAfter('div[data-children="parser"]');
            } else {
              item.hide();
            }
          });
        }
      });
      Lampa.Settings.listener.follow('open', function (e) {
        if (e.name === 'parser') {
          e.body.find('[data-name="jackett_url2"]').remove();
        }
      });
    }
    var Parser = {
      parserSetting: parserSetting
    };

    Lampa.Platform.tv();
    function add() {
      Lang.translate();
      Parser.parserSetting();
    }
    function startPlugin() {
      window.plugin_lmepublictorr_ready = true;
      if (window.appready) add();else {
        Lampa.Listener.follow('app', function (e) {
          if (e.type === 'ready') add();
        });
      }
    }
    if (!window.plugin_lmepublictorr_ready) startPlugin();

})();
