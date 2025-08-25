// Sentir - Interactive Mathematics and Mental Health Application

// Navigation functionality
class Navigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav__link');
        this.sections = document.querySelectorAll('.section');
        this.init();
    }

    init() {
        // Add click event listeners to navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('data-section');
                console.log('Navigating to:', targetSection); // Debug log
                this.showSection(targetSection);
                this.updateActiveLink(link);
                
                // Update URL hash without scrolling
                if (targetSection !== 'home') {
                    history.pushState(null, null, `#${targetSection}`);
                } else {
                    history.pushState(null, null, window.location.pathname);
                }
            });
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleHashChange();
        });

        // Handle initial page load with hash
        this.handleHashChange();
    }

    showSection(sectionId) {
        console.log('Showing section:', sectionId, 'Available sections:', this.sections.length); // Debug log
        
        // Hide all sections
        this.sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('Section activated:', sectionId); // Debug log
        } else {
            console.error('Section not found:', sectionId); // Debug log
            // Fallback to home
            const homeSection = document.getElementById('home');
            if (homeSection) {
                homeSection.classList.add('active');
            }
        }
    }

    updateActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    handleHashChange() {
        const hash = window.location.hash.substring(1);
        const sectionToShow = hash || 'home';
        
        // Find and activate corresponding nav link
        const targetLink = document.querySelector(`[data-section="${sectionToShow}"]`);
        
        this.showSection(sectionToShow);
        this.updateActiveLink(targetLink);
    }
}

// Love Equation Simulator
class LoveEquationSimulator {
    constructor() {
        this.chart = null;
        this.controls = {};
        this.valueDisplays = {};
        this.initializeControls();
    }

    initializeControls() {
        // Wait a bit to ensure DOM elements are available
        setTimeout(() => {
            this.controls = {
                atraccion: document.getElementById('atraccion'),
                compatibilidad: document.getElementById('compatibilidad'),
                tiempoConstante: document.getElementById('tiempo-constante'),
                intensidad: document.getElementById('intensidad')
            };
            
            this.valueDisplays = {
                atraccion: document.getElementById('atraccion-value'),
                compatibilidad: document.getElementById('compatibilidad-value'),
                tiempo: document.getElementById('tiempo-value'),
                intensidad: document.getElementById('intensidad-value')
            };

            this.init();
        }, 500);
    }

    init() {
        // Check if controls are available
        const controlsAvailable = Object.values(this.controls).every(control => control !== null);
        if (!controlsAvailable) {
            console.log('Love equation controls not yet available, retrying...');
            setTimeout(() => this.initializeControls(), 1000);
            return;
        }

        console.log('Initializing love equation simulator...');
        
        // Initialize chart
        this.createChart();
        
        // Add event listeners to controls
        Object.keys(this.controls).forEach(key => {
            const control = this.controls[key];
            if (control) {
                control.addEventListener('input', () => {
                    this.updateValueDisplay(key);
                    this.updateChart();
                });
                console.log(`Added event listener for ${key}`);
            }
        });

        // Initial value display update
        this.updateAllValueDisplays();
    }

    updateValueDisplay(controlKey) {
        const control = this.controls[controlKey];
        const displayKey = controlKey === 'tiempoConstante' ? 'tiempo' : controlKey;
        const display = this.valueDisplays[displayKey];
        
        if (control && display) {
            display.textContent = parseFloat(control.value).toFixed(1);
        }
    }

    updateAllValueDisplays() {
        Object.keys(this.controls).forEach(key => {
            this.updateValueDisplay(key);
        });
    }

    // Love equation: Amor(t) = A * e^(-t/T) + C * cos(I*t)
    loveFunction(t, A, C, T, I) {
        return A * Math.exp(-t / T) + C * Math.cos(I * t);
    }

