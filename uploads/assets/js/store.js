const EASY_KEY = 'ds_easyText';

const store = {
  easyText: localStorage.getItem(EASY_KEY) === 'true',
  audience: null,
  content: null,
  tree: null,
  treeHistory: [],

  _listeners: [],

  subscribe(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(l => l !== fn); };
  },

  _emit(changed) {
    this._listeners.forEach(fn => fn(changed));
  },

  setEasyText(val) {
    this.easyText = Boolean(val);
    localStorage.setItem(EASY_KEY, this.easyText);
    this._emit('easyText');
  },

  setAudience(id) {
    this.audience = id;
    this._emit('audience');
  },

  setContent(data) {
    this.content = data;
    this._emit('content');
  },

  setTree(data) {
    this.tree = data;
    this._emit('tree');
  },

  pushTreeHistory(nodeId) {
    this.treeHistory.push(nodeId);
    this._emit('treeHistory');
  },

  popTreeHistory() {
    this.treeHistory.pop();
    this._emit('treeHistory');
  },

  resetTreeHistory() {
    this.treeHistory = [];
    this._emit('treeHistory');
  }
};

export default store;
