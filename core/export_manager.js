/**
 * Менеджер экспорта панорамных туров
 * Экспортирует готовое A-Frame приложение для размещения на сервере
 * Использует нашу разработанную систему с поддержкой кириллицы и кастомных иконок
 */
class ExportManager {
    constructor(sceneManager, hotspotManager, projectManager) {
        this.exportData = null;
        this.sceneManager = sceneManager;
        this.hotspotManager = hotspotManager;
        this.projectManager = projectManager;
    }

    /**
     * Создает тестовые данные для отладки экспорта
     */
    createTestProjectData() {
        console.log('🧪 Создание тестовых данных для экспорта...');

        return {
            projectTitle: 'Тестовый панорамный тур',
            scenes: [
                {
                    id: 'test-scene-1',
                    name: 'Тестовая сцена 1',
                    panoramaFile: 'test-scene-1.jpg',
                    panoramaData: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxZTI5M2IiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyZDNhNGYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjEyOCIgZmlsbD0idXJsKCNncmFkKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudGVyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmYiPtCi0LXRgdGC0L7QstCw0Y8g0YHRhtC10L3QsCA8L3RleHQ+PC9zdmc+', // SVG заглушка
                    hotspots: [
                        {
                            id: 'test-hotspot-1',
                            position: { x: 1, y: 0, z: -3 },
                            title: 'Тестовый хотспот',
                            description: 'Описание тестового хотспота',
                            type: 'info-point',
                            color: '#ff0000',
                            size: 0.3
                        },
                        {
                            id: 'test-hotspot-2',
                            position: { x: -2, y: 1, z: -4 },
                            title: 'Навигационный хотспот',
                            type: 'hotspot',
                            targetSceneId: 'test-scene-2',
                            color: '#00ff00',
                            size: 0.4
                        }
                    ],
                    initialView: { yaw: 0, pitch: 0, fov: Math.PI / 3 }
                },
                {
                    id: 'test-scene-2',
                    name: 'Тестовая сцена 2',
                    panoramaFile: 'test-scene-2.jpg',
                    panoramaData: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMmQxYjY5Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMWUzYTRmIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIxMjgiIGZpbGw9InVybCgjZ3JhZDIpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50ZXIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiI+0KLQtdGB0YLQvtCy0LDRjyDRgdGG0LXQvdCwIDI8L3RleHQ+PC9zdmc+',
                    hotspots: [
                        {
                            id: 'test-hotspot-3',
                            position: { x: 0, y: -1, z: -5 },
                            title: 'Возврат',
                            type: 'hotspot',
                            targetSceneId: 'test-scene-1',
                            color: '#0000ff',
                            size: 0.3
                        }
                    ],
                    initialView: { yaw: 0, pitch: 0, fov: Math.PI / 3 }
                }
            ],
            settings: {
                autorotate: false,
                showSceneList: true,
                fullscreenButton: true
            }
        };
    }

    /**
     * Экспорт тестового проекта для отладки
     */
    async exportTestProject() {
        try {
            console.log('🧪 [TEST EXPORT] Начинаем тестовый экспорт...');

            const testData = this.createTestProjectData();
            console.log('🧪 [TEST EXPORT] Тестовые данные созданы:', testData);

            // Создаем структуру файлов для экспорта
            const exportPackage = await this.createExportPackage(testData);
            console.log('🧪 [TEST EXPORT] Пакет файлов создан:', Object.keys(exportPackage));

            // Генерируем и скачиваем ZIP архив
            await this.downloadExportPackage(exportPackage);
            console.log('🧪 [TEST EXPORT] Тестовый экспорт завершен!');

        } catch (error) {
            console.error('❌ [TEST EXPORT] Ошибка при тестовом экспорте:', error);
        }
    }
    removeFileExtension(filename) {
        if (!filename || typeof filename !== 'string') {
            return filename;
        }

        // Список распространенных расширений видео и изображений
        const videoExtensions = ['.mp4', '.avi', '.mov', '.webm', '.mkv', '.flv', '.wmv', '.m4v', '.3gp', '.ogv'];
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff', '.ico'];
        const allExtensions = [...videoExtensions, ...imageExtensions];

        const lowerFilename = filename.toLowerCase();

        for (const ext of allExtensions) {
            if (lowerFilename.endsWith(ext)) {
                return filename.slice(0, -ext.length);
            }
        }

        return filename;
    }

    /**
     * Экспорт проекта в готовое приложение
     */
    async exportProject() {
        // start export

        try {
            // Получаем все данные проекта
            const projectData = await this.collectProjectData();

            // Создаем структуру файлов для экспорта
            const exportPackage = await this.createExportPackage(projectData);

            // Генерируем и скачиваем ZIP архив
            await this.downloadExportPackage(exportPackage);

            // export done

        } catch (error) {
            console.error('❌ Ошибка при экспорте:', error);
            alert('Ошибка при экспорте проекта: ' + error.message);
        }
    }

