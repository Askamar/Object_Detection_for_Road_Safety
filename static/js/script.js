document.addEventListener('DOMContentLoaded', () => {
    // ─── CLOCK ───
    const clockElement = document.getElementById('clock');
    function updateTime() {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateTime, 1000);
    updateTime();

    // ─── DOM ELEMENTS ───
    const btnLive = document.getElementById('btn-live');
    const btnUpload = document.getElementById('btn-upload');
    const liveView = document.getElementById('live-view');
    const uploadView = document.getElementById('upload-view');
    const pageTitle = document.getElementById('page-title');
    const modeTag = document.getElementById('mode-tag');

    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    const latencyLabel = document.getElementById('latency-label');
    const latencyVal = document.getElementById('latency-val');
    const detectionCountElem = document.getElementById('detection-count');
    const objCountCard = document.getElementById('obj-count-card');
    const fpsVal = document.getElementById('fps-val');

    const eventLog = document.getElementById('event-log');
    const clearLogBtn = document.getElementById('clear-log');
    
    // UI State
    let isLiveMode = true;
    let fakeDataInterval = null;
    let fakeLogInterval = null;

    // ─── INIT CHARTS ───
    const confBars = document.querySelectorAll('.conf-bar');
    function animateBars() {
        confBars.forEach(bar => {
            const target = bar.getAttribute('data-target');
            // Randomize slightly around target
            const flux = Math.floor(Math.random() * 8) - 4;
            const newPct = Math.max(0, Math.min(100, parseInt(target) + flux));
            bar.style.width = newPct + '%';
            bar.parentElement.nextElementSibling.textContent = newPct + '%';
        });
    }

    // ─── MODE SWITCHING ───
    function setMode(type) {
        if (type === 'live' && !isLiveMode) {
            isLiveMode = true;
            btnLive.classList.add('active');
            btnUpload.classList.remove('active');
            liveView.classList.remove('hidden-view');
            uploadView.classList.add('hidden-view');
            
            pageTitle.innerHTML = '<i class="ph ph-video-camera"></i><span>Live Edge Stream</span>';
            modeTag.textContent = 'Real-Time Detection';
            modeTag.classList.remove('violet-tag');
            
            statusDot.classList.remove('dot-violet');
            statusText.classList.remove('violet-text');
            statusText.textContent = 'Live Active';

            latencyLabel.textContent = 'Latency';
            latencyVal.textContent = '~18ms';
            detectionCountElem.textContent = '...';
            objCountCard.textContent = '...';

            startTelemetry();
            addLogEntry('setup', 'Switched to Live Streaming Mode');
            
        } else if (type === 'upload' && isLiveMode) {
            isLiveMode = false;
            btnUpload.classList.add('active');
            btnLive.classList.remove('active');
            uploadView.classList.remove('hidden-view');
            liveView.classList.add('hidden-view');
            
            pageTitle.innerHTML = '<i class="ph ph-image-square"></i><span>Image Analysis</span>';
            modeTag.textContent = 'Static Mode';
            modeTag.classList.add('violet-tag');
            
            statusDot.classList.add('dot-violet');
            statusText.classList.add('violet-text');
            statusText.textContent = 'Static Ready';

            latencyLabel.textContent = 'File';
            latencyVal.textContent = 'Image';
            detectionCountElem.textContent = '-';
            objCountCard.textContent = '-';
            fpsVal.textContent = 'N/A';
            
            resetBars();
            stopTelemetry();
            addLogEntry('upload', 'Switched to Static Image Mode');
        }
    }

    btnLive.addEventListener('click', () => setMode('live'));
    btnUpload.addEventListener('click', () => setMode('upload'));

    function resetBars() {
        confBars.forEach(bar => {
            bar.style.width = '0%';
            bar.parentElement.nextElementSibling.textContent = '0%';
        });
    }

    // ─── TELEMETRY & LOGS ───
    const fakeEvents = [
        { type: 'detect', msg: 'Vehicle identified in lane 2' },
        { type: 'detect', msg: 'Pedestrian detected near crossing' },
        { type: 'setup',  msg: 'Calibrating depth boundaries' },
        { type: 'detect', msg: 'Traffic sign locked' }
    ];

    function addLogEntry(type, msg) {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        const li = document.createElement('li');
        li.className = `log-item log-${type}`;
        li.innerHTML = `<span class="log-time">${time}</span> ${msg}`;
        eventLog.insertBefore(li, eventLog.firstChild);
        
        // limit
        if (eventLog.children.length > 30) {
            eventLog.removeChild(eventLog.lastChild);
        }
    }

    clearLogBtn.addEventListener('click', () => {
        eventLog.innerHTML = `<li class="log-item log-setup"><span class="log-time">${new Date().toLocaleTimeString('en-US', { hour12: false })}</span> Log cleared by user</li>`;
    });

    function startTelemetry() {
        if (!fakeDataInterval) {
            fakeDataInterval = setInterval(() => {
                const count = Math.floor(Math.random() * 6);
                detectionCountElem.textContent = count;
                objCountCard.textContent = count;
                
                const fps = 28 + Math.floor(Math.random() * 5);
                fpsVal.textContent = `~${fps}`;
                
                animateBars();
            }, 1800);
        }
        if (!fakeLogInterval) {
            fakeLogInterval = setInterval(() => {
                if (Math.random() > 0.4) {
                    const evt = fakeEvents[Math.floor(Math.random() * fakeEvents.length)];
                    addLogEntry(evt.type, evt.msg);
                }
            }, 4000);
        }
        animateBars();
    }

    function stopTelemetry() {
        clearInterval(fakeDataInterval);
        clearInterval(fakeLogInterval);
        fakeDataInterval = null;
        fakeLogInterval = null;
    }

    // Init
    startTelemetry();

    // ─── UPLOAD FUNCTIONALITY ───
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const resultArea = document.getElementById('result-area');
    const uploadedResultImg = document.getElementById('uploaded-result-img');
    const resetUploadBtn = document.getElementById('reset-upload-btn');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => dropZone.addEventListener(evt, e => e.preventDefault()));
    
    ['dragenter', 'dragover'].forEach(evt => dropZone.addEventListener(evt, () => dropZone.classList.add('dragover')));
    ['dragleave', 'drop'].forEach(evt => dropZone.addEventListener(evt, () => dropZone.classList.remove('dragover')));

    dropZone.addEventListener('drop', (e) => {
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processUpload(e.dataTransfer.files[0]);
        }
    });

    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) processUpload(e.target.files[0]);
    });

    resetUploadBtn.addEventListener('click', () => {
        resultArea.classList.add('hidden-view');
        dropZone.style.display = 'flex';
        detectionCountElem.textContent = '-';
        objCountCard.textContent = '-';
        latencyVal.textContent = 'Image';
        resetBars();
    });

    function processUpload(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPG, PNG, etc).');
            return;
        }

        addLogEntry('upload', `Uploading file: ${file.name}...`);
        statusText.textContent = 'Processing...';

        const formData = new FormData();
        formData.append('file', file);
        const startTime = Date.now();
        
        dropZone.style.opacity = '0.5';

        fetch('/upload_image', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            dropZone.style.opacity = '1';
            statusText.textContent = 'Static Ready';
            if (data.success) {
                dropZone.style.display = 'none';
                resultArea.classList.remove('hidden-view');
                uploadedResultImg.src = data.image_url;

                const timeTaken = Date.now() - startTime;
                latencyVal.textContent = `${timeTaken}ms`;
                detectionCountElem.textContent = data.detections;
                objCountCard.textContent = data.detections;
                
                addLogEntry('detect', `Found ${data.detections} objects in uploaded image.`);
                
                // Show some fake confidence data
                animateBars();
            } else {
                addLogEntry('alert', `Upload error: ${data.error}`);
            }
        })
        .catch(err => {
            dropZone.style.opacity = '1';
            statusText.textContent = 'Static Ready';
            addLogEntry('alert', 'Network error during upload');
        })
        .finally(() => {
            fileInput.value = '';
        });
    }
});
