const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;

const EFFECTS = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    unit: ''
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
    filter: 'grayscale'
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
    filter: 'sepia'
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    filter: 'invert'
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
    filter: 'blur'
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
    filter: 'brightness'
  }
};

//элементы для масштабирования
const scaleControl = document.querySelector('.scale__control--value');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const imagePreview = document.querySelector('.img-upload__preview img');

//элементы для эффектов
const effectsList = document.querySelector('.effects__list');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');

let currentEffect = 'none';

// Функция для получения числового значения масштаба
const getScaleValue = () => {
  // Получаем текущее значение из поля
  const valueString = scaleControl.value;
  // Удаляем символ % и преобразуем в число
  return parseInt(valueString.replace('%', ''), 10);
};

// Функция для установки значения масштаба
const setScaleValue = (value) => {
  const clampedValue = Math.max(SCALE_MIN, Math.min(value, SCALE_MAX));
  scaleControl.value = `${clampedValue}%`;
  scaleControl.setAttribute('value', `${clampedValue}%`);
  imagePreview.style.transform = `scale(${clampedValue / 100})`;
  return clampedValue;
};

// Уменьшение масштаба
const onScaleSmallerClick = () => {
  const currentValue = getScaleValue();
  setScaleValue(currentValue - SCALE_STEP);
};

// Увеличение масштаба
const onScaleBiggerClick = () => {
  const currentValue = getScaleValue();
  setScaleValue(currentValue + SCALE_STEP);
};

// Инициализация масштабирования
const initScale = () => {
  setScaleValue(100);
  scaleSmaller.addEventListener('click', onScaleSmallerClick);
  scaleBigger.addEventListener('click', onScaleBiggerClick);
};

// Создание слайдера
const createSlider = () => {
  noUiSlider.create(effectLevelSlider, {
    range: {
      min: EFFECTS.none.min,
      max: EFFECTS.none.max,
    },
    start: EFFECTS.none.max,
    step: EFFECTS.none.step,
    connect: 'lower',
  });
};

const updateSlider = () => {
  const effect = EFFECTS[currentEffect];

  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min: effect.min,
      max: effect.max,
    },
    start: effect.max,
    step: effect.step,
  });

  if (currentEffect === 'none') {
    effectLevelContainer.classList.add('hidden');
    imagePreview.style.filter = 'none';
  } else {
    effectLevelContainer.classList.remove('hidden');
  }
};

// Применение эффекта к изображению
const applyEffect = () => {
  const sliderValue = effectLevelSlider.noUiSlider.get();
  const effect = EFFECTS[currentEffect];

  effectLevelValue.value = sliderValue;

  if (currentEffect !== 'none') {
    imagePreview.style.filter = `${effect.filter}(${sliderValue}${effect.unit})`;
  }
};

// Обработчик переключения эффекта
const onEffectChange = (evt) => {
  if (evt.target.type === 'radio') {
    currentEffect = evt.target.value;
    updateSlider();
    applyEffect();
  }
};

// Инициализация эффектов
const initEffects = () => {
  createSlider();
  effectLevelContainer.classList.add('hidden');
  effectLevelSlider.noUiSlider.on('update', applyEffect);
  effectsList.addEventListener('change', onEffectChange);
};

const resetEffects = () => {
  setScaleValue(100);
  currentEffect = 'none';
  document.querySelector('#effect-none').checked = true;
  updateSlider();
  applyEffect();
};

const resetScale = () => {
  setScaleValue(100);
};

const initImageEffects = () => {
  initScale();
  initEffects();
};

export { initImageEffects, resetEffects, resetScale };
