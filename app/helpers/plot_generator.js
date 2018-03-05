const canvasModule = require('canvas')
const D3Node = require('d3-node')
const d3n = new D3Node({ canvasModule })
const d3 = d3n.d3 
const fs = require('fs')
  
module.exports = (dataset, filename, palleteNum) => {
  const palletes = [
    ['#E3B1AA', '#C3D8C1', '#89C284', '#F0B95D', '#95AB99'],
    ['#F0B5A5', '#AEA68B', '#BDCFD9', '#A2C0A0', '#EEC37F', '#40534F', ],
    ['#F3CB6F', '#F67172', '#96DACE',  '#E7C089', '#95AB99', '#999698', '#EEC2E5',]
  ]
  
  const width = 250,
    height = 250

  const canvas = d3n.createCanvas(500, 250)
  // DBE8D9 FDF7DB
  const context = canvas.getContext('2d')
  // context.fillStyle = "#DBE8D9";
  // context.fillRect(0, 0, canvas.width, canvas.height);
  const pie = d3.pie()
    .value(d => d.percent)
    .sort(null)
    .padAngle(.02);

  const outerRadius=width/2,
    innerRadius=height/2.4

  context.translate(width / 2, height / 2)

  const arc=d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius)
    .context(context)

  const arcs = pie(dataset)
  arcs.forEach((d, i) => {
    context.beginPath()
    arc(d)
    context.fillStyle = palletes[palleteNum][i]
    context.fill()
  });

  context.font = "14px Helvetica";

  context.beginPath();
  arcs.forEach(arc);
  context.strokeStyle = "#DBE8D9";

  dataset.forEach((d, i) => {
    const y = -(10 + i * 20)
    context.fillStyle = palletes[palleteNum][i]
    context.fillRect(150, y, 15, 15)
    context.fillStyle = '#000'
    context.fillText(d.description, 180, y+12)
  })
  canvas.pngStream().pipe(fs.createWriteStream(filename))
}