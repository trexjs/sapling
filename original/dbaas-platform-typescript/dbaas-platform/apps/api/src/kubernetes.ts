import * as k8s from '@kubernetes/client-node';
import type {ResourceEngine} from '@dbaas/contracts';
const namespace=()=>process.env.K8S_NAMESPACE||'dbaas-resources';
const dns=(s:string)=>s.toLowerCase().replace(/[^a-z0-9-]/g,'-').slice(0,52);
export type Desired={id:string;name:string;engine:ResourceEngine;plan:string;config:Record<string,unknown>};
export function desiredManifest(r:Desired):{group:string;version:string;plural:string;manifest:any}{
 const name=dns('db-'+r.id),labels={'app.kubernetes.io/managed-by':'internal-dbaas','dbaas.internal/resource-id':r.id};
 const metadata={name,namespace:namespace(),labels};
 switch(r.engine){
 case 'postgres':return {group:'postgresql.cnpg.io',version:'v1',plural:'clusters',manifest:{apiVersion:'postgresql.cnpg.io/v1',kind:'Cluster',metadata,spec:{instances:r.plan==='critical'?3:r.plan==='standard'?2:1,storage:{size:`${Math.min(200,Math.max(1,Number(r.config.storageGiB)||10))}Gi`},bootstrap:{initdb:{database:'app',owner:'app'}}}}};
 case 'kafka':return {group:'kafka.strimzi.io',version:'v1beta2',plural:'kafkatopics',manifest:{apiVersion:'kafka.strimzi.io/v1beta2',kind:'KafkaTopic',metadata:{...metadata,labels:{...labels,'strimzi.io/cluster':process.env.K8S_STRIMZI_CLUSTER||'shared-kafka'}},spec:{partitions:Math.min(12,Math.max(1,Number(r.config.partitions)||3)),replicas:Math.min(3,Math.max(1,Number(r.config.replicas)||1)),config:{'retention.ms':Math.max(3600000,Number(r.config.retentionMs)||604800000)}}}};
 case 'mongodb':return {group:'mongodbcommunity.mongodb.com',version:'v1',plural:'mongodbcommunity',manifest:{apiVersion:'mongodbcommunity.mongodb.com/v1',kind:'MongoDBCommunity',metadata,spec:{members:r.plan==='critical'?3:1,type:'ReplicaSet',version:String(process.env.MONGODB_ENGINE_VERSION||'7.0.15'),security:{authentication:{modes:['SCRAM']}},users:[]}}};
 case 'valkey':throw new Error('VALKEY_OPERATOR_NOT_SELECTED: no safe universal CRD exists; choose and validate an operator before enabling Kubernetes provisioning');
 case 'cronjob':throw new Error('Use the dedicated jobs API');
 }}
export class KubernetesProvisioner {
 private client:k8s.CustomObjectsApi;
 constructor(){const kc=new k8s.KubeConfig();kc.loadFromDefault();this.client=kc.makeApiClient(k8s.CustomObjectsApi);}
 async apply(resource:Desired){const m=desiredManifest(resource);try {await this.client.getNamespacedCustomObject({group:m.group,version:m.version,namespace:namespace(),plural:m.plural,name:m.manifest.metadata.name});await this.client.patchNamespacedCustomObject({group:m.group,version:m.version,namespace:namespace(),plural:m.plural,name:m.manifest.metadata.name,body:m.manifest});}catch(e:any){if(e?.code===404||e?.statusCode===404||e?.response?.statusCode===404){await this.client.createNamespacedCustomObject({group:m.group,version:m.version,namespace:namespace(),plural:m.plural,body:m.manifest});}else throw e;}return {namespace:namespace(),kind:m.manifest.kind,kubernetesName:m.manifest.metadata.name};}
 async delete(resource:Desired){const m=desiredManifest(resource);await this.client.deleteNamespacedCustomObject({group:m.group,version:m.version,namespace:namespace(),plural:m.plural,name:m.manifest.metadata.name});}
 async applyJob(job:{id:string;name:string;schedule:string;timeZone:string;image:string;command:string[]|null;concurrencyPolicy:string}){
 const kc=new k8s.KubeConfig();kc.loadFromDefault();const batch=kc.makeApiClient(k8s.BatchV1Api),name=dns('job-'+job.id);
 const body:k8s.V1CronJob={apiVersion:'batch/v1',kind:'CronJob',metadata:{name,namespace:namespace(),labels:{'app.kubernetes.io/managed-by':'internal-dbaas'}},spec:{schedule:job.schedule,timeZone:job.timeZone,concurrencyPolicy:job.concurrencyPolicy as any,successfulJobsHistoryLimit:3,failedJobsHistoryLimit:3,jobTemplate:{spec:{backoffLimit:2,activeDeadlineSeconds:3600,template:{spec:{restartPolicy:'Never',automountServiceAccountToken:false,containers:[{name:'worker',image:job.image,command:job.command||undefined,resources:{requests:{cpu:'100m',memory:'128Mi'},limits:{cpu:'500m',memory:'512Mi'}},securityContext:{allowPrivilegeEscalation:false,capabilities:{drop:['ALL']},runAsNonRoot:true,seccompProfile:{type:'RuntimeDefault'}}}]}}}}}};
 try{await batch.createNamespacedCronJob({namespace:namespace(),body});}catch(e:any){if(e?.code===409||e?.statusCode===409)await batch.replaceNamespacedCronJob({namespace:namespace(),name,body});else throw e;}
 return {namespace:namespace(),kubernetesName:name};
 }
}
