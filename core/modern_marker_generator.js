/**
 * Генератор современных SVG маркеров высокого качества с градиентными фонами
 * и цветовой кодировкой по типам действий
 */
class ModernMarkerGenerator {
  constructor() {
    // Высокое разрешение для четких SVG
    this.highResolution = 512; // Увеличено с 64 до 512 для супер-четкости
    this.center = this.highResolution / 2; // Центр маркера
    this.iconScale = 0.4; // Масштаб иконок внутри маркера

    this.colorSchemes = {
      // Безопасные действия (зеленый)
      'info-point': {
        primary: '#4CAF50',
        secondary: '#66BB6A',
        accent: '#81C784',
        glow: 'rgba(76, 175, 80, 0.4)'
      },

      // Важные действия (оранжевый)
      'video-area': {
        primary: '#FF9800',
        secondary: '#FFB74D',
        accent: '#FFCC02',
        glow: 'rgba(255, 152, 0, 0.4)'
      },

      // Основные функции (синий)
      'hotspot': {
        primary: '#2196F3',
        secondary: '#42A5F5',
        accent: '#64B5F6',
        glow: 'rgba(33, 150, 243, 0.4)'
      },

      // Интерактивные элементы (фиолетовый)
      'iframe-3d': {
        primary: '#9C27B0',
        secondary: '#BA68C8',
        accent: '#CE93D8',
        glow: 'rgba(156, 39, 176, 0.4)'
      },

      // Анимированные объекты (голубой)
      'animated-object': {
        primary: '#00BCD4',
        secondary: '#26C6DA',
        accent: '#4DD0E1',
        glow: 'rgba(0, 188, 212, 0.4)'
      },

      // Дополнительные типы маркеров
      'location': {
        primary: '#E91E63',
        secondary: '#F06292',
        accent: '#F8BBD9',
        glow: 'rgba(233, 30, 99, 0.4)'
      },

      'audio': {
        primary: '#8BC34A',
        secondary: '#AED581',
        accent: '#C5E1A5',
        glow: 'rgba(139, 195, 74, 0.4)'
      },

      'download': {
        primary: '#607D8B',
        secondary: '#90A4AE',
        accent: '#B0BEC5',
        glow: 'rgba(96, 125, 139, 0.4)'
      },

      'gallery': {
        primary: '#795548',
        secondary: '#A1887F',
        accent: '#BCAAA4',
        glow: 'rgba(121, 85, 72, 0.4)'
      },

      'shopping': {
        primary: '#FFC107',
        secondary: '#FFD54F',
        accent: '#FFF176',
        glow: 'rgba(255, 193, 7, 0.4)'
      },

      'restaurant': {
        primary: '#FF5722',
        secondary: '#FF8A65',
        accent: '#FFAB91',
        glow: 'rgba(255, 87, 34, 0.4)'
      },

      'transport': {
        primary: '#3F51B5',
        secondary: '#7986CB',
        accent: '#9FA8DA',
        glow: 'rgba(63, 81, 181, 0.4)'
      },

      'warning': {
        primary: '#F44336',
        secondary: '#EF5350',
        accent: '#E57373',
        glow: 'rgba(244, 67, 54, 0.4)'
      },

      'star': {
        primary: '#FFD700',
        secondary: '#FFF176',
        accent: '#FFFF8D',
        glow: 'rgba(255, 215, 0, 0.4)'
      },

      'settings': {
        primary: '#9E9E9E',
        secondary: '#BDBDBD',
        accent: '#E0E0E0',
        glow: 'rgba(158, 158, 158, 0.4)'
      }
    };

    // Определения всех доступных типов маркеров
    this.markerTypes = {
      'hotspot': { name: 'Навигация', icon: 'compass', description: 'Переход между сценами', shape: 'arrow' },
      'info-point': { name: 'Информация', icon: 'info', description: 'Информационная точка', shape: 'circle' },
      'video-area': { name: 'Видео', icon: 'play', description: 'Воспроизведение видео', shape: 'rounded-rect' },
      'iframe-3d': { name: 'Веб-контент', icon: 'web', description: '3D iframe', shape: 'diamond' },
      'animated-object': { name: 'Анимация', icon: 'animation', description: 'Анимированные объекты', shape: 'star' },
      'location': { name: 'Местоположение', icon: 'location', description: 'Маркер местоположения', shape: 'pin' },
      'audio': { name: 'Аудио', icon: 'audio', description: 'Аудио-контент', shape: 'hexagon' },
      'download': { name: 'Скачать', icon: 'download', description: 'Загрузка файлов', shape: 'rounded-rect' },
      'gallery': { name: 'Галерея', icon: 'gallery', description: 'Фото галерея', shape: 'square' },
      'shopping': { name: 'Покупки', icon: 'shopping', description: 'Интернет-магазин', shape: 'circle' },
      'restaurant': { name: 'Ресторан', icon: 'restaurant', description: 'Еда и напитки', shape: 'circle' },
      'transport': { name: 'Транспорт', icon: 'transport', description: 'Транспортные услуги', shape: 'rounded-rect' },
      'warning': { name: 'Предупреждение', icon: 'warning', description: 'Важное уведомление', shape: 'triangle' },
      'star': { name: 'Избранное', icon: 'star', description: 'Особо важные точки', shape: 'star' },
      'settings': { name: 'Настройки', icon: 'settings', description: 'Параметры и настройки', shape: 'hexagon' }
    };
  }

