function share(id){
    navigator.clipboard.writeText((window.location.href.split("#")[0])+"#"+id);
}

function footer() {
    return document.write(`<footer>&copy; Максим Лёвин, ${new Date().getFullYear()}</footer>`);
}