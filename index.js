const { Console } = require('console');
const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs')
const porta = 3000;

var array = JSON.parse(fs.readFileSync('./data/db.json', 'utf-8'))
var ultimo = array[array.length - 1];
var ultimoID = parseInt(ultimo.id)
//console.log(`O ultimo id do array é ${ultimoID}`)

app.use(express.json())

//função para ler os dados que será reaproveitada
const readFile = () => {
    const conteudo = fs.readFileSync('./data/db.json', 'utf-8')
    return JSON.parse(conteudo)

}

//função para gravar dados no arquivo
const writeFile = (conteudo) => {
    const conteudoConvertido = JSON.stringify(conteudo)
    fs.writeFileSync('./data/db.json', conteudoConvertido, 'utf-8')
}

//retornando todos os dados
router.get('/', (req, res) => {
    const conteudo = readFile()
    res.send(conteudo)
})

//retornando um produto especifico para visualização
router.get('/:id', (req, res) => {
    const { id } = req.params
    const conteudoAtual = readFile()
    const conteudoFiltro = conteudoAtual.findIndex((item) => parseInt(item.id) === parseInt(id))
    res.send(conteudoFiltro)

})

//post para cadastrar novos produtos //ainda sem verificação dos campos
router.post('/', (req, res) => {
    //gerando um id automaticamente aproveitando os id's já existentes
    const id = parseInt(ultimoID) + 1
    //console.log(`o próximo id é: ${id}`)
    const { nome, quantidade, valor, autor } = req.body;
    const conteudoAtual = readFile()
    conteudoAtual.push({ id, nome, quantidade, valor, autor })
    writeFile(conteudoAtual)

    res.send({ id, nome, quantidade, valor, autor })
})

router.put('/:id', (req, res) => {
    const { id } = req.params

    const { nome, quantidade, valor, autor } = req.body;
    
    const conteudoAtual = readFile()
    const conteudoFiltro = conteudoAtual.findIndex((item) => parseInt(item.id) === parseInt(id))

    const { nome: nomeAtual, quantidade: qtdAtual, valor: valorAtual, autor: autorAtual } = conteudoAtual[conteudoFiltro]

    
    const newObject = {
        nome: nome ? nome: nomeAtual,
        quantidade: quantidade ? quantidade: qtdAtual,
        valor: valor ? valor: valorAtual,
        autor: autor ? autor: autorAtual
    }

    conteudoAtual[conteudoFiltro] = newObject
    writeFile(conteudoAtual)

    res.send(newObject)

})

router.delete('/', (req, res) => {
    res.send('Bem vindo')
})

app.use(router)

app.listen(porta, () => {
    console.log(`Servidor ON em localhost:${porta}`)
})