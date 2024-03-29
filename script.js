/**
 * @type {HTMLInputElement}
*/
const input = document.getElementById('url-input');
/**
 * @type {NodeListOf<HTMLImageElement>} Nodelist of images
 */
const images = document.querySelectorAll('.thumbnail');
/**
 * @type {HTMLButtonElement} button
*/
const button = document.getElementById('input-btn');
/**
 * @type {HTMLLinkElement} favicon
 */
const link = document.querySelector("link[rel~='icon']");

/**
 * @type {HTMLElement}
 */
const header = document.querySelector("header");
let prevScrollPos = window.scrollY;

input.addEventListener('focus', () => { input.select() });
input.addEventListener('input', processThumbnail);
button.addEventListener('click', processThumbnail);
window.addEventListener('scroll', handleScroll);
images.forEach(image => image.addEventListener('load', e => {
    /**
     * @type {HTMLImageElement}
     */
    let thumb = e.target;
    if (thumb.naturalWidth == 120 && thumb.naturalHeight == 90) {
        thumb.parentElement.classList.add('hidden');
    } else {
        thumb.parentElement.classList.remove('hidden');
    }
}));



let id = document.URL.split('#')[1];
if (id?.length == 11) {
    input.value = `https://www.youtube.com/watch?v=${id}`;
}

processThumbnail();
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
}

if (matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) {
    link.href = "./favicon-dark.png";
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
        link.href = "./favicon-dark.png";
    } else {
        link.href = "./favicon-light.png";
    }
});

function processThumbnail() {
    let url = input.value.trim();
    let id = parseID(url);
    if (id === undefined) return;
    let thumbURLS = [
        `https://i.ytimg.com/vi_webp/${id}/maxresdefault.webp`,
        `https://i.ytimg.com/vi_webp/${id}/sddefault.webp`,
        `https://i.ytimg.com/vi_webp/${id}/hqdefault.webp`,
        `https://i.ytimg.com/vi_webp/${id}/mqdefault.webp`,
    ];
    for (let i = 0; i < images.length; i++) {
        images[i].src = thumbURLS[i];
    }
    window.location.assign(`#${id}`)
}

/**
 * Parses video ID from YouTube URL
 * @param {string} url YouTube video URL
 * @return {string | undefined} YouTube video ID
*/
function parseID(url) {
    let matches = url.match(/[/=]([0-9a-zA-Z-_]{11})[?&]?/);
    if (matches && matches.length) {
        return matches[1];
    }
    return;
}

function handleScroll() {
    const currentScrollPos = window.scrollY;
    if (currentScrollPos > prevScrollPos && currentScrollPos > header.offsetHeight) {
        // Scrolling down
        header.classList.add('retracted');
    } else {
        // Scrolling up
        header.classList.remove('retracted');
    }
    prevScrollPos = currentScrollPos;
}