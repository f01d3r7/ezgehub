# Техническое ТЗ: frontend MVP сайта веломагазина

## 1. Цель

Собрать frontend MVP интернет-витрины веломагазина из двух страниц:

- `index.html` — главная
- `catalog.html` — каталог

Проект должен быть реализован как небольшой модульный e-commerce frontend без backend-части, но с полноценной клиентской логикой: фильтрация, сортировка, корзина, сравнение, переход по категориям через query-параметры.

---

## 2. Состав проекта

```text
project/
├── index.html
├── catalog.html
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── main.css
│   ├── index.css
│   └── catalog.css
├── js/
│   ├── data.js
│   ├── utils.js
│   ├── storage.js
│   ├── cart.js
│   ├── compare.js
│   ├── filters.js
│   ├── render.js
│   ├── index.js
│   └── catalog.js
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

---

## 3. Функциональный объём MVP

### Обязательно реализовать

- вывод карточек товаров из общего массива данных
- блок категорий на главной странице
- переход из категории на главной в каталог с query-параметром `type`
- фильтр по типу велосипеда
- фильтр по цене
- сортировку каталога
- счётчик найденных товаров
- корзину в формате боковой панели
- сохранение корзины в `localStorage`
- сравнение товаров в модальном окне
- ограничение сравнения до 3 товаров

### Не входит в MVP

- backend
- авторизация
- оформление заказа
- страница карточки товара
- реальные платежи

---

## 4. Модель данных

Источник истины для товаров — массив `products` в `js/data.js`.

### Формат объекта товара

```js
{
  id: 1,
  name: "Trek Marlin 7",
  type: "mountain",
  brand: "Trek",
  price: 1299,
  oldPrice: 1499,
  image: "assets/images/bikes/trek-marlin-7.jpg",
  wheelSize: 29,
  frame: "Алюминий",
  brakes: "Гидравлические дисковые",
  purpose: "Трейл и город",
  rating: 4.8,
  isPopular: true,
  isPromo: true,
  shortSpecs: ["29\"", "Алюминий", "Дисковые тормоза"]
}
```

### Обязательные поля

- `id`
- `name`
- `type`
- `brand`
- `price`
- `image`
- `wheelSize`
- `frame`
- `brakes`
- `purpose`

### Допустимые значения `type`

- `mountain`
- `road`
- `city`
- `bmx`
- `electric`

---

## 5. Состояние приложения

Рекомендуемая модель состояния:

```js
const state = {
  products,
  filters: {
    type: "all",
    priceRange: "all"
  },
  sortBy: "popular",
  cart: [],
  compare: [],
  isCartOpen: false,
  isCompareModalOpen: false
};
```

### Принципы

- DOM не является источником истины.
- Фильтрация и сортировка работают только через данные.
- В корзине хранятся только `id` и `quantity`.
- Список сравнения хранит только `id`.

---

## 6. HTML-структура страниц

## 6.1. `index.html`

### Структура страницы

```text
body
├── header.site-header
├── main
│   ├── section.hero
│   ├── section.advantages
│   ├── section.categories
│   ├── section.featured-products
│   ├── section.promo-banner
│   └── section.final-cta
├── aside.cart-drawer
├── div.compare-modal
└── footer.site-footer
```

### Обязательные элементы

#### Header

- логотип
- навигация
- кнопка открытия корзины
- кнопка открытия сравнения
- счётчик корзины
- счётчик сравнения

#### Hero

- заголовок
- подзаголовок
- CTA `Перейти в каталог` с ссылкой на `catalog.html`
- CTA `Смотреть акции` с якорем на промо-блок или ссылкой на каталог

#### Advantages

- 4 карточки преимуществ

#### Categories

- 4–5 карточек категорий
- каждая карточка ведёт на:
  - `catalog.html?type=mountain`
  - `catalog.html?type=road`
  - `catalog.html?type=city`
  - `catalog.html?type=bmx`
  - `catalog.html?type=electric`

#### Featured Products

- контейнер под 4–6 карточек популярных товаров
- рендер из `products.filter(item => item.isPopular || item.isPromo)`

#### Promo Banner

- заголовок
- текст
- CTA-кнопка на каталог

#### Final CTA

- заголовок
- описание
- кнопка `Открыть каталог`

---

## 6.2. `catalog.html`

### Структура страницы

```text
body
├── header.site-header
├── main.catalog-page
│   ├── section.catalog-hero
│   └── section.catalog-layout
│       ├── aside.filters-sidebar
│       └── div.catalog-content
│           ├── div.catalog-toolbar
│           ├── p.results-count
│           └── div.products-grid
├── aside.cart-drawer
├── div.compare-modal
└── footer.site-footer
```

### Обязательные элементы

#### Catalog Hero

- заголовок страницы
- краткое описание
- breadcrumb или короткая строка навигации

#### Filters Sidebar

- блок фильтра `Тип велосипеда`
- блок фильтра `Цена`
- кнопка `Сбросить фильтры`

#### Catalog Toolbar

- select для сортировки
- кнопка открытия сравнения
- счётчик выбранных для сравнения

#### Results Count

- текст в формате: `Найдено: 8 моделей`

#### Products Grid

- рендер карточек по текущему состоянию фильтров и сортировки

---

## 7. Селекторы и data-атрибуты

Чтобы упростить JS-логику, использовать понятные селекторы.

### Рекомендуемые id и атрибуты

- `#featured-products`
- `#catalog-products`
- `#results-count`
- `#sort-select`
- `#compare-open-btn`
- `#compare-counter`
- `#cart-open-btn`
- `#cart-counter`
- `#cart-drawer`
- `#compare-modal`
- `#compare-content`
- `#cart-items`
- `#cart-total`

