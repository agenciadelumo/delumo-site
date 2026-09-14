/**
 * HeyGen SCORM Wrapper
 * Language Manager for SCORM Video Player
 * Handles saving and loading language preferences using SCORM suspend_data and localStorage
 */

var heygenScormWrapper = (function () {
  'use strict';

  var STORAGE_KEY = 'heygen_scorm_video_data';
  var languageConfig = null;
  var speedConfig = null;
  var lessonId = null; // Will be set during initialization
  var interactiveCheckpointCache = null;
  var interactiveCheckpointDraftRef = null;
  var interactiveCheckpointSegmentsRef = null;

  function hasWindowObject() {
    return typeof window !== 'undefined';
  }

  function getInteractiveDraft() {
    if (!hasWindowObject()) {
      return null;
    }
    return window.DRAFT_DATA || null;
  }

  function getInteractiveSegments() {
    if (!hasWindowObject()) {
      return null;
    }
    return window.SEGMENT_METADATA || null;
  }

  function getInteractiveVideoSdk() {
    if (!hasWindowObject()) {
      return null;
    }
    return window.InteractiveVideo || null;
  }

  function getInteractiveResolution(draft) {
    var videoOutput = draft && draft.video_output ? draft.video_output : {};
    var resolution = videoOutput.resolution || {};
    return {
      width: resolution.width || 1920,
      height: resolution.height || 1080,
    };
  }

  function sceneHasQuiz(sceneElement, draft) {
    if (
      !sceneElement ||
      sceneElement.type !== 'scene' ||
      !sceneElement.content ||
      !sceneElement.content.elements
    ) {
      return false;
    }

    return sceneElement.content.elements.some(function (elementId) {
      var element = draft.text_draft.visual.elements[elementId];
      if (!element || element.type !== 'interactive' || !element.content) {
        return false;
      }

      return (
        element.content.interactivity_type === 'component' &&
        element.content.component_id === 'interactive_quiz'
      );
    });
  }

  function getInteractiveCheckpointCache() {
    var draft = getInteractiveDraft();
    var segments = getInteractiveSegments();
    var sdk = getInteractiveVideoSdk();

    if (!draft || !sdk || !sdk.convertDraftToInteractive) {
      return null;
    }

    if (
      interactiveCheckpointDraftRef === draft &&
      interactiveCheckpointSegmentsRef === segments &&
      interactiveCheckpointCache
    ) {
      return interactiveCheckpointCache;
    }

    var converted = sdk.convertDraftToInteractive(draft, getInteractiveResolution(draft));
    var sceneTimelineMap = converted && converted.sceneTimelineMap ? converted.sceneTimelineMap : {};
    var scenesBySegment = {};

    if (segments && segments.length > 0) {
      segments.forEach(function (segment) {
        var segmentSceneIds = segment.sceneIds || [];
        var firstSceneId = segmentSceneIds.length > 0 ? segmentSceneIds[0] : null;
        var firstTimeline = firstSceneId ? sceneTimelineMap[firstSceneId] : null;
        var segmentGlobalStart = firstTimeline ? firstTimeline.start : 0;

        scenesBySegment[segment.segmentId] = [];

        segmentSceneIds.forEach(function (sceneId) {
          var timeline = sceneTimelineMap[sceneId];
          var sceneElement = draft.text_draft.visual.elements[sceneId];
          if (!timeline || !sceneHasQuiz(sceneElement, draft)) {
            return;
          }

          scenesBySegment[segment.segmentId].push({
            sceneId: sceneId,
            start: timeline.start - segmentGlobalStart,
            end: timeline.end - segmentGlobalStart,
          });
        });
      });
    } else {
      // No segments — build flat quiz scene list from draft layout
      var layout = (draft.text_draft && draft.text_draft.visual && draft.text_draft.visual.layout) || [];
      var flatScenes = [];
      layout.forEach(function (sceneId) {
        var timeline = sceneTimelineMap[sceneId];
        var sceneElement = draft.text_draft.visual.elements[sceneId];
        if (!timeline || !sceneHasQuiz(sceneElement, draft)) {
          return;
        }
        flatScenes.push({ sceneId: sceneId, start: timeline.start, end: timeline.end });
      });
      if (flatScenes.length > 0) {
        scenesBySegment['__flat__'] = flatScenes;
      }
    }

    interactiveCheckpointDraftRef = draft;
    interactiveCheckpointSegmentsRef = segments;
    interactiveCheckpointCache = {
      scenesBySegment: scenesBySegment,
    };

    return interactiveCheckpointCache;
  }

  function getInteractiveCheckpointTime(currentTime, segmentId) {
    if (typeof currentTime !== 'number' || !isFinite(currentTime) || currentTime < 0) {
      return 0;
    }

    var cache = getInteractiveCheckpointCache();
    if (!cache || !cache.scenesBySegment) {
      return currentTime;
    }

    var quizScenes = segmentId ? cache.scenesBySegment[segmentId] : cache.scenesBySegment['__flat__'];
    if (!quizScenes) {
      return currentTime;
    }

    for (var i = 0; i < quizScenes.length; i++) {
      var quizScene = quizScenes[i];
      if (currentTime >= quizScene.start && currentTime < quizScene.end) {
        return quizScene.start;
      }
    }

    return currentTime;
  }

  /**
   * Save language preference
   * Storage format:
   *   - SCORM 2004: cmi.learner_preference.language (cross-lesson)
   *   - SCORM 1.2: localStorage only (no SCORM storage)
   *   - localStorage: Simple key-value
   * @param {string} languageCode - Language code (e.g., 'zh-cn', 'ja-jp')
   * @param {object} scormAPI - Optional SCORM API object
   */
  function saveLanguage(languageCode, scormAPI) {
    console.log('heygenScormWrapper: Saving language:', languageCode);

    // Try SCORM 2004 learner preference (cross-lesson)
    if (scormAPI && scormAPI.connection && scormAPI.connection.isActive) {
      try {
        var success = scormAPI.set('cmi.learner_preference.language', languageCode);
        if (success) {
          scormAPI.save();
          console.log('heygenScormWrapper: Saved to SCORM 2004 cmi.learner_preference.language');
        }
      } catch (e) {
        console.log(
          'heygenScormWrapper: SCORM 2004 not available (SCORM 1.2 has no cross-lesson preferences)',
        );
      }
    }

    // Always save to localStorage (works for both SCORM 1.2 and 2004)
    try {
      localStorage.setItem(STORAGE_KEY + '_lang', languageCode);
      console.log('heygenScormWrapper: Saved language to localStorage');
    } catch (e) {
      console.warn('heygenScormWrapper: Failed to save language to localStorage:', e);
    }
  }

  /**
   * Load language preference
   * Priority: SCORM 2004 > localStorage > default
   * Storage format:
   *   - SCORM 2004: cmi.learner_preference.language (cross-lesson)
   *   - SCORM 1.2: localStorage only (no SCORM storage)
   *   - localStorage: Simple key-value
   * @param {object} scormAPI - Optional SCORM API object
   * @returns {string} Language code
   */
  function loadLanguage(scormAPI) {
    var languageCode = null;

    // Try SCORM 2004 learner preference (cross-lesson)
    if (scormAPI && scormAPI.connection && scormAPI.connection.isActive) {
      try {
        languageCode = scormAPI.get('cmi.learner_preference.language');
        if (languageCode && languageCode !== '') {
          console.log(
            'heygenScormWrapper: Loaded language from SCORM 2004 cmi.learner_preference.language:',
            languageCode,
          );
          return languageCode;
        }
      } catch (e) {
        console.log(
          'heygenScormWrapper: SCORM 2004 not available (SCORM 1.2 has no cross-lesson preferences)',
        );
      }
    }

    // Fallback to localStorage
    try {
      languageCode = localStorage.getItem(STORAGE_KEY + '_lang');
      if (languageCode) {
        console.log('heygenScormWrapper: Loaded language from localStorage:', languageCode);
        return languageCode;
      }
    } catch (e) {
      console.warn('heygenScormWrapper: Failed to load language from localStorage:', e);
    }

    // Return default from config
    var defaultLang = languageConfig ? languageConfig.defaultLanguage : 'zh-cn';
    console.log('heygenScormWrapper: Using default language:', defaultLang);
    return defaultLang;
  }

  /**
   * Get video filename for a language code
   * @param {string} languageCode - Language code
   * @returns {string} Video filename
   */
  function getVideoFile(languageCode) {
    if (!languageConfig || !languageConfig.languages) {
      return 'video_' + languageCode + '.mp4';
    }

    for (var i = 0; i < languageConfig.languages.length; i++) {
      if (languageConfig.languages[i].code === languageCode) {
        return languageConfig.languages[i].videoFile;
      }
    }

    // Return first language as default
    return languageConfig.languages[0].videoFile;
  }

  /**
   * Extract language code from video filename
   * @param {string} videoFile - Video filename (e.g., 'video_zh-cn.mp4')
   * @returns {string} Language code
   */
  function getLanguageFromFile(videoFile) {
    if (!languageConfig || !languageConfig.languages) {
      return languageConfig ? languageConfig.defaultLanguage : 'zh-cn';
    }

    for (var i = 0; i < languageConfig.languages.length; i++) {
      if (languageConfig.languages[i].videoFile === videoFile) {
        return languageConfig.languages[i].code;
      }
    }

    return languageConfig.defaultLanguage;
  }

  /**
   * Set the language configuration
   * @param {object} config - Language configuration object with defaultLanguage and languages array
   */
  function setConfig(config) {
    languageConfig = config;
    console.log('heygenScormWrapper: Config set:', config);
  }

  /**
   * Populate the language selector dropdown with options from config
   * @param {HTMLSelectElement} selectElement - Language select element
   */
  function populateLanguageSelector(selectElement) {
    if (!languageConfig || !languageConfig.languages) {
      console.warn('heygenScormWrapper: No language config available');
      return;
    }

    selectElement.innerHTML = ''; // Clear existing options
    languageConfig.languages.forEach(function (lang) {
      var option = document.createElement('option');
      option.value = lang.videoFile;
      option.textContent = lang.label;
      option.setAttribute('data-lang-code', lang.code);
      selectElement.appendChild(option);
    });

    console.log(
      'heygenScormWrapper: Populated selector with',
      languageConfig.languages.length,
      'languages',
    );
  }

  /**
   * Setup language change handler
   * @param {HTMLVideoElement} videoElement - Video element
   * @param {HTMLSelectElement} selectElement - Language select element
   * @param {object} scormAPI - Optional SCORM API object
   */
  function setupLanguageChangeHandler(videoElement, selectElement, scormAPI) {
    selectElement.addEventListener('change', function () {
      var currentTime = videoElement.currentTime;
      var wasPaused = videoElement.paused;

      // Get language code from the selected option's data attribute
      var selectedOption = selectElement.options[selectElement.selectedIndex];
      var languageCode = selectedOption.getAttribute('data-lang-code');

      // Save the language preference (will use localStorage if SCORM unavailable)
      saveLanguage(languageCode, scormAPI);

      var nextUrl = selectElement.value;
      videoElement.src = nextUrl;
      var sourceEl = document.getElementById('videoSource');
      if (sourceEl) {
        sourceEl.src = nextUrl;
      }
      if (typeof videoElement.load === 'function') {
        videoElement.load();
      }
      console.log('Language switched to:', languageCode, '(' + nextUrl + ')');

      // Wait for the video to load before seeking
      videoElement.addEventListener('loadedmetadata', function onLoad() {
        console.log('[SEEK] Language switch - restoring time to:', currentTime);
        videoElement.currentTime = currentTime;
        if (!wasPaused) {
          videoElement.play();
        }
        // Remove the event listener after it's been used
        videoElement.removeEventListener('loadedmetadata', onLoad);
      });
    });

    console.log('heygenScormWrapper: Language change handler setup complete');
  }

  /**
   * Initialize language manager and restore saved language
   * @param {HTMLVideoElement} videoElement - Video element
   * @param {HTMLSelectElement} selectElement - Language select element
   * @param {object} scormAPI - Optional SCORM API object
   * @param {object} config - Language configuration object
   */
  function init(videoElement, selectElement, scormAPI, config) {
    console.log('heygenScormWrapper: Initializing...');

    // Set config
    if (config) {
      setConfig(config);
    }

    // Populate the dropdown
    populateLanguageSelector(selectElement);

    // Load saved language — URL comes from LANGUAGE_CONFIG (runtime fetch merges signed URLs per language).
    // Do not replace with window.__SCORM_RUNTIME_VIDEO_URL: that global is the primary/default stream from
    // fetch time (language select not populated yet) and would override the learner's persisted choice.
    var savedLanguage = loadLanguage(scormAPI);
    var videoFile = getVideoFile(savedLanguage);

    // Set the select dropdown value
    selectElement.value = videoFile;

    var sourceNode = document.getElementById('videoSource');
    videoElement.src = videoFile;
    if (sourceNode) {
      sourceNode.src = videoFile;
    }
    if (typeof videoElement.load === 'function') {
      videoElement.load();
    }

    // Setup change handler
    setupLanguageChangeHandler(videoElement, selectElement, scormAPI);

    console.log('heygenScormWrapper: Initialized with language:', savedLanguage);

    return savedLanguage;
  }

  /**
   * Save playback speed preference
   * Storage format:
   *   - SCORM 2004: cmi.learner_preference.delivery_speed (cross-lesson)
   *   - SCORM 1.2: localStorage only (no SCORM storage)
   *   - localStorage: Simple key-value
   * @param {number} speed - Playback speed (e.g., 0.5, 1.0, 1.5, 2.0)
   * @param {object} scormAPI - Optional SCORM API object
   */
  function savePlaybackSpeed(speed, scormAPI) {
    console.log('heygenScormWrapper: Saving playback speed:', speed);

    // Try SCORM 2004 learner preference (cross-lesson)
    if (scormAPI && scormAPI.connection && scormAPI.connection.isActive) {
      try {
        var success = scormAPI.set('cmi.learner_preference.delivery_speed', speed.toString());
        if (success) {
          scormAPI.save();
          console.log(
            'heygenScormWrapper: Saved playback speed to SCORM 2004 cmi.learner_preference.delivery_speed',
          );
        }
      } catch (e) {
        console.log(
          'heygenScormWrapper: SCORM 2004 not available (SCORM 1.2 has no cross-lesson preferences)',
        );
      }
    }

    // Always save to localStorage (works for both SCORM 1.2 and 2004)
    try {
      localStorage.setItem(STORAGE_KEY + '_speed', speed.toString());
      console.log('heygenScormWrapper: Saved playback speed to localStorage');
    } catch (e) {
      console.warn('heygenScormWrapper: Failed to save playback speed to localStorage:', e);
    }
  }

  /**
   * Load playback speed preference
   * Priority: SCORM 2004 > localStorage > default
   * Storage format:
   *   - SCORM 2004: cmi.learner_preference.delivery_speed (cross-lesson)
   *   - SCORM 1.2: localStorage only (no SCORM storage)
   *   - localStorage: Simple key-value
   * @param {object} scormAPI - Optional SCORM API object
   * @returns {number} Playback speed
   */
  function loadPlaybackSpeed(scormAPI) {
    var speed = null;

    // Try SCORM 2004 learner preference (cross-lesson)
    if (scormAPI && scormAPI.connection && scormAPI.connection.isActive) {
      try {
        speed = scormAPI.get('cmi.learner_preference.delivery_speed');
        if (speed && speed !== '') {
          console.log(
            'heygenScormWrapper: Loaded playback speed from SCORM 2004 cmi.learner_preference.delivery_speed:',
            speed,
          );
          return parseFloat(speed);
        }
      } catch (e) {
        console.log(
          'heygenScormWrapper: SCORM 2004 not available (SCORM 1.2 has no cross-lesson preferences)',
        );
      }
    }

    // Fallback to localStorage
    try {
      speed = localStorage.getItem(STORAGE_KEY + '_speed');
      if (speed) {
        console.log('heygenScormWrapper: Loaded playback speed from localStorage:', speed);
        return parseFloat(speed);
      }
    } catch (e) {
      console.warn('heygenScormWrapper: Failed to load playback speed from localStorage:', e);
    }

    // Return default
    var defaultSpeed = speedConfig ? speedConfig.defaultSpeed : 1.0;
    console.log('heygenScormWrapper: Using default playback speed:', defaultSpeed);
    return defaultSpeed;
  }

  /**
   * Populate speed selector dropdown
   * @param {HTMLSelectElement} selectElement - Speed select element
   * @param {object} config - Speed configuration
   */
  function populateSpeedSelector(selectElement, config) {
    if (!config || !config.speeds) {
      console.warn('heygenScormWrapper: No speed config available');
      return;
    }

    speedConfig = config;

    selectElement.innerHTML = '';
    config.speeds.forEach(function (speedOption) {
      var option = document.createElement('option');
      option.value = speedOption.value;
      option.textContent = speedOption.label;
      selectElement.appendChild(option);
    });

    console.log(
      'heygenScormWrapper: Populated speed selector with',
      config.speeds.length,
      'options',
    );
  }

  /**
   * Setup playback speed change handler
   * @param {HTMLVideoElement} videoElement - Video element
   * @param {HTMLSelectElement} selectElement - Speed select element
   * @param {object} scormAPI - Optional SCORM API object
   */
  function setupSpeedChangeHandler(videoElement, selectElement, scormAPI) {
    var isUpdatingFromDropdown = false;

    // Handle changes from our custom dropdown
    selectElement.addEventListener('change', function () {
      var speed = parseFloat(selectElement.value);
      isUpdatingFromDropdown = true;
      videoElement.playbackRate = speed;
      isUpdatingFromDropdown = false;
      console.log('[SPEED] Playback speed changed via dropdown to:', speed);
    });

    // Handle changes from native video controls (ratechange event)
    // This will fire for both dropdown changes and native control changes
    videoElement.addEventListener('ratechange', function () {
      var speed = videoElement.playbackRate;

      // Update our dropdown to match (only needed for native control changes)
      if (!isUpdatingFromDropdown) {
        selectElement.value = speed;
        console.log('Playback speed changed via native controls to:', speed);
      }

      // Save the preference (happens for all changes)
      savePlaybackSpeed(speed, scormAPI);
    });

    console.log('heygenScormWrapper: Speed change handler setup complete');
  }

  /**
   * Initialize playback speed control
   * @param {HTMLVideoElement} videoElement - Video element
   * @param {HTMLSelectElement} selectElement - Speed select element
   * @param {object} scormAPI - Optional SCORM API object
   * @param {object} config - Speed configuration
   */
  function initPlaybackSpeed(videoElement, selectElement, scormAPI, config) {
    console.log('heygenScormWrapper: Initializing playback speed control...');

    // Populate the dropdown
    populateSpeedSelector(selectElement, config);

    // Load saved speed
    var savedSpeed = loadPlaybackSpeed(scormAPI);

    // Set the select dropdown value
    selectElement.value = savedSpeed;

    // Set the video playback rate
    videoElement.playbackRate = savedSpeed;

    // Setup change handler
    setupSpeedChangeHandler(videoElement, selectElement, scormAPI);

    console.log('heygenScormWrapper: Playback speed initialized to:', savedSpeed);

    return savedSpeed;
  }

  /**
   * Save volume preference
   * Storage format:
   *   - SCORM 2004: cmi.learner_preference.audio_level (cross-lesson)
   *   - SCORM 1.2: localStorage only (no SCORM storage)
   *   - localStorage: Simple key-value
   * @param {number} volume - Volume level (0.0 to 1.0)
   * @param {object} scormAPI - Optional SCORM API object
   */
  function saveVolume(volume, scormAPI) {
    console.log('heygenScormWrapper: Saving volume:', volume);

    // Try SCORM 2004 learner preference (cross-lesson)
    if (scormAPI && scormAPI.connection && scormAPI.connection.isActive) {
      try {
        var success = scormAPI.set('cmi.learner_preference.audio_level', volume.toString());
        if (success) {
          scormAPI.save();
          console.log(
            'heygenScormWrapper: Saved volume to SCORM 2004 cmi.learner_preference.audio_level',
          );
        }
      } catch (e) {
        console.log(
          'heygenScormWrapper: SCORM 2004 not available (SCORM 1.2 has no cross-lesson preferences)',
        );
      }
    }

    // Always save to localStorage (works for both SCORM 1.2 and 2004)
    try {
      localStorage.setItem(STORAGE_KEY + '_volume', volume.toString());
      console.log('heygenScormWrapper: Saved volume to localStorage');
    } catch (e) {
      console.warn('heygenScormWrapper: Failed to save volume to localStorage:', e);
    }
  }

  /**
   * Load volume preference
   * Priority: SCORM 2004 > localStorage > default
   * Storage format:
   *   - SCORM 2004: cmi.learner_preference.audio_level (cross-lesson)
   *   - SCORM 1.2: localStorage only (no SCORM storage)
   *   - localStorage: Simple key-value
   * @param {object} scormAPI - Optional SCORM API object
   * @returns {number} Volume level (0.0 to 1.0)
   */
  function loadVolume(scormAPI) {
    var volume = null;

    // Try SCORM 2004 learner preference (cross-lesson)
    if (scormAPI && scormAPI.connection && scormAPI.connection.isActive) {
      try {
        volume = scormAPI.get('cmi.learner_preference.audio_level');
        if (volume && volume !== '') {
          console.log(
            'heygenScormWrapper: Loaded volume from SCORM 2004 cmi.learner_preference.audio_level:',
            volume,
          );
          return parseFloat(volume);
        }
      } catch (e) {
        console.log(
          'heygenScormWrapper: SCORM 2004 not available (SCORM 1.2 has no cross-lesson preferences)',
        );
      }
    }

    // Fallback to localStorage
    try {
      volume = localStorage.getItem(STORAGE_KEY + '_volume');
      if (volume) {
        console.log('heygenScormWrapper: Loaded volume from localStorage:', volume);
        return parseFloat(volume);
      }
    } catch (e) {
      console.warn('heygenScormWrapper: Failed to load volume from localStorage:', e);
    }

    // Return default volume (1.0 = 100%)
    console.log('heygenScormWrapper: Using default volume: 1.0');
    return 1.0;
  }

  /**
   * Initialize volume control (syncs with native video controls only)
   * @param {HTMLVideoElement} videoElement - Video element
   * @param {object} scormAPI - Optional SCORM API object
   */
  function initVolumeControl(videoElement, scormAPI) {
    console.log('heygenScormWrapper: Initializing volume control...');

    // Load saved volume
    var savedVolume = loadVolume(scormAPI);

    // Set the video volume
    videoElement.volume = savedVolume;

    // Listen for volume changes from native controls
    videoElement.addEventListener('volumechange', function () {
      var volume = videoElement.volume;
      saveVolume(volume, scormAPI);
      console.log('Volume changed to:', volume);
    });

    console.log('heygenScormWrapper: Volume initialized to:', savedVolume);

    return savedVolume;
  }

  /**
   * Save video current time (bookmark) - LESSON-SPECIFIC
   * Storage format:
   *   - SCORM 2004: cmi.location (lesson-specific, managed by LMS)
   *   - SCORM 1.2: cmi.core.lesson_location (lesson-specific, managed by LMS)
   *   - localStorage: heygen_scorm_progress_{lessonId} (lesson-specific key)
   * @param {number} currentTime - Current playback time in seconds
   * @param {object} scormAPI - Optional SCORM API object
   */
  function saveCurrentTime(currentTime, scormAPI, segmentId, calculatedProgress, checkpointTime) {
    var savedToScorm = false;
    var effectiveSegmentId = segmentId;

    if (!effectiveSegmentId && hasWindowObject() && window.currentSegmentId && getInteractiveDraft()) {
      effectiveSegmentId = window.currentSegmentId;
    }

    // For interactive videos with segments, save structured data
    if (effectiveSegmentId) {
      var progressData = loadInteractiveProgress(scormAPI);
      var normalizedCheckpoint =
        typeof checkpointTime === 'number' && isFinite(checkpointTime)
          ? checkpointTime
          : getInteractiveCheckpointTime(currentTime, effectiveSegmentId);

      // Update current segment progress
      progressData.currentSegment = effectiveSegmentId;
      progressData.segments[effectiveSegmentId] = Math.max(
        progressData.segments[effectiveSegmentId] || 0,
        currentTime
      );
      progressData.checkpoints[effectiveSegmentId] = normalizedCheckpoint;

      // Store calculated progress stats if provided (avoid recalculating every time)
      if (calculatedProgress) {
        progressData.calculatedProgress = calculatedProgress;
      }

      saveInteractiveProgress(progressData, scormAPI);
      return;
    }

    // Regular video: save simple timestamp (clamp to quiz scene start if applicable)
    var simpleCheckpointTime = getInteractiveDraft() ? getInteractiveCheckpointTime(currentTime) : currentTime;

    // Try SCORM if available (SCORM handles lesson-specific storage automatically)
    if (scormAPI && scormAPI.connection && scormAPI.connection.isActive) {
      // Try SCORM 2004 cmi.location first
      try {
        var success = scormAPI.set('cmi.location', simpleCheckpointTime.toString());
        if (success) {
          scormAPI.save();
          savedToScorm = true;
        }
      } catch (e) {
        // Try SCORM 1.2 cmi.core.lesson_location
        try {
          success = scormAPI.set('cmi.core.lesson_location', simpleCheckpointTime.toString());
          if (success) {
            scormAPI.save();
            savedToScorm = true;
          }
        } catch (e2) {
          // Both failed, will use localStorage
        }
      }
    }

    // Always save to localStorage as fallback (with lesson-specific key)
    if (lessonId) {
      try {
        var progressKey = STORAGE_KEY + '_progress_' + lessonId;
        localStorage.setItem(progressKey, simpleCheckpointTime.toString());
      } catch (e) {
        console.warn('heygenScormWrapper: Failed to save current time to localStorage:', e);
      }
    }
  }

  /**
   * Save interactive video progress (segment-based)
   */
  function saveInteractiveProgress(progressData, scormAPI) {
    var dataStr = JSON.stringify(progressData);

    // Try SCORM suspend_data
    if (scormAPI && scormAPI.connection && scormAPI.connection.isActive) {
      try {
        var success = scormAPI.set('cmi.suspend_data', dataStr);
        if (success) {
          scormAPI.save();
        }
      } catch (e) {
        // Fallback to localStorage
      }
    }

    // Always save to localStorage
    if (lessonId) {
      try {
        var progressKey = STORAGE_KEY + '_interactive_' + lessonId;
        localStorage.setItem(progressKey, dataStr);
      } catch (e) {
        console.warn('heygenScormWrapper: Failed to save interactive progress:', e);
      }
    }
  }

  /**
   * Load interactive video progress (segment-based)
   */
  function loadInteractiveProgress(scormAPI) {
    var progressData = null;

    // Try SCORM suspend_data
    if (scormAPI && scormAPI.connection && scormAPI.connection.isActive) {
      try {
        var dataStr = scormAPI.get('cmi.suspend_data');
        if (dataStr && dataStr !== '') {
          progressData = JSON.parse(dataStr);
        }
      } catch (e) {
        // Try localStorage
      }
    }

    // Try localStorage
    if (!progressData && lessonId) {
      try {
        var progressKey = STORAGE_KEY + '_interactive_' + lessonId;
        var dataStr = localStorage.getItem(progressKey);
        if (dataStr) {
          progressData = JSON.parse(dataStr);
        }
      } catch (e) {
        // Ignore
      }
    }

    // Return default structure if nothing found
    var normalizedProgress = progressData || {
      currentSegment: null,
      segments: {},  // segmentId -> maxTime
      checkpoints: {},  // segmentId -> resume checkpoint
    };

    if (!normalizedProgress.checkpoints) {
      normalizedProgress.checkpoints = {};
    }

    return normalizedProgress;
  }

  function getInteractiveResumeState(scormAPI) {
    var progressData = loadInteractiveProgress(scormAPI);
    var segmentId = progressData.currentSegment;
    var checkpointTime = 0;

    if (segmentId) {
      if (
        progressData.checkpoints &&
        typeof progressData.checkpoints[segmentId] === 'number' &&
        isFinite(progressData.checkpoints[segmentId])
      ) {
        checkpointTime = progressData.checkpoints[segmentId];
      } else if (
        progressData.segments &&
        typeof progressData.segments[segmentId] === 'number' &&
        isFinite(progressData.segments[segmentId])
      ) {
        checkpointTime = progressData.segments[segmentId];
      }

      checkpointTime = getInteractiveCheckpointTime(checkpointTime, segmentId);
    }

    return {
      segmentId: segmentId,
      checkpointTime: checkpointTime,
    };
  }

  /**
   * Load video current time (bookmark) - LESSON-SPECIFIC
   * Priority: SCORM 2004 > SCORM 1.2 > localStorage > default
   * Storage format:
   *   - SCORM 2004: cmi.location (lesson-specific, managed by LMS)
   *   - SCORM 1.2: cmi.core.lesson_location (lesson-specific, managed by LMS)
   *   - localStorage: heygen_scorm_progress_{lessonId} (lesson-specific key)
   * @param {object} scormAPI - Optional SCORM API object
   * @returns {number} Saved playback time in seconds (or 0 if none)
   */
  function loadCurrentTime(scormAPI) {
    var rawTime = 0;

    // Try SCORM if available (SCORM handles lesson-specific storage automatically)
    if (scormAPI && scormAPI.connection && scormAPI.connection.isActive) {
      // Try SCORM 2004 cmi.location first
      try {
        var scormTime = scormAPI.get('cmi.location');
        if (scormTime && scormTime !== '') {
          rawTime = parseFloat(scormTime);
          return getInteractiveDraft() ? getInteractiveCheckpointTime(rawTime) : rawTime;
        }
      } catch (e) {
        // Try SCORM 1.2 cmi.core.lesson_location
        try {
          scormTime = scormAPI.get('cmi.core.lesson_location');
          if (scormTime && scormTime !== '') {
            rawTime = parseFloat(scormTime);
            return getInteractiveDraft() ? getInteractiveCheckpointTime(rawTime) : rawTime;
          }
        } catch (e2) {
          // Both failed, will use localStorage
        }
      }
    }

    // Fallback to localStorage (with lesson-specific key)
    if (lessonId) {
      try {
        var progressKey = STORAGE_KEY + '_progress_' + lessonId;
        var stored = localStorage.getItem(progressKey);
        if (stored) {
          rawTime = parseFloat(stored);
          return getInteractiveDraft() ? getInteractiveCheckpointTime(rawTime) : rawTime;
        }
      } catch (e) {
        console.warn('heygenScormWrapper: Failed to load current time from localStorage:', e);
      }
    }

    // Return 0 (start from beginning)
    return 0;
  }

  /**
   * Initialize video progress tracking
   * @param {HTMLVideoElement} videoElement - Video element
   * @param {object} scormAPI - Optional SCORM API object
   * @param {number} saveInterval - How often to save (in seconds), default 5
   * @param {string} lessonIdentifier - Unique lesson identifier (for localStorage)
   */
  function initProgressTracking(videoElement, scormAPI, saveInterval, lessonIdentifier) {
    console.log('heygenScormWrapper: Initializing progress tracking...');

    // Set the lesson ID for localStorage (SCORM doesn't need it)
    if (lessonIdentifier) {
      lessonId = lessonIdentifier;
      console.log('heygenScormWrapper: Lesson ID set to:', lessonId);
    }

    var interval = saveInterval || 5; // Default: save every 5 seconds
    var lastSavedTime = -interval; // Initialize to force first save
    var lastSavedSegmentId = null;

    // Check if this is an interactive video
    var isInteractive = typeof window.DRAFT_DATA !== 'undefined';

    // For interactive videos, load segment progress and restart current segment
    if (isInteractive) {
      console.log('[SEEK] Interactive video detected - loading segment progress');

      var progressData = loadInteractiveProgress(scormAPI);
      console.log('[SEEK] Interactive progress:', progressData);

      // Don't restore position, let SDK handle segment loading
      // SDK will be notified of currentSegment via window.interactiveProgress
      window.interactiveProgress = progressData;
      window.interactiveResumeState = getInteractiveResumeState(scormAPI);

      // Continue to save logic below (will use segment-aware saving)
    } else {
      // Load saved time for non-interactive videos
      var savedTime = loadCurrentTime(scormAPI);

      // Set video to saved time when video is ready
      if (savedTime > 0) {
        var timeSet = false;

        var setVideoTime = function () {
          if (timeSet) return; // Prevent multiple calls
          timeSet = true;

          console.log('[SEEK] Restoring saved time:', savedTime);

          // Mark that we're seeking (for no-skip logic coordination)
          window.interactiveVideoSeeking = true;
          videoElement.currentTime = savedTime;

          // Reset flag after a short delay to allow the seek to complete
          setTimeout(function() {
            window.interactiveVideoSeeking = false;
          }, 100);

          console.log('[SEEK] Video time set to:', savedTime, 'actual:', videoElement.currentTime);
        };

        // Non-interactive video - proceed with time restoration
        if (videoElement.readyState >= 3) {
          // HAVE_FUTURE_DATA or higher - can start playing
          setVideoTime();
        } else {
          // Wait for the canplay event which fires when enough data is loaded
          videoElement.addEventListener(
            'canplay',
            function onCanPlay() {
              console.log('heygenScormWrapper: Video can play, setting time to:', savedTime);
              setVideoTime();
              videoElement.removeEventListener('canplay', onCanPlay);
            },
            { once: true },
          );
        }
      }
    }

    // Save progress periodically during playback
    videoElement.addEventListener('timeupdate', function () {
      // Don't save while resume seek or segment switch is in progress —
      // prevents overwriting the saved checkpoint with stale currentTime.
      if (isInteractive && hasWindowObject() && (window.resumeInProgress || window.segmentSwitchInProgress)) return;

      var currentTime = videoElement.currentTime;
      var currentSegmentId = isInteractive && hasWindowObject() ? window.currentSegmentId || null : null;

      if (isInteractive && currentSegmentId !== lastSavedSegmentId) {
        lastSavedSegmentId = currentSegmentId;
        lastSavedTime = -interval;
      }

      // Save every N seconds
      if (currentTime - lastSavedTime >= interval) {
        saveCurrentTime(currentTime, scormAPI, currentSegmentId);
        lastSavedTime = currentTime;
      }
    });

    // Save on pause (but be careful with interactive videos)
    videoElement.addEventListener('pause', function () {
      // Don't save while resume seek or segment switch is in progress
      if (isInteractive && hasWindowObject() && (window.resumeInProgress || window.segmentSwitchInProgress)) return;

      // Don't save if this is a programmatic pause from the Interactive SDK
      // (it will manage its own state)
      var isInteractivePause = window.interactiveVideoReady && videoElement.currentTime > 0;

      if (!isInteractivePause || videoElement.currentTime > 1) {
        // Save progress unless it's an interactive pause at the very beginning
        saveCurrentTime(
          videoElement.currentTime,
          scormAPI,
          isInteractive && hasWindowObject() ? window.currentSegmentId || null : null
        );
        console.log('heygenScormWrapper: Progress saved on pause');
      }
    });

    // Save on page unload
    window.addEventListener('beforeunload', function () {
      saveCurrentTime(
        videoElement.currentTime,
        scormAPI,
        isInteractive && hasWindowObject() ? window.currentSegmentId || null : null
      );
      console.log('heygenScormWrapper: Progress saved on page unload');
    });

    console.log('heygenScormWrapper: Progress tracking initialized');
  }

  // Public API
  return {
    // Main API
    init: init,
    initPlaybackSpeed: initPlaybackSpeed,
    initVolumeControl: initVolumeControl,
    initProgressTracking: initProgressTracking,

    // Language management
    saveLanguage: saveLanguage,
    loadLanguage: loadLanguage,
    getVideoFile: getVideoFile,
    getLanguageFromFile: getLanguageFromFile,

    // Playback speed management
    savePlaybackSpeed: savePlaybackSpeed,
    loadPlaybackSpeed: loadPlaybackSpeed,

    // Volume management
    saveVolume: saveVolume,
    loadVolume: loadVolume,

    // Progress tracking
    saveCurrentTime: saveCurrentTime,
    loadCurrentTime: loadCurrentTime,

    // Interactive video progress
    saveInteractiveProgress: saveInteractiveProgress,
    loadInteractiveProgress: loadInteractiveProgress,
    getInteractiveCheckpointTime: getInteractiveCheckpointTime,
    getInteractiveResumeState: getInteractiveResumeState,

    // Configuration
    setConfig: setConfig,

    // Advanced API (optional manual control)
    populateLanguageSelector: populateLanguageSelector,
    setupLanguageChangeHandler: setupLanguageChangeHandler,
    populateSpeedSelector: populateSpeedSelector,
    setupSpeedChangeHandler: setupSpeedChangeHandler,
  };
})();
