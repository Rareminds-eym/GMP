// Test script to verify popup positioning fixes
// You can run this in your browser's console to test the popups

console.log('🧪 Testing Popup Scroll Positioning Fix');

// Function to create a long scrollable page for testing
function createScrollTestPage() {
  // Add a lot of content to make page scrollable
  const testContent = document.createElement('div');
  testContent.style.height = '200vh';
  testContent.style.background = 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)';
  testContent.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>🧪 Popup Scroll Test Page</h1>
      <p style="margin-bottom: 50vh;">This page is extra long to test popup positioning when scrolled.</p>
      <p style="margin-bottom: 50vh;">Scroll down to test popup positioning at different scroll positions.</p>
      <p>Try opening popups from different scroll positions to verify they stay centered.</p>
    </div>
  `;
  
  // Insert at the beginning of the body
  document.body.insertBefore(testContent, document.body.firstChild);
  
  console.log('✅ Test page created - scroll down and try opening popups');
}

// Function to add scroll position indicator
function addScrollIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'scroll-indicator';
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    z-index: 10000;
  `;
  
  function updateIndicator() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = Math.round((scrollY / maxScroll) * 100);
    
    indicator.textContent = `
Scroll: ${scrollY}px
Progress: ${percentage}%
PopupPortal Active: ${document.getElementById('popup-portal') ? 'Yes' : 'No'}
    `.trim();
  }
  
  window.addEventListener('scroll', updateIndicator);
  updateIndicator();
  
  document.body.appendChild(indicator);
  console.log('✅ Scroll indicator added');
}

// Function to test popup positioning
function testPopupPositioning() {
  console.log('🔍 Testing popup positioning at current scroll position...');
  
  const scrollY = window.scrollY;
  console.log(`Current scroll position: ${scrollY}px`);
  
  // Look for any visible popups
  const popupPortal = document.getElementById('popup-portal');
  if (popupPortal) {
    const popups = popupPortal.querySelectorAll('[class*="fixed"]');
    console.log(`Found ${popups.length} popup(s) in portal`);
    
    popups.forEach((popup, index) => {
      const rect = popup.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      
      console.log(`Popup ${index + 1}:`);
      console.log(`  - Center X: ${Math.round(centerX)}px (should be ~${Math.round(viewportCenterX)}px)`);
      console.log(`  - Center Y: ${Math.round(centerY)}px (should be ~${Math.round(viewportCenterY)}px)`);
      console.log(`  - X offset: ${Math.round(Math.abs(centerX - viewportCenterX))}px`);
      console.log(`  - Y offset: ${Math.round(Math.abs(centerY - viewportCenterY))}px`);
    });
  } else {
    console.log('No popup portal found - try opening a popup first');
  }
}

// Function to run the full test suite
function runPopupTests() {
  console.log('🚀 Starting popup positioning tests...');
  
  createScrollTestPage();
  addScrollIndicator();
  
  // Add test buttons
  const testControls = document.createElement('div');
  testControls.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 5px;
  `;
  
  const testButton = document.createElement('button');
  testButton.textContent = 'Test Popup Position';
  testButton.style.cssText = `
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
  `;
  testButton.onclick = testPopupPositioning;
  
  const scrollButton = document.createElement('button');
  scrollButton.textContent = 'Scroll to 50%';
  scrollButton.style.cssText = `
    padding: 10px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
  `;
  scrollButton.onclick = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * 0.5, behavior: 'smooth' });
  };
  
  testControls.appendChild(testButton);
  testControls.appendChild(scrollButton);
  document.body.appendChild(testControls);
  
  console.log('✅ Test suite ready! Try the following:');
  console.log('1. Scroll to different positions');
  console.log('2. Open any popup in the application');
  console.log('3. Click "Test Popup Position" to verify centering');
  console.log('4. The popup should stay centered regardless of scroll position');
}

// Export functions for manual testing
window.popupTestSuite = {
  createScrollTestPage,
  addScrollIndicator,
  testPopupPositioning,
  runPopupTests
};

console.log('💡 Available functions:');
console.log('- popupTestSuite.runPopupTests() - Run full test suite');
console.log('- popupTestSuite.testPopupPositioning() - Test current popups');
console.log('- popupTestSuite.createScrollTestPage() - Add scrollable content');

// Auto-run if desired
// runPopupTests();
