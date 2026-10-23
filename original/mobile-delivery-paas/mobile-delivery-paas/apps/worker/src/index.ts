import 'dotenv/config';
import {Worker} from 'bullmq';import {eq} from 'drizzle-orm';
import {db,releases,projects} from '@mobile/db';import {redis,upload} from '@mobile/core';
import {mkdtemp,readFile,rm,stat} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';import {spawn} from 'node:child_process';
const run=(cmd:string,args:string[],cwd:string,env:NodeJS.ProcessEnv,timeout=900_000)=>new Promise<string>((resolve,reject)=>{const p=spawn(cmd,args,{cwd,env,shell:false});let out='';const timer=setTimeout(()=>p.kill('SIGKILL'),timeout);for(const s of [p.stdout,p.stderr])s.on('data',(v:Buffer)=>{out+=(v.toString()).slice(-3000);out=out.slice(-60000)});p.on('error',reject);p.on('close',code=>{clearTimeout(timer);code===0?resolve(out):reject(new Error(`${cmd} exited ${code}: ${out.slice(-3000)}`))});});
new Worker('mobile-releases',async job=>{const [r]=await db.select().from(releases).where(eq(releases.id,job.data.releaseId));if(!r)return;const [project]=await db.select().from(projects).where(eq(projects.id,r.projectId));if(!project)throw Error('Project missing');await db.update(releases).set({status:'running',updatedAt:new Date()}).where(eq(releases.id,r.id));const workspace=await mkdtemp(join(process.env.WORKSPACE_ROOT??tmpdir(),'mobile-'));try{
if(process.env.RUNNER_MODE!=='local')throw Error('Runner disabled. Configure isolated runners and RUNNER_MODE=local only in a trusted environment.');
// Restrict repos to an operator-controlled allowlist; never execute arbitrary untrusted project code on shared hosts.
const allowed=(process.env.ALLOWED_REPO_PREFIXES??'').split(',').filter(Boolean);if(!allowed.some(v=>project.repoUrl.startsWith(v)))throw Error('Repository is not allowlisted');
await run('git',['clone','--depth','1','--branch',r.gitRef,'--',project.repoUrl,workspace],process.cwd(),process.env);
await run('corepack',['pnpm','install','--frozen-lockfile'],workspace,process.env);
if(r.kind==='native'){
 const cmd=r.platform==='android'?'bundle':'build';
 const args=r.platform==='android'?['android','--release']:['ios','--configuration','Release'];
 if(r.platform==='ios'&&process.platform!=='darwin')throw Error('iOS requires a macOS worker');
 // Project must supply signing and Fastlane lanes; native compilation is project-specific.
 const output=await run('bundle',['exec','fastlane',r.platform==='android'?'android':'ios',cmd],workspace,process.env,3_600_000);
 await db.update(releases).set({status:'submitted',log:output.slice(-60000),updatedAt:new Date()}).where(eq(releases.id,r.id));
}else{
 // Expo export works for Expo projects and bare React Native apps configured with expo-updates + Expo CLI.
 await run('npx',['expo','export','--platform',r.platform,'--output-dir','dist'],workspace,process.env);
 // OTA manifests require assets, content hashes, metadata, runtime compatibility and signing.
 // Fail closed until the manifest builder is implemented.
 throw Error('OTA manifest publisher is intentionally gated: implement protocol-compliant signed manifests before enabling production OTA.');
}
}catch(e){await db.update(releases).set({status:'failed',log:String(e).slice(0,60000),updatedAt:new Date()}).where(eq(releases.id,r.id));throw e;}finally{await rm(workspace,{recursive:true,force:true})}
},{connection:redis,concurrency:1});
console.log('Release worker online');
