const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const issuesDir = path.join('.github', 'issues');
if (!fs.existsSync(issuesDir)) {
    console.error(`Directory not found: ${issuesDir}`);
    process.exit(1);
}

const files = fs.readdirSync(issuesDir).filter(f => f.endsWith('.md'));
files.sort();

console.log(`Found files: ${files.join(', ')}`);

// Temporary file for body content
const tempBodyFile = path.join(process.cwd(), 'temp_issue_body.md');

for (const file of files) {
    console.log(`
Processing file: ${file}`);
    const filePath = path.join(issuesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const issueRegex = /^##\s+([^\r\n]+)([\s\S]*?)(?=^##\s+|$)/gm;
    let match;
    
    while ((match = issueRegex.exec(content)) !== null) {
        const title = match[1].trim();
        const body = match[2].trim();
        
        if (!title.startsWith('[Phase')) {
            continue;
        }

        let labels = [];
        const labelMatch = body.match(/\*\*Labels\*\*:\s*(.+)$/m);
        if (labelMatch) {
            const labelText = labelMatch[1];
            const extractedLabels = labelText.match(/`([^`]+)`/g);
            if (extractedLabels) {
                labels = extractedLabels.map(l => l.replace(/`/g, ''));
            }
        }

        // Write body to temp file
        fs.writeFileSync(tempBodyFile, body);

        const args = ['issue', 'create', '--title', title, '--body-file', tempBodyFile];
        if (labels.length > 0) {
            labels.forEach(l => {
                args.push('--label');
                args.push(l);
            });
        }

        console.log(`Creating issue: ${title} [Labels: ${labels.join(', ')}]`);
        
        try {
            // PowerShell escaping: double quotes -> backtick double quote (`")
            const cmdArgs = args.map(arg => {
                return `"${arg.split('"').join('`"')}"`;
            }).join(' ');
            
            const cmd = `gh ${cmdArgs}`;
            
            execSync(cmd, { 
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: 'powershell.exe'
            });
            
            // Small delay to avoid rate limits/race conditions
            // execSync('Start-Sleep -Milliseconds 200', { shell: 'powershell.exe' });
            
        } catch (e) {
            console.error(`Failed to create issue: ${title}`);
        }
    }
}

// Cleanup
if (fs.existsSync(tempBodyFile)) {
    fs.unlinkSync(tempBodyFile);
}
