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
          id: 14,
          x: 299.99999999999505,
          y: 963.9166666666649,
          color: '#019caa',
          label: 'Проспект вернадского',
          labelOffset: {
            x: 20,
            y: -20,
          },
        },
        {
          id: 15,
          x: 604.9999999999957,
          y: 882.1921629751746,
          color: '#019caa',
          label: 'Новаторская',
          labelOffset: {
            x: 20,
            y: -20,
          },
        },
        {
          id: 16,
          x: 828.2754963085047,
          y: 658.9166666666686,
          color: '#019caa',
          label: 'Воронцовская',
          labelOffset: {
            x: 20,
            y: -20,
          },
        },
        {
          id: 17,
          x: 909.9999999999992,
          y: 353.9166666666691,
          color: '#019caa',
          label: 'Зюзино',
          labelOffset: {
            x: 20,
            y: -20,
          },
        },
        {
          id: 18,
          x: 828.2754963085089,
          y: 48.91666666666862,
          color: '#019caa',
          label: 'Каховская',
          labelOffset: {
            x: 20,
            y: -20,
          },
        },
        {
          id: 19,
          x: 605.0000000000027,
          y: -174.3588296418406,
          color: '#019caa',
          label: 'Варшавская',
          labelOffset: {
            x: 10,
            y: -30,
          },
        },
        {
          id: 20,
          x: 300.00000000000347,
          y: -256.08333333333513,
          color: '#019caa',
          label: 'Каширская',
          labelOffset: {
            x: 20,
            y: -20,
          },
        },
        {
          id: 21,
          x: -4.999999999997158,
          y: -174.3588296418448,
          color: '#019caa',
          label: 'Кленовый бульвар',
          labelOffset: {
            x: 20,
            y: -20,
          },
        },
        {
          id: 22,
          x: -228.27549630850615,
          y: 48.91666666666089,
          color: '#019caa',
          label: 'Нагатинский затон',
          labelOffset: {
            x: 20,
            y: -20,
          },
        },
        {
          id: 23,
          x: -310.0000000000008,
          y: 353.91666666666043,
          color: '#019caa',
          label: 'Печатники',
          labelOffset: {
            x: 20,
            y: -20,
          },
        },
        {
          id: 24,
          x: -228.27549630851047,
          y: 658.9166666666613,
          color: '#019caa',
          label: 'Текстильщики',
          labelOffset: {
            x: 20,
            y: -20,
          },
        },
        {
          id: 25,
          x: -5.000000000004775,
          y: 882.19216297517,
          color: '#019caa',
          label: 'Нижегородская',
          labelOffset: {
            x: 20,
            y: -20,
          },
        },
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
    ],
    isCircular: false,
    renderStyle: 'circular',
    locking: true,
    curvatureLines: 34,
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
