window.document.addEventListener('DOMContentLoaded', setup)

// DEFINE AS CONFIGURAÇÕES DA TELA
let screen = [1200, 500]

// DEFINE AS CONFIGURAÇÕES DAS CASAS
let cell_size = 20
let cell_border_size = 0.5

// Define a quantidade de linha e coluna -> tamanho do tabuleiro/tamanho da casa - soma de todas as bordas arredodada para cima.
let columns = screen[0]/cell_size - (Math.round((screen[0]/cell_size*cell_border_size)/cell_size))
let rows = screen[1]/cell_size - (Math.round((screen[1]/cell_size*cell_border_size)/cell_size))

function setup() {
    // Verificar se o HTMl canvas está funcionando corretamente e inicializa-lo
    let canvas = window.document.querySelector("canvas")
    if (! canvas.getContext) {
        window.alert("CANVAS NÃO INICIADO CORRETAMENTR")
    } else {
        ctx = canvas.getContext('2d')
    }
    
    let grid = Create_2D_grid(columns, rows)    // Cria o grid
    draw(grid) // Desenha o tabuleiro
    
    canvas.addEventListener('click', (event) => {
        let x = event.offsetX
        let y = event.offsetY

        let cell = convert_PosToCell(x, y)

        add_cell(cell, grid)
    })

    // LOOP DO JOGO
    let initial_grid_position
    let initial_frame = 200
    let frame = initial_frame
    let game_run = false
    let game = function() {
        grid = actualize_grid(grid)
        draw(grid)
        if (game_run) {
           setTimeout(game, frame) 
        }
        
    }

    // BUTTONS
    // Button "start" -> starts the game
    window.document.querySelector('button#start').addEventListener('click', () => {
        if (game_run == true) {
            frame /= 2
        } else {
            initial_grid_position = grid
            game_run = true
            frame = 200
            setTimeout(game, frame)
        }
    })
    // Button "pause" -> pause the game
    window.document.querySelector('button#pause').addEventListener('click', () => {
        game_run = false
    })
    // Button "reset" -> reset the 
    window.document.querySelector('button#reset').addEventListener('click', () => {
        if (grid === initial_grid_position) {
            grid = Create_2D_grid(grid.length, grid[0].length)
        } else {
            grid = initial_grid_position
        }
        
        draw(grid)
    })
}

// Creates an array of arrays to represents a 2D grid
function Create_2D_grid(x, y) {
    let array = new Array(y);
    for (let i = 0; i < y; i++) {
        array[i] = new Array(x);
    }
    for (let i1 = 0; i1 < y; i1++) {
        for (let i2 = 0; i2 < x; i2++) {
            array[i1][i2] = 0
        }
    }
    return array
}

// Print the grid in the screen
function draw(grid) {
    let initial_pos = [(screen[0] - ((cell_size+cell_border_size)*columns)) / 2,
                       (screen[1] - ((cell_size+cell_border_size)*rows)) / 2]

    ctx.fillStyle = "#0869A3"
    ctx.fillRect(0,0,screen[0],screen[1])

    let cell_position = [initial_pos[0],initial_pos[1]]
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (grid[i][j] == 1) {
                ctx.fillStyle = '#8FFF28'
            } else {
                ctx.fillStyle = 'gray'
            }
            
            ctx.fillRect(cell_position[0], cell_position[1], cell_size, cell_size)
            cell_position[0] += cell_size+cell_border_size
        }
        cell_position[1] += cell_size+cell_border_size
        cell_position[0] = initial_pos[0]
    }
}

