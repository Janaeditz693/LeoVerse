// Application Data from provided JSON
const appData = {
    userTypes: {
        worker: {
            name: "Rajesh Kumar",
            phone: "+91 98765 43210",
            location: "Mumbai, Maharashtra",
            skills: ["House Cleaning", "Gardening", "Delivery"],
            hourlyRate: "₹150/hour",
            rating: 4.3,
            completedJobs: 47,
            joinedDate: "2024-03-15",
            isAvailable: true,
            profilePhoto: "https://images.pexels.com/photos/4254168/pexels-photo-4254168.jpeg?auto=compress&cs=tinysrgb&w=300"
        },
        employer: {
            name: "Tech Solutions Pvt Ltd",
            contactPerson: "Priya Sharma",
            phone: "+91 87654 32109",
            location: "Bangalore, Karnataka",
            postedJobs: 12,
            rating: 4.7,
            verified: true
        }
    },
    serviceCategories: [
        {
            id: "cleaning",
            name: "House Cleaning",
            icon: "fas fa-broom",
            workers: 234,
            avgRate: "₹200/hour",
            image: "https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
            id: "construction",
            name: "Construction",
            icon: "fas fa-hard-hat",
            workers: 156,
            avgRate: "₹300/hour",
            image: "https://images.pexels.com/photos/2097617/pexels-photo-2097617.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
            id: "electrician",
            name: "Electrician",
            icon: "fas fa-bolt",
            workers: 89,
            avgRate: "₹250/hour",
            image: "https://images.pexels.com/photos/5974059/pexels-photo-5974059.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
            id: "plumbing",
            name: "Plumbing",
            icon: "fas fa-wrench",
            workers: 67,
            avgRate: "₹280/hour",
            image: "https://images.pexels.com/photos/8585153/pexels-photo-8585153.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
            id: "delivery",
            name: "Delivery",
            icon: "fas fa-motorcycle",
            workers: 198,
            avgRate: "₹180/hour",
            image: "https://images.pexels.com/photos/4391478/pexels-photo-4391478.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
            id: "gardening",
            name: "Gardening",
            icon: "fas fa-leaf",
            workers: 45,
            avgRate: "₹160/hour",
            image: "https://images.pexels.com/photos/4505463/pexels-photo-4505463.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
    ],
    availableJobs: [
        {
            id: 1,
            title: "Office Cleaning Required",
            category: "cleaning",
            employer: "Tech Solutions",
            location: "Koramangala, Bangalore",
            duration: "4 hours",
            rate: "₹200/hour",
            date: "2025-01-15",
            time: "09:00 AM",
            urgency: "medium",
            description: "Deep cleaning of 2000 sq ft office space"
        },
        {
            id: 2,
            title: "Electrical Wiring Work",
            category: "electrician",
            employer: "Residential Client",
            location: "Whitefield, Bangalore",
            duration: "6 hours",
            rate: "₹300/hour",
            date: "2025-01-16",
            time: "10:00 AM",
            urgency: "high",
            description: "New electrical connections for 3BHK apartment"
        }
    ],
    workers: [
        {
            id: 1,
            name: "Suresh Patel",
            skills: ["House Cleaning", "Office Cleaning"],
            rating: 4.5,
            hourlyRate: "₹180/hour",
            location: "2.3 km away",
            completedJobs: 23,
            profilePhoto: "https://images.pexels.com/photos/4254168/pexels-photo-4254168.jpeg?auto=compress&cs=tinysrgb&w=300",
            available: true
        },
        {
            id: 2,
            name: "Vikram Singh",
            skills: ["Electrician", "Appliance Repair"],
            rating: 4.8,
            hourlyRate: "₹320/hour",
            location: "1.8 km away",
            completedJobs: 67,
            profilePhoto: "https://images.pexels.com/photos/4254168/pexels-photo-4254168.jpeg?auto=compress&cs=tinysrgb&w=300",
            available: true
        }
    ]
};

// Application State
const appState = {
    currentScreen: 'landing-screen',
    userType: null, // 'worker' or 'employer'
    activeTab: 'home-screen',
    currentFormStep: 1,
    user: null
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    populateCategories();
    populateRecentJobs();
    populateWorkers();
    
    // Hide bottom nav initially (landing page)
    updateBottomNavVisibility();
}

function setupEventListeners() {
    // Landing page buttons
    document.getElementById('find-work-btn').addEventListener('click', function() {
        appState.userType = 'worker';
        appState.user = appData.userTypes.worker;
        navigateToScreen('home-screen');
    });
    
    document.getElementById('hire-workers-btn').addEventListener('click', function() {
        appState.userType = 'employer';
        appState.user = appData.userTypes.employer;
        navigateToScreen('search-screen');
    });
    
    // Bottom navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetScreen = this.dataset.screen;
            if (targetScreen) {
                navigateToScreen(targetScreen);
                setActiveNavItem(this);
            }
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filter chips
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Remove active class from all chips
            filterChips.forEach(c => c.classList.remove('active'));
            // Add active class to clicked chip
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterWorkers(category);
        });
    });
    
    // Job form navigation
    setupJobFormNavigation();
    
    // Profile toggle
    const availabilityToggle = document.getElementById('availability-toggle');
    if (availabilityToggle) {
        availabilityToggle.addEventListener('change', function() {
            if (appState.user) {
                appState.user.isAvailable = this.checked;
                updateAvailabilityText();
            }
        });
    }
}

function navigateToScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        appState.currentScreen = screenId;
        
        // Update bottom nav visibility
        updateBottomNavVisibility();
        
        // Load screen-specific data
        loadScreenData(screenId);
    }
}

function updateBottomNavVisibility() {
    const bottomNav = document.getElementById('bottom-nav');
    const isLandingPage = appState.currentScreen === 'landing-screen';
    
    if (isLandingPage) {
        bottomNav.classList.add('hidden');
    } else {
        bottomNav.classList.remove('hidden');
    }
}

function setActiveNavItem(clickedItem) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    clickedItem.classList.add('active');
}

function populateCategories() {
    const categoriesGrid = document.getElementById('categories-grid');
    if (!categoriesGrid) return;
    
    categoriesGrid.innerHTML = '';
    
    appData.serviceCategories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.innerHTML = `
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <h3 class="category-name">${category.name}</h3>
            <div class="category-stats">
                <div>${category.workers} workers</div>
                <div>${category.avgRate}</div>
            </div>
        `;
        
        categoryCard.addEventListener('click', function() {
            // Navigate to search screen with category filter
            navigateToScreen('search-screen');
            filterWorkers(category.id);
            
            // Update filter chip
            const filterChips = document.querySelectorAll('.filter-chip');
            filterChips.forEach(chip => {
                chip.classList.toggle('active', chip.dataset.category === category.id);
            });
        });
        
        categoriesGrid.appendChild(categoryCard);
    });
}

