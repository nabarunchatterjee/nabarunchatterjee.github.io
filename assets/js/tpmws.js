const toggle = document.getElementById('blog-tutorial-toggle');
const blog = document.getElementsByClassName('blog');

function toggleDisplay(blg) {
  const blgElem = blg;
  blgElem.style.display = blgElem.style.display === 'none' ? 'block' : 'none';
}

toggle.addEventListener('input', () => {
  Array.prototype.forEach.call(blog, (blg) => toggleDisplay(blg));
});
