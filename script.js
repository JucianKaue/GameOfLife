window.document.addEventListener('DOMContentLoaded', setup)




/*
&#9633 -> quadrado branco
&#9632 -> quadrado preto
*/


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
                ctx.fillStyle = '#F5F000'
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

// ERRO
function click(pos, grid) {
    console.log(pos)
    let cell = convert_PosToCell(pos)
    grid[cell[1]][cell[0]] = 1
    draw(grid)
}
// ERRO
function convert_PosToCell(mouse_position) {
    let x_space = (screen[0] - ((cell_size+cell_border_size)*columns)) / 2
    let y_space = (screen[1] - ((cell_size+cell_border_size)*rows)) / 2

    let CellBorderSpace_X = ((mouse_position[0] - x_space)/(20.5))
    let CellBorderSpace_Y
    //let CellBorderSpace_X = (((mouse_position[1]-x_space)/(cell_size))*cell_border_size)
    //let CellBorderSpace_Y = (((mouse_position[0]-y_space)/(cell_size))*cell_border_size)

    let cell_X = Math.trunc((mouse_position[0] - (x_space - CellBorderSpace_X)) / cell_size)
    let cell_Y = Math.trunc((mouse_position[1] - (y_space - CellBorderSpace_Y)) / cell_size)

        
    console.log(CellBorderSpace_X, CellBorderSpace_Y)
    return [cell_X, cell_Y]

    /*
    let x_space = (screen[0] - ((cell_size+cell_border_size)*columns)) / 2
    let y_space = (screen[1] - ((cell_size+cell_border_size)*rows)) / 2

    let newMousePosX =  mouse_position[0] + (cell_border_size*columns) - x_space

    let cel_x = parseInt((newMousePosX) / (cell_size))
    let cel_y = parseInt((mouse_position[1] - y_space) / (cell_size))

    let cell_x = cel_x 
    let cell_y = cel_y


    let y = screen[0]/cell_size - (Math.round((screen[0]/cell_size*cell_border_size)/cell_size))
    let x = screen[1]/cell_size - (Math.round((screen[1]/cell_size*cell_border_size)/cell_size))

    return [cell_x, cell_y]
    */
}
// FUNÇÃO TESTE, EXCLUIR DPS
function change_grid(grid) {
    grid[6][4] = 1
    grid[6][5] = 1
    grid[7][6] = 1
    grid[8][5] = 1
    grid[8][4] = 1
    grid[7][3] = 1
    grid[7][2] = 1
    return grid
}


// DEFINE AS CONFIGURAÇÕES DA TELA
let screen = [1200, 500]

// DEFINE AS CONFIGURAÇÕES DAS CASAS
let cell_size = 20
let cell_border_size = 0.5

// Define a quantidade de linha e coluna -> tamanho do tabuleiro/tamanho da casa - soma de todas as bordas arredodada para cima.
let columns = screen[0]/cell_size - (Math.round((screen[0]/cell_size*cell_border_size)/cell_size))
let rows = screen[1]/cell_size - (Math.round((screen[1]/cell_size*cell_border_size)/cell_size))

canvas.addEventListener('click', click([canvas.offsetWidth, canvas.offsetHeight]))

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
    
    grid = change_grid(grid)
    draw(grid)
    
    // loop
    let frame = 200
    let game_run
    let game = function() {
        grid = actualize_grid(grid)
        draw(grid)
        if (game_run) {
           setTimeout(game, frame) 
        }
        
    }
    // BOTÕES
    // Botão "start" para iniciar o jogo
    window.document.querySelector('button#start').addEventListener('click', () => {
        game_run = true
        setTimeout(game, frame)
    })
    // Botão "pause" para pausar o jogo
    window.document.querySelector('button#pause').addEventListener('click', () => {
        game_run = false
    })

}