### Для фильтров

- `[name="bike-type"]`
- `[name="price-range"]`
- `[data-action="reset-filters"]`

### Для карточек товаров

- `[data-product-id]`
- `[data-action="add-to-cart"]`
- `[data-action="add-to-compare"]`
- `[data-action="view-details"]`

---

## 8. CSS-архитектура

## 8.1. `css/reset.css`

Содержит:

- сброс margin/padding
- `box-sizing: border-box`
- нормализацию изображений, кнопок, списков, ссылок

## 8.2. `css/variables.css`

Содержит дизайн-токены:

```css
:root {
  --color-bg: #f7f6f2;
  --color-surface: #ffffff;
  --color-surface-alt: #eef3ea;
  --color-text: #112018;
  --color-muted: #5f6c63;
  --color-accent: #1f6b45;
  --color-accent-strong: #144d31;
  --color-accent-alt: #f28c28;
  --color-border: #d8e0d7;
  --color-danger: #c54444;
  --shadow-md: 0 16px 40px rgba(17, 32, 24, 0.12);
  --shadow-sm: 0 8px 20px rgba(17, 32, 24, 0.08);
  --radius-lg: 28px;
  --radius-md: 18px;
  --radius-sm: 12px;
  --container-width: 1280px;
  --transition-fast: 0.2s ease;
  --transition-base: 0.35s ease;
}
```

## 8.3. `css/main.css`

Содержит общие стили:

- контейнер `.container`
- секционные отступы
- типографику
- кнопки `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--ghost`
- общие карточки `.card`
- header/footer
- модалка сравнения
- drawer корзины
- utility-классы

## 8.4. `css/index.css`

Стили только для главной:

- hero
- advantages
- categories
- featured-products
- promo-banner
- final-cta

## 8.5. `css/catalog.css`

Стили только для каталога:

- catalog hero
- layout из двух колонок
- filters sidebar
- toolbar
- products grid
- states: empty, active filter, hover

---

## 9. CSS-компоненты

Ниже список компонентов, которые нужно определить до детальной верстки.

### Общие компоненты

- `.site-header`
- `.site-nav`
- `.logo`
- `.container`
- `.section-heading`
- `.btn`
- `.badge`
- `.counter-chip`
- `.card`
- `.product-card`
- `.drawer`
- `.modal`
- `.overlay`

### Компоненты карточки товара

- `.product-card__image`
- `.product-card__body`
- `.product-card__title`
- `.product-card__meta`
- `.product-card__price`
- `.product-card__old-price`
- `.product-card__specs`
- `.product-card__actions`

### Компоненты фильтров

- `.filters-sidebar`
- `.filter-group`
- `.filter-option`
- `.filter-group__title`
- `.filter-reset`

### Компоненты корзины

- `.cart-drawer`
- `.cart-item`
- `.cart-item__media`
- `.cart-item__content`
- `.cart-item__controls`
- `.cart-summary`

### Компоненты сравнения

- `.compare-modal`
- `.compare-table-wrapper`
- `.compare-table`
- `.compare-table__row`

---

## 10. JS-модули и их API

## 10.1. `js/data.js`

### Ответственность

- экспорт массива `products`

### Контракт

```js
export const products = [ ... ];
```

---

## 10.2. `js/utils.js`

### Ответственность

- вспомогательные функции

### API

```js
export function formatPrice(value) {}
export function getQueryParams() {}
export function debounce(fn, delay) {}
export function isValidArray(value) {}
```

### Назначение

- форматирование цен
- чтение query-параметров
- безопасные общие проверки

---

## 10.3. `js/storage.js`

### Ответственность

- безопасная работа с `localStorage`

### Ключи

- `veloshop-cart`
- `veloshop-compare` — опционально

### API

```js
export function loadFromStorage(key, fallback = []) {}
export function saveToStorage(key, value) {}
export function removeFromStorage(key) {}
```

