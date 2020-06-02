import lang from '../locale/lang'
import Level from './Level'
import LocalLevel from './LocalLevel'

import levelTest from './level000/level000'

import level001 from './level001/level001'
import level002 from './level002/level002'
import level003 from './level003/level003'
import level004 from './level004/level004'
import level005 from './level005/level005'
import level006 from './level006/level006'
import level007 from './level007/level007'
import level008 from './level008/level008'
import level009 from './level009/level009'
import level010 from './level010/level010'
import level011 from './level011/level011'
import level012 from './level012/level012'
import level013 from './level013/level013'
import level014 from './level014/level014'

import level101 from './level101/level101'
import level102 from './level102/level102'
import level103 from './level103/level103'
import level104 from './level104/level104'
import level105 from './level105/level105'
import level106 from './level106/level106'
import level107 from './level107/level107'
import level108 from './level108/level108'
import level109 from './level109/level109'
import level110 from './level110/level110'
import level111 from './level111/level111'
import level112 from './level112/level112'
import level113 from './level113/level113'
import level114 from './level114/level114'
import level115 from './level115/level115'

import level201 from './level201/level201'
import level202 from './level202/level202'
import level203 from './level203/level203'
import level204 from './level204/level204'
import level205 from './level205/level205'
import level206 from './level206/level206'
import level207 from './level207/level207'
import level208 from './level208/level208'
import level209 from './level209/level209'
import level210 from './level210/level210'
import level211 from './level211/level211'
import level212 from './level212/level212'
import level213 from './level213/level213'
import level214 from './level214/level214'

import level301 from './level301/level301'
import level302 from './level302/level302'
import level303 from './level303/level303'
import level304 from './level304/level304'
import level305 from './level305/level305'
import level306 from './level306/level306'
import level307 from './level307/level307'
import level308 from './level308/level308'
import level309 from './level309/level309'
import level310 from './level310/level310'
import level311 from './level311/level311'

import level401 from './level401/level401'
import level402 from './level402/level402'
import level403 from './level403/level403'
import level404 from './level404/level404'
import level405 from './level405/level405'
import level406 from './level406/level406'
import level407 from './level407/level407'
import level408 from './level408/level408'
import level409 from './level409/level409'

const levels = [
  new Level(1, level001),
  new Level(2, level002),
  new Level(3, level003),
  new Level(4, level004),
  new Level(5, level005),
  new Level(6, level006),
  new Level(7, level007),
  new Level(8, level008),
  new Level(9, level009),
  new Level(10, level010),
  new Level(11, level011),
  new Level(12, level012),
  new Level(13, level013),
  new Level(14, level014),

  new Level(101, level101),
  new Level(102, level102),
  new Level(103, level103),
  new Level(104, level104),
  new Level(105, level105),
  new Level(106, level106),
  new Level(107, level107),
  new Level(108, level108),
  new Level(109, level109),
  new Level(110, level110),
  new Level(111, level111),
  new Level(112, level112),
  new Level(113, level113),
  new Level(114, level114),
  new Level(115, level115),

  new Level(201, level201),
  new Level(202, level202),
  new Level(203, level203),
  new Level(204, level204),
  new Level(205, level205),
  new Level(206, level206),
  new Level(207, level207),
  new Level(208, level208),
  new Level(209, level209),
  new Level(210, level210),
  new Level(211, level211),
  new Level(212, level212),
  new Level(213, level213),
  new Level(214, level214),

  new Level(301, level301),
  new Level(302, level302),
  new Level(303, level303),
  new Level(304, level304),
  new Level(305, level305),
  new Level(306, level306),
  new Level(307, level307),
  new Level(308, level308),
  new Level(309, level309),
  new Level(310, level310),
  new Level(311, level311),

  new Level(401, level401),
  new Level(402, level402),
  new Level(403, level403),
  new Level(404, level404),
  new Level(405, level405),
  new Level(406, level406),
  new Level(407, level407),
  new Level(408, level408),
  new Level(409, level409),
]

