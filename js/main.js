import { renderThumbnails } from './thumbnails.js';
import { initFormValidation } from './form-validation.js';
import { getData } from './api.js';
import { initFilters } from './filters.js';

//сообщение об ошибке загрузки
const showLoadError = (message) => {
  const errorContainer = document.createElement('div');
  errorContainer.style.cssText = `
    position: fixed;
    top: 20px;
    left: 25%;
    background-color: #ff4444;
    color: white;
    padding: 15px 30px;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;
  errorContainer.textContent = `Ошибка: ${message}. Обновите страницу.`;
  document.body.appendChild(errorContainer);
};

// Загрузка и отрисовка данных
const loadAndRenderPhotos = async () => {
  try {
    const photos = await getData();
    renderThumbnails(photos);
    initFilters(photos, (filteredPhotos) => {
      renderThumbnails(filteredPhotos);
    });
  } catch (error) {
    showLoadError(error.message);

    const container = document.querySelector('.pictures');
    container.innerHTML = '<p style="text-align: center; padding: 40px;">Не удалось загрузить фотографии. Попробуйте позже.</p>';
  }
};

const initApp = () => {
  initFormValidation();
  loadAndRenderPhotos();
};

document.addEventListener('DOMContentLoaded', initApp);
