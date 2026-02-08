const fs = require('fs');
const path = require('path');
const https = require('https');

const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
};

console.log(`${colors.blue}Starting System Health Check...${colors.reset}\n`);

let hasErrors = false;

// 1. Check for Critical Environment Variables
console.log(`${colors.yellow}Checking Environment Variables...${colors.reset}`);
const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];

    requiredVars.forEach(v => {
        if (envContent.includes(v)) {
            console.log(`${colors.green}✔ ${v} found${colors.reset}`);
        } else {
            console.log(`${colors.red}✘ ${v} MISSING${colors.reset}`);
            hasErrors = true;
        }
    });
} else {
    console.log(`${colors.red}✘ .env.local file not found!${colors.reset}`);
    hasErrors = true;
}

// 2. Check for Critical Components
console.log(`\n${colors.yellow}Checking Critical Components...${colors.reset}`);
const criticalFiles = [
    'app/layout.tsx',
    'app/page.tsx',
    'app/components/Navbar.tsx',
    'app/admin/dashboard/page.tsx',
    'app/context/LanguageContext.tsx'
];

criticalFiles.forEach(file => {
    if (fs.existsSync(path.join(process.cwd(), file))) {
        console.log(`${colors.green}✔ ${file} exists${colors.reset}`);
    } else {
        console.log(`${colors.red}✘ ${file} MISSING${colors.reset}`);
        hasErrors = true;
    }
});

// 3. Simple Connectivity Check (Node.js version)
console.log(`\n${colors.yellow}Checking Internet Connectivity...${colors.reset}`);
https.get('https://www.google.com', (res) => {
    console.log(`${colors.green}✔ Internet Connection Active${colors.reset}`);
    finalize();
}).on('error', (e) => {
    console.log(`${colors.red}✘ Internet Connection Failed: ${e.message}${colors.reset}`);
    hasErrors = true;
    finalize();
});

function finalize() {
    console.log(`\n${colors.blue}Health Check Complete.${colors.reset}`);
    if (hasErrors) {
        console.log(`${colors.red}System has issues. Please review logs.${colors.reset}`);
        process.exit(1);
    } else {
        console.log(`${colors.green}All systems nominal. Ready for production!${colors.reset}`);
        process.exit(0);
    }
}