const categories = [{
    name: 'tutorial',
    color: 'blue',
    unlock: [],
    levels: [{
      id: 1,
      unlock: [],
    }, {
      id: 2,
      unlock: [1],
    }, {
      id: 3,
      unlock: [2],
    }, {
      id: 4,
      unlock: [3],
    }, {
      id: 5,
      unlock: [4],
    }, {
      id: 6,
      unlock: [5],
    }, {
      id: 7,
      unlock: [6],
    }, {
      id: 8,
      unlock: [7],
    }, {
      id: 9,
      unlock: [8],
    }, {
      id: 10,
      unlock: [9],
    }, {
      id: 11,
      unlock: [10],
      boss: true,
    }, {
      id: 12,
      unlock: [11],
      unlockShown: [11],
    }, {
      id: 13,
      unlock: [12],
      unlockShown: [11],
    }, {
      id: 14,
      unlock: [13],
      unlockShown: [11],
    }, ]
  },
  {
    name: 'eggs',
    color: 'green',
    unlock: [10],
    levels: [{
      id: 101,
      unlock: [10],
    }, {
      id: 102,
      unlock: [101],
    }, {
      id: 103,
      unlock: [102],
    }, {
      id: 104,
      unlock: [103],
    }, {
      id: 105,
      unlock: [104],
      bonus: true,
    }, {
      id: 106,
      unlock: [104],
    }, {
      id: 107,
      unlock: [106],
    }, {
      id: 108,
      unlock: [107],
      bonus: true,
    }, {
      id: 109,
      unlock: [107],
    }, {
      id: 110,
      unlock: [109],
    }, {
      id: 111,
      unlock: [110],
    }, {
      id: 112,
      unlock: [111],
      bonus: true,
    }, {
      id: 113,
      unlock: [111],
      boss: true,
    }, {
      id: 114,
      unlock: [113],
      unlockShown: [113],
    }, {
      id: 115,
      unlock: [114],
      bonus: true,
      unlockShown: [113],
    }, ]
  }, {
    name: 'variables',
    color: 'yellow',
    unlock: [113],
    premium: true,
    levels: [{
      id: 201,
      unlock: [113],
    }, {
      id: 202,
      unlock: [201],
    }, {
      id: 203,
      unlock: [202],
    }, {
      id: 204,
      unlock: [203],
    }, {
      id: 205,
      unlock: [204],
    }, {
      id: 206,
      unlock: [205],
    }, {
      id: 207,
      unlock: [206],
      bonus: true,
    }, {
      id: 208,
      unlock: [207],
      bonus: true,
    }, {
      id: 209,
      unlock: [206],
    }, {
      id: 210,
      unlock: [209],
      bonus: true,
    }, {
      id: 211,
      unlock: [209],
      boss: true,
    }, {
      id: 212,
      unlock: [211],
      unlockShown: [211],
    }, {
      id: 213,
      unlock: [212],
      unlockShown: [211],
    }, {
      id: 214,
      unlock: [213],
      unlockShown: [211],
    }, ]
  }, {
    name: 'speach',
    color: 'red',
    premium: true,
    unlock: [113],
    levels: [{
      id: 301,
      unlock: [113],
    }, {
      id: 302,
      unlock: [301],
    }, {
      id: 303,
      unlock: [302],
      bonus: true,
    }, {
      id: 304,
      unlock: [302],
    }, {
      id: 305,
      unlock: [304],
    }, {
      id: 306,
      unlock: [305],
    }, {
      id: 307,
      unlock: [306],
    }, {
      id: 308,
      unlock: [307],
      bonus: true,
    }, {
      id: 309,
      unlock: [307],
      boss: true,
    }, {
      id: 310,
      unlock: [309],
      unlockShown: [309],
    }, {
      id: 311,
      unlock: [310],
      unlockShown: [309],
    }, ],
  }, {
    name: 'clone',
    color: 'purple',
    premium: true,
    unlock: [113],
    levels: [{
      id: 401,
      unlock: [113],
    }, {
      id: 402,
      unlock: [401],
    }, {
      id: 403,
      unlock: [402],
    }, {
      id: 404,
      unlock: [403],
    }, {
      id: 405,
      unlock: [404],
      bonus: true,
    }, {
      id: 406,
      unlock: [404],
    }, {
      id: 407,
      unlock: [406],
    }, {
      id: 408,
      unlock: [407],
      boss: true,
    }, {
      id: 409,
      unlock: [408],
      unlockShown: [408],
    }, ],
  },
]