### Требования

- при битом JSON возвращать `fallback`
- не выбрасывать необработанные ошибки наружу

---

## 10.4. `js/cart.js`

### Ответственность

- хранение и изменение корзины
- синхронизация корзины с `localStorage`
- управление drawer UI

### Формат корзины

```js
[
  { id: 1, quantity: 2 },
  { id: 5, quantity: 1 }
]
```

### API

```js
export function getCart() {}
export function saveCart(cart) {}
export function addToCart(productId) {}
export function removeFromCart(productId) {}
export function increaseQuantity(productId) {}
export function decreaseQuantity(productId) {}
export function clearCart() {}
export function getCartDetailedItems(products) {}
export function getCartTotal(products) {}
export function updateCartCounter() {}
export function renderCart(products) {}
export function openCart() {}
export function closeCart() {}
export function bindCartEvents(products) {}
```

### Поведение

- если товара ещё нет в корзине, добавить с `quantity: 1`
- если товар уже есть, увеличить количество
- если `quantity` становится `0`, удалить запись

---

## 10.5. `js/compare.js`

### Ответственность

- хранение списка сравнения
- ограничение до 3 товаров
- рендер модального окна

### API

```js
export function getCompareList() {}
export function addToCompare(productId) {}
export function removeFromCompare(productId) {}
export function clearCompare() {}
export function getCompareItems(products) {}
export function updateCompareCounter() {}
export function renderCompareModal(products) {}
export function openCompareModal() {}
export function closeCompareModal() {}
export function bindCompareEvents(products) {}
```

### Правила

- максимум 3 товара
- повторное добавление того же товара запрещено
- при пустом списке в модалке выводится сообщение

---

## 10.6. `js/filters.js`

### Ответственность

- применение фильтров и сортировки к массиву товаров

### Состояние фильтров

```js
export const filtersState = {
  type: "all",
  priceRange: "all",
  sortBy: "popular"
};
```

### API

```js
export function setTypeFilter(type) {}
export function setPriceFilter(range) {}
export function setSort(sortBy) {}
export function resetFilters() {}
export function filterProducts(products, state) {}
export function sortProducts(products, sortBy) {}
export function applyFilters(products, state) {}
```

### Поддерживаемые значения `priceRange`

- `all`
- `under-500`
- `500-1000`
- `1000-2000`
- `over-2000`

---

## 10.7. `js/render.js`

### Ответственность

- генерация HTML карточек и UI-состояний

### API

```js
export function createProductCard(product, options = {}) {}
export function renderProducts(container, products, options = {}) {}
export function renderEmptyState(container, text) {}
export function renderResultsCount(container, count) {}
export function renderFeaturedProducts(container, products) {}
```

### Примечание

Функция `createProductCard()` должна использоваться и на главной, и в каталоге, чтобы не дублировать разметку.

---

## 10.8. `js/index.js`

### Ответственность

- инициализация главной страницы

### Задачи

- взять популярные товары
- отрендерить галерею на главной
- привязать события корзины
- привязать события сравнения
- обновить счётчики в header

### Пример последовательности

```js
import { products } from "./data.js";
import { renderFeaturedProducts } from "./render.js";
import { renderCart, updateCartCounter, bindCartEvents } from "./cart.js";
import { renderCompareModal, updateCompareCounter, bindCompareEvents } from "./compare.js";

function initIndexPage() {}

initIndexPage();
```

---

## 10.9. `js/catalog.js`

### Ответственность

- инициализация каталога
- чтение query-параметров
- синхронизация UI-фильтров и состояния
- рендер каталога

### API и шаги

```js
function syncFiltersFromQuery() {}
function syncFilterControls() {}
function applyFiltersAndRender() {}
function bindCatalogEvents() {}
function initCatalogPage() {}
```

### Обязательная последовательность загрузки

1. считать `type` из URL
2. обновить `filtersState`
3. выставить нужные контролы в sidebar
4. применить фильтры и сортировку
5. отрендерить товары
6. обновить счётчик найденных товаров
7. подключить корзину и сравнение

---

## 11. Пользовательские сценарии

## 11.1. С главной в каталог по категории

1. Пользователь нажимает на карточку категории.
2. Открывается `catalog.html?type=mountain`.
3. Каталог считывает query-параметр.
4. Фильтр типа активируется автоматически.
5. Пользователь сразу видит отфильтрованный список.

## 11.2. Добавление в корзину

1. Пользователь нажимает `В корзину`.
2. Товар добавляется в состояние корзины.
3. Корзина сохраняется в `localStorage`.
4. Обновляется счётчик в header.
5. При необходимости перерисовывается drawer.

## 11.3. Сравнение

1. Пользователь нажимает `Сравнить`.
2. Товар добавляется в compare list.
3. Если элементов уже 3, показывается сообщение.
4. При открытии модалки строится таблица характеристик.

