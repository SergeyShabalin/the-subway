export const metroNetwork = [

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
    renderStyle: 'diameter',
  },


  {
    id: 4,
    color: '#019caa',
    name: 'БКЛ',
    stations: [
      {
        "id": 100001,
        "x": 1898.007845610496,
        "y": -351.57749061505297,
        "color": "#019caa",
        "label": "Марьина Роща",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100002,
        "x": 2197.014206791451,
        "y": -297.7405980401993,
        "color": "#019caa",
        "label": "Рижская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100003,
        "x": 2477.4566249124373,
        "y": -180.8848530070752,
        "color": "#019caa",
        "label": "Сокольники",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100004,
        "x": 2726.2219241914772,
        "y": -6.47430027759674,
        "color": "#019caa",
        "label": "Электрозаводская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100005,
        "x": 2931.678115717055,
        "y": 217.3358165460121,
        "color": "#019caa",
        "label": "Лефортово",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100006,
        "x": 3084.2182963215905,
        "y": 480.08038514815814,
        "color": "#019caa",
        "label": "Авиамоторная",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100007,
        "x": 3176.7098566962504,
        "y": 769.4737615206194,
        "color": "#019caa",
        "label": "Нижегородская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100008,
        "x": 3204.8279942749014,
        "y": 1071.9842330218555,
        "color": "#019caa",
        "label": "Текстильщики",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100009,
        "x": 3167.2579361954304,
        "y": 1373.4667462207105,
        "color": "#019caa",
        "label": "Печатники",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100010,
        "x": 3065.7564166175134,
        "y": 1659.8243138737519,
        "color": "#019caa",
        "label": "Нагатинский Затон",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100011,
        "x": 2905.069533785778,
        "y": 1917.6671743811007,
        "color": "#019caa",
        "label": "Кленовый Бульвар",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100012,
        "x": 2692.7108277507923,
        "y": 2134.938882157191,
        "color": "#019caa",
        "label": "Каширская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100013,
        "x": 2438.6099555870023,
        "y": 2301.480053626572,
        "color": "#019caa",
        "label": "Варшавская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100014,
        "x": 2154.6483916639518,
        "y": 2409.5034087085523,
        "color": "#019caa",
        "label": "Каховская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100015,
        "x": 1854.1038631100726,
        "y": 2453.957895378835,
        "color": "#019caa",
        "label": "Зюзино",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100016,
        "x": 1551.029498049291,
        "y": 2432.7648712483306,
        "color": "#019caa",
        "label": "Воронцовская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100017,
        "x": 1259.5967169488856,
        "y": 2346.9152985710275,
        "color": "#019caa",
        "label": "Новаторская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100018,
        "x": 993.43259274884,
        "y": 2200.423407950369,
        "color": "#019caa",
        "label": "Проспект Вернадского",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100019,
        "x": 764.9826640765709,
        "y": 2000.138997377735,
        "color": "#019caa",
        "label": "Мичуринский проспект",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100020,
        "x": 584.9289956929344,
        "y": 1755.427143291367,
        "color": "#019caa",
        "label": "Аминьевская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100021,
        "x": 461.69069701627063,
        "y": 1477.7303000106538,
        "color": "#019caa",
        "label": "Давыдково",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100022,
        "x": 401.03025392316795,
        "y": 1180.0332632895256,
        "color": "#019caa",
        "label": "Кунцевская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100023,
        "x": 405.7840813134201,
        "y": 876.2560156985711,
        "color": "#019caa",
        "label": "Терехово",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100024,
        "x": 475.7298955017586,
        "y": 580.6028437109824,
        "color": "#019caa",
        "label": "Мнёвники",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100025,
        "x": 607.597107955926,
        "y": 306.89816105399916,
        "color": "#019caa",
        "label": "Народное Ополчение",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100026,
        "x": 795.2197543814456,
        "y": 67.9400944877566,
        "color": "#019caa",
        "label": "Хорошёвская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100027,
        "x": 1029.8248083590538,
        "y": -125.09794237792403,
        "color": "#019caa",
        "label": "ЦСКА",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100028,
        "x": 1300.4423983095467,
        "y": -263.18970548557127,
        "color": "#019caa",
        "label": "Петровский парк",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      },
      {
        "id": 100029,
        "x": 1594.4187464966897,
        "y": -339.87817747024405,
        "color": "#019caa",
        "label": "Савёловская",
        "labelOffset": {
          "x": 20,
          "y": -20
        }
      }
    ],
    segments: [
      {
        "id": 200001,
        "fromStationId": 100001,
        "toStationId": 100002,
        "timeMinutes": 4
      },
      {
        "id": 200002,
        "fromStationId": 100002,
        "toStationId": 100003,
        "timeMinutes": 4
      },
      {
        "id": 200003,
        "fromStationId": 100003,
        "toStationId": 100004,
        "timeMinutes": 4
      },
      {
        "id": 200004,
        "fromStationId": 100004,
        "toStationId": 100005,
        "timeMinutes": 4
      },
      {
        "id": 200005,
        "fromStationId": 100005,
        "toStationId": 100006,
        "timeMinutes": 4
      },
      {
        "id": 200006,
        "fromStationId": 100006,
        "toStationId": 100007,
        "timeMinutes": 4
      },
      {
        "id": 200007,
        "fromStationId": 100007,
        "toStationId": 100008,
        "timeMinutes": 4
      },
      {
        "id": 200008,
        "fromStationId": 100008,
        "toStationId": 100009,
        "timeMinutes": 4
      },
      {
        "id": 200009,
        "fromStationId": 100009,
        "toStationId": 100010,
        "timeMinutes": 4
      },
      {
        "id": 200010,
        "fromStationId": 100010,
        "toStationId": 100011,
        "timeMinutes": 4
      },
      {
        "id": 200011,
        "fromStationId": 100011,
        "toStationId": 100012,
        "timeMinutes": 4
      },
      {
        "id": 200012,
        "fromStationId": 100012,
        "toStationId": 100013,
        "timeMinutes": 4
      },
      {
        "id": 200013,
        "fromStationId": 100013,
        "toStationId": 100014,
        "timeMinutes": 4
      },
      {
        "id": 200014,
        "fromStationId": 100014,
        "toStationId": 100015,
        "timeMinutes": 4
      },
      {
        "id": 200015,
        "fromStationId": 100015,
        "toStationId": 100016,
        "timeMinutes": 4
      },
      {
        "id": 200016,
        "fromStationId": 100016,
        "toStationId": 100017,
        "timeMinutes": 4
      },
      {
        "id": 200017,
        "fromStationId": 100017,
        "toStationId": 100018,
        "timeMinutes": 4
      },
      {
        "id": 200018,
        "fromStationId": 100018,
        "toStationId": 100019,
        "timeMinutes": 4
      },
      {
        "id": 200019,
        "fromStationId": 100019,
        "toStationId": 100020,
        "timeMinutes": 4
      },
      {
        "id": 200020,
        "fromStationId": 100020,
        "toStationId": 100021,
        "timeMinutes": 4
      },
      {
        "id": 200021,
        "fromStationId": 100021,
        "toStationId": 100022,
        "timeMinutes": 4
      },
      {
        "id": 200022,
        "fromStationId": 100022,
        "toStationId": 100023,
        "timeMinutes": 4
      },
      {
        "id": 200023,
        "fromStationId": 100023,
        "toStationId": 100024,
        "timeMinutes": 4
      },
      {
        "id": 200024,
        "fromStationId": 100024,
        "toStationId": 100025,
        "timeMinutes": 4
      },
      {
        "id": 200025,
        "fromStationId": 100025,
        "toStationId": 100026,
        "timeMinutes": 4
      },
      {
        "id": 200026,
        "fromStationId": 100026,
        "toStationId": 100027,
        "timeMinutes": 4
      },
      {
        "id": 200027,
        "fromStationId": 100027,
        "toStationId": 100028,
        "timeMinutes": 4
      },
      {
        "id": 200028,
        "fromStationId": 100028,
        "toStationId": 100029,
        "timeMinutes": 4
      },
      {
        "id": 200029,
        "fromStationId": 100029,
        "toStationId": 100001,
        "timeMinutes": 4
      }
    ],
    isCircular: false,
    renderStyle: 'circular',
    locking: true,
    curvatureLines: 23,
  },




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



];