let allTabs = [];
let filteredTabs = [];
let selectedIndex = 0;

const search = document.getElementById("search");
const list = document.getElementById("tabs");
const meta = document.getElementById("meta");
const errorBox = document.getElementById("error");

function showError(message) {
  errorBox.hidden = false;
  errorBox.textContent = message;
}

function clearError() {
  errorBox.hidden = true;
  errorBox.textContent = "";
}

async function loadTabs() {
  clearError();

  try {
    allTabs = await chrome.tabs.query({});
    allTabs.sort((a, b) => {
      if (a.active !== b.active) return a.active ? -1 : 1;
      return (b.lastAccessed || 0) - (a.lastAccessed || 0);
    });
    render();
  } catch (error) {
    showError(`Could not read tabs: ${error.message || error}`);
  }
}

function normalize(value) {
  return (value || "").toLowerCase();
}

function scoreTab(tab, query) {
  if (!query) return 1;

  const title = normalize(tab.title);
  const url = normalize(tab.url);
  const q = normalize(query);

  if (title === q) return 100;
  if (title.startsWith(q)) return 90;
  if (title.includes(q)) return 70;
  if (url.includes(q)) return 50;

  const words = q.split(/\s+/).filter(Boolean);
  if (words.length && words.every(word => title.includes(word) || url.includes(word))) {
    return 40;
  }

  return 0;
}

function filterTabs() {
  const query = search.value.trim();

  filteredTabs = allTabs
    .map(tab => ({ tab, score: scoreTab(tab, query) }))
    .filter(item => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.tab.lastAccessed || 0) - (a.tab.lastAccessed || 0);
    })
    .map(item => item.tab);

  if (selectedIndex >= filteredTabs.length) selectedIndex = filteredTabs.length - 1;
  if (selectedIndex < 0) selectedIndex = 0;
}

function render() {
  filterTabs();
  list.innerHTML = "";
  meta.textContent = `${filteredTabs.length} of ${allTabs.length} tabs`;

  if (!filteredTabs.length) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No matching tabs";
    list.appendChild(empty);
    return;
  }

  filteredTabs.forEach((tab, index) => {
    const li = document.createElement("li");
    li.className = `tab${index === selectedIndex ? " selected" : ""}`;
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", index === selectedIndex ? "true" : "false");
    li.tabIndex = -1;

    const favicon = document.createElement("img");
    favicon.className = "favicon";
    favicon.src = tab.favIconUrl || "icon.svg";
    favicon.onerror = () => {
      favicon.src = "icon.svg";
    };

    const text = document.createElement("div");

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = tab.title || "(untitled)";

    const url = document.createElement("div");
    url.className = "url";
    url.textContent = tab.url || "";

    text.append(title, url);

    const windowLabel = document.createElement("div");
    windowLabel.className = "window";
    windowLabel.textContent = `W${tab.windowId}`;

    li.append(favicon, text, windowLabel);

    li.addEventListener("pointerenter", () => {
      selectedIndex = index;
      render();
    });

    li.addEventListener("mousedown", event => {
      event.preventDefault();
      activateTab(tab);
    });

    list.appendChild(li);
  });

  const selected = list.querySelector(".selected");
  if (selected) selected.scrollIntoView({ block: "nearest" });
}

async function activateTab(tab) {
  clearError();

  if (!tab || typeof tab.id !== "number") {
    showError("Could not switch tabs: missing tab id.");
    return;
  }

  try {
    /*
      Do both operations. Some Edge/Chrome builds focus the window first,
      others behave better if the tab is activated first.
    */
    await chrome.tabs.update(tab.id, { active: true });

    if (typeof tab.windowId === "number") {
      await chrome.windows.update(tab.windowId, { focused: true });
    }

    window.close();
  } catch (error) {
    showError(`Could not switch tabs: ${error.message || error}`);
  }
}

search.addEventListener("input", () => {
  selectedIndex = 0;
  render();
});

document.addEventListener("keydown", event => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    selectedIndex = Math.min(selectedIndex + 1, filteredTabs.length - 1);
    render();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    selectedIndex = Math.max(selectedIndex - 1, 0);
    render();
  } else if (event.key === "Enter") {
    event.preventDefault();
    const tab = filteredTabs[selectedIndex];
    activateTab(tab);
  } else if (event.key === "Escape") {
    window.close();
  }
});

loadTabs();