document.addEventListener('DOMContentLoaded', function () {
  const toggles = document.querySelectorAll('.switch input');

  toggles.forEach(function(toggle, index) {
    toggle.addEventListener('change', function () {
      const state = this.checked;
      const switchId = index + 1; // Corresponding to switch IDs: 1, 2, 3
      fetch('/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'switch_id': switchId, 'state': state})
      })
      .then(response => response.json())
      .then(data => console.log('Switch ' + switchId + ': ' + data.new_state))
      .catch(error => console.error('Error:', error));
    });
  });
});

function fetchMessages() {
  fetch('/messages')
      .then(response => response.json())
      .then(data => {
          const messages = document.getElementById('messages');
          messages.innerHTML = '';
          data.forEach(msg => {
              const item = document.createElement('li');
              item.textContent = msg;
              messages.appendChild(item);
          });
      })
      .catch(console.error);
}

// Fetch messages every 5 seconds
setInterval(fetchMessages, 5000);

// Initial fetch
window.onload = fetchMessages;

window.onload = function() {
  fetchImages();
  setInterval(fetchImages, 5000);
  document.addEventListener('click', function(event) {
      if (!event.target.closest('.image-container')) {
          transitionBack();
      }
  });
};

function fetchImages() {
  fetch('/images')
      .then(response => response.json())
      .then(data => {
          updateTimeline(data);
      });
}

let displayedImages = new Set();  // This set will store the names of displayed images

function updateTimeline(images) {
    const timeline = document.getElementById('timeline');

    images.forEach(image => {
        if (!displayedImages.has(image)) {
            displayedImages.add(image); // Add new image to the set
            const imagePath = `/images/${image}`;
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-container';
            imgContainer.onclick = (e) => {
                e.stopPropagation();
                if (imgContainer.classList.contains('active')) {
                    transitionBack();
                } else {
                    transitionBack();
                    centerImage(imgContainer);
                }
            };

            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = "Loaded Image";

            imgContainer.appendChild(img);
            timeline.appendChild(imgContainer);
        }
    });
}

// function updateTimeline(images) {
//   const timeline = document.getElementById('timeline');
//   const displayedImages = new Set([...timeline.querySelectorAll('img')].map(img => img.src.split('/').pop()));

//   images.forEach(image => {
//       if (!displayedImages.has(image)) {
//           const imagePath = `/images/${image}`;
//           const imgContainer = document.createElement('div');
//           imgContainer.className = 'image-container';
//           imgContainer.onclick = (e) => {
//               e.stopPropagation();
//               if (!imgContainer.classList.contains('active')) {
//                   transitionBack(); // Reset all first
//                   centerImage(imgContainer);
//               } else {
//                   transitionBack(); // Deactivate if active
//               }
//           };

//           const img = document.createElement('img');
//           img.src = imagePath;
//           img.alt = "Loaded Image";

//           imgContainer.appendChild(img);
//           timeline.appendChild(imgContainer);
//       }
//   });
//}

function centerImage(element) {
  const rect = element.getBoundingClientRect();
  element.style.position = 'fixed';
  element.style.left = `${rect.left}px`;
  element.style.top = `${rect.top}px`;
  element.classList.add('active');

  // Use requestAnimationFrame to ensure the transition happens after positioning
  requestAnimationFrame(() => {
      element.style.transform = `translate(-50%, -50%) translate(${window.innerWidth/2 - rect.left - rect.width/2}px, ${window.innerHeight/2 - rect.top - rect.height/2}px) scale(3)`;
  });
}

function transitionBack() {
  const activeContainers = document.querySelectorAll('.image-container.active');
  activeContainers.forEach(container => {
      // Reset transformation to original size and position
      container.style.transform = 'translate(0, 0) scale(1)';
      // Wait for the transition to finish before removing fixed positioning
      container.addEventListener('transitionend', function resetPosition() {
          container.style.position = '';
          container.style.left = '';
          container.style.top = '';
          container.classList.remove('active');
          container.removeEventListener('transitionend', resetPosition);
      }, { once: true });
  });
}
