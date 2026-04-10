// script.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. (Intersection Observer Removed - Replaced by AOS in index.html)


    // 2. Parallax Effect (Removed per user request)

    // 3. Smooth scrolling for Navigation
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Only use custom smooth scrolling for anchor links starting with '#'
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                // Note: Since sections are absolute positioned, standard scrollIntoView might be confused 
                // if we are scrolling the main wrapper or the window. Here they are nested in .home-page.
                // We just let the default or simulate a window scroll:
                if(targetSection) {
                   window.scrollTo({
                       top: targetSection.offsetTop,
                       behavior: 'smooth'
                   });
                }
            }
        });
    });

    // 4. Mobile Navigation Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navBar = document.querySelector('.navigation-bar');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('is-active');
            navBar.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if(mobileMenu.classList.contains('is-active')) {
                    mobileMenu.classList.remove('is-active');
                    navBar.classList.remove('active');
                }
            });
        });
    }

    // 5. Donate Modal
    const modalHTML = `
        <div id="donateModalOverlay" class="donate-modal-overlay">
            <div class="donate-modal-content">
                <span class="close-donate-modal">&times;</span>
                
                <div id="donateStep1">
                    <h3>Make a Donation</h3>
                    <p>Please enter your details to proceed.</p>
                    <form id="donateForm">
                        <div class="input-group">
                            <label>Name</label>
                            <input type="text" id="donateName" required placeholder="Enter your full name">
                        </div>
                        <div class="input-group">
                            <label>Payment For</label>
                            <input type="text" id="donateReason" required placeholder="E.g., ARD Week, Voluntary">
                        </div>
                        <button type="submit" class="btn-donate-submit">Proceed to Pay</button>
                    </form>
                </div>

                <div id="donateStep2" style="display: none;">
                    <h3>Bank Details</h3>
                    <p>Thank you, <span id="displayDonateName"></span>! Please transfer your donation to the following account:</p>
                    <div class="bank-details-box">
                        <p><strong>Bank Name:</strong> Access Bank</p>
                        <p><strong>Account Name:</strong> ARD OAUTHC</p>
                        <p><strong>Account Number:</strong> 0000000000</p>
                    </div>
                    <button type="button" class="btn-donate-done">Done</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const donateModalOverlay = document.getElementById('donateModalOverlay');
    const closeBtn = document.querySelector('.close-donate-modal');
    const doneBtn = document.querySelector('.btn-donate-done');
    const donateForm = document.getElementById('donateForm');
    const donateBtns = document.querySelectorAll('.btn-donate');

    donateBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            donateModalOverlay.style.display = 'flex';
            document.getElementById('donateStep1').style.display = 'block';
            document.getElementById('donateStep2').style.display = 'none';
            donateForm.reset();
        });
    });

    const closeModal = () => {
        donateModalOverlay.style.display = 'none';
    };

    closeBtn.addEventListener('click', closeModal);
    doneBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if(e.target === donateModalOverlay) closeModal();
    });

    donateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameVal = document.getElementById('donateName').value;
        document.getElementById('displayDonateName').textContent = nameVal;
        
        document.getElementById('donateStep1').style.display = 'none';
        document.getElementById('donateStep2').style.display = 'block';
    });

});