function populateRecentJobs() {
    const recentJobsContainer = document.getElementById('recent-jobs');
    if (!recentJobsContainer) return;
    
    recentJobsContainer.innerHTML = '';
    
    // Use available jobs as recent jobs for demo
    appData.availableJobs.slice(0, 3).forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
            <div class="job-header">
                <div>
                    <h3 class="job-title">${job.title}</h3>
                    <p class="job-company">${job.employer}</p>
                </div>
                <div class="job-pay">${job.rate}</div>
            </div>
            <div class="job-meta">
                <div class="job-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${job.location}</span>
                </div>
                <div class="job-time">
                    <i class="fas fa-clock"></i>
                    <span>${job.duration}</span>
                </div>
            </div>
            <div class="job-status ${job.urgency}">${job.urgency}</div>
        `;
        
        jobCard.addEventListener('click', function() {
            showJobDetails(job);
        });
        
        recentJobsContainer.appendChild(jobCard);
    });
}

function populateWorkers(filteredWorkers = null) {
    const workersContainer = document.getElementById('workers-list');
    if (!workersContainer) return;
    
    const workersToShow = filteredWorkers || appData.workers;
    workersContainer.innerHTML = '';
    
    if (workersToShow.length === 0) {
        workersContainer.innerHTML = '<div class="loading">No workers found matching your criteria</div>';
        return;
    }
    
    workersToShow.forEach(worker => {
        const workerCard = document.createElement('div');
        workerCard.className = 'worker-card';
        workerCard.innerHTML = `
            <div class="worker-header">
                <img src="${worker.profilePhoto}" alt="${worker.name}" class="worker-avatar">
                <div class="worker-info">
                    <h3>${worker.name}</h3>
                    <div class="worker-rating">
                        <div class="stars">
                            ${generateStarRating(worker.rating)}
                        </div>
                        <span class="rating-text">${worker.rating} (${worker.completedJobs} jobs)</span>
                    </div>
                    <div class="worker-rate">${worker.hourlyRate}</div>
                </div>
            </div>
            <div class="worker-skills">
                ${worker.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            <div class="worker-distance">
                <i class="fas fa-map-marker-alt"></i>
                ${worker.location}
            </div>
            <div class="worker-actions">
                <button class="btn btn--secondary" onclick="contactWorker(${worker.id})">
                    <i class="fas fa-phone"></i>
                    Contact
                </button>
                <button class="btn btn--primary" onclick="viewWorkerProfile(${worker.id})">
                    <i class="fas fa-user"></i>
                    View Profile
                </button>
            </div>
        `;
        
        workersContainer.appendChild(workerCard);
    });
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function filterWorkers(category) {
    if (category === 'all') {
        populateWorkers();
        return;
    }
    
    // Map category IDs to skill names
    const categoryToSkill = {
        'cleaning': 'House Cleaning',
        'construction': 'Construction',
        'electrician': 'Electrician',
        'plumbing': 'Plumbing',
        'delivery': 'Delivery',
        'gardening': 'Gardening'
    };
    
    const skillName = categoryToSkill[category];
    if (!skillName) {
        populateWorkers();
        return;
    }
    
    const filteredWorkers = appData.workers.filter(worker => 
        worker.skills.some(skill => skill.includes(skillName))
    );
    
    populateWorkers(filteredWorkers);
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        populateWorkers();
        return;
    }
    
    const filteredWorkers = appData.workers.filter(worker => 
        worker.name.toLowerCase().includes(searchTerm) ||
        worker.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        worker.location.toLowerCase().includes(searchTerm)
    );
    
    populateWorkers(filteredWorkers);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function setupJobFormNavigation() {
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const publishBtn = document.getElementById('publish-btn');
    const jobForm = document.getElementById('job-form');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextFormStep);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevFormStep);
    }
    
    if (publishBtn) {
        publishBtn.addEventListener('click', publishJob);
    }
    
    if (jobForm) {
        jobForm.addEventListener('submit', function(e) {
            e.preventDefault();
            publishJob();
        });
    }
}

function nextFormStep() {
    if (appState.currentFormStep < 3) {
        // Hide current step
        const currentStep = document.querySelector(`.form-step[data-step="${appState.currentFormStep}"]`);
        const currentStepIndicator = document.querySelector(`.step[data-step="${appState.currentFormStep}"]`);
        
        if (currentStep) currentStep.classList.remove('active');
        if (currentStepIndicator) currentStepIndicator.classList.remove('active');
        
        // Show next step
        appState.currentFormStep++;
        const nextStep = document.querySelector(`.form-step[data-step="${appState.currentFormStep}"]`);
        const nextStepIndicator = document.querySelector(`.step[data-step="${appState.currentFormStep}"]`);
        
        if (nextStep) nextStep.classList.add('active');
        if (nextStepIndicator) nextStepIndicator.classList.add('active');
        
        // Update button visibility
        updateFormButtons();
    }
}

function prevFormStep() {
    if (appState.currentFormStep > 1) {
        // Hide current step
        const currentStep = document.querySelector(`.form-step[data-step="${appState.currentFormStep}"]`);
        const currentStepIndicator = document.querySelector(`.step[data-step="${appState.currentFormStep}"]`);
        
        if (currentStep) currentStep.classList.remove('active');
        if (currentStepIndicator) currentStepIndicator.classList.remove('active');
        
        // Show previous step
        appState.currentFormStep--;
        const prevStep = document.querySelector(`.form-step[data-step="${appState.currentFormStep}"]`);
        const prevStepIndicator = document.querySelector(`.step[data-step="${appState.currentFormStep}"]`);
        
        if (prevStep) prevStep.classList.add('active');
        if (prevStepIndicator) prevStepIndicator.classList.add('active');
        
        // Update button visibility
        updateFormButtons();
    }
}

function updateFormButtons() {
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const publishBtn = document.getElementById('publish-btn');
    
    if (appState.currentFormStep === 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'inline-flex';
        if (publishBtn) publishBtn.style.display = 'none';
    } else if (appState.currentFormStep === 3) {
        if (prevBtn) prevBtn.style.display = 'inline-flex';
        if (nextBtn) nextBtn.style.display = 'none';
        if (publishBtn) publishBtn.style.display = 'inline-flex';
    } else {
        if (prevBtn) prevBtn.style.display = 'inline-flex';
        if (nextBtn) nextBtn.style.display = 'inline-flex';
        if (publishBtn) publishBtn.style.display = 'none';
    }
}

function publishJob() {
    // Collect form data
    const formData = {
        title: document.getElementById('job-title')?.value,
        category: document.getElementById('job-category')?.value,
        description: document.getElementById('job-description')?.value,
        duration: document.getElementById('job-duration')?.value,
        location: document.getElementById('job-location')?.value,
        date: document.getElementById('job-date')?.value,
        time: document.getElementById('job-time')?.value,
        urgency: document.getElementById('urgency')?.value,
        paymentType: document.getElementById('payment-type')?.value,
        budget: document.getElementById('budget')?.value,
        requirements: document.getElementById('requirements')?.value
    };
    
    // Basic validation
    if (!formData.title || !formData.category || !formData.description) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Simulate job posting
    console.log('Job posted:', formData);
    alert('Job posted successfully!');
    
    // Reset form and navigate to home
    resetJobForm();
    navigateToScreen('home-screen');
    setActiveNavItem(document.querySelector('.nav-item[data-screen="home-screen"]'));
}

function resetJobForm() {
    const jobForm = document.getElementById('job-form');
    if (jobForm) {
        jobForm.reset();
    }
    
    // Reset to first step
    appState.currentFormStep = 1;
    
    // Reset step indicators
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.toggle('active', index === 0);
    });
    
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.toggle('active', index === 0);
    });
    
    updateFormButtons();
}

function loadScreenData(screenId) {
    switch (screenId) {
        case 'home-screen':
            // Update user-specific data
            if (appState.user) {
                updateUserGreeting();
            }
            break;
        case 'profile-screen':
            updateProfileData();
            break;
        case 'post-job-screen':
            resetJobForm();
            break;
    }
}

function updateUserGreeting() {
    const greeting = document.querySelector('.greeting');
    if (greeting && appState.user) {
        const userName = appState.user.name || appState.user.contactPerson;
        greeting.textContent = `Welcome back, ${userName}!`;
    }
}

function updateProfileData() {
    if (!appState.user || appState.userType !== 'worker') return;
    
    const user = appState.user;
    
    // Update profile elements
    const profileName = document.getElementById('profile-name');
    const profileLocation = document.getElementById('profile-location');
    const profileImage = document.getElementById('profile-image');
    const skillsList = document.getElementById('skills-list');
    const availabilityToggle = document.getElementById('availability-toggle');
    
    if (profileName) profileName.textContent = user.name;
    if (profileLocation) profileLocation.textContent = user.location;
    if (profileImage) profileImage.src = user.profilePhoto;
    if (availabilityToggle) availabilityToggle.checked = user.isAvailable;
    
    if (skillsList) {
        skillsList.innerHTML = user.skills.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');
    }
    
    updateAvailabilityText();
}

function updateAvailabilityText() {
    const availabilityText = document.querySelector('.availability-text');
    if (availabilityText && appState.user) {
        availabilityText.textContent = appState.user.isAvailable ? 
            'Available for work' : 'Not available';
    }
}

// Utility Functions
function contactWorker(workerId) {
    const worker = appData.workers.find(w => w.id === workerId);
    if (worker) {
        alert(`Contacting ${worker.name}...\nPhone: +91 98765 43210`);
    }
}

function viewWorkerProfile(workerId) {
    const worker = appData.workers.find(w => w.id === workerId);
    if (worker) {
        alert(`Viewing profile of ${worker.name}\nSkills: ${worker.skills.join(', ')}\nRating: ${worker.rating}/5`);
    }
}

function showJobDetails(job) {
    alert(`Job: ${job.title}\nEmployer: ${job.employer}\nLocation: ${job.location}\nPay: ${job.rate}\nDescription: ${job.description}`);
}

// Lazy loading implementation
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', lazyLoadImages);
