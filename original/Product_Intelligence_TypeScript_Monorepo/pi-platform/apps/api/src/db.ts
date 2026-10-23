import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';import {dirname} from 'node:path';
const file=process.env.PI_DB_PATH||'./data/pulse.db';if(file!==':memory:')mkdirSync(dirname(file),{recursive:true});
export const db=new DatabaseSync(file);db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;');
db.exec(`
CREATE TABLE IF NOT EXISTS organizations(id TEXT PRIMARY KEY,name TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS projects(id TEXT PRIMARY KEY,org_id TEXT NOT NULL,name TEXT NOT NULL,public_key TEXT UNIQUE NOT NULL,admin_key TEXT UNIQUE NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS environments(id TEXT PRIMARY KEY,project_id TEXT NOT NULL,name TEXT NOT NULL,UNIQUE(project_id,name));
CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY,project_id TEXT NOT NULL,environment TEXT NOT NULL,event TEXT NOT NULL,distinct_id TEXT NOT NULL,anonymous_id TEXT,session_id TEXT,properties TEXT NOT NULL,timestamp TEXT NOT NULL,received_at TEXT DEFAULT CURRENT_TIMESTAMP,release TEXT);
CREATE INDEX IF NOT EXISTS events_proj_time ON events(project_id,environment,timestamp);CREATE INDEX IF NOT EXISTS events_name ON events(project_id,event,distinct_id);
CREATE TABLE IF NOT EXISTS profiles(project_id TEXT NOT NULL,distinct_id TEXT NOT NULL,properties TEXT NOT NULL,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(project_id,distinct_id));
CREATE TABLE IF NOT EXISTS aliases(project_id TEXT NOT NULL,anonymous_id TEXT NOT NULL,distinct_id TEXT NOT NULL,PRIMARY KEY(project_id,anonymous_id));
CREATE TABLE IF NOT EXISTS flags(id TEXT PRIMARY KEY,project_id TEXT NOT NULL,environment TEXT NOT NULL,key TEXT NOT NULL,definition TEXT NOT NULL,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(project_id,environment,key));
CREATE TABLE IF NOT EXISTS experiments(id TEXT PRIMARY KEY,project_id TEXT NOT NULL,environment TEXT NOT NULL,name TEXT NOT NULL,flag_key TEXT NOT NULL,goal_event TEXT NOT NULL,status TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS exposures(id TEXT PRIMARY KEY,project_id TEXT NOT NULL,environment TEXT NOT NULL,experiment_id TEXT NOT NULL,distinct_id TEXT NOT NULL,variant TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(project_id,experiment_id,distinct_id));
CREATE TABLE IF NOT EXISTS errors(id TEXT PRIMARY KEY,project_id TEXT NOT NULL,environment TEXT NOT NULL,issue_id TEXT NOT NULL,message TEXT NOT NULL,name TEXT,stack TEXT,release TEXT,distinct_id TEXT,session_id TEXT,context TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS issues(id TEXT PRIMARY KEY,project_id TEXT NOT NULL,environment TEXT NOT NULL,fingerprint TEXT NOT NULL,title TEXT NOT NULL,status TEXT DEFAULT 'open',first_seen TEXT DEFAULT CURRENT_TIMESTAMP,last_seen TEXT DEFAULT CURRENT_TIMESTAMP,count INTEGER DEFAULT 1,UNIQUE(project_id,environment,fingerprint));
CREATE TABLE IF NOT EXISTS releases(id TEXT PRIMARY KEY,project_id TEXT NOT NULL,environment TEXT NOT NULL,version TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(project_id,environment,version));
CREATE TABLE IF NOT EXISTS metrics(id TEXT PRIMARY KEY,project_id TEXT NOT NULL,environment TEXT NOT NULL,name TEXT NOT NULL,value REAL NOT NULL,session_id TEXT,properties TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS audit(id TEXT PRIMARY KEY,project_id TEXT NOT NULL,action TEXT NOT NULL,actor TEXT NOT NULL,details TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
`);
export function all<T=any>(sql:string,...args:any[]):T[]{return db.prepare(sql).all(...args) as T[]}
export function one<T=any>(sql:string,...args:any[]):T|undefined{return db.prepare(sql).get(...args) as T|undefined}
export function run(sql:string,...args:any[]){return db.prepare(sql).run(...args)}