    /**
     * Собирает все данные проекта
     */
    async collectProjectData() {
        // collecting project data

        const scenes = this.sceneManager.getAllScenes();
        const projectInfo = this.projectManager.getProjectInfo();

        // scenes count: %d
        // eslint-disable-next-line no-unused-expressions
        scenes.length;
        scenes.forEach((scene, i) => {
            // scene info
        });

        // Очищаем хотспоты, которые принадлежат несуществующим сценам
        const validSceneIds = scenes.map(scene => scene.id);
        const orphanedCount = this.hotspotManager.cleanupOrphanedHotspots(validSceneIds);
        if (orphanedCount > 0) {
            // cleaned orphaned hotspots
        }

        // Получаем ВСЕ хотспоты для диагностики (текущее состояние в памяти ДО выборки по сценам)
        const allHotspotsInitial = this.hotspotManager.getHotspots();
        console.log('🧪 [EXPORT] Хотспотов в памяти (initial):', allHotspotsInitial.length);
        if (allHotspotsInitial.length) {
            console.log('🧪 [EXPORT] Пример первых хотспотов:', allHotspotsInitial.slice(0, 5).map(h => ({ id: h.id, sceneId: h.sceneId, type: h.type, title: h.title, pos: h.position })));
        }

        // Карта распределения хотспотов по сценам (предварительная)
        const distributionInitial = {};
        allHotspotsInitial.forEach(h => { distributionInitial[h.sceneId] = (distributionInitial[h.sceneId] || 0) + 1; });
        console.log('🧪 [EXPORT] Предварительное распределение хотспотов по сценам:', distributionInitial);

        // Подготовим карту соответствия editorId -> exportId (первый проход)
        const idMap = {};
        scenes.forEach((scene, index) => {
            const exportId = this.generateSceneId(scene.name, index);
            idMap[scene.id] = exportId;
        });

        // Собираем информацию о каждой сцене (второй проход)
        const exportScenes = [];
        for (let index = 0; index < scenes.length; index++) {
            const scene = scenes[index];
            console.log('🧪 [EXPORT] Обработка сцены:', { idx: index, editorId: scene.id, exportId: idMap[scene.id], name: scene.name, sceneHotspotsArrayLen: (scene.hotspots ? scene.hotspots.length : 0) });
            // Основной способ – получить хотспоты через менеджер (форсирует загрузку из localStorage)
            let hotspots = this.hotspotManager.getHotspotsForScene(scene.id) || [];
            console.log(`🧪 [EXPORT] Найдено хотспотов через getHotspotsForScene(${scene.id}):`, hotspots.length);

            // Fallback 1: если пусто, но в объекте сцены есть хотспоты
            if (hotspots.length === 0 && scene.hotspots && scene.hotspots.length) {
                console.warn('⚠️ [EXPORT] Fallback: используем scene.hotspots (длина:', scene.hotspots.length, ')');
                hotspots = scene.hotspots;
            }
            // Fallback 2: если всё ещё пусто, попробуем взять из общего массива (по sceneId)
            if (hotspots.length === 0) {
                const allAfterLoad = this.hotspotManager.getHotspots(); // после потенциальной loadFromStorage внутри getHotspotsForScene
                const matching = allAfterLoad.filter(h => h.sceneId === scene.id);
                if (matching.length) {
                    console.warn('⚠️ [EXPORT] Fallback#2: найдено хотспотов в общем массиве:', matching.length);
                    hotspots = matching;
                }
            }
            if (hotspots.length === 0) {
                console.warn('🚨 [EXPORT] СЦЕНА БЕЗ ХОТСПОТОВ при экспорте:', scene.id, scene.name);
            } else {
                console.log('🧪 [EXPORT] Детали хотспотов сцены:', hotspots.slice(0, 10).map(h => ({ id: h.id, type: h.type, title: h.title, target: h.targetSceneId, pos: h.position })));
            }
            // ВАЖНО: перед конвертацией попытаемся заполнить отсутствующие videoUrl (реестр/IndexedDB/legacy)
            await this.fillMissingVideoUrls(hotspots);

            const convertedHotspots = hotspots.map(hotspot => this.convertHotspot(hotspot, idMap));
            // Проверяем корректность конвертации позиций
            convertedHotspots.forEach(ch => {
                if (!ch.position || typeof ch.position.x !== 'number') {
                    console.warn('⚠️ [EXPORT] Некорректная позиция у конвертированного хотспота:', ch.id, ch.position);
                }
            });

            exportScenes.push({
                id: idMap[scene.id],
                name: scene.name,
                panoramaFile: scene.name || `scene_${index}.jpg`,
                panoramaData: scene.src, // URL или Data URL изображения
                hotspots: convertedHotspots,
                initialView: {
                    yaw: 0,
                    pitch: 0,
                    fov: Math.PI / 3
                }
            });
        }

        // Итоговая проверка распределения уже в exportScenes
        const exportDistribution = {};
        exportScenes.forEach(s => { exportDistribution[s.id] = s.hotspots.length; });
        console.log('🧪 [EXPORT] Итоговое распределение хотспотов (export IDs):', exportDistribution);

        // Сохраняем debug-данные глобально для ручного анализа из консоли
        window.__EXPORT_DEBUG__ = {
            timestamp: Date.now(),
            scenes: exportScenes.map(s => ({ id: s.id, name: s.name, hotspots: s.hotspots.length })),
            totalHotspotsInitial: allHotspotsInitial.length,
            exportDistribution,
            orphanedCount,
            distributionInitial
        };
        console.log('🧪 [EXPORT] Debug данные доступны в window.__EXPORT_DEBUG__');

        return {
            projectTitle: projectInfo.title || 'Панорамный тур',
            scenes: exportScenes,
            settings: {
                autorotate: projectInfo.autorotate || false,
                showSceneList: projectInfo.showSceneList !== false,
                fullscreenButton: projectInfo.fullscreenButton !== false
            }
        };
    }

    /**
     * Дополняет хотспоты отсутствующими videoUrl из доступных источников:
     * - реестр видео (localStorage)
     * - IndexedDB ('color_tour_videos')
     * - legacy поля _originalData.videoUrl / videoData
     */
    async fillMissingVideoUrls(hotspots) {
        try {
            if (!Array.isArray(hotspots) || hotspots.length === 0) return;
            const hm = this.hotspotManager;
            let db = null;
            for (const h of hotspots) {
                if (!h) continue;
                const isVideoType = (h.type === 'video-area' || h.type === 'animated-object');
                if (!isVideoType) continue;
                if (h.videoUrl && String(h.videoUrl).trim() !== '') continue;

                // 1) Реестр
                try {
                    if (hm && typeof hm.getVideoUrlFromRegistry === 'function') {
                        const reg = hm.getVideoUrlFromRegistry(h.id);
                        if (reg) { h.videoUrl = reg; h.hasVideo = true; continue; }
                    }
                } catch { }

                // 2) IndexedDB
                try {
                    if (hm && typeof hm._openVideoDB === 'function') {
                        if (!db) { try { db = await hm._openVideoDB(); } catch { db = null; } }
                        if (db) {
                            const v = await new Promise(res => {
                                const tx = db.transaction('videos', 'readonly');
                                const rq = tx.objectStore('videos').get(h.id);
                                rq.onsuccess = () => res(rq.result && rq.result.data);
                                rq.onerror = () => res(null);
                            });
                            if (v) { h.videoUrl = v; h.hasVideo = true; continue; }
                        }
                    }
                } catch { }

                // 3) Legacy _originalData
                try {
                    const od = h._originalData || {};
                    const raw = od.videoUrl || od.videoData;
                    if (typeof raw === 'string' && raw.trim()) {
                        let dataUrl = raw;
                        if (!raw.startsWith('data:video')) {
                            const cleaned = raw.replace(/^base64,/i, '');
                            dataUrl = `data:video/mp4;base64,${cleaned}`;
                        }
                        h.videoUrl = dataUrl; h.hasVideo = true; continue;
                    }
                } catch { }
            }
        } catch (e) {
            console.warn('⚠️ fillMissingVideoUrls: не удалось дополнить видео-URL при экспорте:', e);
        }
    }

