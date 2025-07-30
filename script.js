// script.js - v13.1 (Final, Complete Version with All Code)

// ==================================================
// ======== 0. FIREBASE SETUP (Module Syntax) =======
// ==================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDfeMg7BzcR1UvsZtFv4SQQtfJZWSdsGxY",
  authDomain: "lifewood-420.firebaseapp.com",
  projectId: "lifewood-420",
  storageBucket: "lifewood-420.firebasestorage.app",
  messagingSenderId: "277748825194",
  appId: "1:277748825194:web:a39e906c4bdf3417e25e13",
  measurementId: "G-KDJ2ZXXCHG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==================================================
// ===== 1. GLOBAL HELPER FUNCTIONS & VARIABLES =====
// ==================================================
const body = document.body;
let originalModalHTML = ''; // Will be used to store and reset the application form

window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        if (modalId === 'application-modal' && originalModalHTML) {
            modal.querySelector('.modal-content').innerHTML = originalModalHTML;
            attachFormListener(); 
            populatePositionsDropdown();
        }
        modal.classList.remove('is-closing');
        modal.style.display = 'flex';
        body.classList.add('modal-open');
    }
}

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('is-closing');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('is-closing');
            body.classList.remove('modal-open');
        }, 300);
    }
}

function attachFormListener() {
    const applicationForm = document.getElementById('application-form');
    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = applicationForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            const formData = {
                name: document.getElementById('app-name').value,
                email: document.getElementById('app-email').value,
                position: document.getElementById('app-position').value,
                resumeLink: document.getElementById('app-resumeLink').value,
                portfolioLink: document.getElementById('app-portfolioLink').value,
                submittedAt: serverTimestamp(),
                status: 'Pending'
            };
            try {
                await addDoc(collection(db, "applications"), formData);
                const modalContent = document.querySelector('#application-modal .modal-content');
                modalContent.innerHTML = `
                    <button class="modal-close" onclick="window.closeModal('application-modal')">×</button>
                    <div style="text-align: center; padding: 2rem 0;">
                        <h3>Thank You!</h3>
                        <p>Thank you for applying. Your application will be reviewed shortly.</p>
                        <br>
                        <button onclick="window.closeModal('application-modal')" class="btn btn-primary">Close</button>
                    </div>
                `;
            } catch (error) {
                console.error("Error adding document: ", error);
                const feedback = document.getElementById('applicant-form-feedback');
                if(feedback){
                    feedback.style.color = 'red';
                    feedback.textContent = 'An error occurred. Please try again.';
                    feedback.style.display = 'block';
                }
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Application';
            }
        });
    }
}

