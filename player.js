// පිටුව සම්පූර්ණයෙන් ලෝඩ් වූ පසු ක්‍රියාත්මක වේ
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('audio-player');
    
    // ප්ලේයර් එක සඳහා වන කන්ටේනරය පිටුවේ තිබේදැයි පරීක්ෂා කරයි
    if (!container) return;

    // HTML ටැග් එකෙන් ඕඩියෝ ලිපිනය සහ මාතෘකාව ලබා ගනී
    const audioSrc = container.getAttribute('data-src') || 'sri-lanka-ocean-frontier-documentary.mp3';
    const audioTitle = container.getAttribute('data-title') || 'Audio Overview: The Blue Frontier';
    const audioFilename = audioSrc.split('/').pop();

    // ප්ලේයර් එකට අදාළ සම්පූර්ණ HTML ව්‍යුහය ස්වයංක්‍රීයව ඇතුළත් කරයි (SVG වෙනුවට Unicode අයිකන භාවිතා කර ඇත)
    container.innerHTML = `
        <div class="mt-8 mb-16 p-6 bg-white border border-stone-200 rounded shadow-sm max-w-xl mx-auto fade-in">
            <div class="flex items-center space-x-4">
                <button id="audio-play-btn" class="w-14 h-14 flex items-center justify-center rounded-full bg-[#5a7d7c] text-white hover:bg-stone-800 transition focus:outline-none shadow-sm text-lg">
                    <span id="play-icon" class="ml-1">&#9654;</span>
                    <span id="pause-icon" class="hidden">&#10074;&#10074;</span>
                </button>
                <div class="flex-1">
                    <h4 class="ui-font font-semibold text-stone-800 text-sm tracking-wide">${audioTitle}</h4>
                    <p class="text-xs text-stone-500 mt-0.5 font-light">${audioFilename}</p>
                    
                    <div class="flex items-center space-x-2 mt-3">
                        <span id="audio-current-time" class="text-[11px] text-stone-500 ui-font">0:00</span>
                        <input id="audio-progress" type="range" class="flex-1 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#5a7d7c]" value="0" min="0" max="100">
                        <span id="audio-duration" class="text-[11px] text-stone-500 ui-font">0:00</span>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between mt-4 pt-4 border-t border-stone-100 text-stone-500 text-xs">
                <div class="flex items-center space-x-1">
                    <span class="ui-font text-[11px] text-stone-400">Playback Speed:</span>
                    <select id="audio-speed" class="bg-stone-50 border border-stone-200 rounded px-1.5 py-0.5 focus:outline-none text-stone-700 ui-font text-[11px] cursor-pointer">
                        <option value="1.0">1.0x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2.0">2.0x</option>
                    </select>
                </div>

                <div class="flex items-center space-x-2">
                    <span class="text-stone-400 text-sm mr-1">&#128266;</span>
                    <input id="audio-volume" type="range" class="w-16 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#5a7d7c]" value="100" min="0" max="100">
                </div>
            </div>

            <audio id="main-audio" src="${audioSrc}" preload="metadata"></audio>
        </div>
    `;

    // අවශ්‍ය DOM මූලද්‍රව්‍ය හඳුනා ගැනීම
    const audio = document.getElementById('main-audio');
    const playBtn = document.getElementById('audio-play-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const progress = document.getElementById('audio-progress');
    const currentTimeEl = document.getElementById('audio-current-time');
    const durationEl = document.getElementById('audio-duration');
    const volume = document.getElementById('audio-volume');
    const speed = document.getElementById('audio-speed');

    // Play / Pause ක්‍රියාවලිය පාලනය
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(error => console.log("Audio play blocked or failed:", error));
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        } else {
            audio.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    });

    // කාලය පෙන්වන ආකාරය සකස් කිරීම (MM:SS)
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // ඕඩියෝ එකේ සම්පූර්ණ කාලය සටහන් කිරීම
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
        progress.max = audio.duration;
    });

    // ධාවනය වන විට ප්‍රගති තීරුව සහ කාලය යාවත්කාලීන කිරීම
    audio.addEventListener('timeupdate', () => {
        if (!progress.classList.contains('user-seeking')) {
            progress.value = audio.currentTime;
        }
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    // පරිශීලකයා ප්‍රගති තීරුව එහා මෙහා කරන විට
    progress.addEventListener('input', () => {
        progress.classList.add('user-seeking');
    });

    progress.addEventListener('change', () => {
        audio.currentTime = progress.value;
        progress.classList.remove('user-seeking');
    });

    // ශබ්ද පරිමාව වෙනස් කිරීම
    volume.addEventListener('input', () => {
        audio.volume = volume.value / 100;
    });

    // ධාවන වේගය වෙනස් කිරීම
    speed.addEventListener('change', () => {
        audio.playbackRate = parseFloat(speed.value);
    });

    // ධාවනය අවසන් වූ පසු නැවත මුල් තත්වයට පත් කිරීම
    audio.addEventListener('ended', () => {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        progress.value = 0;
        currentTimeEl.textContent = '0:00';
    });
});