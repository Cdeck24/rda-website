import { db } from './firebase-config.js';
import { collection, getDocs, query } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Get Current Season Context (Defaults to 6)
const urlParams = new URLSearchParams(window.location.search);
export const currentSeason = urlParams.get('season') || '6'; 

const workerProxy = 'https://rda-worker.coledecker04.workers.dev/';

// ============================================================================
// --- HISTORICAL SPREADSHEET CONFIGURATION ---
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

export const TEAM_MAPPINGS_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS0STj0Sra5tbc7Empve1bBUXJk7hTcN87fGs5Hguq1H_WrE4rybOPfypHWym_f1Ut6LQYv8Kdvn1H_/pub?gid=1391711589&single=true&output=csv';
export const PLAYER_MAPPINGS_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS0STj0Sra5tbc7Empve1bBUXJk7hTcN87fGs5Hguq1H_WrE4rybOPfypHWym_f1Ut6LQYv8Kdvn1H_/pub?gid=0&single=true&output=csv';

// Team Logo Resolver
export function getTeamLogoPath(name) {
    if (!name) return 'https://placehold.co/50x50/0a0a0a/fff?text=?';
    let cleanName = name.trim().toLowerCase();
    if (cleanName.startsWith('the ')) cleanName = cleanName.substring(4);
    if (cleanName.includes('east')) return 'images/teams/east-logo.png';
    if (cleanName.includes('west')) return 'images/teams/west-logo.png';
    cleanName = cleanName.replace(/\s+/g, '-');
    const isPng = ['reapers', 'zombies', 'free-agents', 'east-all-stars', 'west-all-stars', 'saucers'].includes(cleanName);
    return `images/teams/${cleanName}-logo${isPng ? '.png' : '.PNG'}`;
}

