import { initImageEffects, resetEffects,resetScale } from './image-effects.js';
import { sendData } from './api.js';

const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;

// Находим элементы
const uploadForm = document.querySelector('.img-upload__form');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');
const uploadFileInput = uploadForm.querySelector('.img-upload__input');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancel = uploadForm.querySelector('.img-upload__cancel');
const uploadSubmit = uploadForm.querySelector('.img-upload__submit');
const imagePreview = uploadForm.querySelector('.img-upload__preview img');
const effectsPreviews = uploadForm.querySelectorAll('.effects__preview');

// Открытие формы
const openUploadForm = () => {
  resetScale();
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

// Функция для загрузки пользовательского изображения в превью
const loadUserImage = (file) => {
  const reader = new FileReader();

  reader.onload = () => {
    const result = reader.result;

    // Устанавливаем изображение в основное превью
    imagePreview.src = result;

    // Устанавливаем изображение во все превью эффектов
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${result})`;
    });
  };

  reader.readAsDataURL(file);
};

// Обработчик изменения файла
const onFileInputChange = () => {
  const file = uploadFileInput.files[0];

  if (file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (!validTypes.includes(file.type)) {
      uploadFileInput.value = '';
      return;
    }

    loadUserImage(file);
    openUploadForm();
  }
};

// Инициализация Pristine
const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error-text',
  errorTextTag: 'span'
});

// Функция проверки формата хэш-тега
const isValidHashtag = (hashtag) => /^#[a-zа-яё0-9]+$/i.test(hashtag);

// Валидация хэш-тегов
const validateHashtags = (value) => {
  if (value.trim() === '') {
    return true;
  }

  const hashtags = value.toLowerCase().split(' ').filter(Boolean);

  if (hashtags.length > MAX_HASHTAGS) {
    return false;
  }

  for (const hashtag of hashtags) {
    if (hashtag.length === 1) {
      return false;
    }

    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return false;
    }

    if (!isValidHashtag(hashtag)) {
      return false;
    }
  }

  const uniqueHashtags = new Set(hashtags);
  return uniqueHashtags.size === hashtags.length;
};

// Сообщения об ошибках для хэш-тегов
const getHashtagErrorMessage = (value) => {
  if (value.trim() === '') {
    return '';
  }

  const hashtags = value.toLowerCase().split(' ').filter(Boolean);

  if (hashtags.length > MAX_HASHTAGS) {
    return `Не более ${MAX_HASHTAGS} хэш-тегов`;
  }

  for (const hashtag of hashtags) {
    if (!hashtag.startsWith('#')) {
      return 'Хэш-тег должен начинаться с символа #';
    }

    if (hashtag.length === 1) {
      return 'Хэш-тег не может состоять только из #';
    }

    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return `Максимальная длина хэш-тега ${MAX_HASHTAG_LENGTH} символов`;
    }

    if (!isValidHashtag(hashtag)) {
      return 'Хэш-тег содержит недопустимые символы';
    }
  }

  const uniqueHashtags = new Set(hashtags);
  if (uniqueHashtags.size !== hashtags.length) {
    return 'Хэш-теги не должны повторяться';
  }

  return '';
};

// Валидация комментария
const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

// Добавляем валидаторы к Pristine
pristine.addValidator(hashtagInput, validateHashtags, getHashtagErrorMessage);
pristine.addValidator(
  commentInput,
  validateComment,
  `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`
);

// Закрытие формы
const closeUploadForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  // Полный сброс формы
  uploadForm.reset();
  pristine.reset();
  uploadFileInput.value = '';

  // Сброс масштаба и эффектов
  resetEffects();

  // Сброс превью изображения на дефолтное
  imagePreview.src = 'img/upload-default-image.jpg';
  imagePreview.style.transform = 'scale(1)'; // Явно сбрасываем трансформацию
  imagePreview.style.filter = 'none'; // Явно сбрасываем фильтр

  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = '';
  });

  // Удаление обработчика Esc
  document.removeEventListener('keydown', onDocumentKeydown);
};

// Обработчик клавиши Esc для формы
function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    const isHashtagFocused = document.activeElement === hashtagInput;
    const isCommentFocused = document.activeElement === commentInput;

    if (!isHashtagFocused && !isCommentFocused) {
      evt.preventDefault();
      closeUploadForm();
    }
  }
}

// Обработчик закрытия формы
uploadCancel.addEventListener('click', closeUploadForm);

// Блокировка кнопки отправки
const blockSubmitButton = () => {
  uploadSubmit.disabled = true;
  uploadSubmit.textContent = 'Отправляю...';
};

const unblockSubmitButton = () => {
  uploadSubmit.disabled = false;
  uploadSubmit.textContent = 'Опубликовать';
};

// Функция показа сообщения об успехе
const showSuccessMessage = () => {
  const successTemplate = document.querySelector('#success');
  const successElement = successTemplate.content.cloneNode(true);
  const successModal = successElement.querySelector('.success');
  const successButton = successModal.querySelector('.success__button');

  document.body.appendChild(successModal);

  const onSuccessEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      closeSuccessModal();
    }
  };

  const onSuccessOutsideClick = (evt) => {
    if (evt.target === successModal) {
      closeSuccessModal();
    }
  };

  function closeSuccessModal () {
    successModal.remove();
    document.removeEventListener('keydown', onSuccessEscKeydown);
    successModal.removeEventListener('click', onSuccessOutsideClick);
  }

  successButton.addEventListener('click', closeSuccessModal);
  document.addEventListener('keydown', onSuccessEscKeydown);
  successModal.addEventListener('click', onSuccessOutsideClick);
};

// Функция показа сообщения об ошибке
const showErrorMessage = () => {
  const errorTemplate = document.querySelector('#error');
  const errorElement = errorTemplate.content.cloneNode(true);
  const errorModal = errorElement.querySelector('.error');
  const errorButton = errorModal.querySelector('.error__button');

  document.body.appendChild(errorModal);

  const onErrorEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      closeErrorModal();
    }
  };

  const onErrorOutsideClick = (evt) => {
    if (evt.target === errorModal) {
      closeErrorModal();
    }
  };
  function closeErrorModal () {
    errorModal.remove();
    document.removeEventListener('keydown', onErrorEscKeydown);
    errorModal.removeEventListener('click', onErrorOutsideClick);
  }

  errorButton.addEventListener('click', closeErrorModal);
  document.addEventListener('keydown', onErrorEscKeydown);
  errorModal.addEventListener('click', onErrorOutsideClick);
};

// Отправка формы
const setFormSubmit = () => {
  uploadForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();

    if (isValid) {
      blockSubmitButton();

      try {
        const formData = new FormData(uploadForm);
        await sendData(formData);
        closeUploadForm();
        showSuccessMessage();
      } catch (error) {
        showErrorMessage();
      } finally {
        unblockSubmitButton();
      }
    }
  });
};

const initFormValidation = () => {
  setFormSubmit();
  initImageEffects();
  uploadFileInput.addEventListener('change', onFileInputChange);
};

export { initFormValidation, closeUploadForm };
