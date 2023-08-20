function renderImageGallery (imageArray) {
    let ul = document.querySelector('.gallery');
    imageArray.forEach(element => {
        let li = document.createElement('li');
        li.innerHTML = `<h2 id=${element.filename}>${element.title}</h2>
        <figure>
        <a href = "${element.link?element.link+'" target = "_blank"':element.filename+".jpg"}">
                <img src = '${element.filename}_min.jpg'>
            </a>
            <figcaption>
                <p>${element.info?element.info:''}</p>
                <p class='additional'>${element.instruments?element.instruments:''}</p>
                <p class='additional'>${element.date?element.date:''}</p>
                <p align="right" class="share" onclick="share('${element.filename}')"><a>Скопировать ссылку</a></p>
            </figcaption>
        </figure>`;
        ul.append(li);
    });
}

function share(id){
    navigator.clipboard.writeText((window.location.href.split("#")[0])+"#"+id);
}

function renderJpgMax (image, title){
    return document.write(`
    <li>
        <figure class="movies">
            <a href = './${image}.jpg'>
            <img src='${image}_min.jpg'>
            </a>
            <figcaption>${title}</figcaption>
        </figure>
    </li>`);
}

function renderJpg (image, date, animation) {
    return document.write(`
    <li>
        <figure>
            <a href = './${image}.jpg'>
            <img src = './${image}_min.jpg'>
            </a>
            <figcaption>
            ${date?date:''}
            ${animation?('<br><a href="'+image+'.gif">Смореть анимацию</a></figcaption>'):('</figcaption>')}
        </figure>
    </li>
    `);
}

function footer() {
    return document.write(`<footer>&copy; Максим Лёвин, ${new Date().getFullYear()}</footer>`);
}