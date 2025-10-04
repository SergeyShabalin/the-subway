export const metroNetwork = [
  // {
  //   id: 1,
  //   color: '#90a05f',
  //   name: 'Замоскворецкая',
  //   stations: [
  //     {
  //       id: 1,
  //       x: -200,
  //       y: 300,
  //       color: '#90a05f',
  //       label: 'Сокол',
  //       labelOffset: { x: 0, y: -60 },
  //     },
  //     {
  //       id: 2,
  //       x: 40,
  //       y: 300,
  //       color: '#90a05f',
  //       label: 'Аэропорт',
  //       labelOffset: { x: 0, y: -60 },
  //     },
  //     {
  //       id: 3,
  //       x: 550,
  //       y: 300,
  //       color: '#90a05f',
  //       label: 'Войковская',
  //       labelOffset: { x: 0, y: -60 },
  //     },
  //     {
  //       id: 37,
  //       x: 800,
  //       y: 300,
  //       color: '#90a05f',
  //       label: 'Водный стадион',
  //       labelOffset: { x: 0, y: -60 },
  //     },
  //     {
  //       id: 38,
  //       x: 1000,
  //       y: 400,
  //       color: '#90a05f',
  //       label: 'Речной вокзал',
  //       labelOffset: { x: 0, y: -60 },
  //     },
  //     {
  //       id: 39,
  //       x: 1200,
  //       y: 400,
  //       color: '#90a05f',
  //       label: 'Беломорская',
  //       labelOffset: { x: 0, y: -60 },
  //     },
  //   ],
  //   segments: [
  //     { id: '1_2', fromStationId: 1, toStationId: 2, timeMinutes: 5 },
  //     { id: '2_3', fromStationId: 2, toStationId: 3, timeMinutes: 5 },
  //     { id: '3_37', fromStationId: 3, toStationId: 37, timeMinutes: 7 },
  //     { id: '37_38', fromStationId: 37, toStationId: 38, timeMinutes: 7 },
  //     { id: '38_39', fromStationId: 38, toStationId: 39, timeMinutes: 7 },
  //   ],
  //   isCircular: false,
  //   renderStyle: 'linear',
  // },
  {
    id: 2,
    color: '#1a83cd',
    name: 'Филевская',
   stations: [
      { id: 401, x: 400, y: -300, color: '#00BFFF', label: 'Кунцевская', labelOffset: { x: 0, y: -60 } },
      { id: 402, x: 300, y: -250, color: '#00BFFF', label: 'Пионерская', labelOffset: { x: 0, y: -60 } },
      { id: 403, x: 200, y: -200, color: '#00BFFF', label: 'Филёвский парк', labelOffset: { x: 0, y: -60 } },
      { id: 404, x: 100, y: -150, color: '#00BFFF', label: 'Багратионовская', labelOffset: { x: 0, y: -60 } },
      { id: 405, x: 0, y: -100, color: '#00BFFF', label: 'Фили', labelOffset: { x: 0, y: -60 } },
      { id: 406, x: -100, y: -50, color: '#00BFFF', label: 'Кутузовская', labelOffset: { x: 0, y: -60 } },
      { id: 407, x: -200, y: 0, color: '#00BFFF', label: 'Студенческая', labelOffset: { x: 0, y: -60 } },
      { id: 408, x: -300, y: 50, color: '#00BFFF', label: 'Киевская', labelOffset: { x: 0, y: -60 } },
    ],
    segments: [
      { id: '401_402', fromStationId: 401, toStationId: 402, timeMinutes: 2 },
      { id: '402_403', fromStationId: 402, toStationId: 403, timeMinutes: 2 },
      { id: '403_404', fromStationId: 403, toStationId: 404, timeMinutes: 2 },
      { id: '404_405', fromStationId: 404, toStationId: 405, timeMinutes: 2 },
      { id: '405_406', fromStationId: 405, toStationId: 406, timeMinutes: 2 },
      { id: '406_407', fromStationId: 406, toStationId: 407, timeMinutes: 2 },
      { id: '407_408', fromStationId: 407, toStationId: 408, timeMinutes: 2 },
    ],
    isCircular: false,
    renderStyle: 'linear',
  },

  // {
  //   id: 3,
  //   color: '#aa4401',
  //   name: 'Кольцевая',
  //   stations: [
  //     {
  //       "id": 7,
  //       "x": 689.7930778989871,
  //       "y": 487.62750394404776,
  //       "color": "#aa4401",
  //       "label": "Фрунзенская",
  //       "labelOffset": {
  //         "x": 20,
  //         "y": -20
  //       }
  //     },
  //     {
  //       "id": 8,
  //       "x": 861.0121865695592,
  //       "y": 738.4840672838677,
  //       "color": "#aa4401",
  //       "label": "Октябрьская",
  //       "labelOffset": {
  //         "x": 20,
  //         "y": -20
  //       }
  //     },
  //     {
  //       "id": 9,
  //       "x": 1163.8931135118098,
  //       "y": 761.0260866968068,
  //       "color": "#aa4401",
  //       "label": "Добрынинская",
  //       "labelOffset": {
  //         "x": 20,
  //         "y": -20
  //       }
  //     },
  //     {
  //       "id": 10,
  //       "x": 1370.3603430932644,
  //       "y": 538.2789617915251,
  //       "color": "#aa4401",
  //       "label": "Павелецкая",
  //       "labelOffset": {
  //         "x": 20,
  //         "y": -20
  //       }
  //     },
  //     {
  //       "id": 11,
  //       "x": 1324.9398402751394,
  //       "y": 237.97582083499273,
  //       "color": "#aa4401",
  //       "label": "Марксисткая",
  //       "labelOffset": {
  //         "x": 20,
  //         "y": -20
  //       }
  //     },
  //     {
  //       "id": 12,
  //       "x": 1061.8341700888913,
  //       "y": 86.25105403518694,
  //       "color": "#aa4401",
  //       "label": "Курская",
  //       "labelOffset": {
  //         "x": 10,
  //         "y": -30
  //       }
  //     },
  //     {
  //       "id": 13,
  //       "x": 779.1672685623498,
  //       "y": 197.35650541357245,
  //       "color": "#aa4401",
  //       "label": "Комсомольская",
  //       "labelOffset": {
  //         "x": 20,
  //         "y": -20
  //       }
  //     }
  //   ],
  //   segments: [
  //     { id: '7_8', fromStationId: 7, toStationId: 8, timeMinutes: 8 },
  //     { id: '8_9', fromStationId: 8, toStationId: 9, timeMinutes: 4 },
  //     { id: '9_10', fromStationId: 9, toStationId: 10, timeMinutes: 5 },
  //     { id: '10_11', fromStationId: 10, toStationId: 11, timeMinutes: 5 },
  //     { id: '11_12', fromStationId: 11, toStationId: 12, timeMinutes: 3 },
  //     { id: '12_13', fromStationId: 12, toStationId: 13, timeMinutes: 4 },
  //   ],
  //   isCircular: false,
  //   renderStyle: 'circular',
  //   locking: true,
  //   curvatureLines: 62,
  // },
  {
    id: 4,
    color: '#019caa',
    name: 'БКЛ',
    stations: [
      {
        "id": 14,
        "x": 734.7036661768949,
        "y": 1568.2791088387585,
        "color": "#019caa",
        "label": "Проспект вернадского",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 15,
        "x": 1076.2525211854233,
        "y": 1429.503110872322,
        "color": "#019caa",
        "label": "Новаторская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 16,
        "x": 1364.5191939627562,
        "y": 1162.0487477391941,
        "color": "#019caa",
        "label": "Воронцовская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 17,
        "x": 1516.25846834485,
        "y": 826.5018229182471,
        "color": "#019caa",
        "label": "Зюзино",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 18,
        "x": 1544.4693506351239,
        "y": 462.49250271961535,
        "color": "#019caa",
        "label": "Каховская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 19,
        "x": 1452.8685188765255,
        "y": 104.16771580708755,
        "color": "#019caa",
        "label": "Варшавская",
        "labelOffset": {
          "x": 10,
          "y": -30
        }
      },
      {
        "id": 20,
        "x": 1243.7295401774388,
        "y": -187.6175240891364,
        "color": "#019caa",
        "label": "Каширская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 21,
        "x": 955.8009766493255,
        "y": -391.04477295698547,
        "color": "#019caa",
        "label": "Кленовый бульвар",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 22,
        "x": 610.1963124037028,
        "y": -488.79109728812966,
        "color": "#019caa",
        "label": "Нагатинский затон",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 23,
        "x": 259.93665567634406,
        "y": -465.4323597424163,
        "color": "#019caa",
        "label": "Печатники",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 24,
        "x": -60.35247415562321,
        "y": -325.03462335169525,
        "color": "#019caa",
        "label": "Текстильщики",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 25,
        "x": -321.56545589037023,
        "y": -92.2972379310961,
        "color": "#019caa",
        "label": "Нижегородская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 31,
        "x": -492.1428100559036,
        "y": 227.49892057900786,
        "color": "#019caa",
        "label": "Авиамоторная",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 32,
        "x": -541.0209514327246,
        "y": 584.0803571433294,
        "color": "#019caa",
        "label": "Лефортово",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 33,
        "x": -473.1486811738507,
        "y": 939.5181664543791,
        "color": "#019caa",
        "label": "Электрозаводская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 34,
        "x": -281.611329932917,
        "y": 1247.2030287831853,
        "color": "#019caa",
        "label": "Сокольники",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 35,
        "x": 3.4733241718171257,
        "y": 1474.1692920278144,
        "color": "#019caa",
        "label": "Рижская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 36,
        "x": 345.41938210186777,
        "y": 1588.3529296634144,
        "color": "#019caa",
        "label": "Марьина Роща",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      }
    ],
    segments: [
      { id: '14_15', fromStationId: 14, toStationId: 15, timeMinutes: 8 },
      { id: '15_16', fromStationId: 15, toStationId: 16, timeMinutes: 4 },
      { id: '16_17', fromStationId: 16, toStationId: 17, timeMinutes: 5 },
      { id: '17_18', fromStationId: 17, toStationId: 18, timeMinutes: 5 },
      { id: '18_19', fromStationId: 18, toStationId: 19, timeMinutes: 3 },
      { id: '19_20', fromStationId: 19, toStationId: 20, timeMinutes: 4 },
      { id: '20_21', fromStationId: 20, toStationId: 21, timeMinutes: 2 },
      { id: '21_22', fromStationId: 21, toStationId: 22, timeMinutes: 7 },
      { id: '22_23', fromStationId: 22, toStationId: 23, timeMinutes: 3 },
      { id: '23_24', fromStationId: 23, toStationId: 24, timeMinutes: 4 },
      { id: '24_25', fromStationId: 24, toStationId: 25, timeMinutes: 6 },
      { id: '25_31', fromStationId: 25, toStationId: 31, timeMinutes: 4 },
      { id: '31_32', fromStationId: 31, toStationId: 32, timeMinutes: 4 },
      { id: '32_33', fromStationId: 32, toStationId: 33, timeMinutes: 4 },
      { id: '33_34', fromStationId: 33, toStationId: 34, timeMinutes: 4 },
      { id: '34_35', fromStationId: 34, toStationId: 35, timeMinutes: 4 },
      { id: '35_36', fromStationId: 35, toStationId: 36, timeMinutes: 4 },
    ],
    isCircular: false,
    renderStyle: 'circular',
    locking: true,
    curvatureLines: 23,
  },
  // {
  //   id: 5,
  //   color: '#ffc400',
  //   name: 'МЦД-4',
  //   stations: [
  //     {
  //       id: 26,
  //       x: -300,
  //       y: 400,
  //       color: '#ffc400',
  //       label: 'Очаково',
  //       labelOffset: { x: 0, y: -60 },
  //     },
  //     {
  //       id: 27,
  //       x: 200,
  //       y: 450,
  //       color: '#ffc400',
  //       label: 'Аминьевская',
  //       labelOffset: { x: 0, y: -60 },
  //     },
  //     {
  //       id: 28,
  //       x: 600,
  //       y: 650,
  //       color: '#ffc400',
  //       label: 'Минская',
  //       labelOffset: { x: 0, y: -60 },
  //     },
  //     {
  //       id: 29,
  //       x: 1200,
  //       y: 600,
  //       color: '#ffc400',
  //       label: 'Матвеевская',
  //       labelOffset: { x: 0, y: -60 },
  //     },
  //     {
  //       id: 30,
  //       x: 1500,
  //       y: 600,
  //       color: '#ffc400',
  //       label: 'Поклонная',
  //       labelOffset: { x: 0, y: -60 },
  //     },
  //   ],
  //   segments: [
  //     { id: '26_27', fromStationId: 26, toStationId: 27, timeMinutes: 13 },
  //     { id: '27_28', fromStationId: 27, toStationId: 28, timeMinutes: 8 },
  //     { id: '28_29', fromStationId: 28, toStationId: 29, timeMinutes: 14 },
  //     { id: '29_30', fromStationId: 29, toStationId: 30, timeMinutes: 7 }
  //   ],
  //   isCircular: false,
  //   renderStyle: 'diameter',
  //
  // },



  {
    id: 11,
    color: '#FF3333',
    name: 'Сокольническая',
    stations: [
        {
          "id": 101,
          "x": 1530,
          "y": -340,
          "color": "#FF3333",
          "label": "Бульвар Рокоссовского",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 102,
          "x": 1480.0000000000002,
          "y": -240.00000000000003,
          "color": "#FF3333",
          "label": "Черкизовская",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 103,
          "x": 1384.500000000001,
          "y": -198.2499999999999,
          "color": "#FF3333",
          "label": "Преображенская площадь",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 104,
          "x": 1277.0000000000005,
          "y": -105,
          "color": "#FF3333",
          "label": "Сокольники",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 105,
          "x": 1162,
          "y": -8,
          "color": "#FF3333",
          "label": "Красносельская",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 106,
          "x": 1088.3333333333333,
          "y": 56.66666666666657,
          "color": "#FF3333",
          "label": "Комсомольская",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 107,
          "x": 978.3333333333335,
          "y": 163.33333333333314,
          "color": "#FF3333",
          "label": "Красные ворота",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 108,
          "x": 855,
          "y": 281.66666666666663,
          "color": "#FF3333",
          "label": "Чистые пруды",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 109,
          "x": 717.6666666666661,
          "y": 418.9999999999998,
          "color": "#FF3333",
          "label": "Лубянка",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 110,
          "x": 574.7499999999998,
          "y": 577.6666666666664,
          "color": "#FF3333",
          "label": "Охотный ряд",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 111,
          "x": 475.41666666666697,
          "y": 657.0833333333331,
          "color": "#FF3333",
          "label": "Библиотека им. Ленина",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 112,
          "x": 332.08333333333326,
          "y": 726.6666666666667,
          "color": "#FF3333",
          "label": "Кропоткинская",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 113,
          "x": 246.24999999999955,
          "y": 808.7499999999997,
          "color": "#FF3333",
          "label": "Парк культуры",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 114,
          "x": 170.00000000000023,
          "y": 875.0000000000002,
          "color": "#FF3333",
          "label": "Фрунзенская",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 115,
          "x": 113.33333333333371,
          "y": 974.166666666667,
          "color": "#FF3333",
          "label": "Спортивная",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 116,
          "x": 58.50000000000023,
          "y": 1085.0000000000002,
          "color": "#FF3333",
          "label": "Воробьёвы горы",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 117,
          "x": -4.136363636363626,
          "y": 1185.136363636364,
          "color": "#FF3333",
          "label": "Университет",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 118,
          "x": -142.49999999999977,
          "y": 1315.0000000000002,
          "color": "#FF3333",
          "label": "Проспект Вернадского",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        },
        {
          "id": 119,
          "x": -189.99999999999955,
          "y": 1413.0000000000002,
          "color": "#FF3333",
          "label": "Юго-Западная",
          "labelOffset": {
            "x": 0,
            "y": -60
          }
        }
    ],
    segments: [
      { id: '101_102', fromStationId: 101, toStationId: 102, timeMinutes: 2 },
      { id: '102_103', fromStationId: 102, toStationId: 103, timeMinutes: 2 },
      { id: '103_104', fromStationId: 103, toStationId: 104, timeMinutes: 2 },
      { id: '104_105', fromStationId: 104, toStationId: 105, timeMinutes: 2 },
      { id: '105_106', fromStationId: 105, toStationId: 106, timeMinutes: 2 },
      { id: '106_107', fromStationId: 106, toStationId: 107, timeMinutes: 2 },
      { id: '107_108', fromStationId: 107, toStationId: 108, timeMinutes: 2 },
      { id: '108_109', fromStationId: 108, toStationId: 109, timeMinutes: 2 },
      { id: '109_110', fromStationId: 109, toStationId: 110, timeMinutes: 2 },
      { id: '110_111', fromStationId: 110, toStationId: 111, timeMinutes: 2 },
      { id: '111_112', fromStationId: 111, toStationId: 112, timeMinutes: 2 },
      { id: '112_113', fromStationId: 112, toStationId: 113, timeMinutes: 2 },
      { id: '113_114', fromStationId: 113, toStationId: 114, timeMinutes: 2 },
      { id: '114_115', fromStationId: 114, toStationId: 115, timeMinutes: 2 },
      { id: '115_116', fromStationId: 115, toStationId: 116, timeMinutes: 3 },
      { id: '116_117', fromStationId: 116, toStationId: 117, timeMinutes: 3 },
      { id: '117_118', fromStationId: 117, toStationId: 118, timeMinutes: 3 },
      { id: '118_119', fromStationId: 118, toStationId: 119, timeMinutes: 3 },
    ],
    isCircular: false,
    renderStyle: 'linear',
  },
  // {
  //   id: 12,
  //   color: '#008000',
  //   name: 'Замоскворецкая',
  //   stations: [
  //     { id: 201, x: 1800, y: 800, color: '#008000', label: 'Алма-Атинская', labelOffset: { x: 0, y: -60 } },
  //     { id: 202, x: 1700, y: 750, color: '#008000', label: 'Красногвардейская', labelOffset: { x: 0, y: -60 } },
  //     { id: 203, x: 1600, y: 700, color: '#008000', label: 'Домодедовская', labelOffset: { x: 0, y: -60 } },
  //     { id: 204, x: 1500, y: 650, color: '#008000', label: 'Орехово', labelOffset: { x: 0, y: -60 } },
  //     { id: 205, x: 1400, y: 600, color: '#008000', label: 'Царицыно', labelOffset: { x: 0, y: -60 } },
  //     { id: 206, x: 1300, y: 550, color: '#008000', label: 'Кантемировская', labelOffset: { x: 0, y: -60 } },
  //     { id: 207, x: 1200, y: 500, color: '#008000', label: 'Каширская', labelOffset: { x: 0, y: -60 } },
  //     { id: 208, x: 1100, y: 450, color: '#008000', label: 'Коломенская', labelOffset: { x: 0, y: -60 } },
  //     { id: 209, x: 1000, y: 400, color: '#008000', label: 'Технопарк', labelOffset: { x: 0, y: -60 } },
  //     { id: 210, x: 900, y: 350, color: '#008000', label: 'Автозаводская', labelOffset: { x: 0, y: -60 } },
  //     { id: 211, x: 800, y: 300, color: '#008000', label: 'Павелецкая', labelOffset: { x: 0, y: -60 } },
  //     { id: 212, x: 700, y: 250, color: '#008000', label: 'Новокузнецкая', labelOffset: { x: 0, y: -60 } },
  //     { id: 213, x: 600, y: 200, color: '#008000', label: 'Театральная', labelOffset: { x: 0, y: -60 } },
  //     { id: 214, x: 500, y: 150, color: '#008000', label: 'Тверская', labelOffset: { x: 0, y: -60 } },
  //     { id: 215, x: 400, y: 100, color: '#008000', label: 'Маяковская', labelOffset: { x: 0, y: -60 } },
  //     { id: 216, x: 300, y: 50, color: '#008000', label: 'Белорусская', labelOffset: { x: 0, y: -60 } },
  //     { id: 217, x: 200, y: 0, color: '#008000', label: 'Динамо', labelOffset: { x: 0, y: -60 } },
  //     { id: 218, x: 100, y: -50, color: '#008000', label: 'Аэропорт', labelOffset: { x: 0, y: -60 } },
  //     { id: 219, x: 0, y: -100, color: '#008000', label: 'Сокол', labelOffset: { x: 0, y: -60 } },
  //     { id: 220, x: -100, y: -150, color: '#008000', label: 'Войковская', labelOffset: { x: 0, y: -60 } },
  //     { id: 221, x: -200, y: -200, color: '#008000', label: 'Водный стадион', labelOffset: { x: 0, y: -60 } },
  //     { id: 222, x: -300, y: -250, color: '#008000', label: 'Речной вокзал', labelOffset: { x: 0, y: -60 } },
  //   ],
  //   segments: [
  //     { id: '201_202', fromStationId: 201, toStationId: 202, timeMinutes: 2 },
  //     { id: '202_203', fromStationId: 202, toStationId: 203, timeMinutes: 2 },
  //     { id: '203_204', fromStationId: 203, toStationId: 204, timeMinutes: 2 },
  //     { id: '204_205', fromStationId: 204, toStationId: 205, timeMinutes: 2 },
  //     { id: '205_206', fromStationId: 205, toStationId: 206, timeMinutes: 2 },
  //     { id: '206_207', fromStationId: 206, toStationId: 207, timeMinutes: 2 },
  //     { id: '207_208', fromStationId: 207, toStationId: 208, timeMinutes: 2 },
  //     { id: '208_209', fromStationId: 208, toStationId: 209, timeMinutes: 2 },
  //     { id: '209_210', fromStationId: 209, toStationId: 210, timeMinutes: 2 },
  //     { id: '210_211', fromStationId: 210, toStationId: 211, timeMinutes: 2 },
  //     { id: '211_212', fromStationId: 211, toStationId: 212, timeMinutes: 2 },
  //     { id: '212_213', fromStationId: 212, toStationId: 213, timeMinutes: 2 },
  //     { id: '213_214', fromStationId: 213, toStationId: 214, timeMinutes: 2 },
  //     { id: '214_215', fromStationId: 214, toStationId: 215, timeMinutes: 2 },
  //     { id: '215_216', fromStationId: 215, toStationId: 216, timeMinutes: 2 },
  //     { id: '216_217', fromStationId: 216, toStationId: 217, timeMinutes: 2 },
  //     { id: '217_218', fromStationId: 217, toStationId: 218, timeMinutes: 2 },
  //     { id: '218_219', fromStationId: 218, toStationId: 219, timeMinutes: 2 },
  //     { id: '219_220', fromStationId: 219, toStationId: 220, timeMinutes: 2 },
  //     { id: '220_221', fromStationId: 220, toStationId: 221, timeMinutes: 2 },
  //     { id: '221_222', fromStationId: 221, toStationId: 222, timeMinutes: 2 },
  //   ],
  //   isCircular: false,
  //   renderStyle: 'linear',
  // },
  // {
  //   id: 13,
  //   color: '#0000FF',
  //   name: 'Арбатско-Покровская',
  //   stations: [
  //     { id: 301, x: -400, y: 400, color: '#0000FF', label: 'Щёлковская', labelOffset: { x: 0, y: -60 } },
  //     { id: 302, x: -300, y: 350, color: '#0000FF', label: 'Первомайская', labelOffset: { x: 0, y: -60 } },
  //     { id: 303, x: -200, y: 300, color: '#0000FF', label: 'Измайловская', labelOffset: { x: 0, y: -60 } },
  //     { id: 304, x: -100, y: 250, color: '#0000FF', label: 'Партизанская', labelOffset: { x: 0, y: -60 } },
  //     { id: 305, x: 0, y: 200, color: '#0000FF', label: 'Семёновская', labelOffset: { x: 0, y: -60 } },
  //     { id: 306, x: 100, y: 150, color: '#0000FF', label: 'Электрозаводская', labelOffset: { x: 0, y: -60 } },
  //     { id: 307, x: 200, y: 100, color: '#0000FF', label: 'Бауманская', labelOffset: { x: 0, y: -60 } },
  //     { id: 308, x: 300, y: 50, color: '#0000FF', label: 'Курская', labelOffset: { x: 0, y: -60 } },
  //     { id: 309, x: 400, y: 0, color: '#0000FF', label: 'Площадь Революции', labelOffset: { x: 0, y: -60 } },
  //     { id: 310, x: 500, y: -50, color: '#0000FF', label: 'Арбатская', labelOffset: { x: 0, y: -60 } },
  //     { id: 311, x: 600, y: -100, color: '#0000FF', label: 'Смоленская', labelOffset: { x: 0, y: -60 } },
  //     { id: 312, x: 700, y: -150, color: '#0000FF', label: 'Киевская', labelOffset: { x: 0, y: -60 } },
  //     { id: 313, x: 800, y: -200, color: '#0000FF', label: 'Парк Победы', labelOffset: { x: 0, y: -60 } },
  //     { id: 314, x: 900, y: -250, color: '#0000FF', label: 'Славянский бульвар', labelOffset: { x: 0, y: -60 } },
  //   ],
  //   segments: [
  //     { id: '301_302', fromStationId: 301, toStationId: 302, timeMinutes: 2 },
  //     { id: '302_303', fromStationId: 302, toStationId: 303, timeMinutes: 2 },
  //     { id: '303_304', fromStationId: 303, toStationId: 304, timeMinutes: 2 },
  //     { id: '304_305', fromStationId: 304, toStationId: 305, timeMinutes: 2 },
  //     { id: '305_306', fromStationId: 305, toStationId: 306, timeMinutes: 2 },
  //     { id: '306_307', fromStationId: 306, toStationId: 307, timeMinutes: 2 },
  //     { id: '307_308', fromStationId: 307, toStationId: 308, timeMinutes: 2 },
  //     { id: '308_309', fromStationId: 308, toStationId: 309, timeMinutes: 2 },
  //     { id: '309_310', fromStationId: 309, toStationId: 310, timeMinutes: 2 },
  //     { id: '310_311', fromStationId: 310, toStationId: 311, timeMinutes: 2 },
  //     { id: '311_312', fromStationId: 311, toStationId: 312, timeMinutes: 2 },
  //     { id: '312_313', fromStationId: 312, toStationId: 313, timeMinutes: 3 },
  //     { id: '313_314', fromStationId: 313, toStationId: 314, timeMinutes: 3 },
  //   ],
  //   isCircular: false,
  //   renderStyle: 'linear',
  // },
  //

  // {
  //   id: 16,
  //   color: '#FFA500',
  //   name: 'Калужско-Рижская',
  //   stations: [
  //     { id: 601, x: 1200, y: 1000, color: '#FFA500', label: 'Медведково', labelOffset: { x: 0, y: -60 } },
  //     { id: 602, x: 1100, y: 950, color: '#FFA500', label: 'Бабушкинская', labelOffset: { x: 0, y: -60 } },
  //     { id: 603, x: 1000, y: 900, color: '#FFA500', label: 'Свиблово', labelOffset: { x: 0, y: -60 } },
  //     { id: 604, x: 900, y: 850, color: '#FFA500', label: 'Ботанический сад', labelOffset: { x: 0, y: -60 } },
  //     { id: 605, x: 800, y: 800, color: '#FFA500', label: 'ВДНХ', labelOffset: { x: 0, y: -60 } },
  //     { id: 606, x: 700, y: 750, color: '#FFA500', label: 'Алексеевская', labelOffset: { x: 0, y: -60 } },
  //     { id: 607, x: 600, y: 700, color: '#FFA500', label: 'Рижская', labelOffset: { x: 0, y: -60 } },
  //     { id: 608, x: 500, y: 650, color: '#FFA500', label: 'Проспект Мира', labelOffset: { x: 0, y: -60 } },
  //     { id: 609, x: 400, y: 600, color: '#FFA500', label: 'Сухаревская', labelOffset: { x: 0, y: -60 } },
  //     { id: 610, x: 300, y: 550, color: '#FFA500', label: 'Тургеневская', labelOffset: { x: 0, y: -60 } },
  //     { id: 611, x: 200, y: 500, color: '#FFA500', label: 'Китай-город', labelOffset: { x: 0, y: -60 } },
  //     { id: 612, x: 100, y: 450, color: '#FFA500', label: 'Третьяковская', labelOffset: { x: 0, y: -60 } },
  //     { id: 613, x: 0, y: 400, color: '#FFA500', label: 'Октябрьская', labelOffset: { x: 0, y: -60 } },
  //     { id: 614, x: -100, y: 350, color: '#FFA500', label: 'Шаболовская', labelOffset: { x: 0, y: -60 } },
  //     { id: 615, x: -200, y: 300, color: '#FFA500', label: 'Ленинский проспект', labelOffset: { x: 0, y: -60 } },
  //     { id: 616, x: -300, y: 250, color: '#FFA500', label: 'Академическая', labelOffset: { x: 0, y: -60 } },
  //     { id: 617, x: -400, y: 200, color: '#FFA500', label: 'Профсоюзная', labelOffset: { x: 0, y: -60 } },
  //     { id: 618, x: -500, y: 150, color: '#FFA500', label: 'Новые Черёмушки', labelOffset: { x: 0, y: -60 } },
  //     { id: 619, x: -600, y: 100, color: '#FFA500', label: 'Калужская', labelOffset: { x: 0, y: -60 } },
  //     { id: 620, x: -700, y: 50, color: '#FFA500', label: 'Беляево', labelOffset: { x: 0, y: -60 } },
  //     { id: 621, x: -800, y: 0, color: '#FFA500', label: 'Коньково', labelOffset: { x: 0, y: -60 } },
  //     { id: 622, x: -900, y: -50, color: '#FFA500', label: 'Тёплый Стан', labelOffset: { x: 0, y: -60 } },
  //   ],
  //   segments: [
  //     { id: '601_602', fromStationId: 601, toStationId: 602, timeMinutes: 2 },
  //     { id: '602_603', fromStationId: 602, toStationId: 603, timeMinutes: 2 },
  //     { id: '603_604', fromStationId: 603, toStationId: 604, timeMinutes: 2 },
  //     { id: '604_605', fromStationId: 604, toStationId: 605, timeMinutes: 2 },
  //     { id: '605_606', fromStationId: 605, toStationId: 606, timeMinutes: 2 },
  //     { id: '606_607', fromStationId: 606, toStationId: 607, timeMinutes: 2 },
  //     { id: '607_608', fromStationId: 607, toStationId: 608, timeMinutes: 2 },
  //     { id: '608_609', fromStationId: 608, toStationId: 609, timeMinutes: 2 },
  //     { id: '609_610', fromStationId: 609, toStationId: 610, timeMinutes: 2 },
  //     { id: '610_611', fromStationId: 610, toStationId: 611, timeMinutes: 2 },
  //     { id: '611_612', fromStationId: 611, toStationId: 612, timeMinutes: 2 },
  //     { id: '612_613', fromStationId: 612, toStationId: 613, timeMinutes: 2 },
  //     { id: '613_614', fromStationId: 613, toStationId: 614, timeMinutes: 2 },
  //     { id: '614_615', fromStationId: 614, toStationId: 615, timeMinutes: 2 },
  //     { id: '615_616', fromStationId: 615, toStationId: 616, timeMinutes: 2 },
  //     { id: '616_617', fromStationId: 616, toStationId: 617, timeMinutes: 2 },
  //     { id: '617_618', fromStationId: 617, toStationId: 618, timeMinutes: 2 },
  //     { id: '618_619', fromStationId: 618, toStationId: 619, timeMinutes: 2 },
  //     { id: '619_620', fromStationId: 619, toStationId: 620, timeMinutes: 2 },
  //     { id: '620_621', fromStationId: 620, toStationId: 621, timeMinutes: 2 },
  //     { id: '621_622', fromStationId: 621, toStationId: 622, timeMinutes: 2 },
  //   ],
  //   isCircular: false,
  //   renderStyle: 'linear',
  // },
];