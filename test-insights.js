const puppeteer = require('puppeteer');

async function testInsightsPanels() {
    let browser;
    try {
        // Launch browser
        browser = await puppeteer.launch({ 
            headless: false, // Set to true for headless mode
            defaultViewport: { width: 1920, height: 1080 }
        });
        
        const page = await browser.newPage();
        
        // Navigate to the workflow page
        console.log('Navigating to workflow page...');
        await page.goto('http://localhost:3000/workflow', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        // Wait for the page to fully load and animations to complete
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Find all context cards (they should have the click handler)
        console.log('Looking for context cards...');
        await page.waitForSelector('.cursor-pointer');
        
        // Get all clickable cards (excluding other clickable elements like buttons)
        const cards = await page.$$eval('.cursor-pointer', elements => {
            return elements
                .filter(el => el.closest('.bg-white.rounded-2xl')) // Filter for actual card containers
                .map((el, index) => ({ index, text: el.textContent.substring(0, 50) }));
        });
        
        console.log(`Found ${cards.length} context cards:`);
        cards.forEach(card => console.log(`  Card ${card.index + 1}: ${card.text}...`));
        
        // Click each card to open insights panels
        for (let i = 0; i < cards.length; i++) {
            console.log(`Clicking card ${i + 1}...`);
            
            // Click the card container
            await page.evaluate((index) => {
                const cards = Array.from(document.querySelectorAll('.cursor-pointer'))
                    .filter(el => el.closest('.bg-white.rounded-2xl'));
                if (cards[index]) {
                    cards[index].click();
                }
            }, i);
            
            // Wait a bit between clicks to see the animations
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        // Wait for all animations to complete
        console.log('Waiting for insights panels to fully render...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Take a screenshot
        console.log('Taking screenshot...');
        await page.screenshot({ 
            path: 'workflow-all-insights-open.png', 
            fullPage: true
        });
        
        // Get some metrics about what's visible
        const metrics = await page.evaluate(() => {
            const insightsPanels = document.querySelectorAll('[class*="bg-orange-50"], [class*="bg-emerald-50"], [class*="bg-blue-50"], [class*="bg-red-50"], [class*="bg-purple-50"]');
            const cards = document.querySelectorAll('.bg-white.rounded-2xl');
            const timelineMarkers = document.querySelectorAll('[data-intent*="timeline-marker"]');
            
            return {
                totalCards: cards.length,
                visibleInsightsPills: insightsPanels.length,
                timelineMarkers: timelineMarkers.length,
                pageHeight: document.documentElement.scrollHeight,
                viewportHeight: window.innerHeight
            };
        });
        
        console.log('\n=== UI ANALYSIS RESULTS ===');
        console.log(`Total context cards: ${metrics.totalCards}`);
        console.log(`Visible insights pills: ${metrics.visibleInsightsPills}`);
        console.log(`Timeline markers: ${metrics.timelineMarkers}`);
        console.log(`Page height: ${metrics.pageHeight}px`);
        console.log(`Viewport height: ${metrics.viewportHeight}px`);
        console.log('Screenshot saved as: workflow-all-insights-open.png');
        
        // Keep browser open for manual inspection
        console.log('\nBrowser will stay open for 30 seconds for manual inspection...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        
    } catch (error) {
        console.error('Error during testing:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testInsightsPanels();

