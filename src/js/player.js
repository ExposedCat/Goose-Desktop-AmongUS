class Player {
    constructor() {
        this.hp = 10
        this.speed = 7

        this.position = {
            x: -100,
            y: 50
        }
        this.movement = {
            x: {
                moves: 0,
                speed: 0,
                ratio: 0
            },
            y: {
                moves: 0,
                speed: 0,
                ratio: 0
            }
        }

        this.mouse = {
            grabbing: false,
            goingFor: false
        }

        this.state = {
            action: 'staying',
            hit: false,
            moving: false,
            shown: false
        }
        this.view = {
            imageId: 1,
            object: document.querySelector('#player')
        }
    }

    show(fpms = 100) {
        let moves = 1
        const distance = 150
        const movesLimit = distance / this.speed | 0
        const interval = setInterval(() => {
            if (moves === movesLimit) {
                this.state.shown = true
                clearInterval(interval)
            } else {
                i++
                moveTo(this.position.x + this.speed, this.position.y)
            }
        }, fpms)
    }

    startGrabbingMouse(mouseGrabbingRate = 50) {
        const grabber = setInterval(() => {
            moveMouse(
                this.position.x * scaleFactor + 10 + 50 * !!(this.movement.x.moves < 0),
                this.position.y * scaleFactor + 25
            )
        }, mouseGrabbingRate)
        const closer = setInterval(() => {
            if (!this.grabbingMouse) {
                clearInterval(grabber)
                clearInterval(closer)
            }
        }, mouseGrabbingRate)
    }

    setState(state) {
        this.state = state
        switch (state) {
            case 'sitting': {
                this.state.moving = false
                break
            }
            case 'dead': {
                this.state.moving = false
                this.movement.x.moves = 0
                this.movement.y.moves = 0
                break
            }
            case 'staying': {
                if (this.movement.x.moves || this.movement.y.moves) {
                    this.state.moving = true
                }
                break
            }
        }
    }

    updateView() {
        if (this.state.moving) {
            const images = [
                `./img/player-move1.png`,
                `./img/player-staying.png`,
                `./img/player-move2.png`,
                `./img/player-staying.png`
            ]
            this.view.object.src = images[this.view.imageId]
            if (this.view.imageId === 4) {
                this.view.imageId = 0
            }
            this.view.imageId++
        } else {
            this.view.object.src = `./img/player-${this.state}.png`
        }
    }

    placeTo(x, y) {
        this.position.x = x
        this.view.object.style.left = `${x}px`
        this.position.x = y
        this.view.object.style.top = `${y}px`
    }

    move() {
        this.state.moving = true
        if (randomNumber(0, 2)) {
            this.mouse.goingFor = true
            const mousePosition = getCursorScreenPoint()
            this.speed *= 2
            this.movement.x.moves = (mousePosition.x - this.position.x) / this.speed | 0
            this.movement.y.moves = (mousePosition.y - this.position.y) / this.speed | 0
        } else {
            this.movement.x.moves = randomNumber(-maxMovesX, maxMovesX) || 1
            this.movement.y.moves = randomNumber(-maxMovesY, maxMovesY) || 1
        }
        if (Math.abs(this.movement.x.moves) > Math.abs(this.movement.y.moves)) {
            this.movement.x.ratio = 1
            this.movement.y.ratio = Math.abs(this.movement.x.moves / this.movement.y.moves) || 1
            this.movement.x.speed = this.speed
            const speed = this.movement.y.moves ? Number((this.speed / this.movement.y.ratio).toFixed(2)) : 0
            this.movement.y.speed = Math.abs(speed) || this.speed
        } else {
            this.movement.y.ratio = 1
            this.movement.x.ratio = Math.abs(this.movement.y.moves / this.movement.x.moves) || 1
            this.movement.y.speed = this.speed
            const speed = this.movement.x.moves ? Number((this.speed / this.movement.x.ratio).toFixed(2)) : 0
            this.movement.x.speed = Math.abs(speed) || this.speed
        }
    }
}

const player = new Player()