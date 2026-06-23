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

    // 6. Share Buttons — Toast Element & Global Helpers
    const toastEl = document.createElement('div');
    toastEl.className = 'share-toast';
    toastEl.textContent = '✓ Link copied to clipboard';
    document.body.appendChild(toastEl);

});

// ─── Share Utility Functions (global) ──────────────────────────────
const ARDShare = {
    /** SVG icon for WhatsApp */
    whatsappIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,

    /** SVG icon for copy link */
    copyIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,

    /** SVG check icon for copied state */
    checkIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,

    /** Show the toast notification */
    showToast(message) {
        const toast = document.querySelector('.share-toast');
        if (!toast) return;
        toast.textContent = message || '✓ Link copied to clipboard';
        toast.classList.add('show');
        clearTimeout(ARDShare._toastTimeout);
        ARDShare._toastTimeout = setTimeout(() => toast.classList.remove('show'), 2200);
    },

    /** Copy a URL to clipboard and show toast */
    copyLink(url) {
        navigator.clipboard.writeText(url).then(() => {
            ARDShare.showToast('✓ Link copied to clipboard');
        }).catch(() => {
            // Fallback for older browsers
            const ta = document.createElement('textarea');
            ta.value = url;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            ARDShare.showToast('✓ Link copied to clipboard');
        });
    },

    /** Open WhatsApp share with title and URL */
    shareWhatsApp(title, url) {
        const text = encodeURIComponent(`${title}\n${url}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    },

    /**
     * Generate share buttons HTML
     * @param {string} title - The post/event title
     * @param {string} url - Full URL to share (for Copy Link)
     * @param {boolean} compact - Use compact variant for card listings
     * @param {string} shareType - 'news' or 'event' for share.php OG tags
     */
    buttonsHTML(title, url, compact = false, shareType = '') {
        const escapedTitle = title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const escapedUrl = url.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        let waUrl = url;
        if (shareType) {
            const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
            waUrl = baseUrl + 'share.php?type=' + encodeURIComponent(shareType) + '&title=' + encodeURIComponent(title);
        }

        return `
            <div class="share-buttons ${compact ? 'share-buttons--compact' : ''}">
                <a href="https://wa.me/?text=${encodeURIComponent(title + '\n' + waUrl)}" 
                   target="_blank" rel="noopener noreferrer"
                   class="share-btn share-btn--whatsapp" title="Share on WhatsApp">
                    ${ARDShare.whatsappIcon} WhatsApp
                </a>
                <button type="button" class="share-btn share-btn--copy" 
                        onclick="ARDShare.copyLink('${escapedUrl}')" title="Copy link">
                    ${ARDShare.copyIcon} Copy Link
                </button>
            </div>`;
    },

    _toastTimeout: null
};

// Dynamically populate Services dropdown in navigation
document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    fetch(baseUrl + 'content/services.json', { cache: 'no-store' })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
            if (data && data.services_list) {
                // Find all dropdowns for "Services" in the nav
                const navLinks = document.querySelectorAll('.nav .nav-link');
                navLinks.forEach(link => {
                    if (link.textContent.trim() === 'Services') {
                        const dropdownContent = link.nextElementSibling;
                        if (dropdownContent && dropdownContent.classList.contains('dropdown-content')) {
                            dropdownContent.innerHTML = data.services_list.map(svc => {
                                const slug = svc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                return `<a href="services.html#${slug}">${svc.name}</a>`;
                            }).join('');
                        }
                    }
                });
            }
        }).catch(err => console.error('Error fetching services for dropdown:', err));
});
