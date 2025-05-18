const fs = require('fs')
const draw = require('../common/draw')
const {createCanvas}  = require('canvas')
const canvas = createCanvas(400,400)
const ctx = canvas.getContext('2d')

const rawDir = '../data/raw'
const datasetdir = '../data/dataset'
const filenames = fs.readdirSync(rawDir)
const samples = []
let id = 1
filenames.forEach(x => {
    content = fs.readFileSync(rawDir + '/' + x)
    const { session, student, drawings } = JSON.parse(content)
    for (label in drawings) {
        samples.push({
            id,
            label,
            student_name: student,
            student_id: session
        })
        fs.writeFileSync(datasetdir + `/json/${id}.json`, JSON.stringify(drawings[label]))

        generateImageFile(id,drawings[label])
        id++
    }

})

fs.writeFileSync(datasetdir + '/samples.json', JSON.stringify(samples))


function generateImageFile(name,paths){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    draw.paths(ctx,paths)
    const buffer = canvas.toBuffer("image/png")
    fs.writeFileSync(datasetdir+`/img/${name}.png`,buffer)
}
