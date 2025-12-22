const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

// Функция получения данных с сервера
const getData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/data`);

    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Не удалось загрузить данные: ${error.message}`);
  }
};

// Функция отправки данных на сервер
const sendData = async (formData) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Не удалось отправить данные: ${error.message}`);
  }
};

export { getData, sendData };