    /**
     * Генерирует безопасный ID для сцены
     */
    generateSceneId(sceneName, index) {
        // Убираем небезопасные символы и создаем уникальный ID
        const cleanName = sceneName
            .replace(/[^a-zA-Zа-яА-Я0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        return `scene-${index}-${cleanName}`;
    }

    /**
     * Конвертирует хотспот в формат для экспорта
     */
    convertHotspot(hotspot, idMap) {
        // convert hotspot

        const converted = {
            id: hotspot.id,
            position: {
                x: hotspot.position?.x || 0,
                y: hotspot.position?.y || 0,
                z: hotspot.position?.z || 0
            },
            title: hotspot.title ? this.removeFileExtension(hotspot.title) : 'Без названия',
            description: hotspot.description || '',
            type: hotspot.type || 'hotspot',
            targetSceneId: hotspot.targetSceneId || null, // временно, перепишем ниже через idMap
            icon: hotspot.icon || (hotspot.type === 'hotspot' ? 'arrow' :
                hotspot.type === 'info-point' ? 'sphere' :
                    hotspot.type === 'video-area' ? 'cube' :
                        hotspot.type === 'animated-object' ? 'cube' : 'sphere'),
            size: hotspot.size || 0.3,
            color: hotspot.color || (hotspot.type === 'info-point' ? '#ffcc00' :
                hotspot.type === 'video-area' ? '#ff6600' :
                    hotspot.type === 'animated-object' ? '#ffffff' : '#00ff00'),
            textColor: hotspot.textColor || '#ffffff',
            textSize: hotspot.textSize || 1.0,
            videoUrl: hotspot.videoUrl || hotspot._originalData?.videoUrl || null,
            poster: hotspot.poster || hotspot._originalData?.poster || (this.hotspotManager?.getPoster?.(hotspot.id) || null),
            videoWidth: hotspot.videoWidth || hotspot._originalData?.videoWidth || null,
            videoHeight: hotspot.videoHeight || hotspot._originalData?.videoHeight || null,
            chromaEnabled: !!hotspot.chromaEnabled,
            chromaColor: hotspot.chromaColor || '#00ff00',
            chromaSimilarity: hotspot.chromaSimilarity ?? 0.4,
            chromaSmoothness: hotspot.chromaSmoothness ?? 0.1,
            chromaThreshold: hotspot.chromaThreshold ?? 0.0,
            customIconData: hotspot.customIconData || null // для пользовательских иконок
        };

        // Переписываем targetSceneId (editor id -> export id), чтобы переходы работали в сборке
        if (converted.targetSceneId && idMap && idMap[converted.targetSceneId]) {
            converted.targetSceneId = idMap[converted.targetSceneId];
        }

        // converted hotspot position

        return converted;
    }

    /**
     * Генерирует HTML файл для просмотра тура
     */
    generateViewerHTML(projectData) {
        // generate viewer html
        return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectData.projectTitle}</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌐</text></svg>">
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&subset=cyrillic&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="tour-container">
        <!-- Левая панель со сценами -->
        <div id="scene-panel" class="open">
            <div class="scene-panel-header">
                <span class="title">${projectData.projectTitle}</span>
                <button id="scene-panel-toggle" title="Скрыть/показать список сцен">⟨</button>
            </div>
            <div id="scene-list"></div>
        </div>

        <!-- A-Frame сцена -->
        <a-scene 
            id="tour-scene"
            embedded
            style="height: 100vh; width: 100%;"
            background="color: #000000"
            vr-mode-ui="enabled: false"
            cursor="rayOrigin: mouse"
            raycaster="objects: [data-raycastable]; far: 100; interval: 100"
            renderer="antialias: true; colorManagement: true; sortObjects: true"
            loading-screen="enabled: false">>
            
            <!-- Активы -->
            <a-assets>
                ${projectData.scenes.map(scene =>
            `<img id="${scene.id}-panorama" src="panoramas/${scene.id}.jpg">`
        ).join('\n                ')}
            </a-assets>

            <!-- Небесная сфера для панорамы -->
            <a-sky id="panorama-sky" src="#${projectData.scenes[0]?.id || 'scene-0'}-panorama" rotation="0 0 0"></a-sky>

            <!-- Камера с орбитальным управлением -->
            <a-camera 
                id="tour-camera"
                look-controls="pointerLockEnabled: false"
                wasd-controls="enabled: false"
                position="0 0 0"
                fov="75">
            </a-camera>

            <!-- Контейнер для хотспотов -->
            <a-entity id="hotspots-container"></a-entity>
        </a-scene>

        <!-- Элементы управления -->
    <div id="tour-controls">
            <button id="fullscreen-btn">⛶</button>
            <button id="zoom-in-btn">+</button>
            <button id="zoom-out-btn">−</button>
            <button id="reset-view-btn">⌂</button>
            <button id="gyro-btn" title="Гироскоп">📱</button>
        </div>
        <!-- Индикатор загрузки -->
            <div id="tour-loading" role="status" aria-live="polite" aria-label="Загрузка" style="display:none">
                <div class="spinner-ring"><div class="spinner-core"></div></div>
                <div class="loading-text">Загрузка...</div>
            </div>
    </div>

    <!-- Данные тура и логика -->
    <script src="tour-data.js"></script>
</body>
</html>`;
    }

    /**
     * Создает пакет файлов для экспорта
     */
    async createExportPackage(projectData) {
        // create export package

        const packageFiles = {};

        // 1. Создаем базовое A-Frame приложение для просмотра
        packageFiles['index.html'] = this.generateViewerHTML(projectData);

        // 2. Создаем JavaScript файл с данными и логикой
        packageFiles['tour-data.js'] = this.generateTourDataJS(projectData);

        // 2.1. Runtime больше не требуется отдельным файлом (перенесен в tour-data.js)

        // 3. Создаем CSS стили 
        packageFiles['style.css'] = this.generateViewerCSS();

        // 4. Добавляем изображения панорам
        await this.processPanoramaImages(projectData, packageFiles);

        // 5. Добавляем кастомные иконки хотспотов
        await this.processCustomIcons(projectData, packageFiles);

        // 6. Создаем README с инструкциями
        packageFiles['README.md'] = this.generateReadme(projectData);

        return packageFiles;
    }

    /**
     * Генерирует A-Frame компоненты
     */
    generateAFrameComponents() {
        return `
        // Компонент billboard для поворота к камере
        AFRAME.registerComponent('billboard', {
            tick: function () {
                const camera = document.querySelector('[camera]');
                if (camera) {
                    this.el.object3D.lookAt(camera.object3D.position);
                }
            }
        });

        // Компонент face-camera для правильной ориентации видео-областей
        AFRAME.registerComponent('face-camera', {
            init: function () {
                this.cameraEl = null;
                this.tick = this.tick.bind(this);
                this.findCamera();
            },

            findCamera: function () {
                this.cameraEl = document.querySelector('[camera]') ||
                              document.querySelector('a-camera') ||
                              document.querySelector('#defaultCamera');

                if (!this.cameraEl) {
                    const scene = document.querySelector('a-scene');
                    if (scene && scene.camera && scene.camera.el) {
                        this.cameraEl = scene.camera.el;
                    }
                }
            },

            tick: function () {
                if (!this.cameraEl) {
                    this.findCamera();
                    return;
                }

                const cameraWorldPosition = new THREE.Vector3();
                const elementWorldPosition = new THREE.Vector3();

                this.cameraEl.object3D.getWorldPosition(cameraWorldPosition);
                this.el.object3D.getWorldPosition(elementWorldPosition);

                const direction = new THREE.Vector3();
                direction.subVectors(cameraWorldPosition, elementWorldPosition);
                direction.y = 0;
                direction.normalize();

                if (direction.length() > 0) {
                    const angle = Math.atan2(direction.x, direction.z);
                    this.el.object3D.rotation.set(0, angle, 0);
                }
            }
        });

        // Компонент для кириллического текста (с поддержкой family/bold/underline)
        AFRAME.registerComponent('cyrillic-text', {
            schema: {
                value: { type: 'string', default: '' },
                color: { type: 'color', default: '#ffffff' },
                align: { type: 'string', default: 'center' },
                family: { type: 'string', default: 'Arial, sans-serif' },
                bold: { type: 'boolean', default: false },
                underline: { type: 'boolean', default: false }
            },
            init: function () { this.createTextTexture(); },
            update: function () { this.createTextTexture(); },
            createTextTexture: function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const data = this.data;
                const value = data.value;
                const color = data.color;
                const align = data.align;
                const family = data.family;
                const bold = data.bold;
                const underline = data.underline;
                canvas.width = 1024; canvas.height = 256;
                ctx.clearRect(0,0,canvas.width,canvas.height);
                const fontSize = 48; // базовый, масштаб задается через entity.setAttribute('scale')
                ctx.font = (bold ? 'bold ' : '') + fontSize + 'px ' + family;
                ctx.fillStyle = color;
                ctx.textAlign = align;
                ctx.textBaseline = 'middle';
                const x = align === 'center' ? canvas.width/2 : (align === 'right' ? canvas.width-20 : 20);
                ctx.fillText(value || '', x, canvas.height/2);
                if (underline) {
                    const metrics = ctx.measureText(value || '');
                    const textWidth = metrics.width;
                    const startX = x - (align === 'center' ? textWidth/2 : (align === 'right' ? textWidth : 0));
                    ctx.fillRect(startX, canvas.height/2 + fontSize*0.45, textWidth, 4);
                }
                const texture = new THREE.CanvasTexture(canvas); texture.needsUpdate = true;
                const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.1 });
                const geometry = new THREE.PlaneGeometry(2, 0.5);
                const mesh = new THREE.Mesh(geometry, material);
                this.el.setObject3D('mesh', mesh);
            }
        });

        // Шейдер chroma-key для удаления фона по ключевому цвету
        if (!AFRAME.shaders || !AFRAME.shaders['chroma-key']) {
            AFRAME.registerShader('chroma-key', {
                schema: {
                    src: { type: 'map' },
                    color: { type: 'color', default: '#00ff00' },
                    similarity: { type: 'number', default: 0.4 },
                    smoothness: { type: 'number', default: 0.1 },
                    threshold: { type: 'number', default: 0.0 }
                },
                init: function (data) {
                    this.material = new THREE.ShaderMaterial({
                        uniforms: {
                            map: { value: null },
                            keyColor: { value: new THREE.Color(data.color) },
                            similarity: { value: data.similarity },
                            smoothness: { value: data.smoothness },
                            threshold: { value: data.threshold }
                        },
                        transparent: true,
                        depthWrite: false,
                        side: THREE.DoubleSide,
                        vertexShader: 'varying vec2 vUV; void main(){ vUV = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
                        fragmentShader: 'uniform sampler2D map; uniform vec3 keyColor; uniform float similarity; uniform float smoothness; uniform float threshold; varying vec2 vUV; void main(){ vec4 color = texture2D(map, vUV); float kr = 0.299, kg = 0.587, kb = 0.114; float r = color.r, g = color.g, b = color.b; float y = kr * r + kg * g + kb * b; float cr = (r - y) * 0.713 + 0.5; float cb = (b - y) * 0.564 + 0.5; float rK = keyColor.r, gK = keyColor.g, bK = keyColor.b; float yK = kr * rK + kg * gK + kb * bK; float crK = (rK - yK) * 0.713 + 0.5; float cbK = (bK - yK) * 0.564 + 0.5; float d = distance(vec2(cb, cr), vec2(cbK, crK)); float a = smoothstep(similarity, similarity + smoothness, d); a = clamp((a - threshold) / (1.0 - threshold + 1e-6), 0.0, 1.0); gl_FragColor = vec4(color.rgb, a * color.a); }'
                    });
                },
                update: function (data) {
                    if (data.src && data.src.image) { this.material.uniforms.map.value = data.src.image; this.material.needsUpdate = true; }
                    if (data.color) this.material.uniforms.keyColor.value.set(data.color);
                    if (typeof data.similarity === 'number') this.material.uniforms.similarity.value = data.similarity;
                    if (typeof data.smoothness === 'number') this.material.uniforms.smoothness.value = data.smoothness;
                    if (typeof data.threshold === 'number') this.material.uniforms.threshold.value = data.threshold;
                }
            });
        }

        // Компонент обработки хотспотов
        AFRAME.registerComponent('hotspot-handler', {
            schema: {
                hotspotId: { type: 'string' },
                type: { type: 'string', default: 'info' },
                linkTo: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                videoUrl: { type: 'string' }
            },
            init: function() {
                this.el.addEventListener('click', this.onClick.bind(this));
                this.el.addEventListener('mouseenter', this.onMouseEnter.bind(this));
                this.el.addEventListener('mouseleave', this.onMouseLeave.bind(this));
                
                // Добавляем data-raycastable для корректной работы raycaster
                this.el.setAttribute('data-raycastable', '');
            },
            onClick: function() {
                // hotspot click
                // Info-point: всегда показываем текст, НЕ навигируем
                if (this.data.type === 'info-point' || this.data.type === 'infopoint') {
                    this.showInfoModal();
                    return;
                }
                // Видео-область: воспроизводим ВНУТРИ плоскости
                if (this.data.type === 'video-area') {
                    const markerEl = this.el.parentElement;
                    if (!markerEl) return;
                    let videoEl = document.getElementById('video-' + this.data.hotspotId);
                    const plane = markerEl.querySelector('a-plane');
                    if (!videoEl) {
                        videoEl = document.createElement('video');
                        videoEl.id = 'video-' + this.data.hotspotId;
                        videoEl.crossOrigin = 'anonymous';
                        videoEl.loop = true;
                        videoEl.playsInline = true;
                        // Не форсируем muted: по клику пользователя звук допускается браузером
                        videoEl.style.display = 'none';
                        const assets = document.querySelector('a-assets') || (()=>{ const a=document.createElement('a-assets'); document.querySelector('a-scene').appendChild(a); return a; })();
                        assets.appendChild(videoEl);
                        if (this.data.videoUrl) {
                            videoEl.src = this.data.videoUrl;
                        }
                    }
                    if (plane) {
                        // При первом клике заменяем постер на видео-текстуру
                        const mat = plane.getAttribute('material') || {};
                        if (!mat.src || mat.src !== ('#' + videoEl.id)) {
                            plane.setAttribute('material', { shader: 'flat', src: '#' + videoEl.id, transparent: false, side: 'double' });
                        }
                    }
                    // toggle
                    if (videoEl.paused) {
                        try { videoEl.muted = false; } catch {}
                        videoEl.play().catch(()=>{});
                    } else {
                        try { videoEl.pause(); } catch {}
                    }
                    return;
                }
                // Переход к другой сцене только для навигационных хотспотов
                if (this.data.linkTo && this.data.linkTo !== '' && this.data.linkTo !== 'undefined' && this.data.linkTo !== 'null') {
                    // go to scene
                    window.tourViewer.switchToScene(this.data.linkTo);
                    return;
                }
                // По умолчанию — инфо
                this.showInfoModal();
            },
            showInfoModal: function() {
                // Функция для удаления расширений файлов
                const removeFileExtension = (filename) => {
                    if (!filename || typeof filename !== 'string') {
                        return filename;
                    }
                    const videoExtensions = ['.mp4', '.avi', '.mov', '.webm', '.mkv', '.flv', '.wmv', '.m4v', '.3gp', '.ogv'];
                    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff', '.ico'];
                    const allExtensions = [...videoExtensions, ...imageExtensions];
                    const lowerFilename = filename.toLowerCase();
                    for (const ext of allExtensions) {
                        if (lowerFilename.endsWith(ext)) {
                            return filename.slice(0, -ext.length);
                        }
                    }
                    return filename;
                };

                // Создаем модальное окно для информации
                const modal = document.createElement('div');
                modal.style.cssText = 
                    'position: fixed;' +
                    'top: 0;' +
                    'left: 0;' +
                    'width: 100%;' +
                    'height: 100%;' +
                    'background: rgba(0, 0, 0, 0.8);' +
                    'z-index: 10000;' +
                    'display: flex;' +
                    'align-items: center;' +
                    'justify-content: center;';
                
                const content = document.createElement('div');
                content.style.cssText = 
                    'background: #2a2a2a;' +
                    'padding: 30px;' +
                    'border-radius: 10px;' +
                    'max-width: 500px;' +
                    'color: white;' +
                    'font-family: Roboto, Arial, sans-serif;';
                
                content.innerHTML = 
                    '<h3 style="margin: 0 0 15px 0; color: #ffcc00;">' + (this.data.title ? removeFileExtension(this.data.title) : 'Информация') + '</h3>' +
                    '<p style="margin: 0 0 20px 0; line-height: 1.5;">' + (this.data.description || 'Описание отсутствует') + '</p>' +
                    '<button style="background: #ffcc00; color: black; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">Закрыть</button>';
                
                modal.appendChild(content);
                document.body.appendChild(modal);
                
                // Закрытие модального окна
                const closeBtn = content.querySelector('button');
                const closeModal = () => {
                    document.body.removeChild(modal);
                };
                
                closeBtn.addEventListener('click', closeModal);
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeModal();
                });
            },
                // Удален showVideoModal: видео теперь играет в плоскости
        onMouseEnter: function(evt) {
                const textEl = this.el.querySelector('[cyrillic-text]');
                // Показываем 3D-лейбл для всех типов (info-point, hotspot, video-area)
                if (textEl) {
                    textEl.setAttribute('visible', true);
                }
                this.el.setAttribute('scale', '1.2 1.2 1.2');
                // 2D подсказка: показываем Название + Описание для всех типов маркеров
                if (this.data && (this.data.title || this.data.description)) {
                    const tip = document.createElement('div');
                    tip.className = 'tour-tooltip';
            const title = removeFileExtension(this.data.title || 'Информация');
            const hasDesc = !!this.data.description;
            const desc = hasDesc ? '<div class="desc">' + this.data.description + '</div>' : '';
            const sep = hasDesc ? '<hr class="tour-tip-sep" />' : '';
            tip.innerHTML = '<div class="title">' + title + '</div>' + sep + desc;
                    document.body.appendChild(tip);
                    const move = (e) => { tip.style.left = (e.clientX + 12) + 'px'; tip.style.top = (e.clientY + 12) + 'px'; };
                    window.addEventListener('mousemove', move);
                    this._tooltipEl = tip; this._tooltipMove = move;
                }
            },
            onMouseLeave: function() {
                const textEl = this.el.querySelector('[cyrillic-text]');
                if (textEl) textEl.setAttribute('visible', false);
                this.el.setAttribute('scale', '1 1 1');
                if (this._tooltipEl) {
                    window.removeEventListener('mousemove', this._tooltipMove);
                    document.body.removeChild(this._tooltipEl);
                    this._tooltipEl = null; this._tooltipMove = null;
                }
            }
        });
        `;
    }

    /**
     * Генерирует файл с данными тура и логикой просмотра
     */
    generateTourDataJS(projectData) {
        // generate tour-data.js (safe serialization to avoid unescaped line breaks)  
        const safeJson = JSON.stringify(projectData, (key, value) => {
            if (typeof value === 'string') {
                // Только экранируем критичные символы Unicode
                return value.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
            }
            return value;
        }, 2);
        return `// Данные панорамного тура
