const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const planFile = path.join('docs', '7-execution-plan.md');
if (!fs.existsSync(planFile)) {
    console.error(`File not found: ${planFile}`);
    process.exit(1);
}

const content = fs.readFileSync(planFile, 'utf-8');
const lines = content.split('\n');

let currentPhase = '';
let tasks = [];
let currentTask = null;
let currentSection = null; // 'content', 'criteria', 'dependency', 'output'

// Helper to determine labels
function getLabels(phase, priority, timeStr) {
    const labels = [];
    
    // Phase label
    if (phase.includes('Phase 1')) labels.push('database');
    else if (phase.includes('Phase 2')) labels.push('backend');
    else if (phase.includes('Phase 3')) labels.push('frontend');
    else if (phase.includes('Phase 4')) labels.push('deployment');
    
    // Priority label
    if (priority.includes('P0')) labels.push('priority:high');
    else if (priority.includes('P1')) labels.push('priority:medium');
    else if (priority.includes('P2')) labels.push('priority:low');
    
    // Complexity label
    const timeMatch = timeStr.match(/(\d+(\.\d+)?)/);
    if (timeMatch) {
        const hours = parseFloat(timeMatch[0]);
        if (hours < 1) labels.push('complexity:low');
        else if (hours <= 3) labels.push('complexity:medium');
        else labels.push('complexity:high');
    } else {
        labels.push('complexity:medium');
    }
    
    return labels;
}

// Tech stack map for "Technical Considerations"
const techStack = {
    'Phase 1': 'PostgreSQL 15+, SQL DDL, DBeaver/pgAdmin',
    'Phase 2': 'Node.js, Express.js, PostgreSQL (pg), JWT, bcrypt, RESTful API',
    'Phase 3': 'React, Vite, Tailwind CSS, Zustand, Axios, React Router',
    'Phase 4': 'Vercel, Supabase, GitHub Actions (CI/CD)',
};

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('## Phase')) {
        currentPhase = line.replace('## ', '').trim();
    } else if (line.startsWith('### Task')) {
        if (currentTask) {
            tasks.push(currentTask);
        }
        
        const titleMatch = line.match(/### (Task \d+\.\d+): (.+)/);
        if (titleMatch) {
            currentTask = {
                phase: currentPhase,
                id: titleMatch[1],
                name: titleMatch[2],
                fullTitle: `[${currentPhase.split(':')[0]}] ${titleMatch[1]}: ${titleMatch[2]}`, 
                priority: 'P1',
                time: '2시간',
                assignee: '',
                
                // Sections
                content: [], // 작업 내용
                criteria: [], // 완료 조건
                dependency: [], // 의존성
                output: [] // 산출물
            };
            currentSection = null;
        }
    } else if (currentTask) {
        // Metadata
        if (line.startsWith('**담당**:')) currentTask.assignee = line.split(':')[1].trim();
        else if (line.startsWith('**예상 시간**:')) currentTask.time = line.split(':')[1].trim();
        else if (line.startsWith('**우선순위**:')) currentTask.priority = line.split(':')[1].trim();
        
        // Sections headers
        else if (line.startsWith('**작업 내용**:')) currentSection = 'content';
        else if (line.startsWith('**완료 조건**:')) currentSection = 'criteria';
        else if (line.startsWith('**의존성**:')) currentSection = 'dependency';
        else if (line.startsWith('**산출물**:')) currentSection = 'output';
        
        // Capture section content
        else if (line !== '' && !line.startsWith('---')) {
            if (currentSection === 'content') currentTask.content.push(line);
            else if (currentSection === 'criteria') currentTask.criteria.push(line);
            else if (currentSection === 'dependency') currentTask.dependency.push(line);
            else if (currentSection === 'output') currentTask.output.push(line);
        }
    }
}
if (currentTask) tasks.push(currentTask);

console.log(`Parsed ${tasks.length} tasks from Execution Plan.`);

const tempBodyFile = 'temp_issue_body.md';

for (const task of tasks) {
    console.log(`Processing: ${task.fullTitle}`);
    
    // Format Body
    let body = '';
    
    // Overview
    body += `### 📋 작업 개요\n\n`;
    body += `${task.name} (${task.time}, ${task.priority})\n`;
    body += `**담당**: ${task.assignee}\n\n`;
    
    // Todo
    body += `### 📝 Todo (작업 상세)\n\n`;
    if (task.content.length > 0) {
        task.content.forEach(item => {
            // Ensure it looks like a todo item
            if (item.startsWith('-')) {
                if (!item.includes('[ ]') && !item.includes('[x]')) {
                    body += item.replace('-', '- [ ]') + '\n';
                } else {
                    body += item + '\n';
                }
            } else {
                body += item + '\n';
            }
        });
    } else {
        body += `(작업 내용 없음)\n`;
    }
    body += `\n`;

    // Criteria
    body += `### ✅ 완료 조건\n\n`;
    if (task.criteria.length > 0) {
        body += task.criteria.join('\n') + '\n';
    } else {
        body += `- [ ] 완료 조건 정의 필요\n`;
    }
    body += `\n`;

    // Technical Considerations (Inferred)
    body += `### 🔧 기술적 고려사항\n\n`;
    body += `- **Tech Stack**: ${techStack[task.phase.split(':')[0]] || 'General'}\n`;
    body += `- **참조 문서**: 	oys/2-prd.md\
`;
    body += `\n`;
    
    // Dependencies
    body += `### 🔗 의존성\n\n`;
    if (task.dependency.length > 0) {
        body += task.dependency.join('\n') + '\n';
    } else {
        body += `- 없음\n`;
    }
    body += `\n`;
    
    // Output
    body += `### 📦 산출물\n\n`;
    if (task.output.length > 0) {
        body += task.output.join('\n') + '\n';
    } else {
        body += `- 정의되지 않음\n`;
    }

    // Write to file
    fs.writeFileSync(tempBodyFile, body);
    
    // Create Issue
    const labels = getLabels(task.phase, task.priority, task.time);
    
    const args = ['issue', 'create', '--title', task.fullTitle, '--body-file', tempBodyFile];
    labels.forEach(l => {
        args.push('--label');
        args.push(l);
    });
    
    try {
        const cmdArgs = args.map(arg => `"${arg.replace(/"/g, '`"')}"`).join(' ');
        // console.log(`CMD: gh ${cmdArgs}`);
        execSync(`gh ${cmdArgs}`, { 
            stdio: ['ignore', 'inherit', 'inherit'],
            shell: 'powershell.exe'
        });
    } catch (e) {
        console.error(`Failed to create issue: ${task.fullTitle}`);
    }
}

if (fs.existsSync(tempBodyFile)) fs.unlinkSync(tempBodyFile);
