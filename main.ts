function drawPlayer () {
    px = offsetX + playerX * cellSize
    py = offsetY + playerY * cellSize
    margin = Math.floor(cellSize / 4)
    screenImg.fillRect(px + margin, py + margin, cellSize - margin * 2, cellSize - margin * 2, COLOR_PLAYER)
    cx = px + Math.floor(cellSize / 2)
    cy = py + Math.floor(cellSize / 2)
    arrowLength = Math.max(1, Math.floor(cellSize / 2) - 1)
    screenImg.drawLine(cx, cy, cx + dirX * arrowLength, cy + dirY * arrowLength, COLOR_ARROW)
}
function calcLayout () {
    areaW = SCREEN_W - 4
    areaH = SCREEN_H - 4
    sizeX = Math.floor(areaW / mazeW)
    sizeY = Math.floor(areaH / mazeH)
    cellSize = Math.min(sizeX, sizeY)
    offsetX = Math.floor((SCREEN_W - mazeW * cellSize) / 2)
    offsetY = Math.floor((SCREEN_H - mazeH * cellSize) / 2)
}
function checkGoal () {
    if (playerX == goalX && playerY == goalY) {
        transitioning = true
        game.splash("GOAL!")
        currentStage += 1
        if (currentStage >= STAGE_COUNT) {
            game.over(true)
        } else {
            loadStage(currentStage)
            transitioning = false
        }
    }
}
function getIndex (x: number, y: number) {
    return y * mazeW + x
}
function discoverArea (cx2: number, cy2: number) {
    let dx: number;
diameter = DISCOVER_RADIUS * 2
    while (dy <= diameter) {
        dx = 0
        while (dx <= diameter) {
            x22 = cx2 - DISCOVER_RADIUS + dx
            y22 = cy2 - DISCOVER_RADIUS + dy
            if (x22 >= 0 && y22 >= 0 && x22 < mazeW && y22 < mazeH) {
                index2 = getIndex(x22, y22)
                discovered[index2] = 1
            }
            dx += 1
        }
        dy += 1
    }
}
function loadStage (stageIndex: number) {
    if (stageIndex == 0) {
        mazeW = 15
        mazeH = 13
        data = "###############" + "#S..#.........#" + "#.#.#.#####.#.#" + "#.#...#...#.#.#" + "#.#####.#.#.#.#" + "#.....#.#...#.#" + "#####.#.#####.#" + "#...#.#.....#.#" + "#.#.#.#####.#.#" + "#.#...#...#...#" + "#.#####.#.###.#" + "#.......#....G#" + "###############"
    } else {
        mazeW = 11
        mazeH = 9
        data = "###########" + "#S#...#...#" + "#.#.#.#.#.#" + "#...#...#.#" + "#####.###.#" + "#.....#...#" + "#.###.#.#.#" + "#...#...#G#" + "###########"
    }
    mazeMap = []
    discovered = []
    while (i <= data.length - 1) {
        c = data.charAt(i)
        x2 = i % mazeW
        y2 = Math.floor(i / mazeW)
        if (c == "#") {
            mazeMap.push(TILE_WALL)
        } else {
            mazeMap.push(TILE_PATH)
        }
        discovered.push(0)
        if (c == "S") {
            playerX = x2
            playerY = y2
        }
        if (c == "G") {
            goalX = x2
            goalY = y2
        }
        i += 1
    }
    dirX = 1
    dirY = 0
    calcLayout()
    discoverArea(playerX, playerY)
    render()
}
function drawMaze () {
    let x4: number;
while (y4 <= mazeH - 1) {
        x4 = 0
        while (x4 <= mazeW - 1) {
            index4 = getIndex(x4, y4)
            if (discovered[index4] == 1) {
                tileColor = COLOR_PATH
                if (mazeMap[index4] == TILE_WALL) {
                    tileColor = COLOR_WALL
                }
                if (x4 == goalX && y4 == goalY) {
                    tileColor = COLOR_GOAL
                }
                screenImg.fillRect(offsetX + x4 * cellSize, offsetY + y4 * cellSize, cellSize, cellSize, tileColor)
            }
            x4 += 1
        }
        y4 += 1
    }
}
function movePlayer (dx2: number, dy2: number) {
    if (transitioning) {
        return
    }
    dirX = dx2
    dirY = dy2
    nextX = playerX + dx2
    nextY = playerY + dy2
    if (isWall(nextX, nextY) == false) {
        playerX = nextX
        playerY = nextY
        discoverArea(playerX, playerY)
    }
    render()
    checkGoal()
}
function render () {
    screenImg.fill(COLOR_BG)
    drawMaze()
    drawPlayer()
    scene.setBackgroundImage(screenImg)
}
function isWall (x5: number, y5: number) {
    wall = false
    if (x5 < 0 || y5 < 0 || x5 >= mazeW || y5 >= mazeH) {
        wall = true
    } else {
        index = getIndex(x5, y5)
        if (mazeMap[index] == TILE_WALL) {
            wall = true
        }
    }
    return wall
}
let accelY = 0
let accelX = 0
let index = 0
let wall = false
let nextY = 0
let nextX = 0
let tileColor = 0
let index4 = 0
let y4 = 0
let y2 = 0
let x2 = 0
let c = ""
let i = 0
let mazeMap: number[] = []
let data = ""
let discovered: number[] = []
let index2 = 0
let y22 = 0
let x22 = 0
let dy = 0
let diameter = 0
let transitioning = false
let goalY = 0
let goalX = 0
let mazeH = 0
let sizeY = 0
let mazeW = 0
let sizeX = 0
let areaH = 0
let areaW = 0
let arrowLength = 0
let cy = 0
let cx = 0
let margin = 0
let offsetY = 0
let py = 0
let offsetX = 0
let px = 0
let currentStage = 0
let screenImg: Image = null
let cellSize = 0
let dirY = 0
let dirX = 0
let playerY = 0
let playerX = 0
let STAGE_COUNT = 0
let COLOR_ARROW = 0
let COLOR_PLAYER = 0
let COLOR_GOAL = 0
let COLOR_PATH = 0
let COLOR_WALL = 0
let COLOR_BG = 0
let TILE_WALL = 0
let TILE_PATH = 0
let DISCOVER_RADIUS = 0
let SCREEN_H = 0
let SCREEN_W = 0
SCREEN_W = 160
SCREEN_H = 120
DISCOVER_RADIUS = 1
TILE_PATH = 0
TILE_WALL = 1
COLOR_BG = 15
COLOR_WALL = 8
COLOR_PATH = 13
COLOR_GOAL = 7
COLOR_PLAYER = 2
COLOR_ARROW = 1
STAGE_COUNT = 2
playerX = 1
playerY = 1
dirX = 1
dirY = 0
cellSize = 8
screenImg = image.create(SCREEN_W, SCREEN_H)
scene.setBackgroundImage(screenImg)
loadStage(currentStage)
let tiltAvailable = retroTilt.initialize()
if (!(tiltAvailable)) {
    game.splash("Tilt unavailable", "Use direction buttons")
}
// 元の操作感を維持し、300 ms ごとに最大 1 マス移動する。
game.onUpdateInterval(300, function () {
    // 十字キーは傾きより優先。センサーが使えない場合もキーで遊べる。
    if (!(transitioning)) {
        if (controller.left.isPressed()) {
            movePlayer(-1, 0)
        } else if (controller.right.isPressed()) {
            movePlayer(1, 0)
        } else if (controller.up.isPressed()) {
            movePlayer(0, -1)
        } else if (controller.down.isPressed()) {
            movePlayer(0, 1)
        } else if (tiltAvailable && retroTilt.read()) {
            accelX = retroTilt.x()
            accelY = retroTilt.y()
            if (Math.abs(accelX) > Math.abs(accelY)) {
                if (accelX > 350) {
                    movePlayer(1, 0)
                } else if (accelX < -350) {
                    movePlayer(-1, 0)
                }
            }
            if (Math.abs(accelX) < Math.abs(accelY)) {
                if (accelY > 350) {
                    movePlayer(0, 1)
                } else if (accelY < -350) {
                    movePlayer(0, -1)
                }
            }
        }
    }
})
