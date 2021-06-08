window.document.addEventListener('DOMContentLoaded', setup)

// DEFINE AS CONFIGURAÇÕES DA TELA
let screen = [1200, 500]

// DEFINE AS CONFIGURAÇÕES DAS CASAS
let cell_size = 20
let cell_border_size = 0.5

// Define a quantidade de linha e coluna -> tamanho do tabuleiro/tamanho da casa - soma de todas as bordas arredodada para cima.
let columns = screen[0]/cell_size - (Math.round((screen[0]/cell_size*cell_border_size)/cell_size))
let rows = screen[1]/cell_size - (Math.round((screen[1]/cell_size*cell_border_size)/cell_size))

// Função inicial do site, irá ocorrer ao carregar a
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
    
    // Adiciona um EventListener para identificar um clique do mouse dentro do tabuleiro do jogo
    canvas.addEventListener('click', (event) => {
        let x = event.offsetX // Pega a coordenada X do mouse
        let y = event.offsetY // Pega a coordenada Y do mouse

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
        // Se o botão for clicado enquanto o jogo estiver rodando, a velocidade do jogo será duplicada.
        if (game_run == true) {
            frame /= 2 
        }
        // Se o botão for clicado enquanto o jogo não estiver rodando
        else {
            initial_grid_position = grid // Salvar a posição inicial
            game_run = true // Definir a variavel de controle do jogo com verdadeira.
            frame = 200 // Definir a velocidade como padrão
            setTimeout(game, frame) // Rodar o jogo
        }
    })
    // Button "pause" -> pause the game
    window.document.querySelector('button#pause').addEventListener('click', () => {
        game_run = false // Irá pausar o jogo
    })
    // Button "reset" -> reset the 
    window.document.querySelector('button#reset').addEventListener('click', () => {
        // Se o grid atual for igual ao grid inicial
        if (grid === initial_grid_position) {
            grid = Create_2D_grid(grid.length, grid[0].length) // Será gerado um grid novo, com todas as células mortas
        }
        // Se o grid atual for diferente do inicial
        else {
            grid = initial_grid_position // O grid será resetado
        }
        
        draw(grid)
    })
}

// Creates an array of arrays to represents a 2D grid
function Create_2D_grid(x, y) {
    let array = new Array(y) // Um novo Array com y casas
    // Percorre todo o Array criado, criando um novo Array de X de comprimento dentro de cada elemento 
    for (let i = 0; i < y; i++) {
        array[i] = new Array(x)
    }
    // Define todas as casas do array como 0(celula morta)
    for (let i1 = 0; i1 < y; i1++) {
        for (let i2 = 0; i2 < x; i2++) {
            array[i1][i2] = 0
        }
    }
    return array
}

// Print the grid in the screen
function draw(grid) {
    // Define a posição da primeira célula do tabuleiro
    let initial_pos = [(screen[0] - ((cell_size+cell_border_size)*columns)) / 2,
                       (screen[1] - ((cell_size+cell_border_size)*rows)) / 2]

    ctx.fillStyle = "#A937CC" // Define a cor de fundo da tela no canvas
    ctx.fillRect(0,0,screen[0],screen[1]) // Desenha um retângulo do tamanho da tela -> cria o background

    // Desenha as casas baseando se no grid que foi recebido pela função
    let cell_position = [initial_pos[0],initial_pos[1]]
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            // Caso a célula estiver viva
            if (grid[i][j] == 1) {
                ctx.fillStyle = '#A937CC' 
            }
            // Caso a célula estiver morta
            else {
                ctx.fillStyle = '#FCFCD9'
            }
            
            ctx.fillRect(cell_position[0], cell_position[1], cell_size, cell_size) // Cria um quadrado (célula)
            cell_position[0] += cell_size+cell_border_size // Atualiza a coordenada X para a posição da próxima casa
        }
        cell_position[1] += cell_size+cell_border_size // Atualiza a coordenadas Y para a próxima linha
        cell_position[0] = initial_pos[0] // Atualiza a coordenada X para o valor inicial
    }
}

// Actualize the grid based on the rules of game of life
function actualize_grid(grid) {
    // Recebe um par de coordenadas que representa uma célula e retorna quantas células vivas existema redor dela
    function count_around(n) {
        // Salva o estado(vivo ou morto - 1 ou 0) de cada uma das casas ao redor em uma lista
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

        // Percorre pela lista gerada anteriormente e adiciona 1 ao contador(counter) toda vez que encontra uma célula viva.
        let counter = 0
        for (let i = 0; i < around.length; i++) {
            if (around[i] == 1) {
                counter += 1
            }
        }
        return counter
    }

    // Gera um novo grid 2D vazio
    let new_grid = Create_2D_grid(grid.length, grid[0].length)
    
    let around
    // Percorre todo o tabuleiro analizando cada uma das casas e atualizando-as com base nas regras do jogo.
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            around = count_around([i, j])

            if (grid[i][j] == 1) {

               if (around <= 1) {
                   new_grid[i][j] = 0
               } else if (around == 2 || around == 3) {
                   new_grid[i][j] = 1
               } else if (around >= 4) {
                   new_grid[i][j] = 0
               }
               
            } else {
                if (around == 3) {
                new_grid[i][j] = 1
               }
            }
        }
    }

    return new_grid
}

// Convert the mouse coordinates to the grid coordinates
function convert_PosToCell(x, y) {
    // Descobre o tamanho da borda do tabuleiro no eixo X e Y
    let border_sizeX = (screen[0] - ((columns*cell_size)+((columns-1)*cell_border_size))) / 2
    let border_sizeY= (screen[1] - ((rows*cell_size)+((rows-1)*cell_border_size))) / 2

    // Converte a posição recebida em pixels para posição em casas
    let cellX = Math.trunc((x - border_sizeX) / (cell_size+cell_border_size))
    let cellY = Math.trunc((y - border_sizeY) / (cell_size+cell_border_size))

    return [cellX, cellY]
}

// Change the life status of the cell
function add_cell(pos, grid) {
    // Se a célula estiver viva, atualiza ela para morta.
    if (grid[pos[1]][pos[0]] == 1) { 
        grid[pos[1]][pos[0]] = 0 
    } 
    // Se a célula estiver morta, atualiza ela para viva.
    else {
        grid[pos[1]][pos[0]] = 1
    } 
    draw(grid)
}