if (LEVEL_DEV) {
  levels.push(new Level(0, levelTest))

  categories.push({
    name: 'other',
    color: 'gray',
    unlock: [],
    levels: [{
      id: 0,
      unlock: [],
    }, ]
  })
}


class LevelManager {
  constructor(levels, categories) {
    this.levels = levels
    this.categories = categories

    this.installMessages()

    this.localLevel = null
  }

  installMessages() {
    for (let level of levels) {
      level.installMessages(lang)
    }
  }

  getList(levels) {
    return this.levels
  }

  getCareerList(career, premium) {
    let winList = []
    for (let i = 0; i < this.levels.length; i++) {
      let solutions = career.getLevel(this.levels[i].id)
      winList.push({
        id: this.levels[i].id,
        won: !!(solutions && solutions.hasWon())
      })
    }

    let careerList = []
    for (let categoryConf of this.categories) {
      if (categoryConf.premium && !premium) {
        continue
      }

      let category = {
        name: categoryConf.name,
        color: categoryConf.color,
        unlocked: this.isCategoryUnlocked(categoryConf, winList),
        levels: [],
      }

      for (let levelConf of categoryConf.levels) {
        let level = this.getLevelByID(levelConf.id)
        let score = null
        let levelSolutions = career.getLevel(levelConf.id)
        let unlocked = this.isLevelUnlocked(levelConf, winList)
        let unlockShown = this.isLevelShownUnlocked(levelConf, winList)

        if (!(levelConf.bonus && !unlocked) && unlockShown)
          category.levels.push({
            id: levelConf.id,
            level: level,
            bonus: !!levelConf.bonus,
            boss: !!levelConf.boss,
            bossName: level.bossName,
            solutions: levelSolutions,
            unlocked: unlocked,
          })
      }
      careerList.push(category)
    }

    return careerList
  }

  isCategoryUnlocked(category, winList) {
    return this.isUnlocked(category.unlock, winList)
  }

  isLevelShownUnlocked(levelConf, winList) {
    let unlockTree = levelConf.unlockShown ? levelConf.unlockShown : []
    return this.isUnlocked(unlockTree, winList)
  }

  isLevelUnlocked(levelConf, winList) {
    let unlockTree = levelConf.unlock ? levelConf.unlock : []
    return this.isUnlocked(unlockTree, winList)
  }

  isUnlocked(unlockTree, winList) {
    let condition = unlockTree.slice(0)
    if (condition.length === 0) {
      return true
    }
    for (let i = 0; i < condition.length; i++) {
      if (typeof condition[i] === 'number') {
        condition[i] = winList.find(item => item.id === condition[i]).won
      }
    }

    for (let i = 0; i < condition.length; i++) {
      if (condition[i] === 'and') {
        condition.splice(i - 1, 3, condition[i - 1] && condition[i + 1])
      }
    }

    for (let i = 0; condition.length > 1; i++) {
      if (condition[i] === 'or') {
        condition.splice(i - 1, 3, condition[i - 1] || condition[i + 1])
      }
    }

    return condition[0]
  }

  getLevelByID(id) {
    return this.levels.find(level => level.id === id)
  }

  installLocalLevel(levelConfig) {
    this.localLevel = new LocalLevel(levelConfig)
    this.localLevel.level.installMessages(lang)
  }
}

const manager = new LevelManager(levels, categories)
export default manager