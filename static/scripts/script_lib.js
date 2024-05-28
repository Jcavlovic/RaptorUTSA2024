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
  
  window.onload = function() {
    fetchImages();
    setInterval(fetchImages, 500);
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.image-container')) {
            transitionBack();
        }
    });
  };

  
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

  function loadImages() {
    const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    const categories = Array.from(checkboxes).map(cb => cb.value);
    const queryString = categories.map(cat => `category=${cat}`).join('&');

    fetch(`/library_images?${queryString}`)
        .then(response => response.json())
        .then(data => {
            const gallery = document.getElementById('image-gallery');
            gallery.innerHTML = '';
            data.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = `/${image}`;
                imgElement.addEventListener('click', () => showImageModal(image));
                gallery.appendChild(imgElement);
            });
        });
}

function showImageModal(imageSrc) {
    const modal = document.getElementById('modal-overlay');
    const fullImage = document.getElementById('full-size-image');
    fullImage.src = `/${imageSrc}`;
    modal.classList.add('visible'); // Make modal visible
    modal.onclick = () => {
        modal.classList.remove('visible'); // Hide modal on click
    };
}

window.onload = loadImages;
