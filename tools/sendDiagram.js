const { createCanvas, loadImage } = require('canvas');

function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
module.exports=async function sendPieChart(chatId,bot,data,labels) {
    const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');

  const total = data.reduce((sum, value) => sum + value, 0);
  let startAngle = 0;
  const colors = [];

  for (let i = 0; i < data.length; i++) {
    const angle = (Math.PI * 2 * data[i]) / total;
    const color = generateRandomColor();
    colors.push(color);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 150, startAngle, startAngle + angle);
    ctx.closePath();
    ctx.fill();
    startAngle += angle;

    // Додавання числа завдань у сектор діаграми
    const tasksCount = data[i];
    const tasksCountText = `Tasks: ${tasksCount}`;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const labelAngle = startAngle - angle / 2;
    const radius = 100;
    const x = 200 + Math.cos(labelAngle) * (radius / 2);
    const y = 200 + Math.sin(labelAngle) * (radius / 2);

    ctx.fillText(tasksCountText, x, y);
  }

  // Додавання верхніх надписів кольору та майстра
  ctx.font = '12px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    const master = labels[i];
    const label = `${master}`;

    const labelX = 300;
    const labelY = i * 20;

    ctx.fillStyle = color;
    ctx.fillRect(labelX - 30, labelY+2, 10, 10);
    ctx.fillStyle = '#000000';
    ctx.fillText(label, labelX, labelY);
  }

  const imageBuffer = canvas.toBuffer();
  await bot.sendPhoto(chatId, imageBuffer);
}