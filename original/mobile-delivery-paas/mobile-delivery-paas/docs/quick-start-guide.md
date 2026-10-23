# Quick start guide

## Requirements
Node 22+, pnpm, Docker Compose; Android builds need Android SDK/Java, iOS builds require macOS + Xcode. Store uploads need Google Play service account credentials and App Store Connect API key/signing assets.

## Local control plane
Run README setup. Verify `curl http://localhost:4000/health`. Bootstrap once; put the returned API key in dashboard. Create a project using an HTTPS Git repository. Queue a release; default worker refuses execution until runners are configured.

## SDK example
```ts
import {MobileDeliveryClient} from '@mobile/sdk';
const client=new MobileDeliveryClient({baseUrl:'http://localhost:4000',apiKey:process.env.MOBILE_KEY!});
const project=await client.createProject({name:'my-app',repoUrl:'https://github.com/example/my-app.git',framework:'expo'});
await client.createRelease(project.id,{gitRef:'main',platform:'android',kind:'native',channel:'internal'});
```

## Mobile client setup (design target)
Expo: configure expo-updates URL, channel, runtimeVersion and signing certificate in app config. Bare: install expo modules and expo-updates, configure native Android and iOS update integration, and rebuild binaries. Do not configure clients to use the included experimental endpoint until manifest signing and asset publication are implemented.
