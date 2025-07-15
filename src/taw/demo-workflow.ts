import { Workflow } from './Workflow.js';

/**
 * Demo: Workflow as Pure Program with Monitoring
 *
 * This demonstrates the essence of Workflow:
 * - It IS the program (executable code)
 * - It monitors itself (built-in observability)
 * - It presents clear state to consciousness
 */

async function demoWorkflowExecution() {
  console.log('🚀 TAW Workflow Demo: Pure Program with Monitoring');
  console.log('==================================================');

  // Create a simple workflow - This IS the program
  const workflow = new Workflow({
    name: 'Data Processing Pipeline',
    type: 'sequential',
    definition: {
      steps: [
        {
          id: 'step1',
          name: 'Load Data',
          type: 'task',
          dependsOn: [],
          runAfter: [],
          taskId: 'load-data-task',
        },
        {
          id: 'step2',
          name: 'Process Data',
          type: 'task',
          dependsOn: ['step1'],
          runAfter: [],
          taskId: 'process-data-task',
        },
        {
          id: 'step3',
          name: 'Save Results',
          type: 'task',
          dependsOn: ['step2'],
          runAfter: [],
          taskId: 'save-results-task',
        },
      ],
      startStep: 'step1',
      endSteps: ['step3'],
      flowType: 'sequential',
    },
  });

  console.log(`📋 Created workflow: ${workflow.name}`);
  console.log(`🆔 ID: ${workflow.id}`);
  console.log(`📊 Initial status: ${workflow.status}`);
  console.log(`🔢 Steps: ${workflow.steps.length}`);

  // Show monitoring state before execution
  const initialMonitoring = workflow.getMonitoringState();
  console.log('📈 Initial Monitoring State:', initialMonitoring);

  try {
    // Execute the workflow - This is the program running
    console.log('\n🏃 Starting workflow execution...');
    await workflow.execute();
    console.log(`✅ Workflow completed successfully!`);
    console.log(`📊 Final status: ${workflow.status}`);
    console.log(`🎯 Progress: ${workflow.progress.progressPercent}%`);
    // Show final monitoring state
    const finalMonitoring = workflow.getMonitoringState();
    console.log('📈 Final Monitoring State:', finalMonitoring);
  } catch (error) {
    console.error(`❌ Workflow failed:`, error);
    console.log(`📊 Final status: ${workflow.status}`);
    const errorMonitoring = workflow.getMonitoringState();
    console.log('📈 Error Monitoring State:', errorMonitoring);
  }

  // Show the complete workflow data
  console.log('\n📄 Complete Workflow Data:');
  console.log(JSON.stringify(workflow.toJSON(), null, 2));
}

// Run the demo
demoWorkflowExecution().catch(console.error);

export { demoWorkflowExecution };
