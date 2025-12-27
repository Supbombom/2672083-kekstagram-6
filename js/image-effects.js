const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

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

let currentScale = SCALE_DEFAULT;
let currentEffect = 'none';

const updateScaleDisplay = () => {
  scaleControl.value = `${currentScale}%`;
  imagePreview.style.transform = `scale(${currentScale / 100})`;
};

const resetScale = () => {
  currentScale = SCALE_DEFAULT;
  updateScaleDisplay();
};

// Уменьшение масштаба
const onScaleSmallerClick = () => {
  currentScale = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
  updateScaleDisplay();
};

// Увеличение масштаба
const onScaleBiggerClick = () => {
  currentScale = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
  updateScaleDisplay();
};

// Инициализация масштабирования
const initScale = () => {
  currentScale = SCALE_DEFAULT;
  updateScaleDisplay();
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
  currentScale = SCALE_DEFAULT;
  currentEffect = 'none';
  updateScaleDisplay();
  document.querySelector('#effect-none').checked = true;
  updateSlider();
  applyEffect();
};

const initImageEffects = () => {
  initScale();
  initEffects();
};

export { initImageEffects, resetEffects, resetScale };
