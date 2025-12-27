const RANDOM_PHOTOS_COUNT = 10;
const FILTER_DEFAULT = 'default';
const FILTER_RANDOM = 'random';
const FILTER_DISCUSSED = 'discussed';
const DEBOUNCE_DELAY = 500;

// Ссылки на DOM элементы
const filtersContainer = document.querySelector('.img-filters');
const filterButtons = filtersContainer.querySelectorAll('.img-filters__button');
const filterDefaultBtn = document.querySelector('#filter-default');
const filterRandomBtn = document.querySelector('#filter-random');
const filterDiscussedBtn = document.querySelector('#filter-discussed');

let currentPhotos = [];
let activeFilter = FILTER_DEFAULT;
let lastTimeout = null;

// Функции фильтрации
const getDefaultPhotos = () => [...currentPhotos];

const getRandomPhotos = () => {
  const shuffled = [...currentPhotos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, RANDOM_PHOTOS_COUNT);
};

const getDiscussedPhotos = () =>
  [...currentPhotos].sort((a, b) => b.comments.length - a.comments.length);

// Получить отфильтрованные фото
const getFilteredPhotos = () => {
  switch (activeFilter) {
    case FILTER_RANDOM:
      return getRandomPhotos();
    case FILTER_DISCUSSED:
      return getDiscussedPhotos();
    case FILTER_DEFAULT:
    default:
      return getDefaultPhotos();
  }
};

// Обновить активную кнопку
const updateActiveButton = (selectedButton) => {
  filterButtons.forEach((button) => {
    button.classList.remove('img-filters__button--active');
  });
  selectedButton.classList.add('img-filters__button--active');
};

// Обработчик изменения фильтра с дебаунсом
const onFilterChange = (filterType, buttonElement, renderFunction) =>
  () => {
    activeFilter = filterType;
    updateActiveButton(buttonElement);

    // Дебаунс
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }

    lastTimeout = setTimeout(() => {
      const filteredPhotos = getFilteredPhotos();
      renderFunction(filteredPhotos);
    }, DEBOUNCE_DELAY);
  };

// Инициализация фильтров
const initFilters = (photos, renderFunction) => {
  currentPhotos = photos;

  // Показываем блок фильтров
  filtersContainer.classList.remove('img-filters--inactive');

  // Назначаем обработчики
  filterDefaultBtn.addEventListener('click',
    onFilterChange(FILTER_DEFAULT, filterDefaultBtn, renderFunction));
  filterRandomBtn.addEventListener('click',
    onFilterChange(FILTER_RANDOM, filterRandomBtn, renderFunction));
  filterDiscussedBtn.addEventListener('click',
    onFilterChange(FILTER_DISCUSSED, filterDiscussedBtn, renderFunction));
};

export { initFilters };
