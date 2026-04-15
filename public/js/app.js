import { db } from './firebase-config.js';
import { collection, getDocs, query } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Get Current Season Context
const urlParams = new URLSearchParams(window.location.search);
export const currentSeason = urlParams.get('season') || '4'; 

const workerProxy = 'https://rda-worker.coledecker04.workers.dev/';

// ============================================================================
// --- HISTORICAL SPREADSHEET CONFIGURATION ---
// Paste your "Publish to Web -> CSV" links in the appropriate slots below.
// IMPORTANT: The column headers in your sheet MUST exactly match the 
// properties the app expects (e.g., 'name', 'wins', 'team1score', 'winner').
// ============================================================================
const HISTORICAL_CSVS = {
    '1': {
        'teams': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1686851245&single=true&output=csv',
        'players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1104547775&single=true&output=csv',
        'games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1497737829&single=true&output=csv',
    },
    '2': {
        'teams': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=904806981&single=true&output=csv',
        'players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=2034232936&single=true&output=csv',
        'games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=187836077&single=true&output=csv',
        'playoff-games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=2072775868&single=true&output=csv',
        'playoff-players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=230753827&single=true&output=csv'
    },
    '3': {
        'teams': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=149573686&single=true&output=csv',
        'players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1960079304&single=true&output=csv',
        'games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=515899453&single=true&output=csv',
        'playoff-games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1445398263&single=true&output=csv',
        'playoff-players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1882626613&single=true&output=csv'
    },
    '4': {
        'teams': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1083528154&single=true&output=csv',
        'players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=561111419&single=true&output=csv',
        'games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=912328044&single=true&output=csv'
    }
};

// Helper to convert CSV string into an array of database-like objects
function parseCsvToObject(csvText) {
    if (!csvText) return [];
    const rows = csvText.trim().split(/\r?\n/);
    if (rows.length < 2) return [];

    const headers = rows[0].split(',').map(h => h.trim());

    return rows.slice(1).map((row, index) => {
        let inQuotes = false;
        let currentVal = '';
        const values = [];

        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"' && (i === 0 || row[i-1] !== '\\')) {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(currentVal.trim());
                currentVal = '';
            } else {
                currentVal += char;
            }
        }
        values.push(currentVal.trim());

        const obj = { id: `csv-row-${index}` };
        headers.forEach((header, i) => {
            let val = values[i] !== undefined ? values[i] : '';
            
            // Automatically convert numbers and booleans so math functions don't break
            if (val !== '' && !isNaN(val)) {
                val = Number(val);
            } else if (val.toLowerCase() === 'true') {
                val = true;
            } else if (val.toLowerCase() === 'false') {
                val = false;
            }
            
            obj[header] = val;
        });
        return obj;
    });
}

// Initialize Navigation Bar
export function initNav() {
    const showLive = currentSeason === '4';

    const navHTML = `
    <div class="nav-container">
        <div class="nav-bar">
            <!-- Points to the separated RDA home page instead of portal -->
            <a href="rda-home.html" class="nav-button">Home</a>
            <a href="hub.html?season=${currentSeason}" class="nav-button" id="nav-hub">Hub</a>
            ${showLive ? `<a href="live-scores.html?season=${currentSeason}" class="nav-button" id="nav-live">Live</a>` : ''}
            <a href="teams.html?season=${currentSeason}" class="nav-button" id="nav-teams">Teams</a>
            <a href="standings.html?season=${currentSeason}" class="nav-button" id="nav-standings">Standings</a>
            <a href="schedule.html?season=${currentSeason}" class="nav-button" id="nav-schedule">Schedule</a>
            <a href="players.html?season=${currentSeason}" class="nav-button" id="nav-players">Players</a>
            <a href="free-agents.html?season=${currentSeason}" class="nav-button" id="nav-fa">Free Agents</a>
            <a href="transactions.html?season=${currentSeason}" class="nav-button" id="nav-transactions">Transactions</a>
            <a href="trophies.html?season=${currentSeason}" class="nav-button" id="nav-trophies">Trophies</a>
        </div>
    </div>
    `;

    // Insert Nav AFTER the Header (H1)
    const header = document.querySelector('h1');
    if (header) {
        header.insertAdjacentHTML('afterend', navHTML);
    } else {
        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }
    
    // Highlight Active Link
    const path = window.location.pathname;
    if(path.includes('hub')) document.getElementById('nav-hub')?.classList.add('active');
    if(path.includes('live')) document.getElementById('nav-live')?.classList.add('active');
    if(path.includes('teams')) document.getElementById('nav-teams')?.classList.add('active');
    if(path.includes('standings')) document.getElementById('nav-standings')?.classList.add('active');
    if(path.includes('schedule')) document.getElementById('nav-schedule')?.classList.add('active');
    if(path.includes('players')) document.getElementById('nav-players')?.classList.add('active');
    if(path.includes('free-agents')) document.getElementById('nav-fa')?.classList.add('active');
    if(path.includes('transactions')) document.getElementById('nav-transactions')?.classList.add('active');
    if(path.includes('trophies')) document.getElementById('nav-trophies')?.classList.add('active');

    // Update Page Title
    if (document.title.includes('RDA')) {
       const pageName = document.title.split('RDA')[1] || '';
       if(header) header.innerText = `RDA Season ${currentSeason} ${pageName}`;
    }
}

// Universal Data Fetcher (Handles Caching & Routing to CSVs)
export async function getSeasonData(collectionType) {
    const cacheKey = `rda_s${currentSeason}_${collectionType}`;
    const csvUrl = HISTORICAL_CSVS[currentSeason]?.[collectionType];

    // If a CSV link is provided, bypass the database!
    if (csvUrl) {
        // Only use local caching for older seasons so Season 4 updates show instantly
        const shouldCache = ['1', '2', '3'].includes(currentSeason);
        
        if (shouldCache) {
            const cached = localStorage.getItem(cacheKey);
            if (cached) return JSON.parse(cached);
        }

        try {
            const res = await fetch(workerProxy + '?url=' + encodeURIComponent(csvUrl));
            if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
            const text = await res.text();
            const data = parseCsvToObject(text);

            if (shouldCache && data.length > 0) {
                localStorage.setItem(cacheKey, JSON.stringify(data));
            }
            return data;
        } catch (e) {
            console.error(`Failed to load CSV for ${collectionType}:`, e);
            return [];
        }
    }

    // Prevent historical seasons from ever reading from Firestore
    if (currentSeason !== '4') {
        console.warn(`No CSV configured for historical season ${currentSeason} ${collectionType}. Skipping Firestore.`);
        return [];
    }

    // Default Fallback: Read from Firestore Database for the active season
    const fsCollection = `s${currentSeason}-${collectionType}`;
    
    try {
        const q = query(collection(db, fsCollection));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.warn("Data fetch warning:", error);
        return [];
    }
}