// Actualize the grid based on the rules of game of life
function actualize_grid(grid) {
    function count_around(n) {
        let around
        if (n[0] == 0 & n[1] == 0) { // Canto superior esquerdo
            around = [
                grid[n[0]][n[1]+1],
                grid[n[0]+1][n[1]],
                grid[n[0]+1][n[1]+1]
            ]
        } else if (n[0] == 0 & n[1] == grid[1].length-1) { // Canto superior direito
            around = [
                grid[n[0]][n[1]-1],
                grid[n[0]+1][n[1]-1],
                grid[n[0]+1][n[1]],
            ]
        } else if (n[0] == grid.length-1 & n[1] == grid[1].length-1) { // Canto inferior direito
            around = [
                grid[n[0]-1][n[1]-1],
                grid[n[0]-1][n[1]],
                grid[n[0]][n[1]-1],
            ]
        } else if(n[0] == grid.length-1 & n[1] == 0) { // Canto inferior esquerdo
            around = [
                grid[n[0]-1][n[1]],
                grid[n[0]-1][n[1]+1],
                grid[n[0]][n[1]+1],
            ]
        } else if (n[0] == 0) { // linha superior
            around = [
                grid[n[0]][n[1]-1],
                grid[n[0]][n[1]+1],
                grid[n[0]+1][n[1]-1],
                grid[n[0]+1][n[1]],
                grid[n[0]+1][n[1]+1]
            ]
        } else if (n[1] == 0) { // coluna esquerda
            around = [
                grid[n[0]-1][n[1]],
                grid[n[0]-1][n[1]+1],
                grid[n[0]][n[1]+1],
                grid[n[0]+1][n[1]],
                grid[n[0]+1][n[1]+1] 
            ]
        } else if (n[0] == grid.length-1) { // linha inferior
            around = [
                grid[n[0]-1][n[1]-1],
                grid[n[0]-1][n[1]],
                grid[n[0]-1][n[1]+1],
                grid[n[0]][n[1]-1],
                grid[n[0]][n[1]+1],
            ]
        } else if (n[1] == grid[1].length-1) { // coluna direita
            around = [
                grid[n[0]-1][n[1]-1],
                grid[n[0]-1][n[1]],
                grid[n[0]][n[1]-1],
                grid[n[0]+1][n[1]-1],
                grid[n[0]+1][n[1]],
            ]
        } else { // resto do tabuleiro
            around = [
                grid[n[0]-1][n[1]-1],
                grid[n[0]-1][n[1]],
                grid[n[0]-1][n[1]+1],
                grid[n[0]][n[1]-1],
                grid[n[0]][n[1]+1],
                grid[n[0]+1][n[1]-1],
                grid[n[0]+1][n[1]],
                grid[n[0]+1][n[1]+1]
            ]
        }

        let counter = 0
        for (let i = 0; i < around.length; i++) {
            if (around[i] == 1) {
                counter += 1
            }
        }
        return counter
    }

    let new_grid = Array(grid.length)
    for (let i = 0; i < grid.length; i++) {
        new_grid[i] = Array(grid[i].length) 
    }
    
    let around
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            around = count_around([i, j])

            console.log(i, j, around)
            if (grid[i][j] == 1) {

               if (around <= 1) {
                   new_grid[i][j] = 0
               } else if (around == 2 || around == 3) {
                   new_grid[i][j] = 1
               } else if (around >= 4) {
                   new_grid[i][j] = 0
               }
               
            }
               if (around == 3) {
                new_grid[i][j] = 1
               }
        }
    }

    return new_grid
}

// Convert the mouse coordinates to the grid coordinates
function convert_PosToCell(x, y) {
    let border_sizeX = (screen[0] - ((columns*cell_size)+((columns-1)*cell_border_size))) / 2
    let border_sizeY= (screen[1] - ((rows*cell_size)+((rows-1)*cell_border_size))) / 2

    let cellX = Math.trunc((x - border_sizeX) / (cell_size+cell_border_size))
    let cellY = Math.trunc((y - border_sizeY) / (cell_size+cell_border_size))

    return [cellX, cellY]
}

// Change the life status of the cell
function add_cell(pos, grid) {
    if (grid[pos[1]][pos[0]] == 1) {
        grid[pos[1]][pos[0]] = 0
    } else {
        grid[pos[1]][pos[0]] = 1
    } 
    draw(grid)
}
