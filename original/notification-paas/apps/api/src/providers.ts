import nodemailer from 'nodemailer';
import {SESv2Client,SendEmailCommand} from '@aws-sdk/client-sesv2';
import {SNSClient,PublishCommand} from '@aws-sdk/client-sns';
export type Message={to:string;subject?:string;body:string};
export type Provider={send(message:Message):Promise<void>};
export function createProvider(kind:string,config:Record<string,string>):Provider {
 switch(kind){
 case 'smtp': {const transport=nodemailer.createTransport({host:config.host,port:Number(config.port||587),secure:config.secure==='true',auth:{user:config.user,pass:config.password}});return {async send(m){await transport.sendMail({from:config.from,to:m.to,subject:m.subject,text:m.body,html:m.body})}};}
 case 'aws-ses': {const client=new SESv2Client({region:config.region});return {async send(m){await client.send(new SendEmailCommand({FromEmailAddress:config.from,Destination:{ToAddresses:[m.to]},Content:{Simple:{Subject:{Data:m.subject||'Notification'},Body:{Html:{Data:m.body}}}}}))}};}
 case 'aws-sns': {const client=new SNSClient({region:config.region});return {async send(m){await client.send(new PublishCommand({PhoneNumber:m.to,Message:m.body}))}};}
 case 'msg91': return {async send(m){const response=await fetch('https://control.msg91.com/api/v5/flow/',{method:'POST',headers:{authkey:config.authkey,'content-type':'application/json'},body:JSON.stringify({flow_id:config.flowId,sender:config.sender,mobiles:m.to,...JSON.parse(m.body)})});if(!response.ok)throw new Error(`MSG91 HTTP ${response.status}`)}};
 default:throw new Error(`Unsupported provider ${kind}`);
 }
}