const TOUR_DATA = ${safeJson};

// Делаем данные доступными глобально
window.TOUR_DATA = TOUR_DATA;

// Хелпер: удаляет известные расширения файлов из строки
function removeFileExtension(filename) {
    if (!filename || typeof filename !== 'string') return filename;
    const videoExtensions = ['.mp4', '.avi', '.mov', '.webm', '.mkv', '.flv', '.wmv', '.m4v', '.3gp', '.ogv'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff', '.ico'];
    const allExtensions = [...videoExtensions, ...imageExtensions];
    const lower = filename.toLowerCase();
    for (const ext of allExtensions) {
        if (lower.endsWith(ext)) return filename.slice(0, -ext.length);
    }
    return filename;
}

// Основной класс просмотрщика тура
class TourViewer {
    constructor(tourData) {
        this.tourData = tourData;
        this.currentSceneId = tourData.scenes[0]?.id || null;
        this.scene = document.querySelector('#tour-scene');
        this.panoramaSky = document.querySelector('#panorama-sky');
        this.hotspotsContainer = document.querySelector('#hotspots-container');
    this.sceneList = document.querySelector('#scene-list');
    this.scenePanel = document.querySelector('#scene-panel');
    this.loadingBox = document.querySelector('#tour-loading');

    // Авторотация
    this.autorotateEnabled = !!(tourData.settings && tourData.settings.autorotate);
    this.autorotateSpeed = 0.02; // рад/сек
    this.autorotateIdleDelay = 3000; // мс
    this._autorotatePaused = false;
    this._autorotateLastTs = 0;
    this._lastUserInteraction = Date.now();
    this._autorotateRaf = null;
    // Гироскоп и pinch
    this.gyroEnabled = false;
    this._pinch = { active: false, startDist: 0, startFov: 75 };
        
        this.init();
        window.tourViewer = this; // Глобальный доступ
    }

    init() {
        console.log('🎬 TourViewer.init() запущен');
        
        // Проверяем, готовы ли элементы DOM
        if (!this.scene || !this.panoramaSky || !this.hotspotsContainer || !this.sceneList) {
            console.log('⏳ DOM элементы не готовы, повторяем через 100мс...');
            setTimeout(() => this.init(), 100);
            return;
        }
        
        console.log('✅ DOM элементы найдены');
        
        // Ожидаем готовности A-Frame сцены
        if (this.scene.hasLoaded) {
            console.log('✅ A-Frame сцена уже загружена, запускаем тур');
            this.startTour();
        } else {
            console.log('⏳ Ждем загрузки A-Frame сцены...');
            this.scene.addEventListener('loaded', () => {
                console.log('✅ A-Frame сцена загружена, запускаем тур');
                this.startTour();
            });
        }
    }
    
    startTour() {
        console.log('🚀 Запуск тура...');
        this.setupEventListeners();
        this.loadScene(this.currentSceneId);
    }

    setupEventListeners() {
        // Построение списка сцен и переключатель панели
        this.renderSceneList();
        const toggleBtn = document.getElementById('scene-panel-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.scenePanel.classList.toggle('open');
                toggleBtn.textContent = this.scenePanel.classList.contains('open') ? '⟨' : '⟩';
            });
        }

        // Элементы управления
        document.getElementById('fullscreen-btn').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        document.getElementById('zoom-in-btn').addEventListener('click', () => {
            this.zoomIn();
        });

        document.getElementById('zoom-out-btn').addEventListener('click', () => {
            this.zoomOut();
        });

        document.getElementById('reset-view-btn').addEventListener('click', () => {
            this.resetView();
        });

        const gyroBtn = document.getElementById('gyro-btn');
        if (gyroBtn) {
            gyroBtn.addEventListener('click', async () => {
                this.enableGyro(!this.gyroEnabled);
                gyroBtn.classList.toggle('active', this.gyroEnabled);
            });
        }

        // Горячая клавиша: R — включить/выключить авторотацию
        window.addEventListener('keydown', (e) => {
            if ((e.key || '').toLowerCase() === 'r') {
                this.enableAutorotate(!this.autorotateEnabled);
            }
        });

        this._setupAutorotateUserInteractivity();

        // Pinch-to-zoom
        const sceneEl = this.scene;
        if (sceneEl) {
            sceneEl.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches.length === 2) {
                    this._pinch.active = true;
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    this._pinch.startDist = Math.hypot(dx, dy);
                    const cam = document.querySelector('#tour-camera');
                    this._pinch.startFov = parseFloat(cam?.getAttribute('fov')) || 75;
                }
            }, { passive: false });
            sceneEl.addEventListener('touchmove', (e) => {
                if (this._pinch.active && e.touches && e.touches.length === 2) {
                    e.preventDefault();
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    const dist = Math.hypot(dx, dy);
                    if (this._pinch.startDist > 0) {
                        const scale = this._pinch.startDist / dist;
                        let newFov = this._pinch.startFov * scale;
                        newFov = Math.max(30, Math.min(120, newFov));
                        const cam = document.querySelector('#tour-camera');
                        cam.setAttribute('fov', newFov);
                    }
                }
            }, { passive: false });
            const endPinch = () => { this._pinch.active = false; };
            sceneEl.addEventListener('touchend', endPinch, { passive: true });
            sceneEl.addEventListener('touchcancel', endPinch, { passive: true });
        }
    }

    switchToScene(sceneId) {
    // switch to scene
        this.currentSceneId = sceneId;
        this.loadScene(sceneId);
    this.markActiveScene(sceneId);
    }

    loadScene(sceneId) {
    // load scene
        const scene = this.tourData.scenes.find(s => s.id === sceneId);
        if (!scene) {
            console.error('❌ Сцена не найдена:', sceneId);
            return;
        }

    // scene data
        scene.hotspots.forEach(function(hotspot, i){
            console.log('  🎯 Хотспот ' + (i+1) + ': "' + hotspot.title + '" тип: ' + hotspot.type + ' переход: ' + hotspot.targetSceneId);
        });

        // Показать индикатор загрузки панорамы
        this.showLoading('Загрузка панорамы...');
        var self = this;
        var hideTimeout = setTimeout(function(){ self.hideLoading(); }, 10000);
        var onLoaded = function() {
            clearTimeout(hideTimeout);
            self.hideLoading();
            if (self.panoramaSky) {
                self.panoramaSky.removeEventListener('materialtextureloaded', onLoaded);
            }
        };
        if (this.panoramaSky) {
            this.panoramaSky.addEventListener('materialtextureloaded', onLoaded);
        }

        // Обновляем панораму
        const panoramaElement = document.querySelector('#' + sceneId + '-panorama');
        if (panoramaElement) {
            this.panoramaSky.setAttribute('src', '#' + sceneId + '-panorama');
            console.log('✅ Панорама установлена:', sceneId);
        } else {
            console.error('❌ Элемент панорамы не найден:', sceneId + '-panorama');
        }

        // Очищаем старые хотспоты
        while (this.hotspotsContainer.firstChild) {
            this.hotspotsContainer.removeChild(this.hotspotsContainer.firstChild);
        }
        console.log('🧹 Старые хотспоты очищены');

        // Добавляем хотспоты
        console.log('🎯 Создаем', scene.hotspots.length, 'хотспотов...');
        scene.hotspots.forEach((hotspot, i) => {
            console.log('🔧 Создаем хотспот ' + (i + 1) + '/' + scene.hotspots.length + ':', hotspot.title);
            this.createHotspot(hotspot);
        });
        
        console.log('✅ Сцена загружена:', scene.name);
        this.hideLoading();
}

    renderSceneList() {
        if (!this.sceneList) return;
        this.sceneList.innerHTML = '';
        this.tourData.scenes.forEach(scene => {
            const item = document.createElement('div');
            item.className = 'scene-item';
            item.dataset.sceneId = scene.id;
            item.textContent = removeFileExtension(scene.name);
            item.addEventListener('click', () => this.switchToScene(scene.id));
            this.sceneList.appendChild(item);
        });
        this.markActiveScene(this.currentSceneId);
    }

    markActiveScene(sceneId) {
        if (!this.sceneList) return;
        Array.from(this.sceneList.children).forEach(el => {
            el.classList.toggle('active', el.dataset.sceneId === sceneId);
        });
    }

    createHotspot(hotspot) {
        console.log('🎯 Создаем хотспот:', hotspot.title, 'позиция:', hotspot.position);

        // Основной контейнер хотспота
        const hotspotEl = document.createElement('a-entity');
        hotspotEl.setAttribute('id', 'hotspot-' + hotspot.id);
        hotspotEl.setAttribute('position',
            hotspot.position.x + ' ' + hotspot.position.y + ' ' + hotspot.position.z);
        hotspotEl.setAttribute('hotspot-handler', {
            hotspotId: hotspot.id,
            type: hotspot.type,
            linkTo: hotspot.targetSceneId,
            title: hotspot.title,
            description: hotspot.description,
            videoUrl: hotspot.videoUrl || ''
        });

        // Визуальная форма хотспота
    let shape;
    const size = parseFloat(hotspot.size) || 0.3; // В редакторе радиус = size
        
        if (hotspot.type === 'video-area') {
            // Видео-область - плоскость с правильными размерами
            shape = document.createElement('a-plane');
            const width = parseFloat(hotspot.videoWidth) || 4;
            const height = parseFloat(hotspot.videoHeight) || 3;
            shape.setAttribute('width', width);
            shape.setAttribute('height', height);
            // Нейтральный цвет и материал, чтобы не давать оттенок видео
            if (hotspot.poster) {
                // Покажем постер до старта видео
                shape.setAttribute('material', { shader: 'flat', src: hotspot.poster, transparent: false, side: 'double' });
            } else {
                shape.setAttribute('color', '#ffffff');
                shape.setAttribute('material', 'color: #ffffff; transparent: false; side: double');
            }
            
            // Добавляем face-camera компонент для правильной ориентации
            hotspotEl.setAttribute('face-camera', '');
            
            // Подготавливаем video element заранее, чтобы material мог сослаться по id
            let videoEl = document.getElementById('video-' + hotspot.id);
            if (!videoEl) {
                videoEl = document.createElement('video');
                videoEl.id = 'video-' + hotspot.id;
                videoEl.crossOrigin = 'anonymous';
                videoEl.loop = true;
                videoEl.playsInline = true;
                videoEl.style.display = 'none';
                const assets = document.querySelector('a-assets') || (()=>{ const a=document.createElement('a-assets'); document.querySelector('a-scene').appendChild(a); return a; })();
                assets.appendChild(videoEl);
                if (hotspot.videoUrl) videoEl.src = hotspot.videoUrl;
            }
        } else if (hotspot.type === 'animated-object') {
            // Анимированный объект — видео-плоскость с опциональным хромакеем
            shape = document.createElement('a-plane');
            const width = parseFloat(hotspot.videoWidth) || 2;
            const height = parseFloat(hotspot.videoHeight) || (2 * 9/16);
            shape.setAttribute('width', width);
            shape.setAttribute('height', height);
            hotspotEl.setAttribute('face-camera', '');

            // Подготовим video element
            let videoEl = document.getElementById('video-' + hotspot.id);
            if (!videoEl) {
                videoEl = document.createElement('video');
                videoEl.id = 'video-' + hotspot.id;
                videoEl.crossOrigin = 'anonymous';
                videoEl.loop = true;
                videoEl.playsInline = true;
                videoEl.muted = true;
                videoEl.style.display = 'none';
                const assets = document.querySelector('a-assets') || (()=>{ const a=document.createElement('a-assets'); document.querySelector('a-scene').appendChild(a); return a; })();
                assets.appendChild(videoEl);
                if (hotspot.videoUrl) videoEl.src = hotspot.videoUrl;
            }

            // Материал: chroma-key или flat
            if (hotspot.chromaEnabled) {
                shape.setAttribute('material', {
                    shader: 'chroma-key',
                    src: '#video-' + hotspot.id,
                    color: hotspot.chromaColor || '#00ff00',
                    similarity: hotspot.chromaSimilarity ?? 0.4,
                    smoothness: hotspot.chromaSmoothness ?? 0.1,
                    threshold: hotspot.chromaThreshold ?? 0.0,
                    side: 'double'
                });
            } else {
                shape.setAttribute('material', { shader: 'flat', src: '#video-' + hotspot.id, side: 'double' });
            }

            // Toggle по клику (с включением звука при старте по жесту)
            shape.addEventListener('click', () => {
                if (videoEl.paused) {
                    try { videoEl.muted = false; } catch {}
                    videoEl.play().catch(()=>{});
                } else {
                    try { videoEl.pause(); } catch {}
                }
            });
        } else if (hotspot.icon === 'arrow') {
            // Стрелка из сплюснутого конуса
            shape = document.createElement('a-cone');
            shape.setAttribute('height', size * 1.5);
            shape.setAttribute('radius-bottom', size * 0.8);
            shape.setAttribute('radius-top', 0);
            shape.setAttribute('rotation', '0 0 0');
            shape.setAttribute('color', hotspot.color || '#ff0000');
        } else if (hotspot.icon === 'sphere' || hotspot.type === 'info-point' || hotspot.type === 'infopoint') {
            // Сферический маркер
            shape = document.createElement('a-sphere');
            shape.setAttribute('radius', size);
            shape.setAttribute('color', hotspot.color || '#0099ff');
        } else {
            // Плоский круглый маркер по умолчанию
            shape = document.createElement('a-circle');
            shape.setAttribute('radius', size);
            shape.setAttribute('color', hotspot.color || '#ff0000');
        }

        shape.setAttribute('opacity', '0.8');
        shape.setAttribute('data-raycastable', '');
        hotspotEl.appendChild(shape);

        // Кастомная иконка если есть
        if (hotspot.customIconData) {
            const icon = document.createElement('a-image');
            icon.setAttribute('src', 'icons/' + hotspot.id + '-icon.png');
            icon.setAttribute('width', size * 2);
            icon.setAttribute('height', size * 2);
            icon.setAttribute('position', '0 0 0.01');
            icon.setAttribute('data-raycastable', '');
            hotspotEl.appendChild(icon);
        }

    // Удалено: 3D-текст над маркером в экспорте (оставляем только 2D тултип)

        console.log('✅ Хотспот создан:', hotspot.title);
    this.hotspotsContainer.appendChild(hotspotEl);
    }

toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

zoomIn() {
    const camera = document.querySelector('#tour-camera');
    const currentFov = camera.getAttribute('fov');
    const newFov = Math.max(30, currentFov - 10);
    camera.setAttribute('fov', newFov);
}

zoomOut() {
    const camera = document.querySelector('#tour-camera');
    const currentFov = camera.getAttribute('fov');
    const newFov = Math.min(120, currentFov + 10);
    camera.setAttribute('fov', newFov);
}

resetView() {
    const camera = document.querySelector('#tour-camera');
    camera.setAttribute('fov', 75);
    camera.setAttribute('rotation', '0 0 0');
}
// === Гироскоп ===
async enableGyro(enabled) {
    this.gyroEnabled = !!enabled;
    const cam = document.querySelector('#tour-camera');
    if (!cam) return;
    const current = cam.getAttribute('look-controls') || {};
    if (this.gyroEnabled) {
        try { await this.requestGyroPermission(); } catch {}
        cam.setAttribute('look-controls', { ...current, magicWindowTrackingEnabled: true, pointerLockEnabled: false });
    } else {
        cam.setAttribute('look-controls', { ...current, magicWindowTrackingEnabled: false });
    }
}

async requestGyroPermission() {
    const w = window;
    if (typeof w.DeviceOrientationEvent !== 'undefined' && typeof w.DeviceOrientationEvent.requestPermission === 'function') {
        try { const res = await w.DeviceOrientationEvent.requestPermission(); return res === 'granted'; } catch { return false; }
    }
    return true;
}
// ===== Загрузка и индикатор =====
showLoading(label) {
    if (!this.loadingBox) return;
    const txt = this.loadingBox.querySelector('.loading-text');
    if (txt) txt.textContent = label || 'Загрузка...';
    this.loadingBox.style.display = 'flex';
}

