import { expect, test, beforeEach } from 'vitest';
import App from '../stores/App.js';

import walmare from './data/schemas/walmare.json'
import woftsare from './data/schemas/woftsare.json';

const app = new App();
beforeEach(async () => {
    app.reset();
    app.nodes = []; 
})

/**
 * UI and Bundle Initialization
 */
test('Bundle starts empty', () => {
  const result = app.edges.length + app.nodes.length;
  expect(result).toBe(0);
});

test('Unknown types generate unknown nodes', () => {
    const node = app.createNodeByType('virus');
    app.persistNode(node);
    expect(app.getNodesByType('unknown').length).toBe(1);
})

test('SDO extension schema imported', () => {
    const schema = walmare;
    app.addSchema(schema);
    expect(app.getTypeSDO('walmare')).toBeTruthy();
    expect(app.getExtensions().length).toBe(1);

    const node = app.createNodeByType('walmare');
    node.id = app.generateNodeID(node.prefix);
    app.persistNode(node);
    expect(app.getNodesByType('walmare').length).toBe(1);

    expect(app.nodes.length).toBe(2);
})

test('SCO extension schema imported', () => {
    const schema = woftsare;
    app.addSchema(schema);
    expect(app.getTypeSDO('woftsare')).toBeTruthy();
    expect(app.getExtensions().length).toBe(1);

    const node = app.createNodeByType('woftsare');
    node.id = app.generateNodeID(node.prefix);
    app.persistNode(node);
    expect(app.getNodesByType('woftsare').length).toBe(1);

    expect(app.nodes.length).toBe(2);
})

/**
 * Node, Schema, and Bundle Creation via UI
 */

test('Manually create relationship', () => {
  const source = app.createNodeByType('course-of-action');
  source.id = 'test-source-coa';
  source.properties.name.value = 'test-coa';
  app.persistNode(source);
  const target = app.createNodeByType('indicator');
  target.id = 'test-target-indicator';
  target.properties.name.value = 'test-indicator';
  target.properties.pattern.value = {"pattern": "test-pattern"};
  target.properties.pattern_type.value = "test";
  app.persistNode(target);
  const relationships = app.canRelate(source, target);
  app.setRelationships(relationships);
  expect(app.relationships).not.toHaveLength(0);
  const relationship = relationships.find( rel => rel.relationship_type == 'investigates');
  app.manuallySelectRelationship(relationship);
  app.failedCollection = [];
  app.validateSubmission();
  expect(app.failedCollection).toStrictEqual([]);
})

test('Create new relationship', () => {
  const source = app.createNodeByType('course-of-action');
  source.id = 'test-source-coa';
  source.properties.name.value = 'test-coa';
  app.persistNode(source);
  const target = app.createNodeByType('indicator');
  target.id = 'test-target-indicator';
  target.properties.name.value = 'test-indicator';
  target.properties.pattern.value = {"pattern": "test-pattern"};
  target.properties.pattern_type.value = "test";
  app.persistNode(target);

  const relationships = app.canRelate(source, target);
  app.setRelationships(relationships);

  const rel = {
    type: 'test-relationship',
    targetObjectType: 'indicator',
    x_exclusive: false,
  };
  expect(app.relationships).not.toHaveLength(0);

  const relationship = app.makeRelationship(source, target, rel);
  app.manuallySelectRelationship(relationship);
  app.addCustomRelationship(rel, source.id);

  // custom relationships include test-relationship type
  expect(app.customRelationships['course-of-action'][0]).toStrictEqual({
    type: 'test-relationship',
    target: 'indicator',
    x_exclusive: false,
  });
  app.failedCollection = [];
  app.validateSubmission();
  expect(app.failedCollection).toStrictEqual([]);
})

test('Manually create SCO', () => {
  const source = app.createNodeByType('malware');
  source.id = 'test-source-malware';
  app.persistNode(source);
  const target = app.createNodeByType('observable');

  const relationships = app.canRelate(source, target);
  app.setRelationships(relationships);
  expect(app.relationships).not.toHaveLength(0);

  const relationship = relationships.find( rel => rel.relationship_type == 'drops');
  const rel = app.manuallySelectRelationship(relationship);

  // manually select should have created a file sdo
  const targetId = rel.target_ref;
  expect(targetId).toBeTruthy();
  const targetNode = app.getNodeById(targetId);
  expect(targetNode).toBeTruthy();
  expect(targetNode.properties.type.value).toBe('file');

  app.failedCollection = [];
  app.validateSubmission();
  expect(app.failedCollection).toStrictEqual([]);
})