    generateLoveData() {
        const A = parseFloat(this.controls.atraccion?.value || 5);
        const C = parseFloat(this.controls.compatibilidad?.value || 3);
        const T = parseFloat(this.controls.tiempoConstante?.value || 10);
        const I = parseFloat(this.controls.intensidad?.value || 1);

        const data = [];
        const labels = [];
        
        for (let t = 0; t <= 50; t += 0.5) {
            labels.push(t.toFixed(1));
            data.push(this.loveFunction(t, A, C, T, I));
        }

        return { labels, data };
    }

    createChart() {
        const ctx = document.getElementById('love-chart');
        if (!ctx) {
            console.log('Love chart canvas not found');
            return;
        }

        console.log('Creating love chart...');
        const { labels, data } = this.generateLoveData();

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Intensidad del Amor',
                    data: data,
                    borderColor: '#FFB6C1',
                    backgroundColor: 'rgba(255, 182, 193, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tiempo',
                            font: { size: 14, weight: 'bold' }
                        },
                        grid: { color: 'rgba(0,0,0,0.1)' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Intensidad del Amor',
                            font: { size: 14, weight: 'bold' }
                        },
                        grid: { color: 'rgba(0,0,0,0.1)' }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `Amor: ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
        
        console.log('Love chart created successfully');
    }

    updateChart() {
        if (!this.chart) return;

        const { labels, data } = this.generateLoveData();
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update('none');
    }
}

// Brain Waves Simulator
class BrainWavesSimulator {
    constructor() {
        this.chart = null;
        this.animationId = null;
        this.time = 0;
        this.waveTypes = {
            delta: { frequency: 2, color: '#0066CC', enabled: true, amplitude: 2 },
            theta: { frequency: 6, color: '#0099CC', enabled: true, amplitude: 2 },
            alpha: { frequency: 10, color: '#00CC99', enabled: true, amplitude: 2 },
            beta: { frequency: 20, color: '#CCAA00', enabled: true, amplitude: 2 },
            gamma: { frequency: 40, color: '#CC6600', enabled: true, amplitude: 1 }
        };
        this.initializeControls();
    }

    initializeControls() {
        setTimeout(() => {
            this.init();
        }, 500);
    }

    init() {
        const deltaCheckbox = document.getElementById('delta-wave');
        if (!deltaCheckbox) {
            console.log('Brain waves controls not yet available, retrying...');
            setTimeout(() => this.initializeControls(), 1000);
            return;
        }

        console.log('Initializing brain waves simulator...');
        this.createChart();
        this.setupControls();
        this.startAnimation();
    }

    setupControls() {
        Object.keys(this.waveTypes).forEach(waveType => {
            const checkbox = document.getElementById(`${waveType}-wave`);
            const amplitude = document.getElementById(`${waveType}-amplitude`);

            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    this.waveTypes[waveType].enabled = e.target.checked;
                    this.updateChart();
                });
                console.log(`Added checkbox listener for ${waveType}`);
            }

            if (amplitude) {
                amplitude.addEventListener('input', (e) => {
                    this.waveTypes[waveType].amplitude = parseFloat(e.target.value);
                    this.updateChart();
                });
                console.log(`Added amplitude listener for ${waveType}`);
            }
        });
    }

    // Generate sine wave: y = A * sin(2π * f * t)
    generateWave(frequency, amplitude, timeOffset = 0) {
        const data = [];
        const sampleRate = 100; // Points per second
        
        for (let i = 0; i < sampleRate; i++) {
            const t = (i + timeOffset) / sampleRate;
            const y = amplitude * Math.sin(2 * Math.PI * frequency * t);
            data.push(y);
        }
        
        return data;
    }

    generateCombinedWave() {
        const sampleRate = 100;
        const combinedData = new Array(sampleRate).fill(0);
        
        Object.keys(this.waveTypes).forEach(waveType => {
            const wave = this.waveTypes[waveType];
            if (wave.enabled) {
                const waveData = this.generateWave(wave.frequency, wave.amplitude, this.time);
                for (let i = 0; i < sampleRate; i++) {
                    combinedData[i] += waveData[i];
                }
            }
        });
        
        return combinedData;
    }

    createChart() {
        const ctx = document.getElementById('brain-waves-chart');
        if (!ctx) {
            console.log('Brain waves chart canvas not found');
            return;
        }

        console.log('Creating brain waves chart...');
        const labels = Array.from({length: 100}, (_, i) => (i / 100).toFixed(2));
        
        const datasets = [];
        
        // Individual wave datasets
        Object.keys(this.waveTypes).forEach(waveType => {
            const wave = this.waveTypes[waveType];
            datasets.push({
                label: `${waveType.charAt(0).toUpperCase() + waveType.slice(1)} (${wave.frequency} Hz)`,
                data: this.generateWave(wave.frequency, wave.amplitude),
                borderColor: wave.color,
                backgroundColor: 'transparent',
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointRadius: 0,
                hidden: false
            });
        });

        // Combined wave dataset
        datasets.push({
            label: 'Señal Combinada',
            data: this.generateCombinedWave(),
            borderColor: '#2C3E50',
            backgroundColor: 'rgba(44, 62, 80, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.1,
            pointRadius: 0
        });

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tiempo (s)',
                            font: { size: 14, weight: 'bold' }
                        },
                        grid: { color: 'rgba(0,0,0,0.1)' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amplitud (μV)',
                            font: { size: 14, weight: 'bold' }
                        },
                        grid: { color: 'rgba(0,0,0,0.1)' },
                        min: -10,
                        max: 10
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            filter: function(legendItem, chartData) {
                                return legendItem.text !== 'Señal Combinada';
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });

        console.log('Brain waves chart created successfully');
    }

    updateChart() {
        if (!this.chart) return;

        // Update individual waves
        Object.keys(this.waveTypes).forEach((waveType, index) => {
            const wave = this.waveTypes[waveType];
            const dataset = this.chart.data.datasets[index];
            
            if (wave.enabled) {
                dataset.data = this.generateWave(wave.frequency, wave.amplitude, this.time);
                dataset.hidden = false;
            } else {
                dataset.hidden = true;
            }
        });

        // Update combined wave
        const combinedDataset = this.chart.data.datasets[this.chart.data.datasets.length - 1];
        combinedDataset.data = this.generateCombinedWave();

        this.chart.update('none');
    }

    startAnimation() {
        const animate = () => {
            this.time += 0.02; // Increment time for animation
            this.updateChart();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Application initialization
class SentirApp {
    constructor() {
        this.navigation = null;
        this.loveSimulator = null;
        this.brainWavesSimulator = null;
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        console.log('Initializing Sentir application...');
        
        // Initialize navigation first
        this.navigation = new Navigation();

        // Initialize simulators with delay to ensure DOM is ready
        setTimeout(() => {
            this.loveSimulator = new LoveEquationSimulator();
            this.brainWavesSimulator = new BrainWavesSimulator();
        }, 100);

        // Add additional functionality
        this.addSmoothScrolling();
        this.handleResponsiveDesign();
        
        console.log('Sentir application initialized successfully');
    }

    addSmoothScrolling() {
        // Smooth transitions for section changes
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.transition = 'opacity 0.6s ease-out';
        });
    }

    handleResponsiveDesign() {
        // Handle window resize for chart responsiveness
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (this.loveSimulator?.chart) {
                    this.loveSimulator.chart.resize();
                }
                if (this.brainWavesSimulator?.chart) {
                    this.brainWavesSimulator.chart.resize();
                }
            }, 250);
        });

        // Handle visibility changes to optimize performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.brainWavesSimulator?.stopAnimation();
            } else {
                this.brainWavesSimulator?.startAnimation();
            }
        });
    }
}

// Initialize the application
const sentirApp = new SentirApp();