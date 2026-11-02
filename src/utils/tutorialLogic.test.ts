import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_TERMINAL_ENV,
  simulateCommand,
  calculateProgress,
  generateBatchPowerShellScript,
  diagnoseInstallIssue,
} from './tutorialLogic';

test('simulateCommand handles ensurepip and updates state', () => {
  const res = simulateCommand('python -m ensurepip --upgrade', INITIAL_TERMINAL_ENV);
  assert.equal(res.status, 'success');
  assert.equal(res.nextState.pipUpgraded, true);
  assert.equal(res.completedStepId, 'step-3-ensurepip');
});

test('simulateCommand enforces pipx installation before pipx install lucidadl', () => {
  const resBeforePipx = simulateCommand('python -m pipx install lucidadl', INITIAL_TERMINAL_ENV);
  assert.equal(resBeforePipx.status, 'error');
  assert.equal(resBeforePipx.nextState.lucidadlInstalled, false);

  const afterPipx = simulateCommand('python -m pip install pipx', INITIAL_TERMINAL_ENV).nextState;
  const afterPath = simulateCommand('python -m pipx ensurepath', afterPipx).nextState;
  const afterLucida = simulateCommand('python -m pipx install lucidadl', afterPath);

  assert.equal(afterLucida.status, 'success');
  assert.equal(afterLucida.nextState.lucidadlInstalled, true);
  assert.equal(afterLucida.completedStepId, 'step-4-pipx');

  const runLucida = simulateCommand('lucida.exe', afterLucida.nextState);
  assert.equal(runLucida.status, 'success');
  assert.equal(runLucida.completedStepId, 'step-5-run-lucida');
});

test('calculateProgress computes accurate completion percentage and next step', () => {
  const stepIds = ['s1', 's2', 's3', 's4', 's5'];
  const p1 = calculateProgress(['s1', 's2'], stepIds);
  assert.equal(p1.completedCount, 2);
  assert.equal(p1.totalCount, 5);
  assert.equal(p1.percentage, 40);
  assert.equal(p1.isAllComplete, false);
  assert.equal(p1.nextStepId, 's3');

  const pAll = calculateProgress(stepIds, stepIds);
  assert.equal(pAll.percentage, 100);
  assert.equal(pAll.isAllComplete, true);
  assert.equal(pAll.nextStepId, null);
});

test('generateBatchPowerShellScript includes all requested commands', () => {
  const script = generateBatchPowerShellScript({
    includeEnsurePip: true,
    includeEnsurePath: true,
    autoRunLucida: true,
  });
  assert.ok(script.includes('python -m ensurepip --upgrade'));
  assert.ok(script.includes('python -m pip install pipx'));
  assert.ok(script.includes('python -m pipx ensurepath'));
  assert.ok(script.includes('python -m pipx install lucidadl'));
  assert.ok(script.includes('lucida.exe'));
});

test('diagnoseInstallIssue matches C++ and lucida.exe PATH errors accurately', () => {
  const cppMatch = diagnoseInstallIssue('error: Microsoft Visual C++ 14.0 or greater is required');
  assert.equal(cppMatch.matchedPreset.id, 'err-msvc-missing');
  assert.equal(cppMatch.confidence, 'high');

  const lucidaMatch = diagnoseInstallIssue("The term 'lucida.exe' is not recognized");
  assert.equal(lucidaMatch.matchedPreset.id, 'err-lucida-not-found');
  assert.equal(lucidaMatch.confidence, 'high');
});
