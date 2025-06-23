const puppeteer = require('puppeteer');

async function debugInsightsPanels() {
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: { width: 1920, height: 1080 }
        });
        
        const page = await browser.newPage();
        
        console.log('Navigating to workflow page...');
        await page.goto('http://localhost:3000/workflow', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Debug: Check the current state before clicking
        const initialState = await page.evaluate(() => {
            const cards = document.querySelectorAll('.bg-white.rounded-2xl');
            const expandedElements = document.querySelectorAll('[class*="opacity-1"][class*="x-0"]');
            const motionDivs = document.querySelectorAll('div[style*="opacity: 1"]');
            
            return {
                totalCards: cards.length,
                expandedElements: expandedElements.length,
                motionDivs: motionDivs.length,
                cardTexts: Array.from(cards).map(card => card.textContent.substring(0, 30))
            };
        });
        
        console.log('Initial state:', initialState);
        
        // Click the first card and observe what happens
        console.log('Clicking first card...');
        await page.click('.cursor-pointer');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check what changed after first click
        const afterFirstClick = await page.evaluate(() => {
            const insightsPanels = document.querySelectorAll('motion-div, [class*="bg-orange-50"], [class*="bg-emerald-50"], [class*="bg-blue-50"], [class*="bg-red-50"], [class*="bg-purple-50"]');
            const tooltipElements = document.querySelectorAll('[class*="tooltip"]');
            const animatedElements = document.querySelectorAll('[style*="opacity: 1"][style*="transform"]');
            const pillElements = document.querySelectorAll('.rounded-lg.px-3.py-2');
            
            // Look for the actual insights content structure
            const insightsContainers = document.querySelectorAll('.flex.flex-col.gap-y-3');
            const insightsPillsAlt = document.querySelectorAll('.bg-orange-50, .bg-emerald-50, .bg-blue-50, .bg-red-50, .bg-purple-50');
            
            return {
                insightsPanels: insightsPanels.length,
                tooltipElements: tooltipElements.length,
                animatedElements: animatedElements.length,
                pillElements: pillElements.length,
                insightsContainers: insightsContainers.length,
                insightsPillsAlt: insightsPillsAlt.length,
                // Get the actual HTML structure
                bodyHTML: document.body.innerHTML.includes('bg-orange-50') ? 'Contains orange insights' : 'No orange insights found'
            };
        });
        
        console.log('After first click:', afterFirstClick);
        
        // Take a screenshot after first click
        await page.screenshot({ 
            path: 'workflow-first-card-clicked.png', 
            fullPage: true
        });
        
        console.log('Screenshot saved: workflow-first-card-clicked.png');
        
        // Try to find any insights-related elements in a different way
        const detailedAnalysis = await page.evaluate(() => {
            // Look for motion.div elements specifically
            const motionElements = document.querySelectorAll('motion-div');
            const divsWithOpacity = Array.from(document.querySelectorAll('div')).filter(div => 
                div.style.opacity === '1' && div.style.transform && div.style.transform !== 'none'
            );
            
            // Look for the insights content based on the code structure we know
            const flexColGapElements = document.querySelectorAll('.flex.flex-col.gap-y-3');
            const insightsFound = [];
            
            flexColGapElements.forEach((element, index) => {
                const orangePills = element.querySelectorAll('.bg-orange-50');
                const emeraldPills = element.querySelectorAll('.bg-emerald-50');
                const bluePills = element.querySelectorAll('.bg-blue-50');
                const redPills = element.querySelectorAll('.bg-red-50');
                const purplePills = element.querySelectorAll('.bg-purple-50');
                
                if (orangePills.length > 0 || emeraldPills.length > 0 || bluePills.length > 0 || redPills.length > 0 || purplePills.length > 0) {
                    insightsFound.push({
                        index,
                        orange: orangePills.length,
                        emerald: emeraldPills.length,
                        blue: bluePills.length,
                        red: redPills.length,
                        purple: purplePills.length,
                        visible: element.style.opacity !== '0' && element.offsetHeight > 0
                    });
                }
            });
            
            return {
                motionElements: motionElements.length,
                divsWithOpacity: divsWithOpacity.length,
                flexColGapElements: flexColGapElements.length,
                insightsFound,
                // Get some sample HTML to debug
                sampleHTML: document.querySelector('.flex.flex-col.gap-y-3')?.outerHTML.substring(0, 500) || 'No flex-col-gap elements found'
            };
        });
        
        console.log('\n=== DETAILED ANALYSIS ===');
        console.log(JSON.stringify(detailedAnalysis, null, 2));
        
        // Wait for manual inspection
        console.log('\nBrowser staying open for inspection...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        
    } catch (error) {
        console.error('Error during debugging:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

debugInsightsPanels();

