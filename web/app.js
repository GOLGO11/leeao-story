const rawData = window.STORY_DATA || window.LEEAO_STORIES || { stories: [] };

function normalizeStoryRecord(story, index) {
  const bookSlug = story.bookSlug ?? story.book_slug ?? story.book;
  const sourceIds = story.sourceIds ?? story.source_ids ?? "";
  const sourceFile = story.sourceFile ?? story.source_file ?? "";
  const sourceLines = story.sourceLines ?? story.source_lines ?? "";
  const id = String(story.id ?? "").trim();
  const fallbackId = [bookSlug, story.title, sourceFile, sourceLines, index + 1]
    .filter(Boolean)
    .join("::");
  return {
    ...story,
    id: id || fallbackId,
    storyKey: id ? `${id}::${index}` : fallbackId,
    bookSlug,
    sourceIds,
    sourceFile,
    sourceLines,
    charCount: story.charCount ?? Number(story.char_count || 0),
    text: story.text ?? story.story_text ?? ""
  };
}

const data = {
  ...rawData,
  stories: Array.isArray(rawData.stories) ? rawData.stories.map(normalizeStoryRecord) : []
};

const elements = {
  storyCount: document.querySelector("#storyCount"),
  totalChars: document.querySelector("#totalChars"),
  resultCount: document.querySelector("#resultCount"),
  searchInput: document.querySelector("#searchInput"),
  bookFilter: document.querySelector("#bookFilter"),
  sourceFilter: document.querySelector("#sourceFilter"),
  clearButton: document.querySelector("#clearButton"),
  storyList: document.querySelector("#storyList"),
  storyDetail: document.querySelector("#storyDetail")
};

const state = {
  query: "",
  book: "all",
  source: "all",
  selectedKey: data?.stories?.[0]?.storyKey ?? ""
};

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN").format(Number(value || 0));
}

function normalize(value) {
  return String(value ?? "").toLocaleLowerCase("zh-CN");
}

function appendText(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function getSourceIds(story) {
  return Array.isArray(story.sourceIds) ? story.sourceIds.join(", ") : String(story.sourceIds || "");
}

function getSourceKey(story) {
  return `${story.bookSlug || story.book}::${story.sourceFile}`;
}

function getBooks() {
  if (Array.isArray(data.books) && data.books.length) return data.books;
  const counts = new Map();
  for (const story of data.stories) {
    const slug = story.bookSlug || story.book;
    const current = counts.get(slug) || { book: story.book, slug, count: 0 };
    current.count += 1;
    counts.set(slug, current);
  }
  return Array.from(counts.values());
}

function getStoriesForBook() {
  if (state.book === "all") return data.stories;
  return data.stories.filter((story) => (story.bookSlug || story.book) === state.book);
}

function getFilteredStories(bookStories) {
  const query = normalize(state.query.trim());
  return bookStories.filter((story) => {
    const sourceOk = state.source === "all" || getSourceKey(story) === state.source;
    if (!sourceOk) return false;
    if (!query) return true;
    const haystack = normalize(
      [
        story.id,
        story.book,
        story.title,
        story.sourceFile,
        story.sourceLines,
        getSourceIds(story),
        story.text
      ].join(" ")
    );
    return haystack.includes(query);
  });
}

function getExcerpt(story) {
  const text = story.text.replace(/\s+/g, " ").trim();
  return text.length > 76 ? `${text.slice(0, 76)}...` : text;
}

function renderBookOptions() {
  elements.bookFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "全部书";
  elements.bookFilter.appendChild(allOption);

  for (const book of getBooks()) {
    const option = document.createElement("option");
    option.value = book.slug;
    option.textContent = `${book.book} (${formatNumber(book.count)})`;
    elements.bookFilter.appendChild(option);
  }
  elements.bookFilter.value = state.book;
}

function renderSourceOptions(bookStories) {
  const counts = new Map();
  for (const story of bookStories) {
    const key = getSourceKey(story);
    const current = counts.get(key) || {
      key,
      label: state.book === "all" ? `${story.book}｜${story.sourceFile}` : story.sourceFile,
      count: 0
    };
    current.count += 1;
    counts.set(key, current);
  }

  if (state.source !== "all" && !counts.has(state.source)) {
    state.source = "all";
  }

  elements.sourceFilter.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "全部来源";
  elements.sourceFilter.appendChild(allOption);

  for (const source of counts.values()) {
    const option = document.createElement("option");
    option.value = source.key;
    option.textContent = `${source.label} (${formatNumber(source.count)})`;
    elements.sourceFilter.appendChild(option);
  }
  elements.sourceFilter.value = state.source;
}

function renderList(stories) {
  elements.storyList.innerHTML = "";
  elements.resultCount.textContent = `${formatNumber(stories.length)} 条`;

  if (!stories.length) {
    appendText(elements.storyList, "div", "emptyState", "没有匹配条目");
    return;
  }

  if (!stories.some((story) => story.storyKey === state.selectedKey)) {
    state.selectedKey = stories[0].storyKey;
  }

  for (const story of stories) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `storyRow${story.storyKey === state.selectedKey ? " isActive" : ""}`;
    button.addEventListener("click", () => {
      state.selectedKey = story.storyKey;
      render();
      elements.storyDetail.scrollIntoView({ block: "start", behavior: "smooth" });
    });

    appendText(button, "h2", "storyTitle", story.title);
    appendText(
      button,
      "p",
      "storyMeta",
      `${story.book} | ${story.sourceFile} | ${story.sourceLines} | ${formatNumber(story.charCount)} 字`
    );
    appendText(button, "p", "storyExcerpt", getExcerpt(story));
    elements.storyList.appendChild(button);
  }
}

function renderDetail(stories) {
  elements.storyDetail.innerHTML = "";
  const story = stories.find((item) => item.storyKey === state.selectedKey);
  if (!story) {
    appendText(elements.storyDetail, "div", "emptyState", "请选择条目");
    return;
  }

  appendText(elements.storyDetail, "h2", "detailTitle", story.title);

  const meta = document.createElement("div");
  meta.className = "detailMeta";
  const chips = [
    story.book,
    story.id,
    story.sourceFile,
    `行 ${story.sourceLines}`,
    `${formatNumber(story.charCount)} 字`,
    `源 ${getSourceIds(story)}`
  ];
  for (const chip of chips) {
    appendText(meta, "span", "metaPill", chip);
  }
  elements.storyDetail.appendChild(meta);

  appendText(elements.storyDetail, "p", "storyText", story.text);
}

function render() {
  const bookStories = getStoriesForBook();
  renderSourceOptions(bookStories);
  const stories = getFilteredStories(bookStories);
  renderList(stories);
  renderDetail(stories);
}

function boot() {
  if (!data || !Array.isArray(data.stories)) {
    document.body.textContent = "数据未加载";
    return;
  }

  elements.storyCount.textContent = `${formatNumber(data.count || data.stories.length)} 条`;
  elements.totalChars.textContent = `${formatNumber(data.totalChars)} 字`;
  renderBookOptions();
  render();

  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });

  elements.bookFilter.addEventListener("change", (event) => {
    state.book = event.target.value;
    state.source = "all";
    render();
  });

  elements.sourceFilter.addEventListener("change", (event) => {
    state.source = event.target.value;
    render();
  });

  elements.clearButton.addEventListener("click", () => {
    state.query = "";
    state.book = "all";
    state.source = "all";
    elements.searchInput.value = "";
    elements.bookFilter.value = "all";
    elements.sourceFilter.value = "all";
    render();
  });
}

boot();