hideLoading() {
    if (!this.loadingBox) return;
    this.loadingBox.style.display = 'none';
}

// ===== Авторотация =====
enableAutorotate(enabled, speed, idleDelay) {
    this.autorotateEnabled = !!enabled;
    if (typeof speed === 'number') this.autorotateSpeed = speed;
    if (typeof idleDelay === 'number') this.autorotateIdleDelay = idleDelay;
    if (this.autorotateEnabled) this._startAutorotateLoop(); else this._stopAutorotateLoop();
}

_setupAutorotateUserInteractivity() {
    var self = this;
    var onInteract = function(){ self._lastUserInteraction = Date.now(); self._autorotatePaused = true; };
    var sceneEl = document.querySelector('a-scene');
    var canvas = sceneEl ? sceneEl.querySelector('canvas') : null;
    var target = canvas || window;
    ['mousedown','wheel','touchstart','keydown'].forEach(function(evt){ target.addEventListener(evt, onInteract, { passive: true }); });
}

_startAutorotateLoop() {
    if (this._autorotateRaf) return;
    this._autorotatePaused = false;
    this._autorotateLastTs = performance.now();
    var self = this;
    var loop = function(ts){
        if (!self.autorotateEnabled) { self._autorotateRaf = null; return; }
        var dt = Math.max(0, (ts - self._autorotateLastTs) / 1000);
        self._autorotateLastTs = ts;
        if (self._autorotatePaused) {
            if (Date.now() - self._lastUserInteraction >= self.autorotateIdleDelay) self._autorotatePaused = false;
        }
        var camera = document.querySelector('#tour-camera');
        if (!self._autorotatePaused && camera) {
            var rot = camera.getAttribute('rotation') || { x: 0, y: 0, z: 0 };
            var newY = rot.y + (self.autorotateSpeed * (180 / Math.PI)) * dt;
            camera.setAttribute('rotation', rot.x + ' ' + newY + ' ' + rot.z);
        }
        self._autorotateRaf = requestAnimationFrame(loop);
    };
    this._autorotateRaf = requestAnimationFrame(loop);
}

