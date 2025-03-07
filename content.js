// Function to hide Shorts section
const hideShortsSection = () => {
  // Hide Shorts shelf
  const shortsSections = document.querySelectorAll(
    'ytd-rich-section-renderer, ytd-reel-shelf-renderer, [title*="Short"]'
  );
  
  shortsSections.forEach(section => {
    if (section.innerText.toLowerCase().includes('short') || 
        section.querySelector('[aria-label*="Short"]')) {
      section.style.display = 'none';
    }
  });

  // Hide Shorts in navigation
  const shortsLinks = document.querySelectorAll(
    'a[title*="Short"], a[href*="/shorts"], ytd-guide-entry-renderer[title*="Short"]'
  );
  shortsLinks.forEach(link => link.style.display = 'none');
};
const shouldHideVideo = (title, description) => {
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();

  // Check for exclusion keywords first
  const hasExcluded = window.excludeKeywords.some(keyword =>
    titleLower.includes(keyword) || descLower.includes(keyword)
  );

  if (hasExcluded) return true;

  // Check for required tech keywords
  const hasTech = window.techKeywords.some(keyword =>
    titleLower.includes(keyword) || descLower.includes(keyword)
  );

  return !hasTech;
};

const filterVideos = () => {
  const videoSelectors = [
    'ytd-rich-item-renderer', 
    'ytd-video-renderer',
    'ytd-grid-video-renderer',
    'ytd-compact-video-renderer'
  ];

  document.querySelectorAll(videoSelectors.join(', ')).forEach(video => {
    const titleElement = video.querySelector('#video-title, #video-title-link');
    const title = titleElement?.textContent?.trim() || '';
    
    const description = Array.from(video.querySelectorAll(
      '.metadata-line, yt-formatted-string, #description-text'
    )).map(el => el.textContent).join(' ').toLowerCase();

    const isShort = video.closest('ytd-reel-shelf-renderer, ytd-rich-section-renderer') || 
                    title.toLowerCase().includes('short');

    if (isShort || shouldHideVideo(title, description)) {
      video.style.display = 'none';
    }
  });
};
// Combined function to run both filters
const runFilters = () => {
  hideShortsSection();
  filterVideos();
};

// Initial run
runFilters();

// Mutation Observer with better configuration
const observer = new MutationObserver(mutations => {
  runFilters();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true
});

// Add resize listener for infinite scroll
window.addEventListener('resize', runFilters);