  /**
   * Получает список всех доступных типов маркеров
   * @returns {Object} Объект с типами маркеров
   */
  getAvailableMarkerTypes() {
    return this.markerTypes;
  }

  /**
   * Создает современный SVG маркер высокого качества
   * @param {string} type - тип маркера
   * @param {number} size - размер маркера (по умолчанию высокое разрешение)
   * @param {Object} options - дополнительные опции
   * @returns {SVGElement} SVG элемент маркера
   */
  createModernMarker(type, size = this.highResolution, options = {}) {
    const scheme = this.colorSchemes[type] || this.colorSchemes['hotspot'];
    const markerInfo = this.markerTypes[type] || this.markerTypes['hotspot'];
    const svgNS = 'http://www.w3.org/2000/svg';

    // Создаем SVG элемент высокого разрешения
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', `0 0 ${this.highResolution} ${this.highResolution}`);
    svg.setAttribute('class', `modern-marker modern-marker-${type}`);

    // Настройки для четкого рендеринга
    svg.setAttribute('shape-rendering', 'geometricPrecision');
    svg.setAttribute('image-rendering', 'optimizeQuality');
    svg.style.imageRendering = 'crisp-edges';

    // Добавляем определения градиентов и эффектов
    const defs = document.createElementNS(svgNS, 'defs');

    // Основной градиент высокого качества
    const gradient = document.createElementNS(svgNS, 'radialGradient');
    gradient.setAttribute('id', `gradient-${type}-${Date.now()}`);
    gradient.setAttribute('cx', '40%');
    gradient.setAttribute('cy', '30%');
    gradient.setAttribute('r', '60%');

    const stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', scheme.accent);
    stop1.setAttribute('stop-opacity', '1');

    const stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '60%');
    stop2.setAttribute('stop-color', scheme.primary);
    stop2.setAttribute('stop-opacity', '0.9');

    const stop3 = document.createElementNS(svgNS, 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.setAttribute('stop-color', scheme.secondary);
    stop3.setAttribute('stop-opacity', '0.8');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);

    // Создаем высококачественный фильтр для свечения
    const filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', `glow-${type}-${Date.now()}`);
    filter.setAttribute('x', '-100%');
    filter.setAttribute('y', '-100%');
    filter.setAttribute('width', '300%');
    filter.setAttribute('height', '300%');

    const feGaussianBlur = document.createElementNS(svgNS, 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '8');
    feGaussianBlur.setAttribute('result', 'coloredBlur');