// CSV Parser Helper
export function parseCsvToObject(csvText) {
    if (!csvText || csvText.trim().startsWith('<')) return [];
    const rows = csvText.trim().split(/\r?\n/);
    if (rows.length < 2) return [];

    const delimiter = rows[0].includes('\t') ? '\t' : ',';
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

// ============================================================================
// --- UNIFIED 3-PILLAR NAVIGATION & QUICK-INSPECT DRAWER ENGINE ---
// ============================================================================
export function initNav() {
    const primaryNavItems = [
        { id: 'nav-live', label: '⚡ Live', href: `live-v2.html?season=${currentSeason}` },
        { id: 'nav-standings', label: 'Standings', href: `standings-v2.html?season=${currentSeason}` },
        { id: 'nav-players', label: 'Players', href: `players-v2.html?season=${currentSeason}` }
    ];

    const moreNavItems = [
        { id: 'nav-schedule', label: 'Schedule', href: `schedule-v2.html?season=${currentSeason}` },
        { id: 'nav-teams', label: 'Franchises', href: `teams-v2.html?season=${currentSeason}` },
        { id: 'nav-records', label: 'Records', href: `records-v2.html?season=${currentSeason}` }
    ];

    if (!document.getElementById('v2-nav-styles')) {
        const style = document.createElement('style');
        style.id = 'v2-nav-styles';
        style.textContent = `
            .nav-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-width: 1100px;
                width: 100%;
                margin: 0 auto 1.25rem auto;
                padding: 0.25rem 0.4rem;
                background: linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%);
                border: 1px solid var(--border-subtle);
                border-radius: 8px;
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                gap: 0.2rem;
                box-sizing: border-box;
            }
            .nav-left {
                display: flex;
                align-items: center;
                gap: 0.15rem;
                min-width: 0;
                flex: 1 1 auto;
            }
            .nav-brand {
                font-family: 'Didot', serif;
                font-weight: 800;
                font-size: 0.85rem;
                color: var(--gold-light);
                text-decoration: none;
                letter-spacing: 0.5px;
                margin-right: 0.1rem;
                padding-left: 0.1rem;
                flex-shrink: 0;
            }
            .nav-button {
                color: var(--text-muted);
                text-decoration: none;
                font-size: 0.65rem;
                font-weight: 700;
                padding: 0.25rem 0.35rem;
                border-radius: 4px;
                transition: all 0.2s ease;
                white-space: nowrap;
                text-transform: uppercase;
                letter-spacing: 0.2px;
                flex-shrink: 0;
            }
            .nav-button:hover { color: #fff; background: rgba(255, 255, 255, 0.06); }
            .nav-button.active {
                color: var(--gold-light);
                background: rgba(212, 175, 55, 0.15);
                border: 1px solid rgba(212, 175, 55, 0.35);
            }
            .nav-right {
                display: flex;
                align-items: center;
                gap: 0.2rem;
                flex-shrink: 0;
            }
            .nav-season-select {
                background: rgba(0, 0, 0, 0.6);
                border: 1px solid var(--border-gold);
                color: var(--gold-light);
                border-radius: 4px;
                padding: 0.2rem 0.25rem;
                font-size: 0.65rem;
                font-weight: 800;
                outline: none;
                cursor: pointer;
                width: 44px;
                text-align: center;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
            }
            .nav-dropdown-btn {
                background: transparent;
                border: 1px solid var(--border-subtle);
                color: var(--text-muted);
                font-size: 0.65rem;
                font-weight: 700;
                padding: 0.2rem 0.35rem;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 2px;
                text-transform: uppercase;
                white-space: nowrap;
            }
            .nav-dropdown-btn:hover { color: #fff; border-color: rgba(255,255,255,0.2); }
            .nav-dropdown-btn.active {
                color: var(--gold-light);
                border-color: var(--border-gold);
                background: rgba(212, 175, 55, 0.15);
            }
            .nav-dropdown-menu {
                display: none;
                position: absolute;
                top: calc(100% + 5px);
                right: 0;
                background: var(--bg-navy-light);
                min-width: 150px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.7);
                border: 1px solid var(--border-gold);
                border-radius: 8px;
                z-index: 2000;
                padding: 0.35rem 0;
            }
            .nav-dropdown-menu.open { display: block; }
            .nav-dropdown-item {
                display: block;
                padding: 0.55rem 0.85rem;
                color: #cbd5e1;
                font-size: 0.78rem;
                text-decoration: none;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: background 0.15s ease;
            }
            .nav-dropdown-item:hover {
                background: rgba(212, 175, 55, 0.15);
                color: var(--gold-light);
            }
            .nav-dropdown-item.active {
                color: var(--gold-light);
                background: rgba(212, 175, 55, 0.1);
            }
            /* Quick Inspect Slideout Drawer */
            .quick-drawer-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
                z-index: 9998;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            .quick-drawer-backdrop.open { opacity: 1; pointer-events: auto; }
            .quick-drawer {
                position: fixed;
                top: 0;
                right: 0;
                width: 100%;
                max-width: 380px;
                height: 100%;
                background: var(--bg-navy);
                border-left: 1px solid var(--border-gold);
                box-shadow: -10px 0 35px rgba(0, 0, 0, 0.7);
                z-index: 9999;
                transform: translateX(100%);
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
            }
            .quick-drawer.open { transform: translateX(0); }
            .quick-drawer-header {
                padding: 1.25rem;
                border-bottom: 1px solid var(--border-subtle);
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: rgba(0, 0, 0, 0.2);
            }
            .quick-drawer-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 700;
                font-size: 1.1rem;
                color: #fff;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .quick-drawer-close {
                background: rgba(255, 255, 255, 0.05);
                border: none;
                color: var(--text-muted);
                font-size: 1.4rem;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
            }
            .quick-drawer-close:hover { color: #fff; background: rgba(255, 255, 255, 0.15); }
            .quick-drawer-body {
                padding: 1.25rem;
                overflow-y: auto;
                flex: 1;
            }
        `;
        document.head.appendChild(style);
    }

    const currentPath = window.location.pathname.split('/').pop() || 'live-v2.html';
    const isMoreActive = moreNavItems.some(item => currentPath === item.href.split('?')[0]);

    const navHTML = `
    <div class="nav-container">
        <div class="nav-left">
            <a href="live-v2.html?season=${currentSeason}" class="nav-brand">RDA</a>
            ${primaryNavItems.map(item => {
                const target = item.href.split('?')[0];
                const isActive = currentPath === target;
                return `<a href="${item.href}" class="nav-button ${isActive ? 'active' : ''}" id="${item.id}">${item.label}</a>`;
            }).join('')}
        </div>
        <div class="nav-right">
            <select class="nav-season-select" id="global-season-select" title="Select Season">
                <option value="6" ${currentSeason === '6' ? 'selected' : ''}>S6</option>
                <option value="5" ${currentSeason === '5' ? 'selected' : ''}>S5</option>
                <option value="4" ${currentSeason === '4' ? 'selected' : ''}>S4</option>
                <option value="3" ${currentSeason === '3' ? 'selected' : ''}>S3</option>
                <option value="2" ${currentSeason === '2' ? 'selected' : ''}>S2</option>
                <option value="1" ${currentSeason === '1' ? 'selected' : ''}>S1</option>
            </select>
            <div class="nav-dropdown">
                <button class="nav-dropdown-btn ${isMoreActive ? 'active' : ''}" id="nav-more-toggle">More ▾</button>
                <div class="nav-dropdown-menu" id="nav-more-menu">
                    ${moreNavItems.map(item => {
                        const target = item.href.split('?')[0];
                        const isActive = currentPath === target;
                        return `<a href="${item.href}" class="nav-dropdown-item ${isActive ? 'active' : ''}">${item.label}</a>`;
                    }).join('')}
                </div>
            </div>
        </div>
    </div>

    <!-- Global Quick-Inspect Drawer Markup -->
    <div class="quick-drawer-backdrop" id="quick-drawer-backdrop"></div>
    <div class="quick-drawer" id="quick-drawer">
        <div class="quick-drawer-header">
            <div class="quick-drawer-title" id="quick-drawer-title">
                <img id="quick-drawer-logo" style="width: 32px; height: 32px; object-fit: contain;">
                <span id="quick-drawer-name">Team</span>
            </div>
            <button class="quick-drawer-close" id="quick-drawer-close">&times;</button>
        </div>
        <div class="quick-drawer-body" id="quick-drawer-body">
            <div style="color: var(--text-muted); font-style: italic; text-align: center; padding: 2rem 0;">Loading team dossier...</div>
        </div>
    </div>
    `;

    const existingNav = document.querySelector('.nav-container');
    if (existingNav) existingNav.remove();

    const header = document.querySelector('h1');
    if (header) header.insertAdjacentHTML('afterend', navHTML);
    else document.body.insertAdjacentHTML('afterbegin', navHTML);

    const seasonSelect = document.getElementById('global-season-select');
    seasonSelect?.addEventListener('change', (e) => {
        const newSeason = e.target.value;
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('season', newSeason);
        window.location.href = currentUrl.toString();
    });

    const moreBtn = document.getElementById('nav-more-toggle');
    const moreMenu = document.getElementById('nav-more-menu');
    moreBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        moreMenu?.classList.toggle('open');
    });
    document.addEventListener('click', () => moreMenu?.classList.remove('open'));

    initQuickDrawerListeners();
}

