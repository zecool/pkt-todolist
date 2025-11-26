const { execSync } = require('child_process');

const labels = [
    { name: 'database', color: 'D93F0B', description: 'Database related tasks' },
    { name: 'backend', color: '0052CC', description: 'Backend development tasks' },
    { name: 'frontend', color: '63C0CE', description: 'Frontend development tasks' },
    { name: 'deployment', color: '7057FF', description: 'Deployment and DevOps tasks' },
    { name: 'priority:high', color: 'B60205', description: 'High priority' },
    { name: 'priority:medium', color: 'FBCA04', description: 'Medium priority' },
    { name: 'priority:low', color: '0E8A16', description: 'Low priority' },
    { name: 'complexity:high', color: 'B60205', description: 'High complexity' },
    { name: 'complexity:medium', color: 'FBCA04', description: 'Medium complexity' },
    { name: 'complexity:low', color: '0E8A16', description: 'Low complexity' }
];

console.log('Setting up labels...');

for (const label of labels) {
    try {
        console.log(`Creating label: ${label.name}`);
        execSync(`gh label create "${label.name}" --color "${label.color}" --description "${label.description}" --force`, { 
            stdio: ['ignore', 'inherit', 'inherit'],
            shell: 'powershell.exe'
        });
    } catch (e) {
        console.log(`Label ${label.name} might already exist or failed to create.`);
    }
}
