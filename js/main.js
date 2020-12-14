const {
    remote
} = require('electron')

const mainProcess = remote.require('./index.js')
const {
    app,
    width,
    height,
    moveMouse,
    scaleFactor,
    getCursorScreenPoint
} = mainProcess
const fpms = 100

window.onload = () => {
    const sabotageLine = document.querySelector('#sabotage')
    const sabotageButton = document.querySelector('#sabotage-button')
    const player = {
        x: -100,
        y: 50,
        hp: 10,
        movesX: 0,
        speedX: 0,
        ratioX: 0,
        movesY: 0,
        speedY: 0,
        ratioY: 0,
        speed: 7,
        started: false,
        hit: false,
        moving: true,
        grabbingMouse: false,
        goingForMouse: false,
        state: 'staying',
        image: 1,
        graphicalObject: document.querySelector('#player')
    }
    const maxMovesX = width / player.speed / 2 | 0
    const maxMovesY = height / player.speed / 2 | 0

    setInterval(() => {
        if (!player.started) {
            return
        }
        if (!randomNumber(0, 2) && !player.moving && !['dead', 'sitting'].includes(player.state)) {
            move()
        }
    }, 2000)

    setInterval(() => { // Life cycle
        changeImage()
        if (!player.started) {
            return
        }
        if (!player.movesX && !player.movesY) {
            player.moving = false
            player.grabbingMouse = false
        } else {
            if (player.moving) {
                if (player.goingForMouse) {
                    const mousePosition = getCursorScreenPoint()
                    player.movesX = (mousePosition.x - player.x) / player.speed | 0
                    player.movesY = (mousePosition.y - player.y) / player.speed | 0
                    console.log(player.movesX)
                    console.log(player.movesY)
                    if (Math.abs(player.movesX) <= 3 && Math.abs(player.movesY) <= 3) {
                        player.goingForMouse = false
                        player.speed /= 2
                        player.grabbingMouse = true
                        startGrabbingMouse()
                        player.movesX = 0
                        player.movesY = 0
                        move()
                        return
                    }
                }
                if (player.x <= -1 || player.x >= width) {
                    player.movesX *= -1
                }
                if (player.y <= -1 || player.y >= height) {
                    player.movesY *= -1
                }
                const directionX = (-1 * !!(player.movesX < 0)) || 1
                const directionY = (-1 * !!(player.movesY < 0)) || 1
                const x = player.movesX ? player.x + player.speedX * directionX : player.x
                const y = player.movesY ? player.y + player.speedY * directionY : player.y
                const diffMovesX = !!player.movesX * directionX / player.ratioX
                const diffMovesY = !!player.movesY * directionY / player.ratioY
                player.movesX -= Math.abs(player.movesX) < Math.abs(diffMovesX) ? player.movesX : diffMovesX
                player.movesY -= Math.abs(player.movesY) < Math.abs(diffMovesY) ? player.movesY : diffMovesY
                if (player.movesX < 0) {
                    player.graphicalObject.style.transform = 'scaleX(-1)'
                } else if (player.movesX > 0) {
                    player.graphicalObject.style.transform = 'scaleX(1)'
                }
                if (player.goingForMouse) {
                    console.log('Speed:')
                    console.log(player.speedX)
                    console.log(player.speed)
                }
                moveTo(x, y)
            }
        }
    }, fpms)



    function startGrabbingMouse() {
        const grabber = setInterval(() => {
            moveMouse(player.x * scaleFactor + 10 + 50 * !!(player.movesX < 0), player.y * scaleFactor + 25)
        }, 50)
        const closer = setInterval(() => {
            if (!player.grabbingMouse) {
                clearInterval(grabber)
                clearInterval(closer)
            }
        }, 50)
    }

    function start() {
        let i = 1
        let distance = 150
        let limit = distance / player.speed | 0
        const interval = setInterval(() => {
            if (i === limit) {
                player.started = true
                clearInterval(interval)
            } else {
                i++
                moveTo(player.x + player.speed, player.y)
            }
        }, fpms)
    }

    function setState(state) {
        player.state = state
        switch (state) {
            case 'sitting': {
                player.moving = false
                break
            }
            case 'dead': {
                player.moving = false
                player.movesX = 0
                player.movesY = 0
                break
            }
            case 'staying': {
                if (player.movesX || player.movesY) {
                    player.moving = true
                }
                break
            }
        }
    }

    function changeImage() {
        if (player.moving) {
            switch (player.image) {
                case 1: {
                    player.graphicalObject.src = `./img/player-move1.png`
                    break
                }
                case 2: {
                    player.graphicalObject.src = `./img/player-staying.png`
                    break
                }
                case 3: {
                    player.graphicalObject.src = `./img/player-move2.png`
                    break
                }
                case 4: {
                    player.image = 0
                    player.graphicalObject.src = `./img/player-staying.png`
                    break
                }
            }
            player.image++
        } else {
            player.graphicalObject.src = `./img/player-${player.state}.png`
        }
    }

    function moveTo(x, y) {
        player.x = x
        player.y = y
        player.graphicalObject.style.left = `${x}px`
        player.graphicalObject.style.top = `${y}px`
    }

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function move() {
        player.moving = true
        if (true || !randomNumber(0, 1)) {
            player.goingForMouse = true
            const mousePosition = getCursorScreenPoint()
            player.speed *= 2
            player.movesX = (mousePosition.x - player.x) / player.speed | 0
            player.movesY = (mousePosition.y - player.y) / player.speed | 0
        } else {
            player.movesX = randomNumber(-maxMovesX, maxMovesX) || 1
            player.movesY = randomNumber(-maxMovesY, maxMovesY) || 1
        }
        if (Math.abs(player.movesX) > Math.abs(player.movesY)) {
            player.ratioX = 1
            player.ratioY = Math.abs(player.movesX / player.movesY) || 1
            player.speedX = player.speed
            player.speedY = Math.abs(player.movesY ? Number((player.speed / player.ratioY).toFixed(2)) : 0) || player.speed
        } else {
            player.ratioY = 1
            player.ratioX = Math.abs(player.movesY / player.movesX) || 1
            player.speedY = player.speed
            player.speedX = Math.abs(player.movesX ? Number((player.speed / player.ratioX).toFixed(2)) : 0) || player.speed
        }
    }

    const elements = [...document.querySelector('.public').querySelectorAll('*')]
    for (const element of elements) {
        element.addEventListener('mouseenter', event => { // Hover
            console.log(event.target)
            app.setIgnoreMouseEvents(false)
        })

        element.addEventListener('mouseout', event => { // Unhover
            app.setIgnoreMouseEvents(true, {
                forward: true
            })
        })
    }

    sabotageButton.addEventListener('click', event => {
        sabotageLine.classList.add('animating')
        sabotageLine.style.left = '50%'
        setTimeout(() => {
            sabotageLine.style.left = '150%'
            setTimeout(() => {
                sabotageLine.classList.remove('animating')
                sabotageLine.style.left = '-100%'
            }, 500)
        }, 2000)
    })

    player.graphicalObject.addEventListener('click', event => { // Left mouse
        if (player.state !== 'dead') {
            const newState = player.state === 'sitting' ? 'staying' : 'sitting'
            setState(newState)
        }

    })

    player.graphicalObject.addEventListener('contextmenu', event => { // Right mouse
        if (player.hp && !player.hit) {
            player.graphicalObject.style.opacity = 0.6
            player.hit = true
            setTimeout(() => {
                player.graphicalObject.style.opacity = 1
                player.hit = false
            }, 200)
            player.hp--
            if (!player.hp) {
                setState('dead')
            }
        }
    })

    start()
}