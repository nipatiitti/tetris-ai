import React, { Component } from 'react'

import NEXT from '../../NEXT_ONES.json'

import Block from './block'

class Game extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: "",
            map: [0,0,0,0,0,0,0,0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(item => (
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(item => ({state: 0, id: ""}))
                )
            ),
            next: {
                shape: [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                name: ""
            },
            score: 0
        }

        console.log(this.state)

    }

    makeid = () => {
        let text = ""
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      
        for (let i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length))
      
        return text
    }

    keyDown = (e) => {
        switch (e.keyCode) {
            case 32:
                this.tick()
                break;

            case 87:
                this.next()
                break;

            case 37:
                this.left()
                break;

            case 39:
                this.right()
                break;

            case 81:
                this.turnLeft()
                break;

            case 69:
                this.turnRight()
                break;
        
            default:
                break;
        }

        console.log(e.keyCode)
    }

    componentDidMount() {
        // setInterval(() => this.tick(), 1000)
        document
            .addEventListener("keydown", this.keyDown, false)

        let newMap = this.state.map

        for(let i = 0; i < newMap.length; i++) {
            for (let j = 0; j < newMap[i].length; j++) {
                newMap[i][j].y = i
                newMap[i][j].x = j
            }
        }

        console.log(newMap)

        this.setState({
            next: this.next_block(),
            map: newMap
        })
    }

    componentWillUnmount(){
        document
            .removeEventListener("keydown", this.keyDown, false)
    }

    mapToArray = (map) => {
        let array = []
        map.forEach(row => {
            array.push(row.map(item => item.state))
        })

        return array
    }

    flip = (grid) => {
        let grid2 = [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ]

        for(let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                grid2[i][3-j] = grid[i][j]
            }
        }

        return grid2
    }

    next_block = () => {
        const int = Math.floor(Math.random() * Math.floor(5))
        let next = NEXT[int]
        const toFlip = Math.round(Math.random())
        if( toFlip ) {
            next.shape = this.flip(next.shape)
            next.flipped = true
        }

        return next
    }

    tick = () => {
        const {id, map} = this.state

        if (id === "") {
            let index = 0

            map.forEach(row => {
                if(row.every(item => item.state === 1)) {
                    this.removeRow(index)
                }
                index++
            })

            this.next()
        } else {
            this.down()
        }
    }

    removeRow = (index) => {
        const { map, score } = this.state
        let newMap = map
        newMap.splice(index, 1)
        let j = 0
        newMap.unshift(
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(item => ({state: 0, id: "", y:0, x:j++}))
        )

        let i = 0
        newMap.forEach(row => {
            row.forEach(item => {
                item.y = i
            })
            i++
        })

        this.setState({
            map: newMap,
            score: score+10
        })
        
    }

    getBlocks = (id, map) => {
        let tempBlocks = map.map(row => row.filter(item => item.id === id))
        let blocks = []
        tempBlocks.forEach(row => row.forEach(item => blocks.push(item)))
        blocks.reverse()

        return blocks
    }

    next = () => {
        const id = this.makeid()
        
        const { next, score } = this.state
        let map = this.state.map

        for(let i = 0; i < next.shape.length; i++) {
            for (let j = 0; j < next.shape[i].length; j++) {
                if(next.shape[i][j] === 1) {
                    map[i][j + 1] = Object.assign({}, map[i][j+1],
                        {
                            f_state: 0,
                            state: 1,
                            id,
                            name: next.name,
                            flipped: next.flipped
                        }
                    )
                }
            }
        }

        this.setState({
            next: this.next_block(),
            map,
            id,
            score: score+1
        })

    }

    t_i = () => {
        const {id, map} = this.state
        let newMap = map
        let blocks = this.getBlocks( id, map )

        if(blocks[0].f_state === 0) {
            try {
                const c_y = blocks[0].y - 2
                const c_x = blocks[0].x
                if (map[c_y][c_x-2].state === 1 || map[c_y][c_x-1].state === 1 || map[c_y][c_x+1].state === 1) {
                    return
                }
            } catch ( e ) {
                return
            }

            for (let i = 0; i < blocks.length; i++) {
                let block = blocks[i];
                const x = block.x
                const y = block.y

                if(i === 0) {
                    let oldBlock = newMap[y-2][x+1]
                    newMap[y-2][x+1] = Object.assign({}, block, {x: oldBlock.x, y: oldBlock.y, f_state: 1})
                    newMap[y][x] = Object.assign({}, block, {state: 0, id: ""})
                } else if(i === 1) {
                    let oldBlock = newMap[y-1][x-1]
                    newMap[y-1][x-1] = Object.assign({}, block, {x: oldBlock.x, y: oldBlock.y, f_state: 1})
                    newMap[y][x] = Object.assign({}, block, {state: 0, id: ""})
                } else if(i === 3) {
                    let oldBlock = newMap[y+1][x-2]
                    newMap[y+1][x-2] = Object.assign({}, block, {x: oldBlock.x, y: oldBlock.y, f_state: 1})
                    newMap[y][x] = Object.assign({}, block, {state: 0, id: ""})
                }
                
            }
        } else if(blocks[0].f_state === 1) {
            try {
                const c_y = blocks[0].y
                const c_x = blocks[0].x-1
                if (map[c_y+1][c_x].state === 1 || map[c_y+2][c_x].state === 1 || map[c_y-1][c_x].state === 1) {
                    return
                }
            } catch ( e ) {
                return
            }

            for (let i = 0; i < blocks.length; i++) {
                let block = blocks[i];
                const x = block.x
                const y = block.y

                if(i === 0) {
                    let oldBlock = newMap[y+1][x-1]
                    newMap[y+1][x-1] = Object.assign({}, block, {x: oldBlock.x, y: oldBlock.y, f_state: 0})
                    newMap[y][x] = Object.assign({}, block, {state: 0, id: ""})
                } else if(i === 1) {
                    let oldBlock = newMap[y][x]
                    newMap[y][x] = Object.assign({}, block, {x: oldBlock.x, y: oldBlock.y, f_state: 0})
                } else if(i === 2) {
                    let oldBlock = newMap[y-1][x+1]
                    newMap[y-1][x+1] = Object.assign({}, block, {x: oldBlock.x, y: oldBlock.y, f_state: 0})
                    newMap[y][x] = Object.assign({}, block, {state: 0, id: ""})
                } else if(i === 3) {
                    let oldBlock = newMap[y+2][x+2]
                    newMap[y+2][x+2] = Object.assign({}, block, {x: oldBlock.x, y: oldBlock.y, f_state: 0})
                    newMap[y][x] = Object.assign({}, block, {state: 0, id: ""})
                }
                
            } 
        }

        this.setState({
            map: newMap
        })
    }

    down = () => {
        const { id, map} = this.state
        let newMap = map
        let blocks = this.getBlocks( id, map )
        let canMove = true
        blocks.forEach(block => {
            try {
                let under = map[block.y+1][block.x]
                if(under.state === 1 && under.id !== id) {
                    canMove = false
                }
            } catch ( e ) {
                canMove = false
            }
        })

        if (canMove) {
            blocks.forEach(block => {
                newMap[block.y+1][block.x] = 
                    Object.assign({}, newMap[block.y+1][block.x], 
                        {
                            f_state: block.f_state,
                            state: 1,
                            id: block.id,
                            name: block.name,
                            flipped: block.flipped
                        }
                    )

                newMap[block.y][block.x] = Object.assign({}, block, {state: 0, id: ""})
            })

            this.setState({
                map: newMap
            })
        } else {
            blocks.forEach(block => {
                newMap[block.y][block.x] = Object.assign({}, block, {state: 1, id: ""})
            })

            this.setState({
                id: "",
                newMap
            })
        }
    }

    left = () => {
        const { id, map} = this.state
        let newMap = map

        let tempBlocks = map.map(row => row.filter(item => item.id === id))
        let blocks = []
        tempBlocks.forEach(row => row.forEach(item => blocks.push(item)))
        
        let canMove = true
        blocks.forEach(block => {
            try {
                let left = map[block.y][block.x-1]
                if(left.state === 1 && left.id !== id) {
                    canMove = false
                }
            } catch ( e ) {
                canMove = false
            }
        })

        if(canMove) {
            blocks.forEach(block => {
                newMap[block.y][block.x-1] = 
                    Object.assign({}, newMap[block.y][block.x-1], 
                        {
                            f_state: block.f_state,
                            state: 1,
                            id: block.id,
                            name: block.name,
                            flipped: block.flipped
                        }
                    )

                newMap[block.y][block.x] = Object.assign({}, block, {state: 0, id: ""})
            })

            this.setState({
                map: newMap
            })
        }
    }

    right = () => {
        const { id, map} = this.state
        let newMap = map
        
        let blocks = this.getBlocks(id, map)
        
        let canMove = true
        blocks.forEach(block => {
            try {
                let left = map[block.y][block.x+1]
                if(left.state === 1 && left.id !== id) {
                    canMove = false
                }
            } catch ( e ) {
                canMove = false
            }
        })

        if(canMove) {
            blocks.forEach(block => {
                newMap[block.y][block.x+1] = 
                    Object.assign({}, newMap[block.y][block.x+1],
                        {
                            f_state: block.f_state,
                            state: 1,
                            id: block.id,
                            name: block.name,
                            flipped: block.flipped
                        }
                    )

                newMap[block.y][block.x] = Object.assign({}, block, {state: 0, id: ""})
            })

            this.setState({
                map: newMap
            })
        }
    }

    turnLeft = () => {
        const { id, map } = this.state
        const blocks = this.getBlocks( id, map )
        switch (blocks[0].name) {
            case "if":
            case "i":
                this.t_i()
                break;
        
            default:
                break;
        }
    }

    turnRight = () => {
        const { id, map } = this.state
        const blocks = this.getBlocks( id, map )
        switch (blocks[0].name) {
            case "if":
            case "i":
                this.t_i()
                break;
        
            default:
                break;
        }
    }

    render() {
        const grid = this.mapToArray(this.state.map)
        const next = this.state.next.shape
        let gridItems = []
        let nextItems = []
        let index = 0

        for(let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                gridItems.push(
                    <Block key={index} state={grid[i][j]} />
                )
                index++
            }
        }


        for(let i = 0; i < next.length; i++) {
            for (let j = 0; j < next[i].length; j++) {
                nextItems.push(
                    <Block key={index} state={next[i][j]} />
                )
                index++
            }
        }

        return (
            <div className='game'>
                <div className="next">
                    {nextItems}
                </div>
                <p className="text">{this.state.score}</p>
                <div className="grid">
                    {gridItems}
                </div>
            </div>
        )
    }
}

export default Game