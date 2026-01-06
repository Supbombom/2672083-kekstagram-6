const COMMENTS_PER_PORTION = 5;
const AVATAR_WIDTH = 35;
const AVATAR_HEIGHT = 35;

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatarImg = document.createElement('img');
  avatarImg.classList.add('social__picture');
  avatarImg.src = comment.avatar;
  avatarImg.alt = comment.name;
  avatarImg.width = AVATAR_WIDTH;
  avatarImg.height = AVATAR_HEIGHT;

  const commentText = document.createElement('p');
  commentText.classList.add('social__text');
  commentText.textContent = comment.message;

  commentElement.appendChild(avatarImg);
  commentElement.appendChild(commentText);
  return commentElement;
};

// Функция для отображения порции комментариев
const renderCommentsPortion = (comments, startIndex, commentsList, commentsCountElement, loaderButton) => {
  const endIndex = Math.min(startIndex + COMMENTS_PER_PORTION, comments.length);

  // Очищаем только при первой загрузке
  if (startIndex === 0) {
    commentsList.innerHTML = '';
  }

  // Показываем комментарии
  for (let i = startIndex; i < endIndex; i++) {
    const commentElement = createCommentElement(comments[i]);
    commentsList.appendChild(commentElement);
  }

  commentsCountElement.innerHTML = `${endIndex} из <span class="comments-count">${comments.length}</span> комментариев`;

  // Скрываем кнопку, если показали все комментарии
  if (endIndex >= comments.length) {
    loaderButton.classList.add('hidden');
  }

  return endIndex;
};

// Функция для настройки обработчиков закрытия
const setupCloseHandlers = (bigPicture) => {
  const closeButton = bigPicture.querySelector('#picture-cancel');

  const closeFullscreenPhoto = () => {
    bigPicture.classList.add('hidden');
    document.body.classList.remove('modal-open');

    // Удаляем обработчики
    closeButton.removeEventListener('click', closeFullscreenPhoto);
    document.removeEventListener('keydown', onEscKeyDown);

    // Удаляем обработчик кнопки "Загрузить ещё"
    const commentsLoader = bigPicture.querySelector('.comments-loader');
    const oldButton = commentsLoader.cloneNode(true);
    commentsLoader.parentNode.replaceChild(oldButton, commentsLoader);
  };

  function onEscKeyDown (evt) {
    if (evt.key === 'Escape') {
      closeFullscreenPhoto();
    }
  }

  // Вешаем обработчики
  closeButton.addEventListener('click', closeFullscreenPhoto);
  document.addEventListener('keydown', onEscKeyDown);
};

// Основная функция для открытия полноразмерного фото
const openFullscreenPhoto = (photo) => {
  const bigPicture = document.querySelector('.big-picture');
  const bigImage = bigPicture.querySelector('.big-picture__img img');
  const likesCount = bigPicture.querySelector('.likes-count');
  const commentsCount = bigPicture.querySelector('.comments-count');
  const socialCaption = bigPicture.querySelector('.social__caption');
  const commentsList = bigPicture.querySelector('.social__comments');

  // Находим блоки для постраничной загрузки
  const commentsLoader = bigPicture.querySelector('.comments-loader');
  const socialCommentCount = bigPicture.querySelector('.social__comment-count');

  // Заполняем данные фотографии
  bigImage.src = photo.url;
  bigImage.alt = photo.description;
  likesCount.textContent = photo.likes;
  commentsCount.textContent = photo.comments.length;
  socialCaption.textContent = photo.description;

  // Сбрасываем состояние кнопки и счётчика
  commentsLoader.classList.remove('hidden');
  commentsLoader.textContent = 'Загрузить ещё';
  socialCommentCount.classList.remove('hidden');

  // Удаляем старый обработчик (если был)
  const newCommentsLoader = commentsLoader.cloneNode(true);
  commentsLoader.parentNode.replaceChild(newCommentsLoader, commentsLoader);

  const currentCommentsLoader = bigPicture.querySelector('.comments-loader');
  const currentSocialCommentCount = bigPicture.querySelector('.social__comment-count');

  // Замыкаем переменные для конкретной фотографии
  let currentCommentIndex = 0;
  const allComments = photo.comments;

  // Функция для загрузки следующей порции
  const loadMoreComments = () => {
    currentCommentIndex = renderCommentsPortion(
      allComments,
      currentCommentIndex,
      commentsList,
      currentSocialCommentCount,
      currentCommentsLoader
    );
  };

  // Загружаем первую порцию
  loadMoreComments();

  currentCommentsLoader.addEventListener('click', loadMoreComments);

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  setupCloseHandlers(bigPicture);
};

export { openFullscreenPhoto };