_stopAutorotateLoop() {
        if (this._autorotateRaf) {
                cancelAnimationFrame(this._autorotateRaf);
                this._autorotateRaf = null;
        }
}
}

// === Регистрация A-Frame компонентов (перенесено из viewer.js) ===
(function(){
    if (typeof AFRAME === 'undefined') { return; }
    try {
${this.generateAFrameComponents().split('\n').map(l => '    ' + l).join('\n')}
    } catch(e){ console.error('Ошибка регистрации компонентов', e); }
})();

// === Инициализация тура ===
(function initRuntime(){
    console.log('🎬 Инициализация экспортного тура...');
    function init(){
        console.log('🎬 Проверяем готовность компонентов...');
        console.log('- TOUR_DATA:', !!window.TOUR_DATA);
        console.log('- TourViewer:', typeof TourViewer);
        console.log('- tourViewer instance:', !!window.tourViewer);
        
        if (!window.TOUR_DATA) {
            console.log('⏳ TOUR_DATA не готов, повторяем через 100мс...');
            setTimeout(init, 100); 
            return;
        }
        if (!Array.isArray(window.TOUR_DATA.scenes)) {
            console.error('❌ TOUR_DATA.scenes не является массивом:', window.TOUR_DATA.scenes);
            return;
        }
        if (typeof TourViewer === 'undefined') {
            console.log('⏳ TourViewer не определен, повторяем через 100мс...');
            setTimeout(init, 100); 
            return;
        }
        
        console.log('✅ Все компоненты готовы, создаем TourViewer...');
        console.log('📊 Количество сцен:', window.TOUR_DATA.scenes.length);
        
        if (!window.tourViewer) {
            try { 
                window.tourViewer = new TourViewer(window.TOUR_DATA); 
                console.log('✅ TourViewer успешно инициализирован');
            } catch(e){ 
                console.error('❌ Ошибка инициализации TourViewer:', e); 
            }
        }
    }
    if (document.readyState === 'loading') {
        console.log('📄 DOM загружается, ждем DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', init);
    } else {
        console.log('📄 DOM уже готов, запускаем инициализацию...');
        init();
    }
})();
`;
    }

    /**
     * Генерирует CSS стили для просмотрщика
     */
    generateViewerCSS() {
        return `/* Стили для просмотрщика панорамного тура */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Roboto', Arial, sans-serif;
    background: #000;
    color: #fff;
    overflow: hidden;
}

#tour-container {
    width: 100vw;
    height: 100vh;
    display: block;
}

/* Левая панель со сценами */
#scene-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background: rgba(26, 26, 26, 0.85);
    border-right: 1px solid #333;
    backdrop-filter: blur(4px);
    color: #fff;
    transform: translateX(0);
    transition: transform 0.2s ease-in-out;
    z-index: 1001;
}

#scene-panel:not(.open) {
    transform: translateX(-250px);
}

.scene-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 10px 8px 14px;
    border-bottom: 1px solid #333;
}

.scene-panel-header .title {
    font-size: 16px;
    font-weight: 400;
}

#scene-panel-toggle {
    background: transparent;
    border: 1px solid #555;
    color: #fff;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    cursor: pointer;
}

#scene-list {
    padding: 10px;
    overflow-y: auto;
    height: calc(100vh - 50px);
}

#scene-list .scene-item {
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid transparent;
    cursor: pointer;
    margin-bottom: 6px;
}

#scene-list .scene-item.active, #scene-list .scene-item:hover {
    border-color: #646cff;
    background: rgba(100, 108, 255, 0.15);
}

#tour-controls {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 10px;
    z-index: 1000;
}

#tour-controls button {
    width: 50px;
    height: 50px;
    background: rgba(26, 26, 26, 0.9);
    border: 1px solid #555;
    border-radius: 8px;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s ease;
}

#tour-controls button:hover {
    background: rgba(100, 108, 255, 0.8);
    border-color: #646cff;
}

#tour-controls button:active {
    transform: scale(0.95);
}

