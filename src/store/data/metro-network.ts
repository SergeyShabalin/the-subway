export const metroNetwork = [
  {
    id: 1,
    color: '#90a05f',
    name: 'Замоскворецкая',
    stations: [
      {
        id: 1,
        x: 200,
        y: 300,
        color: '#90a05f',
        label: 'Сокол',
        labelOffset: { x: 0, y: -60 },
      },
      {
        id: 2,
        x: 600,
        y: 300,
        color: '#90a05f',
        label: 'Аэропорт',
        labelOffset: { x: 0, y: -60 },
      },
      {
        id: 3,
        x: 700,
        y: 300,
        color: '#90a05f',
        label: 'Войковская',
        labelOffset: { x: 0, y: -60 },
      },
    ],
    segments: [
      { fromStationId: 1, toStationId: 2, timeMinutes: 5 },
      { fromStationId: 2, toStationId: 3, timeMinutes: 5 },
    ],
    isCircular: false,
    renderStyle: 'linear',
  },
  {
    id: 2,
    color: '#1a83cd',
    name: 'Арбатско-Покровская',
    stations: [
      {
        id: 4,
        x: 200,
        y: 500,
        color: '#1a83cd',
        label: 'Парк победы',
        labelOffset: { x: 0, y: -60 },
      },
      {
        id: 5,
        x: 600,
        y: 500,
        color: '#1a83cd',
        label: 'Славянский бульвар',
        labelOffset: { x: 0, y: -60 },
      },
      {
        id: 6,
        x: 800,
        y: 500,
        color: '#1a83cd',
        label: 'Киевская',
        labelOffset: { x: 0, y: -60 },
        type: 'single'
      },
    ],
    segments: [
      { fromStationId: 4, toStationId: 5, timeMinutes: 5 },
      { fromStationId: 5, toStationId: 6, timeMinutes: 7 },
    ],
    isCircular: false,
    renderStyle: 'linear',
  },
  {
    id: 3,
    color: '#aa4401',
    name: 'Кольцевая',
    stations: [
      {
        "id": 7,
        "x": 389.79307789898706,
        "y": 487.62750394404776,
        "color": "#aa4401",
        "label": "Фрунзенская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 8,
        "x": 561.0121865695592,
        "y": 738.4840672838677,
        "color": "#aa4401",
        "label": "Октябрьская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 9,
        "x": 863.8931135118098,
        "y": 761.0260866968068,
        "color": "#aa4401",
        "label": "Добрынинская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 10,
        "x": 1070.3603430932644,
        "y": 538.2789617915251,
        "color": "#aa4401",
        "label": "Павелецкая",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 11,
        "x": 1024.9398402751394,
        "y": 237.97582083499273,
        "color": "#aa4401",
        "label": "Марксисткая",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 12,
        "x": 761.8341700888913,
        "y": 86.25105403518694,
        "color": "#aa4401",
        "label": "Курская",
        "labelOffset": {
          "x": 10,
          "y": -30
        }
      },
      {
        "id": 13,
        "x": 479.1672685623498,
        "y": 197.35650541357245,
        "color": "#aa4401",
        "label": "Комсомольская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      }
    ],
    segments: [
      { fromStationId: 7, toStationId: 8, timeMinutes: 8 },
      { fromStationId: 8, toStationId: 9, timeMinutes: 4 },
      { fromStationId: 9, toStationId: 10, timeMinutes: 5 },
      { fromStationId: 10, toStationId: 11, timeMinutes: 5 },
      { fromStationId: 11, toStationId: 12, timeMinutes: 3 },
      { fromStationId: 12, toStationId: 13, timeMinutes: 4 },
    ],
    isCircular: false,
    renderStyle: 'circular',
    locking: true,
    curvatureLines: 62,
  },
  {
    id: 4,
    color: '#019caa',
    name: 'БКЛ',
    stations: [

        {
          "id": 14,
          "x": 344.3341781462873,
          "y": 1153.1326864832351,
          "color": "#019caa",
          "label": "Проспект вернадского",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 15,
          "x": 548.6502738241176,
          "y": 1065.6184699287141,
          "color": "#019caa",
          "label": "Новаторская",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 16,
          "x": 710.7129763513514,
          "y": 913.5017860910983,
          "color": "#019caa",
          "label": "Воронцовская",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 17,
          "x": 810.975132012448,
          "y": 715.130152044358,
          "color": "#019caa",
          "label": "Зюзино",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 18,
          "x": 837.3436451228553,
          "y": 494.4301145080446,
          "color": "#019caa",
          "label": "Каховская",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 19,
          "x": 786.6380838436511,
          "y": 278.02135519469164,
          "color": "#019caa",
          "label": "Варшавская",
          "labelOffset": {
            "x": 10,
            "y": -30
          }
        },
        {
          "id": 20,
          "x": 664.9742871994922,
          "y": 92.00596433062213,
          "color": "#019caa",
          "label": "Каширская",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 21,
          "x": 487.02670463206937,
          "y": -41.179856651170326,
          "color": "#019caa",
          "label": "Кленовый бульвар",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 22,
          "x": 274.2584408256314,
          "y": -105.47193212690752,
          "color": "#019caa",
          "label": "Нагатинский затон",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 23,
          "x": 52.33248852037582,
          "y": -93.11568894423681,
          "color": "#019caa",
          "label": "Печатники",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 24,
          "x": -151.98360715745443,
          "y": -5.601472389715809,
          "color": "#019caa",
          "label": "Текстильщики",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 25,
          "x": -314.046309684688,
          "y": 146.5152114478998,
          "color": "#019caa",
          "label": "Нижегородская",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 31,
          "x": -414.3084653457847,
          "y": 344.8868454946401,
          "color": "#019caa",
          "label": "Авиамоторная",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 32,
          "x": -440.67697845619216,
          "y": 565.5868830309538,
          "color": "#019caa",
          "label": "Лефортово",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 33,
          "x": -389.9714171769881,
          "y": 781.9956423443065,
          "color": "#019caa",
          "label": "Электрозаводская",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 34,
          "x": -268.30762053282945,
          "y": 968.0110332083759,
          "color": "#019caa",
          "label": "Сокольники",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 35,
          "x": -90.36003796540612,
          "y": 1101.1968541901688,
          "color": "#019caa",
          "label": "Рижская",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        },
        {
          "id": 36,
          "x": 122.4082258410316,
          "y": 1165.4889296659057,
          "color": "#019caa",
          "label": "Марьина Роща",
          "labelOffset": {
            "x": 20,
            "y": -20
          }
        }

    ],
    segments: [
      { fromStationId: 14, toStationId: 15, timeMinutes: 8 },
      { fromStationId: 15, toStationId: 16, timeMinutes: 4 },
      { fromStationId: 16, toStationId: 17, timeMinutes: 5 },
      { fromStationId: 17, toStationId: 18, timeMinutes: 5 },
      { fromStationId: 18, toStationId: 19, timeMinutes: 3 },
      { fromStationId: 19, toStationId: 20, timeMinutes: 4 },
      { fromStationId: 20, toStationId: 21, timeMinutes: 2 },
      { fromStationId: 21, toStationId: 22, timeMinutes: 7 },
      { fromStationId: 22, toStationId: 23, timeMinutes: 3 },
      { fromStationId: 23, toStationId: 24, timeMinutes: 4 },
      { fromStationId: 24, toStationId: 25, timeMinutes: 6 },
      { fromStationId: 25, toStationId: 31, timeMinutes: 4 },
      { fromStationId: 31, toStationId: 32, timeMinutes: 4 },
      { fromStationId: 32, toStationId: 33, timeMinutes: 4 },
      { fromStationId: 33, toStationId: 34, timeMinutes: 4 },
      { fromStationId: 34, toStationId: 35, timeMinutes: 4 },
      { fromStationId: 35, toStationId: 36, timeMinutes: 4 },
    ],
    isCircular: false,
    renderStyle: 'circular',
    locking: true,
    curvatureLines: 17,
  },
  {
    id: 5,
    color: '#ffc400',
    name: 'МЦД-4',
    stations: [
      {
        id: 26,
        x: -600,
        y: 400,
        color: '#ffc400',
        label: 'Очаково',
        labelOffset: { x: 0, y: -60 },
      },
      {
        id: 27,
        x: -100,
        y: 450,
        color: '#ffc400',
        label: 'Аминьевская',
        labelOffset: { x: 0, y: -60 },
      },
      {
        id: 28,
        x: 300,
        y: 650,
        color: '#ffc400',
        label: 'Минская',
        labelOffset: { x: 0, y: -60 },
      },
      {
        id: 29,
        x: 900,
        y: 600,
        color: '#ffc400',
        label: 'Матвеевская',
        labelOffset: { x: 0, y: -60 },
      },
      {
        id: 30,
        x: 1200,
        y: 600,
        color: '#ffc400',
        label: 'Поклонная',
        labelOffset: { x: 0, y: -60 },
      },
    ],
    segments: [
      { fromStationId: 26, toStationId: 27, timeMinutes: 13 },
      { fromStationId: 27, toStationId: 28, timeMinutes: 8 },
      { fromStationId: 28, toStationId: 29, timeMinutes: 14 },
      { fromStationId: 29, toStationId: 30, timeMinutes: 7 }

    ],
    isCircular: false,
    renderStyle: 'diameter',
  },
]