async function populatePositionsDropdown() {
    const positionsCollectionRef = collection(db, "positions");
    const positionSelect = document.getElementById('app-position');
    if (!positionSelect) return;
    try {
        const q = query(positionsCollectionRef, orderBy("name"));
        const querySnapshot = await getDocs(q);
        positionSelect.innerHTML = '<option value="" disabled selected>Select a position...</option>';
        if (querySnapshot.empty) {
            positionSelect.disabled = true;
            positionSelect.innerHTML = '<option value="" disabled>No open positions at this time.</option>';
        } else {
            positionSelect.disabled = false;
            querySnapshot.forEach((doc) => {
                const position = doc.data();
                const option = document.createElement('option');
                option.value = position.name;
                option.textContent = position.name;
                positionSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error fetching job positions: ", error);
        positionSelect.disabled = true;
        positionSelect.innerHTML = '<option value="" disabled>Could not load positions.</option>';
    }
}

// ==================================================
// === 2. ON-LOAD & DYNAMIC CONTENT LOGIC ===========
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
    const applicationModalContent = document.querySelector('#application-modal .modal-content');
    if (applicationModalContent) {
        originalModalHTML = applicationModalContent.innerHTML;
    }
    attachFormListener();
    populatePositionsDropdown();

    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            body.classList.toggle('nav-open');
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Section: Translations & Language Switcher (FULL VERSION RESTORED) ---
    const translations = {
      // English
      en: {
        'nav-solutions': 'Solutions', 'nav-about': 'About Us', 'nav-services': 'Services', 'nav-contact': 'Contact Us', 'nav-apply': 'Apply Now!', 'learn-more': 'Learn More →', 'footer-motto': 'Bridging cultures through technology.', 'footer-nav-title': 'Navigate', 'footer-nav-home': 'Home', 'footer-nav-solutions': 'Solutions', 'footer-nav-about': 'About Us', 'footer-nav-services': 'Services', 'footer-solutions-title': 'Solutions', 'footer-solutions-talent': 'Customer Data Platform', 'footer-follow-title': 'Follow Us', 'footer-copyright': '© 2025 Lifewood. All rights reserved.',
        'index-hero-title': 'Your Always-On Global Technology Partner.', 'index-hero-subtitle': 'We build adaptive, innovative solutions that bridge cultures, streamline operations, and accelerate your growth.', 'index-hero-button': 'Explore Our Solutions', 'index-proof-label': 'TRUSTED BY GLOBAL COMPANIES', 'index-solutions-title': 'Transformative Solutions for a Connected World.', 'index-solutions-card1-title': 'Cross-Border Platforms', 'index-solutions-card1-text': 'Seamlessly connect markets with our robust and scalable e-commerce infrastructure.', 'index-solutions-card2-title': 'Customer Data Platform', 'index-solutions-card2-text': 'Unify your international teams with one adaptive, intelligent software suite.', 'index-solutions-card3-title': 'Technology Consulting', 'index-solutions-card3-text': 'Leverage our strategic expertise to navigate complex digital transformations.', 'index-dna-title': 'Engineered to be Adaptive. Built to be Proactive.', 'index-dna-text': "Our core DNA is built on being 'Always On Never Off.' This means we don't just solve today's problems—we anticipate tomorrow's opportunities, ensuring your business has a constant, evolving competitive edge.", 'index-dna-hex1': 'ADAPTIVE', 'index-dna-hex2': 'INNOVATIVE', 'index-dna-hex3': 'PROACTIVE', 'index-dna-hex4': 'TECH', 'index-cta-title': 'Ready to Evolve?', 'index-cta-text': "Let's build your future. Schedule a strategic consultation with our experts today.", 'index-cta-button': 'Schedule a Consultation',
        'about-hero-title': 'We Bridge Cultures Through Technology.', 'about-hero-subtitle': 'Our mission is to empower global businesses with transformative solutions built on trust, innovation, and a deep understanding of human connection.', 'about-timeline-card1-title': 'Lifewood Founded', 'about-timeline-card1-text': "Founded in year 2004 with the core principle of being 'Always On' to solve cross-border tech challenges.", 'about-timeline-card2-title': '15 Years of Experience', 'about-timeline-card2-text': 'With over 15 years of experience in AI data solutions, we are working hard to innovate and expand our impact globally.', 'about-timeline-card3-title': 'What we believe', 'about-timeline-card3-text': 'We believe that AI and Big Data is the driving force for our economy.', 'about-team-title': 'Meet Our Leadership', 'about-team-subtitle': "The architects of our 'Always On' philosophy, guiding our mission with expertise and vision.", 'about-team-member1-name': 'Person 1', 'about-team-member1-title': 'Co-Founder & CEO', 'about-team-member2-name': 'Person 2', 'about-team-member2-title': 'Co-Founder & CTO', 'about-team-member3-name': 'Person 3', 'about-team-member3-title': 'VP of Global Strategy', 'about-cta-title': 'Join Our Mission', 'about-cta-text': "We're looking for proactive and innovative minds to help us build the future. Explore our open positions.", 'about-cta-button': 'Apply Now!',
        'contact-hero-title': "Let's Connect.", 'contact-hero-subtitle': "Whether you have a specific project in mind or want to learn more about our approach, we're ready to talk.", 'contact-form-title': 'Send Us a Message', 'contact-form-name': 'Full Name*', 'contact-form-email': 'Work Email*', 'contact-form-company': 'Company Name', 'contact-form-help': 'How can we help?*', 'contact-form-button': 'Send Message', 'contact-details-title': 'Our Offices', 'contact-details-office1-name': 'Lifewood Cebu', 'contact-details-office2-name': 'Lifewood Legazpi',
        'solutions-hero-label': 'Customer Data Platform', 'solutions-hero-title': 'From Scattered Data to Lifelong Customers.', 'solutions-hero-subtitle': 'The Lifewood Customer Data Platform unifies all your customer touchpoints into a single, actionable view. Understand the entire customer journey and cultivate relationships that grow over time.', 'solutions-hero-button': 'Request a Demo', 'solutions-caps-title': 'Core Capabilities', 'solutions-caps-subtitle': 'A comprehensive feature set engineered for modern marketing.', 'solutions-caps-card1-title': '360° Customer View', 'solutions-caps-card1-text': 'Effortlessly stitch together data from every source—web, mobile, CRM, support—to see every customer as a whole person, not just a data point.', 'solutions-caps-card2-title': 'Intuitive Audience Building', 'solutions-caps-card2-text': 'Empower your marketing team to create rich, dynamic segments with a simple, no-code interface. Target the right customers at the perfect moment.', 'solutions-caps-card3-title': 'Real-Time Activation', 'solutions-caps-card3-text': 'Sync your unified data and audiences to your entire marketing and sales stack, powering personalized experiences that drive sustainable growth.', 'solutions-testimonial': '"Lifewood gave us the complete story of our customers. We moved from siloed guesswork to data-driven empathy. Our customer retention is up 20% year-over-year because we can finally build relationships at scale."', 'solutions-testimonial-cite': '– Global Operations Director', 'solutions-demo-title': 'See it in Action.', 'solutions-demo-text': 'Schedule a personalized demo and let us show you how our Customer Data Platform can be tailored to your business. See the "Always On" difference for yourself.', 'solutions-demo-button': 'Schedule My Demo',
        'services-hero-title': 'Services Offered', 'services-hero-subtitle': 'Explore our latest services tailored for global success.', 'services-filter-all': 'All Services', 'services-filter-pa': 'Predictive Analytics', 'services-filter-nlp': 'NLP', 'services-filter-de': 'Data Engineering', 'services-card1-title': 'Predictive Analytics', 'services-card1-text': 'Using machine learning models to forecast trends and behaviors. This is great for finance, retail, or healthcare clients.', 'services-card2-title': 'Natural Language Processing (NLP)', 'services-card2-text': 'Create chatbots, sentiment analysis tools, and text summarizers for client-facing applications.', 'services-card3-title': 'Data Engineering Solutions', 'services-card3-text': 'Architect scalable data systems using tools like Apache Spark, Hadoop, and SQL-based orchestration.', 'services-cta-title': 'Stay Ahead of the Curve.', 'services-cta-text': 'Get the latest Lifewood insights delivered directly to your inbox.', 'services-cta-button': 'Subscribe',
      },
      // Chinese
      zh: {
        'nav-solutions': '解决方案', 'nav-about': '关于我们', 'nav-services': '服务项目', 'nav-contact': '联系我们', 'nav-apply': '立即申请!', 'learn-more': '了解更多 →', 'footer-motto': '科技连接文化。', 'footer-nav-title': '导航', 'footer-nav-home': '首页', 'footer-nav-solutions': '解决方案', 'footer-nav-about': '关于我们', 'footer-nav-services': '服务项目', 'footer-solutions-title': '解决方案', 'footer-solutions-talent': '客户数据平台', 'footer-follow-title': '关注我们', 'footer-copyright': '© 2025 Lifewood. 版权所有。',
        'index-hero-title': '您永不间断的全球技术合作伙伴。', 'index-hero-subtitle': '我们构建适应性强的创新解决方案，连接不同文化，简化运营流程，并加速您的增长。', 'index-hero-button': '探索我们的解决方案', 'index-proof-label': '全球公司的信赖之选', 'index-solutions-title': '为互联世界打造的变革性解决方案。', 'index-solutions-card1-title': '跨境平台', 'index-solutions-card1-text': '通过我们强大且可扩展的电子商务基础设施，无缝连接各个市场。', 'index-solutions-card2-title': '全球人才管理', 'index-solutions-card2-text': '使用一套适应性强的智能软件套件，统一您的国际团队。', 'index-solutions-card3-title': '客户数据平台', 'index-solutions-card3-text': '利用我们的战略专业知识，驾驭复杂的数字化转型。', 'index-dna-title': '为适应而生，为主动而建。', 'index-dna-text': '我们的核心DNA建立在“永不间断”的理念之上。这意味着我们不仅解决今天的问题，更预见未来的机遇，确保您的业务拥有持续发展的竞争优势。', 'index-dna-hex1': '适应', 'index-dna-hex2': '创新', 'index-dna-hex3': '主动', 'index-dna-hex4': '技术', 'index-cta-title': '准备好进化了吗？', 'index-cta-text': '让我们共筑未来。立即与我们的专家安排一次战略咨询。', 'index-cta-button': '安排咨询',
        'about-hero-title': '我们通过技术连接文化。', 'about-hero-subtitle': '我们的使命是基于信任、创新和对人际联系的深刻理解，为全球企业提供变革性的解决方案。', 'about-timeline-card1-title': 'Lifewood成立', 'about-timeline-card1-text': '公司成立于2004年，核心原则是“永不间断”，致力于解决跨境技术挑战。', 'about-timeline-card2-title': '15年经验', 'about-timeline-card2-text': '凭借在人工智能数据解决方案领域超过15年的经验，我们努力创新并扩大我们的全球影响力。', 'about-timeline-card3-title': '我们的信念', 'about-timeline-card3-text': '我们相信人工智能和大数据是驱动我们经济发展的动力。', 'about-team-title': '认识我们的领导团队', 'about-team-subtitle': '我们“永不间断”理念的构建者，以专业知识和远见指导我们的使命。', 'about-team-member1-name': '人物一', 'about-team-member1-title': '联合创始人兼首席执行官', 'about-team-member2-name': '人物二', 'about-team-member2-title': '联合创始人兼首席技术官', 'about-team-member3-name': '人物三', 'about-team-member3-title': '全球战略副总裁', 'about-cta-title': '加入我们的使命', 'about-cta-text': '我们正在寻找积极主动、富有创新精神的人才与我们共筑未来。探索我们的空缺职位。', 'about-cta-button': '立即申请!',
        'contact-hero-title': '让我们建立联系。', 'contact-hero-subtitle': '无论您有特定的项目构想，还是想了解更多关于我们的方法，我们都随时准备好与您交谈。', 'contact-form-title': '给我们发送消息', 'contact-form-name': '全名*', 'contact-form-email': '工作邮箱*', 'contact-form-company': '公司名称', 'contact-form-help': '我们能如何帮助您？*', 'contact-form-button': '发送消息', 'contact-details-title': '我们的办公室', 'contact-details-office1-name': 'Lifewood 宿雾', 'contact-details-office2-name': 'Lifewood 黎牙实比',
        'solutions-hero-label': '客户数据平台', 'solutions-hero-title': '从分散数据到终身客户。', 'solutions-hero-subtitle': 'Lifewood客户数据平台将所有客户接触点统一到一个可操作的单一视图中。了解整个客户旅程，培养随时间增长的客户关系。', 'solutions-hero-button': '请求演示', 'solutions-caps-title': '核心功能', 'solutions-caps-subtitle': '为现代营销设计的全面功能集。', 'solutions-caps-card1-title': '360°客户视图', 'solutions-caps-card1-text': '轻松整合来自所有来源的数据——网站、移动端、CRM、支持——将每位客户视为一个完整的人，而不仅仅是一个数据点。', 'solutions-caps-card2-title': '直观的受众构建', 'solutions-caps-card2-text': '让您的营销团队能通过简单的无代码界面创建丰富、动态的细分。在完美的时刻触达正确的客户。', 'solutions-caps-card3-title': '实时激活', 'solutions-caps-card3-text': '将您的统一数据和受众同步到整个营销和销售技术栈，驱动个性化体验，实现可持续增长。', 'solutions-testimonial': '“Lifewood为我们提供了客户的完整故事。我们从孤立的猜测转向了数据驱动的共情。我们的客户保留率同比增长了20%，因为我们终于能够大规模地建立关系。”', 'solutions-testimonial-cite': '– 全球运营总监', 'solutions-demo-title': '亲身体验。', 'solutions-demo-text': '安排一次个性化演示，让我们向您展示我们的客户数据平台如何根据您的业务量身定制。亲眼见证“永不间断”的与众不同。', 'solutions-demo-button': '安排我的演示',
        'services-hero-title': '服务项目', 'services-hero-subtitle': '探索我们为全球成功量身定制的最新服务。', 'services-filter-all': '所有服务', 'services-filter-pa': '预测分析', 'services-filter-nlp': '自然语言处理', 'services-filter-de': '数据工程', 'services-card1-title': '预测分析', 'services-card1-text': '利用机器学习模型预测趋势和行为。非常适合金融、零售或医疗保健领域的客户。', 'services-card2-title': '自然语言处理 (NLP)', 'services-card2-text': '为面向客户的应用创建聊天机器人、情感分析工具和文本摘要器。', 'services-card3-title': '数据工程解决方案', 'services-card3-text': '使用 Apache Spark、Hadoop 和基于 SQL 的编排工具构建可扩展的数据系统。', 'services-cta-title': '保持领先地位。', 'services-cta-text': '将最新的 Lifewood 见解直接发送到您的收件箱。', 'services-cta-button': '订阅',
      }
    };
    let currentLang = localStorage.getItem('lifewood_lang') || 'en';
    const setLanguage = (lang) => {
        const pageId = body.id ? body.id.replace('page-', '') : null;
        currentLang = lang;
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.getAttribute('data-key');
            let translation = '';
            if (pageId && translations[lang][`${pageId}-${key}`]) {
                translation = translations[lang][`${pageId}-${key}`];
            } 
            else if (translations[lang][key]) {
                translation = translations[lang][key];
            }
            if (translation) {
                elem.innerHTML = translation;
            }
        });
        document.querySelectorAll('.lang-switcher-btn').forEach(button => {
            button.textContent = lang === 'en' ? '中文' : 'English';
        });
        document.documentElement.lang = lang;
        localStorage.setItem('lifewood_lang', lang);
    };
    setLanguage(currentLang);
    document.querySelectorAll('.lang-switcher-btn').forEach(button => {
        button.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'zh' : 'en';
            setLanguage(newLang);
        });
    });

    const loadElements = document.querySelectorAll('.animate-on-load');
    loadElements.forEach((el) => {
        const delay = el.dataset.delay || 0;
        setTimeout(() => { el.classList.add('is-visible'); }, parseInt(delay));
    });
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => { entry.target.classList.add('is-visible'); }, parseInt(delay));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        scrollElements.forEach(el => observer.observe(el));
    } else {
        scrollElements.forEach(el => el.classList.add('is-visible'));
    }
    
    // --- Konami Code Easter Egg for Admin Login ---
    const konamiSequence = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];
    let konamiPosition = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTap = 0;
    function checkKonami(key) {
        if (key === konamiSequence[konamiPosition]) {
            konamiPosition++;
            if (konamiPosition === konamiSequence.length) {
                window.openModal('admin-login-modal');
                konamiPosition = 0;
            }
        } else {
            konamiPosition = (key === konamiSequence[0]) ? 1 : 0;
        }
    }
    document.addEventListener('keydown', (e) => {
        let key = e.key.toLowerCase();
        if (key.startsWith('arrow')) { key = key.substring(5); }
        checkKonami(key);
    });
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            if (konamiSequence[konamiPosition] === 'b' || konamiSequence[konamiPosition] === 'a') {
                checkKonami(konamiSequence[konamiPosition]);
            }
            e.preventDefault();
        }
        lastTap = currentTime;
    }, { passive: false });
    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const minSwipeDistance = 50;
        if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) { return; }
        if (Math.abs(deltaX) > Math.abs(deltaY)) { checkKonami(deltaX > 0 ? 'right' : 'left'); } 
        else { checkKonami(deltaY > 0 ? 'down' : 'up'); }
    });

    // --- Admin Login Form Handler ---
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            const errorMsg = document.getElementById('admin-login-error');
            if (email === 'admin@lifewood.com' && password === 'secret123') {
                sessionStorage.setItem('lifewood_admin_auth', 'true');
                window.location.href = 'admin.html';
            } else {
                errorMsg.style.display = 'block';
            }
        });
    }
});
