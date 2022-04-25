import { Template } from '../Template';

export default new Template(({ emojiCount, classes, category, pickerId, icon, i18n }) => /* html */`
  <div class="${classes.emojiCategory}" role="tabpanel" aria-labelledby="${pickerId}-category-${category.key}">
  <h3 data-category="${category.key}" class="${classes.categoryName}">
    <i data-icon="${icon}"></i>
    ${i18n.get(`categories.${category.key}`, category.message || category.key)}
    <!-- <button title="<%= i18n.get('recents.clear') %>"><i class="fa-solid fa-lg fa-square-xmark"></i></button> -->
  </h3>
  <div data-empty="${emojiCount === 0}" class="${classes.recentEmojis}">
    <div data-view="emojis" data-render="sync"></div>
  </div>
  <div class="${classes.noRecents}">
    ${i18n.get('recents.none')}
  </div>
</div>
`, { mode: 'async' });