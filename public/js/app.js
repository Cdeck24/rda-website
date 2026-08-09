import { db } from './firebase-config.js';
import { collection, getDocs, query } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Get Current Season Context (Defaults to 6)
const urlParams = new URLSearchParams(window.location.search);
export const currentSeason = urlParams.get('season') || '6'; 

const workerProxy = 'https://rda-worker.coledecker04.workers.dev/';

// ============================================================================
// --- HISTORICAL SPREADSHEET CONFIGURATION ---
// Paste your "Publish to Web -> CSV" links in the appropriate slots below.
// ============================================================================
export const HISTORICAL_CSVS = {
    '1': {
        'teams': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=872573071&single=true&output=csv',
        'players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1981492822&single=true&output=csv',
        'games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1254637152&single=true&output=csv',
    },
    '2': {
        'teams': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=904806981&single=true&output=csv',
        'players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=878682053&single=true&output=csv',
        'games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=752851895&single=true&output=csv',
        'playoff-games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1770347447&single=true&output=csv',
        'playoff-players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=81333375&single=true&output=csv'
    },
    '3': {
        'teams': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1764254404&single=true&output=csv',
        'players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1200060608&single=true&output=csv',
        'games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1920401171&single=true&output=csv',
        'playoff-games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1525027402&single=true&output=csv',
        'playoff-players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=458121362&single=true&output=csv'
    },
    '4': {
        'teams': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1083528154&single=true&output=csv',
        'players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=561111419&single=true&output=csv',
        'games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=912328044&single=true&output=csv',
        'playoff-games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1605731121&single=true&output=csv',
        'playoff-players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1735166278&single=true&output=csv'
    },
    '5': {
        'teams': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1152132322&single=true&output=csv',
        'players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=292583226&single=true&output=csv',
        'games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=556843426&single=true&output=csv',
        'playoff-games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=1856385768&single=true&output=csv',
        'playoff-players': ''
    },
    '6': {
        'games': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=755000020&single=true&output=csv',
        'players': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Kbt8LtTPbJp3GtxDD1vdWOrSyhvaawyPluCBewFw7umrl07YfKPa91qhokbHUitAK1YqaIPFqaHW/pub?gid=386743668&single=true&output=csv'
    }
};

// Aliases mappings
export const TEAM_MAPPINGS_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS0STj0Sra5tbc7Empve1bBUXJk7hTcN87fGs5Hguq1H_WrE4rybOPfypHWym_f1Ut6LQYv8Kdvn1H_/pub?gid=1391711589&single=true&output=csv';
export const PLAYER_MAPPINGS_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS0STj0Sra5tbc7Empve1bBUXJk7hTcN87fGs5Hguq1H_WrE4rybOPfypHWym_f1Ut6LQYv8Kdvn1H_/pub?gid=0&single=true&output=csv';

// Helper to convert CSV string into an array of database-like objects
function parseCsvToObject(csvText) {
    if (!csvText) return [];
    
    // Aggressive BOM stripping logic for Google Sheets 
    if (csvText.trim().startsWith('<')) {
        console.warn("Invalid CSV received (likely HTML/404).");
        return [];
    }

    const rows = csvText.trim().split(/\r?\n/);
    if (rows.length < 2) return [];

    const delimiter = rows[0].includes('\t') ? '\t' : ',';
    
    // Clean headers of BOMs and quotes
    const headers = rows[0].split(delimiter).map(h => 
        h.replace(/^[\uFEFF\u200B]+/, '').replace(/"/g, '').trim().toLowerCase()
    );

    return rows.slice(1).map((row, index) => {
        let inQuotes = false;
        let currentVal = '';
        const values = [];

        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"' && (i === 0 || row[i-1] !== '\\')) {
                inQuotes = !inQuotes;
            } else if (char === delimiter && !inQuotes) {
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
            val = val.replace(/^"|"$/g, '').trim();
            
            // Convert numbers/booleans dynamically
            if (val !== '' && !isNaN(val)) {
                obj[header] = Number(val);
            } else if (val.toLowerCase() === 'true') {
                obj[header] = true;
            } else if (val.toLowerCase() === 'false') {
                obj[header] = false;
            } else {
                obj[header] = val;
            }
        });
        return obj;
    });
}

// Initialize Navigation Bar
export function initNav() {
    // Enabled Live for Season 4, Season 5, and Season 6
    const showLive = ['4', '5', '6'].includes(currentSeason);

    const navHTML = `
    <div class="nav-container">
        <div class="nav-bar">
            <a href="rda-home.html" class="nav-button">Home</a>
            <a href="hub.html?season=${currentSeason}" class="nav-button" id="nav-hub">Hub</a>
            ${showLive ? `<a href="live-scores.html?season=${currentSeason}" class="nav-button" id="nav-live">Live</a>` : ''}
            <a href="teams.html?season=${currentSeason}" class="nav-button" id="nav-teams">Teams</a>
            <a href="standings.html?season=${currentSeason}" class="nav-button" id="nav-standings">Standings</a>
            <a href="schedule.html?season=${currentSeason}" class="nav-button" id="nav-schedule">Schedule</a>
            <a href="players.html?season=${currentSeason}" class="nav-button" id="nav-players">Players</a>
            <a href="free-agents.html?season=${currentSeason}" class="nav-button" id="nav-fa">Free Agents</a>
            <a href="transactions.html?season=${currentSeason}" class="nav-button" id="nav-transactions">Transactions</a>
            <a href="analytics.html?season=${currentSeason}" class="nav-button" id="nav-analytics">Analytics</a>
            <a href="trophies.html?season=${currentSeason}" class="nav-button" id="nav-trophies">Trophies</a>
            <a href="records.html" class="nav-button" id="nav-records">Records</a>
            <a href="gms.html" class="nav-button" id="nav-gm">GM Dashboard</a>
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
    if(path.includes('analytics')) document.getElementById('nav-analytics')?.classList.add('active');
    if(path.includes('trophies')) document.getElementById('nav-trophies')?.classList.add('active');
    if(path.includes('records')) document.getElementById('nav-records')?.classList.add('active');
    if(path.includes('gms')) document.getElementById('nav-gm')?.classList.add('active');

    // Update Page Title
    if (header && document.title.includes('RDA')) {
       const pageName = document.title.split('RDA')[1] || '';
       header.innerText = `RDA Season ${currentSeason} ${pageName}`;
    }
}

// Universal Data Fetcher (Handles Caching & Routing to CSVs)
export async function getSeasonData(collectionType) {
    const cacheKey = `rda_s${currentSeason}_${collectionType}`;
    const csvUrl = HISTORICAL_CSVS[currentSeason]?.[collectionType];

    // If a CSV link is provided, bypass the database!
    if (csvUrl) {
        // Only use local caching for older seasons so updates show instantly
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

    // --- Allow Season 4, Season 5, AND Season 6 to query Firestore! ---
    if (!['4', '5', '6'].includes(currentSeason)) {
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