// ============================================================================
// --- GLOBAL QUICK-INSPECT DRAWER LOGIC ---
// ============================================================================
function initQuickDrawerListeners() {
    const backdrop = document.getElementById('quick-drawer-backdrop');
    const drawer = document.getElementById('quick-drawer');
    const closeBtn = document.getElementById('quick-drawer-close');

    const closeDrawer = () => {
        backdrop?.classList.remove('open');
        drawer?.classList.remove('open');
    };

    backdrop?.addEventListener('click', closeDrawer);
    closeBtn?.addEventListener('click', closeDrawer);

    // Global event delegation: click any element with [data-team] to open drawer
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[data-team]');
        if (target) {
            e.preventDefault();
            const teamName = target.getAttribute('data-team');
            if (teamName) window.openTeamQuickDrawer(teamName);
        }
    });
}

window.openTeamQuickDrawer = async function(teamName) {
    const backdrop = document.getElementById('quick-drawer-backdrop');
    const drawer = document.getElementById('quick-drawer');
    const logoEl = document.getElementById('quick-drawer-logo');
    const nameEl = document.getElementById('quick-drawer-name');
    const bodyEl = document.getElementById('quick-drawer-body');

    if (!drawer) return;

    // Reset view
    nameEl.textContent = teamName;
    logoEl.src = getTeamLogoPath(teamName);
    bodyEl.innerHTML = `<div style="color: var(--text-muted); font-style: italic; text-align: center; padding: 2rem 0;">Loading franchise dossier...</div>`;

    backdrop.classList.add('open');
    drawer.classList.add('open');

    try {
        const isV2 = window.location.pathname.includes('-v2');
        const teamUrl = isV2 ? `teams-v2.html?season=${currentSeason}&team=${encodeURIComponent(teamName)}` : `teams.html?season=${currentSeason}&team=${encodeURIComponent(teamName)}`;

        // Pull active roster and draft capital
        const [playersData, gamesData] = await Promise.all([
            getSeasonData('players'),
            getSeasonData('games')
        ]);

        const teamPlayers = (playersData || []).filter(p => (p.team || '').toLowerCase() === teamName.toLowerCase());
        
        let wins = 0, losses = 0;
        (gamesData || []).forEach(g => {
            if (g.winner === teamName) wins++;
            else if ((g.team1 === teamName || g.team2 === teamName) && g.winner && g.winner !== 'TIE') losses++;
        });

        const topScorers = teamPlayers
            .map(p => ({ name: p.username || p.displayName, score: parseFloat(p.score || p.totalscore || 0) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        bodyEl.innerHTML = `
            <div style="display: flex; gap: 0.75rem; margin-bottom: 1.25rem;">
                <div style="flex: 1; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 0.75rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">Record</div>
                    <div style="font-size: 1.3rem; font-weight: 800; color: var(--gold-light); font-family: 'Didot', serif;">${wins} - ${losses}</div>
                </div>
                <div style="flex: 1; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 0.75rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">Roster Size</div>
                    <div style="font-size: 1.3rem; font-weight: 800; color: #fff;">${teamPlayers.length}</div>
                </div>
            </div>

            <div style="font-size: 0.75rem; font-weight: 700; color: var(--gold-mid); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">
                Key Point Contributors
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.5rem;">
                ${topScorers.length ? topScorers.map(p => `
                    <div style="display: flex; justify-content: space-between; background: rgba(255,255,255,0.02); padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.04); font-size: 0.85rem;">
                        <span style="color: #fff; font-weight: 600;">${p.name}</span>
                        <span style="color: var(--gold-light); font-weight: 700;">${p.score.toFixed(2)} pts</span>
                    </div>
                `).join('') : '<div style="color: #666; font-size: 0.8rem; font-style: italic;">No player data logged.</div>'}
            </div>

            <a href="${teamUrl}" style="display: block; width: 100%; text-align: center; background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1)); border: 1px solid var(--border-gold); color: var(--gold-light); padding: 0.75rem 0; border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s;">
                View Full Franchise Page →
            </a>
        `;
    } catch (err) {
        bodyEl.innerHTML = `<div style="color: var(--danger); font-size: 0.85rem; text-align: center;">Error loading team profile.</div>`;
    }
};

// ============================================================================
// --- UNIVERSAL DATA FETCHER ---
// ============================================================================
export async function getSeasonData(collectionType) {
    const cacheKey = `rda_s${currentSeason}_${collectionType}`;
    const csvUrl = HISTORICAL_CSVS[currentSeason]?.[collectionType];

    if (csvUrl) {
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

    // Since all data is maintained in published CSVs, bypass Firestore calls that get blocked
    return [];
}