document.querySelector('h1').id='top';
const topLink = document.createElement('a');
topLink.href = "#top";
const topIcon = document.createElement('img');
topIcon.className = 'icon-top';
topIcon.src = "./back-to-top.png";
topIcon.alt = 'Наверх';
topLink.appendChild(topIcon);
document.body.appendChild(topLink);

const homeLink = document.createElement('a');
homeLink.href = './index.html';
const homeIcon = document.createElement('img');
homeIcon.className = "icon-home";
homeIcon.src = "./home.png";
homeIcon.alt = 'Домой';
homeLink.appendChild(homeIcon);
document.body.appendChild(homeLink);