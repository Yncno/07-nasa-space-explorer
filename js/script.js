// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// NASA APOD API key
const API_KEY = '51oxV5dPuuf4h3bnZnMGo6ibWW5u5qrSOOk7aJME';

// Function to fetch data from NASA's APOD API
async function fetchAPODData(startDate, endDate) {
    // Construct the API URL with the selected date range
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

    try {
        // Fetch data from the API
        const response = await fetch(apiUrl);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Log the data to the console for now
        console.log('Fetched APOD data:', data);

        // Return the data for future use
        return data;
    } catch (error) {
        // Log any errors to the console
        console.error('Error fetching APOD data:', error);
    }
}

// Function to open the modal with the selected image's details
function openModal(image) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalExplanation = document.getElementById('modalExplanation');

    // Populate the modal with the image's details
    modalImage.src = image.url;
    modalImage.alt = image.title;
    modalTitle.textContent = image.title;
    modalDate.textContent = `Date: ${image.date}`;
    modalExplanation.textContent = image.explanation;

    // Show the modal
    modal.style.display = 'flex';
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Add event listener to close the modal when the close button is clicked
document.getElementById('closeModal').addEventListener('click', closeModal);

// Add event listener to close the modal when clicking outside the modal content
document.getElementById('modal').addEventListener('click', (event) => {
    const modalContent = document.querySelector('.modal-content');
    if (!modalContent.contains(event.target)) {
        closeModal();
    }
});

// Function to display the gallery of space images or videos
function displayGallery(images) {
    // Find the gallery container on the page
    const gallery = document.getElementById('gallery');

    // Clear any existing content in the gallery
    gallery.innerHTML = '';

    // Loop through the images and create elements for each one
    images.forEach(image => {
        // Create a container for each entry
        const imageContainer = document.createElement('div');
        imageContainer.className = 'gallery-item';

        if (image.media_type === 'image') {
            // Handle image entries
            const img = document.createElement('img');
            img.src = image.url;
            img.alt = image.title;

            const title = document.createElement('h3');
            title.textContent = image.title;

            const date = document.createElement('p');
            date.textContent = `Date: ${image.date}`;

            // Add click event listener to open the modal
            imageContainer.addEventListener('click', () => openModal(image));

            // Append the image, title, and date to the container
            imageContainer.appendChild(img);
            imageContainer.appendChild(title);
            imageContainer.appendChild(date);
        } else if (image.media_type === 'video') {
            // Handle video entries
            const videoLink = document.createElement('a');
            videoLink.href = image.url;
            videoLink.target = '_blank';
            videoLink.textContent = 'Watch Video';
            videoLink.style.color = '#0b3d91';
            videoLink.style.textDecoration = 'none';
            videoLink.style.fontWeight = 'bold';

            const title = document.createElement('h3');
            title.textContent = image.title;

            const date = document.createElement('p');
            date.textContent = `Date: ${image.date}`;

            // Append the video link, title, and date to the container
            imageContainer.appendChild(videoLink);
            imageContainer.appendChild(title);
            imageContainer.appendChild(date);
        }

        // Append the container to the gallery
        gallery.appendChild(imageContainer);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Example usage: Fetch data when a button is clicked
    const fetchButton = document.getElementById('fetchImages');
    fetchButton.addEventListener('click', async () => {
        // Get the selected start and end dates
        const startDate = startInput.value;
        const endDate = endInput.value;

        // Validate the date inputs
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.');
            return;
        }

        // Display a loading message
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '<p>Loading space photos…</p>';

        // Fetch the APOD data
        const images = await fetchAPODData(startDate, endDate);

        // Display the gallery with the fetched images
        if (images) {
            displayGallery(images);
        }
    });
});