---

## 12. Логика фильтрации и сортировки

### Порядок обработки

```text
products
→ filter by type
→ filter by priceRange
→ sort
→ render
```

### Правила сортировки

- `popular` — сначала `isPopular === true`, далее по `rating` или исходному порядку
- `price-asc` — от меньшей цены к большей
- `price-desc` — от большей цены к меньшей
- `name-asc` — по алфавиту

### Важно

- сортировка применяется только к уже отфильтрованному массиву
- исходный массив `products` не должен мутироваться напрямую

---

## 13. Корзина: UI и поведение

### Формат UI

- выезжающая панель справа
- затемняющий overlay
- закрытие по крестику, overlay и клавише `Escape`

### Содержимое

- заголовок `Корзина`
- список товаров
- цена каждой позиции
- количество
- кнопки `+` и `-`
- кнопка удаления
- итоговая сумма
- кнопка `Оформить` как заглушка

### Пустое состояние

`Ваша корзина пока пуста`

---

## 14. Сравнение: UI и поведение

### Формат UI

- модальное окно по центру
- overlay
- закрытие по крестику, overlay и клавише `Escape`

### Содержимое таблицы

- фото
- название
- тип
- цена
- материал рамы
- размер колёс
- тормоза
- назначение

### Адаптивность

- на мобильном сравнение не ломается
- при нехватке ширины доступен горизонтальный скролл внутри таблицы

### Пустое состояние

`Добавьте модели в сравнение`

---

## 15. Адаптивные требования

### Desktop

- двухколоночный layout каталога
- карточки в несколько колонок через CSS Grid

### Tablet

- фильтры могут переходить в компактный вид
- сетка карточек уплотняется

### Mobile

- карточки строятся в 1 колонку или в адаптивный `auto-fit`
- drawer корзины открывается на всю ширину или почти на всю
- модалка сравнения не выходит за экран
- таблица сравнения скроллится по горизонтали

---

## 16. Порядок разработки

### Этап 1. Каркас проекта

- создать папки
- создать HTML, CSS, JS-файлы
- подключить стили и скрипты

### Этап 2. Данные

- заполнить `js/data.js`
- подготовить 10–12 карточек велосипедов

### Этап 3. Базовые стили

- reset
- variables
- main layout
- базовые кнопки и карточки

### Этап 4. Главная страница

- hero
- advantages
- categories
- featured products
- promo banner
- final CTA

### Этап 5. Каталог

- sidebar
- toolbar
- products grid
- results count

### Этап 6. Общий рендер карточек

- создать `createProductCard()`
- создать `renderProducts()`

### Этап 7. Фильтры и сортировка

- type
- price
- sort
- reset

### Этап 8. Корзина

- storage
- add/remove/update quantity
- drawer render

### Этап 9. Сравнение

- add/remove
- limit = 3
- modal render

### Этап 10. Связь страниц

- категории на главной
- чтение query на каталоге

### Этап 11. Адаптив

- tablet
- mobile
- тест пустых состояний

### Этап 12. Полировка

- hover
- transitions
- visual rhythm
- сообщения для edge cases

---

## 17. Приёмочные критерии

### Главная страница

- есть все 6 ключевых секций
- категории ведут в каталог с нужным `type`
- популярные товары рендерятся из массива
- кнопки корзины и сравнения работают

### Каталог

- товары рендерятся из `products`
- тип фильтруется корректно
- цена фильтруется корректно
- сортировка работает во всех вариантах
- счётчик найденных товаров обновляется

### Корзина

- товар добавляется и сохраняется после перезагрузки
- количество можно увеличить и уменьшить
- товар можно удалить
- сумма считается корректно

### Сравнение

- можно добавить до 3 товаров
- повтор не добавляется
- модалка открывается и закрывается
- характеристики выводятся корректно

### Общая UX-целостность

- главная не декоративная, а ведёт в каталог по сценарию
- интерфейс адаптивен
- визуальная система единообразна

---

## 18. Что можно взять как правило код-стайла

- одна зона ответственности на модуль
- минимум дублирования разметки
- не хранить полные объекты товаров в корзине
- не мутировать исходный массив товаров при сортировке
- все DOM-селекторы вынести в понятные константы внутри модулей
- ошибки `localStorage` обрабатывать безопасно

---

## 19. Следующая практическая задача

После этого ТЗ можно переходить к реализации в таком порядке:

1. создать структуру проекта и пустые файлы
2. заполнить `data.js`
3. собрать базовый layout и стили
4. сверстать `index.html`
5. сверстать `catalog.html`
6. подключить общий рендер товаров
7. подключить фильтры и сортировку
8. реализовать корзину
9. реализовать сравнение
10. проверить переход по query-параметрам