    const feMerge = document.createElementNS(svgNS, 'feMerge');
    const feMergeNode1 = document.createElementNS(svgNS, 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS(svgNS, 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');

    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);

    defs.appendChild(gradient);
    defs.appendChild(filter);
    svg.appendChild(defs);

    // Создаем группу для контента маркера
    const group = document.createElementNS(svgNS, 'g');
    group.setAttribute('class', 'marker-content');

    // Создаем основной фон маркера высокого качества
    const background = this.createMarkerBackground(markerInfo.shape, gradient.id, filter.id);
    group.appendChild(background);

    // Добавляем иконку высокого качества
    const icon = this.createMarkerIcon(markerInfo.icon, scheme);
    if (icon) {
      group.appendChild(icon);
    }

    svg.appendChild(group);

    // Добавляем CSS анимации
    this.addMarkerAnimations(svg, scheme);

    return svg;
  }

  // Вспомогательные методы для создания фигур
  createMarkerBackground(shape, gradientId, filterId) {
    const svgNS = 'http://www.w3.org/2000/svg';
    let element;
    const center = this.center;
    const radius = center * 0.7;

    switch (shape) {
      case 'arrow':
        element = document.createElementNS(svgNS, 'polygon');
        const arrowPoints = [
          [center, center * 0.3],
          [center * 1.4, center * 0.8],
          [center * 1.15, center * 0.8],
          [center * 1.15, center * 1.4],
          [center * 0.85, center * 1.4],
          [center * 0.85, center * 0.8],
          [center * 0.6, center * 0.8]
        ];
        element.setAttribute('points', arrowPoints.map(p => p.join(',')).join(' '));
        break;
      case 'circle':
        element = document.createElementNS(svgNS, 'circle');
        element.setAttribute('cx', center);
        element.setAttribute('cy', center);
        element.setAttribute('r', radius);
        break;
      case 'diamond':
        element = document.createElementNS(svgNS, 'polygon');
        const diamondPoints = [
          [center, center - radius],
          [center + radius, center],
          [center, center + radius],
          [center - radius, center]
        ];
        element.setAttribute('points', diamondPoints.map(p => p.join(',')).join(' '));
        break;
      case 'star':
        element = document.createElementNS(svgNS, 'polygon');
        const starPoints = this.createStarPoints(center, center, radius, radius * 0.5, 5);
        element.setAttribute('points', starPoints.map(p => p.join(',')).join(' '));
        break;
      default:
        element = document.createElementNS(svgNS, 'circle');
        element.setAttribute('cx', center);
        element.setAttribute('cy', center);
        element.setAttribute('r', radius);
    }

    element.setAttribute('fill', `url(#${gradientId})`);
    element.setAttribute('filter', `url(#${filterId})`);
    element.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
    element.setAttribute('stroke-width', '3');

    return element;
  }

