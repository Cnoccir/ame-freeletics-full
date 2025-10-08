export default {
  shouldRender(args, component) {
    // Only show on categories page
    const path = window.location.pathname;
    return path === '/categories' || path.includes('categories');
  }
};
