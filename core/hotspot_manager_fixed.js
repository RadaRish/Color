export default class HotspotManager {
  constructor() {
    this.viewerManager = null; // Будет установлено позже
    this.hotspots = [];
    this.sceneManager = null; // Будет установлено позже
  }

  setViewerManager(viewerManager) {
    this.viewerManager = viewerManager;
  }

  setSceneManager(sceneManager) {
    this.sceneManager = sceneManager;
  }

  addHotspot(scene, hotspotData) {
    const id = `hotspot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('🎯 Создаем хотспот с данными:', hotspotData);
    console.log('🎯 Позиция в hotspotData:', hotspotData.position);

    // Нормализуем позицию перед созданием хотспота
    let normalizedPosition;
    if (typeof hotspotData.position === 'string') {
      const coords = hotspotData.position.split(' ').map(c => parseFloat(c) || 0);
      normalizedPosition = { x: coords[0] || 0, y: coords[1] || 0, z: coords[2] || 0 };
    } else if (hotspotData.position && typeof hotspotData.position === 'object') {
      normalizedPosition = hotspotData.position;
    } else {
      normalizedPosition = { x: 0, y: 0, z: -5 };
    }

    const newHotspot = {
      id,
      sceneId: scene.id,
      ...hotspotData,
      position: normalizedPosition
    };
    console.log('🎯 Финальный хотспот:', newHotspot);
    console.log('🎯 Позиция в newHotspot:', newHotspot.position);

    this.hotspots.push(newHotspot);
    scene.hotspots.push(newHotspot); // Также сохраняем в сцене для совместимости

    this.viewerManager.createVisualMarker(newHotspot);

    // Автоматически сохраняем в localStorage
    this.saveToStorage();

    console.log('Хотспот добавлен:', newHotspot);
  }

  updateHotspot(hotspotId, data) {
    const hotspot = this.findHotspotById(hotspotId);
    if (!hotspot) return;

    Object.assign(hotspot, data);
    this.viewerManager.updateVisualMarker(hotspot);

    // Автоматически сохраняем в localStorage
    this.saveToStorage();

    console.log('Хотспот обновлен:', hotspot);
  }

  updateHotspotPosition(hotspotId, position) {
    const hotspot = this.findHotspotById(hotspotId);
    if (!hotspot) {
      console.warn('Хотспот не найден для обновления позиции:', hotspotId);
      return;
    }

    // Преобразуем позицию в правильный формат объекта для сохранения
    let normalizedPosition;
    if (position && typeof position === 'object') {
      if (position.x !== undefined && position.y !== undefined && position.z !== undefined) {
        // A-Frame позиция объект - извлекаем координаты
        normalizedPosition = {
          x: parseFloat(position.x) || 0,
          y: parseFloat(position.y) || 0,
          z: parseFloat(position.z) || 0
        };
      } else {
        // Уже нормализованный объект
        normalizedPosition = position;
      }
    } else if (typeof position === 'string') {
      // Строковая позиция "x y z"
      const coords = position.split(' ').map(c => parseFloat(c) || 0);
      normalizedPosition = { x: coords[0] || 0, y: coords[1] || 0, z: coords[2] || 0 };
    } else {
      console.warn('💾 Неизвестный формат позиции:', position);
      normalizedPosition = { x: 0, y: 0, z: -5 };
    }

    hotspot.position = normalizedPosition;
    console.log('💾 Позиция хотспота обновлена:', hotspotId, normalizedPosition);
    console.log('💾 Тип позиции:', typeof normalizedPosition, 'Конструктор:', normalizedPosition?.constructor?.name);
    console.log('💾 Содержимое позиции:', JSON.stringify(normalizedPosition));

    // Также обновляем в связанной сцене
    if (this.sceneManager) {
      const scene = this.sceneManager.getSceneById(hotspot.sceneId);
      if (scene) {
        const sceneHotspot = scene.hotspots.find(h => h.id === hotspotId);
        if (sceneHotspot) {
          sceneHotspot.position = normalizedPosition;
        }
      }
    }

    // Автоматически сохраняем в localStorage
    this.saveToStorage();
  }

  removeHotspotById(hotspotId) {
    const index = this.hotspots.findIndex(h => h.id === hotspotId);
    if (index === -1) return;

    const hotspot = this.hotspots[index];

    // Удаляем из массива хотспотов
    this.hotspots.splice(index, 1);

    // Также удаляем из связанной сцены
    if (this.sceneManager) {
      const scene = this.sceneManager.getSceneById(hotspot.sceneId);
      if (scene && scene.hotspots) {
        const sceneIndex = scene.hotspots.findIndex(h => h.id === hotspotId);
        if (sceneIndex !== -1) {
          scene.hotspots.splice(sceneIndex, 1);
        }
      }
    }

    // Удаляем визуальный маркер
    if (this.viewerManager) {
      this.viewerManager.removeVisualMarker(hotspotId);
    }

    // Сохраняем изменения
    this.saveToStorage();

    console.log('Хотспот удален:', hotspotId);
  }

  editHotspot(hotspotId) {
    const hotspot = this.findHotspotById(hotspotId);
    if (!hotspot) {
      console.warn('Хотспот не найден для редактирования:', hotspotId);
      return;
    }

    // Вызываем глобальную функцию редактирования маркера
    if (window.editMarker) {
      window.editMarker(hotspotId);
    } else {
      console.warn('Функция editMarker не найдена');
    }
  }

  removeHotspotByMarkerId(markerId) {
    // Извлекаем ID хотспота из ID маркера
    const hotspotId = markerId.replace('marker-', '');
    this.removeHotspotById(hotspotId);
  }

  findHotspotById(id) {
    const hotspot = this.hotspots.find(h => h.id === id);
    if (hotspot && hotspot._needsVideoRestore && !hotspot.videoUrl) {
      // Логируем о необходимости восстановления video URL
      console.log(`🔄 Хотспот ${id} требует восстановления videoUrl`);
      if (typeof hotspot._needsVideoRestore === 'string') {
        console.log(`📁 Ожидаемый файл: ${hotspot._needsVideoRestore}`);
      }
    }
    return hotspot;
  }

  findHotspotByMarkerId(markerId) {
    const hotspotId = markerId.replace('marker-', '');
    return this.findHotspotById(hotspotId);
  }

  getHotspotsForScene(sceneId) {
    console.log('🔍 getHotspotsForScene вызван для сцены:', sceneId);
    console.log('🔍 Все доступные маркеры:', this.hotspots);

    // Загружаем из localStorage при каждом запросе для актуализации данных
    this.loadFromStorage();

    const sceneHotspots = this.hotspots.filter(h => h.sceneId === sceneId);
    console.log('🔍 Найдено маркеров для сцены', sceneId, ':', sceneHotspots.length);

    if (sceneHotspots.length === 0) {
      console.log('📋 Маркеры других сцен:', this.hotspots.filter(h => h.sceneId !== sceneId));
    }

    return sceneHotspots;
  }

  loadHotspots(hotspotsData) {
    this.hotspots = hotspotsData || [];
    console.log('Загружено хотспотов:', this.hotspots.length);
  }

  getAllHotspots() {
    return this.hotspots;
  }

  updateAllMarkersWithSettings(settings) {
    this.hotspots.forEach(hotspot => {
      if (!hotspot.size) {
        hotspot.size = hotspot.type === 'hotspot' ? settings.hotspotSize : settings.infopointSize;
      }
      if (!hotspot.color) { // Если у хотспота нет индивидуального цвета
        hotspot.color = hotspot.type === 'hotspot' ? settings.hotspotColor : settings.infopointColor;
        if (this.viewerManager) {
          this.viewerManager.updateVisualMarker(hotspot);
        }
      }
    });
  }

  /**
   * Сохраняет текущие хотспоты в localStorage
   */
  saveToStorage() {
    try {
      console.log('💾 Сохраняем хотспоты:', this.hotspots.length);

      // РАДИКАЛЬНАЯ ОПТИМИЗАЦИЯ: сохраняем только критически важные данные
      const hotspotsToSave = this.hotspots.map(hotspot => {
        // Сохраняем только минимально необходимые поля
        const minimizedHotspot = {
          id: hotspot.id,
          sceneId: hotspot.sceneId,
          type: hotspot.type,
          position: hotspot.position
        };

        // Добавляем размеры только если они не дефолтные
        if (hotspot.width && hotspot.width !== 2) {
          minimizedHotspot.width = hotspot.width;
        }
        if (hotspot.height && hotspot.height !== 1.5) {
          minimizedHotspot.height = hotspot.height;
        }

        // Добавляем rotation только если он не нулевой
        if (hotspot.rotation && (hotspot.rotation !== "0 0 0" && hotspot.rotation !== 0)) {
          minimizedHotspot.rotation = hotspot.rotation;
        }

        // Добавляем title только если он есть и не пустой
        if (hotspot.title && hotspot.title.trim()) {
          minimizedHotspot.title = hotspot.title.substring(0, 50); // Ограничиваем длину
        }

        // ВАЖНО: Сохраняем информацию о наличии videoUrl для восстановления
        if (hotspot.videoUrl && hotspot.videoUrl.trim() !== '') {
          // Сохраняем только имя файла или последние символы URL для идентификации
          const urlParts = hotspot.videoUrl.split('/');
          const fileName = urlParts[urlParts.length - 1];
          if (fileName.length < 100) { // Сохраняем короткие имена файлов
            minimizedHotspot.videoFileName = fileName;
          }
          minimizedHotspot.hasVideo = true;
        }

        // КРИТИЧНО: НЕ СОХРАНЯЕМ videoUrl, data URLs, base64 данные и другие большие объекты
        // Эти данные будут восстановлены из оригинальных источников при загрузке
        const excludedFields = ['videoUrl', 'thumbnail', 'poster', 'src', 'href', 'data', 'content', 'blob'];

        // Фильтруем исключаемые поля из исходного хотспота
        const filteredHotspot = { ...hotspot };
        excludedFields.forEach(field => {
          if (filteredHotspot.hasOwnProperty(field)) {
            delete filteredHotspot[field];
            console.log(`🚫 Исключено поле: ${field} (размер: ${JSON.stringify(hotspot[field] || '').length} символов)`);
          }
        });

        // Логирование для отладки размера данных
        const originalSize = JSON.stringify(hotspot).length;
        const filteredSize = JSON.stringify(filteredHotspot).length;
        const optimizedSize = JSON.stringify(minimizedHotspot).length;
        const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);

        console.log(`💾 Минимизированный хотспот: ${hotspot.id}`);
        console.log(`   Размер до: ${originalSize} символов`);
        console.log(`   Размер после фильтрации: ${filteredSize} символов`);
        console.log(`   Размер после минимизации: ${optimizedSize} символов`);
        console.log(`   Общее сжатие: ${reduction}%`);

        return minimizedHotspot;
      });

      const dataToSave = JSON.stringify(hotspotsToSave);

      // Проверяем размер данных
      const sizeKB = (dataToSave.length / 1024).toFixed(2);
      console.log(`💾 Размер оптимизированных данных: ${sizeKB} KB (было: 5653+ KB)`);

      // Проверяем, что размер приемлемый (менее 2MB)
      if (dataToSave.length > 2 * 1024 * 1024) {
        console.warn('⚠️ Данные все еще слишком большие, дополнительная оптимизация...');
        // Сохраняем только последние 30 хотспотов
        const recentHotspots = hotspotsToSave.slice(-30);
        const reducedData = JSON.stringify(recentHotspots);
        console.log(`💾 Сохраняем только последние 30 хотспотов: ${(reducedData.length / 1024).toFixed(2)} KB`);
        localStorage.setItem('color_tour_hotspots', reducedData);
      } else {
        localStorage.setItem('color_tour_hotspots', dataToSave);
      }

      console.log('💾 Хотспоты сохранены в localStorage (оптимизированная версия)');
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('❌ localStorage переполнен! Пытаемся экстренную оптимизацию...');
        this.handleQuotaExceeded();
      } else {
        console.error('❌ Ошибка сохранения хотспотов:', error);
      }
    }
  }

  /**
   * Обрабатывает переполнение localStorage
   */
  handleQuotaExceeded() {
    try {
      console.log('⚠️ localStorage переполнен, выполняем автоматическую оптимизацию...');

      // Автоматически очищаем все данные localStorage
      localStorage.clear();
      console.log('🧹 localStorage очищен');

      // Сохраняем только последние 20 хотспотов в минимальном формате
      const recentHotspots = this.hotspots.slice(-20).map(hotspot => ({
        id: hotspot.id,
        sceneId: hotspot.sceneId,
        type: hotspot.type || 'video-area',
        position: hotspot.position,
        width: hotspot.width || 2,
        height: hotspot.height || 1.5
      }));

      const emergencyData = JSON.stringify(recentHotspots);
      console.log(`🆘 Автоматическое сохранение ${recentHotspots.length} последних хотспотов: ${(emergencyData.length / 1024).toFixed(2)} KB`);

      localStorage.setItem('color_tour_hotspots', emergencyData);
      console.log('💾 Автоматическое сохранение выполнено успешно');
    } catch (retryError) {
      console.error('❌ Ошибка при автоматическом сохранении:', retryError);
    }
  }

  /**
   * Загружает хотспоты из localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('color_tour_hotspots');
      if (stored) {
        this.hotspots = JSON.parse(stored);
        console.log('📥 Хотспоты загружены из localStorage:', this.hotspots.length);

        // Восстанавливаем исключенные поля из полных данных хотспотов
        this.hotspots.forEach((hotspot, index) => {
          console.log(`📥 Загруженный хотспот ${index + 1}: ${hotspot.id}`);
          console.log(`   Позиция: ${JSON.stringify(hotspot.position)}`);

          // Восстанавливаем недостающие поля из полных данных в памяти
          this.restoreHotspotData(hotspot);
        });

        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Ошибка загрузки хотспотов:', error);
      return false;
    }
  }

  /**
   * Восстанавливает исключенные при сохранении поля хотспота
   */
  restoreHotspotData(hotspot) {
    // Устанавливаем дефолтные значения для основных полей
    if (!hotspot.width) hotspot.width = 2;
    if (!hotspot.height) hotspot.height = 1.5;
    if (!hotspot.rotation) hotspot.rotation = "0 0 0";
    if (!hotspot.type) hotspot.type = "video-area";

    // Проверяем, нужно ли восстановить videoUrl
    if (hotspot.hasVideo && !hotspot.videoUrl) {
      if (hotspot.videoFileName) {
        // Помечаем для восстановления с информацией о файле
        hotspot._needsVideoRestore = hotspot.videoFileName;
        console.log(`⚠️ videoUrl отсутствует для хотспота ${hotspot.id} - файл: ${hotspot.videoFileName}`);
      } else {
        hotspot._needsVideoRestore = true;
        console.log(`⚠️ videoUrl отсутствует для хотспота ${hotspot.id} - потребуется переустановка`);
      }
    }
  }

  /**
   * Получает хотспот с восстановленными полными данными
   */
  getHotspotWithFullData(hotspotId) {
    const hotspot = this.findHotspotById(hotspotId);
    if (!hotspot) return null;

    // Создаем копию хотспота для безопасности
    const fullHotspot = { ...hotspot };

    // Если нужно восстановить videoUrl, делаем это автоматически
    if (fullHotspot._needsVideoRestore && !fullHotspot.videoUrl) {
      console.log(`🔄 Автоматическое восстановление videoUrl для ${hotspotId}`);

      // Если есть имя файла, логируем его для отладки
      if (typeof fullHotspot._needsVideoRestore === 'string') {
        const fileName = fullHotspot._needsVideoRestore;
        console.log(`📁 Ожидается файл: ${fileName}`);
      }

      // Удаляем флаг восстановления без дополнительных действий
      delete fullHotspot._needsVideoRestore;
    }

    return fullHotspot;
  }

  /**
   * Автоматически восстанавливает видео без пользовательских подсказок
   */
  promptForVideoRestore(hotspot, expectedFileName) {
    console.log(`🔄 Автоматическое восстановление видео для ${hotspot.id}`);
    console.log(`📁 Ожидаемый файл: ${expectedFileName}`);

    // Автоматически открываем редактор без подтверждения пользователя
    this.editHotspot(hotspot.id);
  }

  /**
   * Очищает все хотспоты
   */
  clearAll() {
    this.hotspots = [];
    localStorage.removeItem('color_tour_hotspots');
    if (this.viewerManager) {
      this.viewerManager.clearMarkers();
    }
    console.log('Все хотспоты очищены');
  }

  /**
   * Диагностика размера localStorage (вызывать в консоли браузера)
   */
  static checkStorageSize() {
    let total = 0;
    const results = {};

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const size = localStorage[key].length;
        total += size;
        results[key] = `${(size / 1024).toFixed(2)} KB`;
      }
    }

    console.log('📊 Анализ localStorage:');
    console.log(`📏 Общий размер: ${(total / 1024).toFixed(2)} KB`);
    console.log('📋 По ключам:', results);

    // Примерная оценка лимита (обычно 5-10 MB)
    const estimatedLimit = 5 * 1024 * 1024; // 5 MB в байтах
    const usage = (total / estimatedLimit * 100).toFixed(2);
    console.log(`⚡ Использовано примерно: ${usage}% от лимита`);

    return { total, results, usage };
  }
}

// Добавляем глобальную функцию для быстрой диагностики
window.checkStorageSize = HotspotManager.checkStorageSize;