  createStarPoints(cx, cy, outerRadius, innerRadius, points) {
    const angle = Math.PI / points;
    const starPoints = [];
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const currentAngle = i * angle - Math.PI / 2;
      starPoints.push([
        cx + Math.cos(currentAngle) * radius,
        cy + Math.sin(currentAngle) * radius
      ]);
    }
    return starPoints;
  }

  createMarkerIcon(iconType, scheme) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const group = document.createElementNS(svgNS, 'g');
    group.setAttribute('class', 'marker-icon');
    group.setAttribute('fill', '#ffffff');
    group.setAttribute('opacity', '0.95');

    const center = this.center;
    const iconSize = center * this.iconScale;

    switch (iconType) {
      case 'compass':
        return this.createCompassIcon(center, iconSize);
      case 'info':
        return this.createInfoIcon(center, iconSize);
      case 'play':
        return this.createPlayIcon(center, iconSize);
      case 'web':
        return this.createWebIcon(center, iconSize);
      case 'animation':
        return this.createAnimationIcon(center, iconSize);
      default:
        return this.createInfoIcon(center, iconSize);
    }
  }

  createCompassIcon(cx, cy, size) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const group = document.createElementNS(svgNS, 'g');

    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', size);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'currentColor');
    circle.setAttribute('stroke-width', '8');

    const arrow = document.createElementNS(svgNS, 'polygon');
    // Увеличиваем размер стрелки в 2 раза
    const arrowPoints = [
      [cx, cy - size * 1.6], // было 0.8, стало 1.6
      [cx - size * 0.6, cy + size * 0.6], // было 0.3, стало 0.6
      [cx, cy],
      [cx + size * 0.6, cy + size * 0.6] // было 0.3, стало 0.6
    ];
    arrow.setAttribute('points', arrowPoints.map(p => p.join(',')).join(' '));
    arrow.setAttribute('fill', 'currentColor');

    group.appendChild(circle);
    group.appendChild(arrow);
    return group;
  }

  createInfoIcon(cx, cy, size) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const group = document.createElementNS(svgNS, 'g');

    // Создаем круг фон для иконки "i"
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', size * 0.9);
    circle.setAttribute('fill', 'currentColor');
    circle.setAttribute('stroke', '#ffffff');
    circle.setAttribute('stroke-width', '4');

    // Создаем букву "i" - точка сверху
    const dot = document.createElementNS(svgNS, 'circle');
    dot.setAttribute('cx', cx);
    dot.setAttribute('cy', cy - size * 0.3);
    dot.setAttribute('r', size * 0.12);
    dot.setAttribute('fill', '#ffffff');

    // Создаем букву "i" - вертикальная линия
    const line = document.createElementNS(svgNS, 'rect');
    line.setAttribute('x', cx - size * 0.08);
    line.setAttribute('y', cy - size * 0.05);
    line.setAttribute('width', size * 0.16);
    line.setAttribute('height', size * 0.6);
    line.setAttribute('fill', '#ffffff');
    line.setAttribute('rx', size * 0.04);

    group.appendChild(circle);
    group.appendChild(dot);
    group.appendChild(line);
    return group;
  }

  createPlayIcon(cx, cy, size) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const triangle = document.createElementNS(svgNS, 'polygon');
    const points = [
      [cx - size * 0.4, cy - size * 0.6],
      [cx - size * 0.4, cy + size * 0.6],
      [cx + size * 0.6, cy]
    ];
    triangle.setAttribute('points', points.map(p => p.join(',')).join(' '));
    triangle.setAttribute('fill', 'currentColor');
    return triangle;
  }

  createWebIcon(cx, cy, size) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const group = document.createElementNS(svgNS, 'g');

    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', cx - size * 0.8);
    rect.setAttribute('y', cy - size * 0.8);
    rect.setAttribute('width', size * 1.6);
    rect.setAttribute('height', size * 1.6);
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', 'currentColor');
    rect.setAttribute('stroke-width', '8');
    rect.setAttribute('rx', size * 0.1);

    const arrow = document.createElementNS(svgNS, 'path');
    arrow.setAttribute('d', `M${cx - size * 0.2},${cy + size * 0.4} L${cx + size * 0.4},${cy - size * 0.2}`);
    arrow.setAttribute('fill', 'none');
    arrow.setAttribute('stroke', 'currentColor');
    arrow.setAttribute('stroke-width', '8');
    arrow.setAttribute('stroke-linecap', 'round');

    group.appendChild(rect);
    group.appendChild(arrow);
    return group;
  }

  createAnimationIcon(cx, cy, size) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const group = document.createElementNS(svgNS, 'g');

    for (let i = 0; i < 3; i++) {
      const wave = document.createElementNS(svgNS, 'path');
      const yOffset = (i - 1) * size * 0.4;
      wave.setAttribute('d', `M${cx - size * 0.8},${cy + yOffset} Q${cx - size * 0.4},${cy + yOffset - size * 0.3} ${cx},${cy + yOffset} Q${cx + size * 0.4},${cy + yOffset + size * 0.3} ${cx + size * 0.8},${cy + yOffset}`);
      wave.setAttribute('fill', 'none');
      wave.setAttribute('stroke', 'currentColor');
      wave.setAttribute('stroke-width', '6');
      wave.setAttribute('stroke-linecap', 'round');
      group.appendChild(wave);
    }

    return group;
  }

  addMarkerAnimations(svg, scheme) {
    svg.style.transition = 'all 0.3s ease';
    svg.style.cursor = 'pointer';

    svg.addEventListener('mouseenter', () => {
      svg.style.transform = 'scale(1.2)';
      svg.style.filter = `drop-shadow(0 0 20px ${scheme.glow})`;
    });

    svg.addEventListener('mouseleave', () => {
      svg.style.transform = 'scale(1)';
      svg.style.filter = 'none';
    });
  }
}

export default ModernMarkerGenerator;