import {createSiteMenuTemplate} from './view/site-menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createBoardTemplate} from './view/board.js';
import {createSortingTemplate} from './view/sorting.js';
import {createTaskTemplate} from './view/task.js';
import {createTaskEditTemplate} from './view/task-edit.js';
import {createLoadMoreButtonTemplate} from './view/load-more-button.js';
import {generateTask} from './mock/task.js';
import {generateFilter} from "./mock/filter.js";

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);
const notArchiveTasks = tasks.filter((task) => !task.isArchive);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createFilterTemplate(filters), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);
render(boardElement, createSortingTemplate(), `afterbegin`);
render(taskListElement, createTaskEditTemplate(notArchiveTasks[0]), `beforeend`);

for (let i = 0; i < Math.min(notArchiveTasks.length, TASK_COUNT_PER_STEP); i++) {
  render(taskListElement, createTaskTemplate(notArchiveTasks[i]), `beforeend`);
}

if (notArchiveTasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;
  render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);

  const loadMoreButton = boardElement.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    notArchiveTasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= notArchiveTasks.length) {
      loadMoreButton.remove();
    }
  });
}