#tour-controls #gyro-btn.active {
    background: rgba(100, 200, 120, 0.9);
    border-color: #36c26a;
}

/* Индикатор загрузки (кольцевой) */
#tour-loading { position:fixed; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px; pointer-events:none; z-index:2000; font-family:'Roboto',Arial,sans-serif; animation:fadeInLoader .25s ease; }
@keyframes fadeInLoader { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
.spinner-ring { width:110px; height:110px; position:relative; filter:drop-shadow(0 0 6px #646cff) drop-shadow(0 0 12px #ff6ad5); }
.spinner-core { position:absolute; inset:0; border-radius:50%; background:conic-gradient(from 0deg,#646cff 0deg,#8b5cf6 90deg,#ec4899 180deg,#f59e0b 270deg,#646cff 360deg); -webkit-mask:radial-gradient(circle 47% at 50% 50%,transparent 40%, black 41%); mask:radial-gradient(circle 47% at 50% 50%,transparent 40%, black 41%); animation:spinGradient 2s linear infinite, pulseGlow 3.5s ease-in-out infinite; }
@keyframes spinGradient { to { transform:rotate(360deg);} }
@keyframes pulseGlow { 0%,100% { filter:brightness(1);} 50% { filter:brightness(1.45);} }
.loading-text { font-size:15px; letter-spacing:.12em; text-transform:uppercase; background:linear-gradient(90deg,#646cff,#ec4899,#f59e0b,#646cff); background-size:300% 100%; -webkit-background-clip:text; color:transparent; animation:slideHue 6s linear infinite; font-weight:500; text-shadow:0 0 10px rgba(100,108,255,.35);} 
@keyframes slideHue { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }

/* Подсказка (2D) */
.tour-tooltip {
    position: fixed;
    padding: 6px 10px;
    background: rgba(26, 26, 26, 0.95);
    border: 1px solid #333;
    color: #fff;
    border-radius: 6px;
    font-size: 12px;
    pointer-events: none;
    z-index: 1002;
}

.tour-tooltip .title { font-weight: 600; margin-bottom: 4px; }
.tour-tooltip .tour-tip-sep { border: none; border-top: 1px solid rgba(255,255,255,.12); margin: 4px 0; }
.tour-tooltip .desc { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08); padding: 6px 8px; border-radius: 4px; color: #eee; line-height: 1.35; }

/* Стили для A-Frame сцены */
a-scene {
    border: none !important;
}

/* Адаптивность */
@media (max-width: 768px) {
    #scene-panel {
        width: 75vw;
    }
    #tour-controls {
        bottom: 10px;
        right: 10px;
        gap: 5px;
    }
    
    #tour-controls button {
        width: 40px;
        height: 40px;
        font-size: 16px;
    }
}

/* Стили для полноэкранного режима */
#tour-container:-webkit-full-screen {
    width: 100vw;
    height: 100vh;
}

#tour-container:-moz-full-screen {
    width: 100vw;
    height: 100vh;
}

#tour-container:fullscreen {
    width: 100vw;
    height: 100vh;
}`;
    }

    /**
     * Обрабатывает изображения панорам для экспорта
     */
    async processPanoramaImages(projectData, packageFiles) {
        console.log('🖼️ Обрабатываем изображения панорам...');

        for (const scene of projectData.scenes) {
            if (scene.panoramaData) {
                try {
                    // Конвертируем Data URL в Blob
                    const response = await fetch(scene.panoramaData);
                    const blob = await response.blob();

                    // Сохраняем с именем сцены
                    const imagePath = `panoramas/${scene.id}.jpg`;
                    packageFiles[imagePath] = blob;

                    console.log(`✅ Панорама обработана: ${scene.name}`);
                } catch (error) {
                    console.warn(`⚠️ Ошибка обработки панорамы ${scene.name}:`, error);
                }
            }
        }
    }

    /**
     * Обрабатывает кастомные иконки хотспотов
     */
    async processCustomIcons(projectData, packageFiles) {
        console.log('🎨 Обрабатываем кастомные иконки...');
        const processedIcons = new Set();
        for (const scene of projectData.scenes) {
            for (const hotspot of scene.hotspots) {
                // Поддержка как customIconData (оригинал), так и уже присвоенного пути customIcon
                const dataUrl = hotspot.customIconData || hotspot.customIcon;
                if (dataUrl && dataUrl.startsWith('data:') && !processedIcons.has(hotspot.id)) {
                    try {
                        const response = await fetch(dataUrl);
                        const blob = await response.blob();
                        const iconFileName = `icons/${hotspot.id}-icon.png`;
                        packageFiles[iconFileName] = blob;
                        hotspot.customIcon = iconFileName; // нормализуем
                        hotspot.customIconData = iconFileName; // чтобы условие в createHotspot сработало
                        processedIcons.add(hotspot.id);
                        console.log(`✅ Иконка обработана для хотспота: ${hotspot.title}`);
                    } catch (error) {
                        console.warn(`⚠️ Ошибка обработки иконки для ${hotspot.title}:`, error);
                        hotspot.customIcon = null;
                    }
                }
            }
        }
    }


    /**
     * Генерирует README файл с инструкциями
     */
    generateReadme(projectData) {
        return `# ${projectData.projectTitle}

Панорамный тур, созданный в ColoR Tour Editor.

## Установка

1. Разархивируйте файлы на ваш веб-сервер
2. Откройте index.html в браузере

## Структура файлов

- \`index.html\` - главная страница тура
- \`tour-data.js\` - данные тура и логика просмотра
- \`style.css\` - стили интерфейса
- \`panoramas/\` - изображения панорам
- \`icons/\` - кастомные иконки хотспотов

## Возможности

- 🖱️ Навигация мышью по панораме
- 📱 Поддержка мобильных устройств
- 🎯 Интерактивные хотспоты с кириллическими названиями
- 🔗 Переходы между сценами
- 🖼️ Кастомные иконки маркеров
- ⛶ Полноэкранный режим
- 🔍 Зумирование

## Управление

- **Мышь**: поворот камеры
- **Клик по хотспоту**: взаимодействие
- **Кнопки управления**: зум, сброс вида, полный экран
- **Селектор сцен**: быстрый переход между локациями

## Технические требования

- Современный браузер с поддержкой WebGL
- Веб-сервер (не работает при открытии file://)

---

Создано в ColoR Tour Editor v1.0
Дата экспорта: ${new Date().toLocaleDateString('ru-RU')}
Количество сцен: ${projectData.scenes.length}
`;
    }

    /**
     * Создает и скачивает ZIP архив
     */
    async downloadExportPackage(packageFiles) {
        console.log('⬇️ Создаем ZIP архив...');

        if (typeof JSZip === 'undefined') {
            throw new Error('JSZip не загружен. Убедитесь что библиотека подключена.');
        }

        const zip = new JSZip();

        // Добавляем все файлы в архив
        for (const [filePath, content] of Object.entries(packageFiles)) {
            if (content instanceof Blob) {
                // Для бинарных файлов (изображения)
                zip.file(filePath, content);
            } else {
                // Для текстовых файлов
                zip.file(filePath, content);
            }
        }

        // Генерируем архив
        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });

        // Создаем ссылку для скачивания
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'panorama-tour.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('📥 ZIP архив скачан!');
    }
}

// Глобальные функции для отладки экспорта из консоли браузера
window.testExport = function () {
    if (window.exportManager) {
        window.exportManager.exportTestProject();
    } else {
        console.error('exportManager не найден');
    }
};

window.debugExport = function () {
    if (window.exportManager) {
        const projectData = window.exportManager.collectProjectData();
        console.log('🧪 [DEBUG] Собранные данные проекта:', projectData);
        window.__LAST_EXPORT_DATA__ = projectData;
        return projectData;
    } else {
        console.error('exportManager не найден');
    }
};

export default ExportManager;
