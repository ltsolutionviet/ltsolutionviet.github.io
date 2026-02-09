/**
 * Common JavaScript for IELTS Exercises
 * Handles radio button selection and audio player controls
 */

document.addEventListener('DOMContentLoaded', function () {

    // ==================== RADIO BUTTON SELECTION ====================

    var answerLis = document.querySelectorAll('form ol ol li');

    // Function to update selected state
    function updateSelected(radioInput) {
        // Remove selected class from all options in the same question
        var questionLi = radioInput.closest('form > ol > li');
        if (questionLi) {
            var allOptions = questionLi.querySelectorAll('form ol ol li');
            allOptions.forEach(function (option) {
                option.classList.remove('selected');
            });
        }

        // Add selected class to the parent li of checked radio
        var parentLi = radioInput.closest('li');
        if (parentLi && radioInput.checked) {
            parentLi.classList.add('selected');
        }
    }

    // Handle clicks on li elements
    answerLis.forEach(function (li) {
        li.addEventListener('click', function (e) {
            // Only trigger if not clicking directly on radio button
            if (e.target.tagName !== 'INPUT') {
                var radio = this.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    updateSelected(radio);
                }
            }
        });

        // Handle direct radio button clicks
        var radio = li.querySelector('input[type="radio"]');
        if (radio) {
            radio.addEventListener('change', function () {
                updateSelected(this);
            });

            // Initialize selected state on load
            if (radio.checked) {
                updateSelected(radio);
            }
        }
    });


    // ==================== AUDIO PLAYER CONTROLS ====================

    // Support multiple audio players on the same page
    const audioPlayers = document.querySelectorAll('.audio-player');

    audioPlayers.forEach(function (playerContainer) {
        const audio = playerContainer.querySelector('audio');
        const playBtn = playerContainer.querySelector('.play-btn');
        const playIcon = playerContainer.querySelector('.play-icon');
        const pauseIcon = playerContainer.querySelector('.pause-icon');
        const progressBar = playerContainer.querySelector('.progress-bar');
        const progressFill = playerContainer.querySelector('.progress-fill');
        const progressHandle = playerContainer.querySelector('.progress-handle');
        const currentTimeEl = playerContainer.querySelector('.current-time') || playerContainer.querySelector('#currentTime');
        const durationEl = playerContainer.querySelector('.duration') || playerContainer.querySelector('#duration');

        if (!audio || !playBtn) return; // Skip if elements not found

        // Format time helper
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Update duration when metadata loads
        audio.addEventListener('loadedmetadata', function () {
            durationEl.textContent = formatTime(audio.duration);
        });

        // Play/Pause toggle
        playBtn.addEventListener('click', function () {
            if (audio.paused) {
                audio.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                audio.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        });

        // Update progress bar and time
        audio.addEventListener('timeupdate', function () {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = progress + '%';
            progressHandle.style.left = progress + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
        });

        // Seek functionality
        progressBar.addEventListener('click', function (e) {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            audio.currentTime = percentage * audio.duration;
        });

        // Reset when audio ends
        audio.addEventListener('ended', function () {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            progressFill.style.width = '0%';
            progressHandle.style.left = '0%';
        });
    });
});
