import {test} from 'node:test';import assert from 'node:assert/strict';import {evaluate,bucket,type Flag} from '@pi/shared';
test('bucketing stable',()=>assert.equal(bucket('abc'),bucket('abc')));
test('disabled flag fallback',()=>{const f:Flag={key:'x',enabled:false,defaultValue:false,rules:[],rollout:100,version:1};assert.equal(evaluate(f,'u1').value,false)});
test('targeting rule',()=>{const f:Flag={key:'x',enabled:true,defaultValue:false,rules:[{attribute:'plan',operator:'eq',value:'pro'}],rollout:100,version:1};assert.equal(evaluate(f,'u1',{plan:'free'}).reason,'not_targeted');assert.equal(evaluate(f,'u1',{plan:'pro'}).value,true)});
test('zero rollout',()=>{const f:Flag={key:'x',enabled:true,defaultValue:false,rules:[],rollout:0,version:1};assert.equal(evaluate(f,'u1').value,false)});
