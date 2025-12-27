import { openFullscreenPhoto } from './fullscreen.js';

const clearThumbnails = () => {
  const container = document.querySelector('.pictures');
  const thumbnails = container.querySelectorAll('.picture');
  thumbnails.forEach((thumbnail) => thumbnail.remove());
};

function renderThumbnails(photosArray) {
  const container = document.querySelector('.pictures');
  const template = document.querySelector('#picture');
  const fragment = document.createDocumentFragment();

  photosArray.forEach((photo) => {
    const thumbnail = template.content.querySelector('.picture').cloneNode(true);

    const img = thumbnail.querySelector('.picture__img');
    const likes = thumbnail.querySelector('.picture__likes');
    const comments = thumbnail.querySelector('.picture__comments');

    img.src = photo.url;
    img.alt = photo.description;
    likes.textContent = photo.likes;
    comments.textContent = photo.comments.length;

    // обработчик клика на миниатюру
    thumbnail.addEventListener('click', (evt) => {
      evt.preventDefault();
      openFullscreenPhoto(photo);
    });

    fragment.appendChild(thumbnail);
  });

  clearThumbnails();
  container.appendChild(fragment);
}

export { renderThumbnails };
