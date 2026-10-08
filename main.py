def drawPlayer():
    global px, py, margin, cx, cy, arrowLength
    px = offsetX + playerX * cellSize
    py = offsetY + playerY * cellSize
    margin = Math.floor(cellSize / 4)
    screenImg.fill_rect(px + margin,
        py + margin,
        cellSize - margin * 2,
        cellSize - margin * 2,
        COLOR_PLAYER)
    cx = px + Math.floor(cellSize / 2)
    cy = py + Math.floor(cellSize / 2)
    arrowLength = max(1, Math.floor(cellSize / 2) - 1)
    screenImg.draw_line(cx,
        cy,
        cx + dirX * arrowLength,
        cy + dirY * arrowLength,
        COLOR_ARROW)
def calcLayout():
    global areaW, areaH, sizeX, sizeY, cellSize, offsetX, offsetY
    areaW = SCREEN_W - 4
    areaH = SCREEN_H - 4
    sizeX = Math.floor(areaW / mazeW)
    sizeY = Math.floor(areaH / mazeH)
    cellSize = min(sizeX, sizeY)
    offsetX = Math.floor((SCREEN_W - mazeW * cellSize) / 2)
    offsetY = Math.floor((SCREEN_H - mazeH * cellSize) / 2)
def checkGoal():
    global transitioning, currentStage
    if playerX == goalX and playerY == goalY:
        transitioning = True
        game.splash("GOAL!")
        currentStage += 1
        if currentStage >= STAGE_COUNT:
            game.over(True)
        else:
            loadStage(currentStage)
            transitioning = False
def getIndex(x: number, y: number):
    return y * mazeW + x
def discoverArea(cx2: number, cy2: number):
    global diameter, x22, y22, index2, dy
    diameter = DISCOVER_RADIUS * 2
    while dy <= diameter:
        dx = 0
        while dx <= diameter:
            x22 = cx2 - DISCOVER_RADIUS + dx
            y22 = cy2 - DISCOVER_RADIUS + dy
            if x22 >= 0 and y22 >= 0 and x22 < mazeW and y22 < mazeH:
                index2 = getIndex(x22, y22)
                discovered[index2] = 1
            dx += 1
        dy += 1
def loadStage(stageIndex: number):
    global mazeW, mazeH, data, mazeMap, discovered, c, x2, y2, playerX, playerY, goalX, goalY, i, dirX, dirY
    if stageIndex == 0:
        mazeW = 15
        mazeH = 13
        data = "###############" + "#S..#.........#" + "#.#.#.#####.#.#" + "#.#...#...#.#.#" + "#.#####.#.#.#.#" + "#.....#.#...#.#" + "#####.#.#####.#" + "#...#.#.....#.#" + "#.#.#.#####.#.#" + "#.#...#...#...#" + "#.#####.#.###.#" + "#.......#....G#" + "###############"
    else:
        mazeW = 11
        mazeH = 9
        data = "###########" + "#S#...#...#" + "#.#.#.#.#.#" + "#...#...#.#" + "#####.###.#" + "#.....#...#" + "#.###.#.#.#" + "#...#...#G#" + "###########"
    mazeMap = []
    discovered = []
    while i <= len(data) - 1:
        c = data.char_at(i)
        x2 = i % mazeW
        y2 = Math.floor(i / mazeW)
        if c == "#":
            mazeMap.append(TILE_WALL)
        else:
            mazeMap.append(TILE_PATH)
        discovered.append(0)
        if c == "S":
            playerX = x2
            playerY = y2
        if c == "G":
            goalX = x2
            goalY = y2
        i += 1
    dirX = 1
    dirY = 0
    calcLayout()
    discoverArea(playerX, playerY)
    render()
def drawMaze():
    global index4, tileColor, y4
    while y4 <= mazeH - 1:
        x4 = 0
        while x4 <= mazeW - 1:
            index4 = getIndex(x4, y4)
            if discovered[index4] == 1:
                tileColor = COLOR_PATH
                if mazeMap[index4] == TILE_WALL:
                    tileColor = COLOR_WALL
                if x4 == goalX and y4 == goalY:
                    tileColor = COLOR_GOAL
                screenImg.fill_rect(offsetX + x4 * cellSize,
                    offsetY + y4 * cellSize,
                    cellSize,
                    cellSize,
                    tileColor)
            x4 += 1
        y4 += 1
def movePlayer(dx2: number, dy2: number):
    global dirX, dirY, nextX, nextY, playerX, playerY
    if transitioning:
        return
    dirX = dx2
    dirY = dy2
    nextX = playerX + dx2
    nextY = playerY + dy2
    if isWall(nextX, nextY) == False:
        playerX = nextX
        playerY = nextY
        discoverArea(playerX, playerY)
    render()
    checkGoal()
def render():
    screenImg.fill(COLOR_BG)
    drawMaze()
    drawPlayer()
    scene.set_background_image(screenImg)
def isWall(x5: number, y5: number):
    global wall, index
    wall = False
    if x5 < 0 or y5 < 0 or x5 >= mazeW or y5 >= mazeH:
        wall = True
    else:
        index = getIndex(x5, y5)
        if mazeMap[index] == TILE_WALL:
            wall = True
    return wall
accelY = 0
accelX = 0
index = 0
wall = False
nextY = 0
nextX = 0
tileColor = 0
index4 = 0
y4 = 0
y2 = 0
x2 = 0
c = ""
i = 0
mazeMap: List[number] = []
data = ""
discovered: List[number] = []
index2 = 0
y22 = 0
x22 = 0
dy = 0
diameter = 0
transitioning = False
goalY = 0
goalX = 0
mazeH = 0
sizeY = 0
mazeW = 0
sizeX = 0
areaH = 0
areaW = 0
arrowLength = 0
cy = 0
cx = 0
margin = 0
offsetY = 0
py = 0
offsetX = 0
px = 0
currentStage = 0
screenImg: Image = None
cellSize = 0
dirY = 0
dirX = 0
playerY = 0
playerX = 0
STAGE_COUNT = 0
COLOR_ARROW = 0
COLOR_PLAYER = 0
COLOR_GOAL = 0
COLOR_PATH = 0
COLOR_WALL = 0
COLOR_BG = 0
TILE_WALL = 0
TILE_PATH = 0
DISCOVER_RADIUS = 0
SCREEN_H = 0
SCREEN_W = 0
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
scene.set_background_image(screenImg)
loadStage(currentStage)
tiltAvailable = retroTilt.initialize()
if not (tiltAvailable):
    game.splash("Tilt unavailable", "Use direction buttons")
# 元の操作感を維持し、300 ms ごとに最大 1 マス移動する。

def on_update_interval():
    global accelX, accelY
    # 十字キーは傾きより優先。センサーが使えない場合もキーで遊べる。
    if not (transitioning):
        if controller.left.is_pressed():
            movePlayer(-1, 0)
        elif controller.right.is_pressed():
            movePlayer(1, 0)
        elif controller.up.is_pressed():
            movePlayer(0, -1)
        elif controller.down.is_pressed():
            movePlayer(0, 1)
        elif tiltAvailable and retroTilt.read():
            accelX = retroTilt.x()
            accelY = retroTilt.y()
            if abs(accelX) > abs(accelY):
                if accelX > 350:
                    movePlayer(1, 0)
                elif accelX < -350:
                    movePlayer(-1, 0)
            if abs(accelX) < abs(accelY):
                if accelY > 350:
                    movePlayer(0, 1)
                elif accelY < -350:
                    movePlayer(0, -1)
game.on_update_interval(300, on_update_interval)
