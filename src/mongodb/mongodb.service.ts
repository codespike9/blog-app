import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientSession, Db, MongoClient, Document, Filter } from 'mongodb';

@Injectable()
export class MongodbService {
    private client: MongoClient;
    private db: Db;

    constructor(private config: ConfigService) {
        const dbUrl = this.config.get<string>('DATABASE_URL');
        const dbName = this.config.get<string>('DATABASE_NAME');
        
        console.log(`Connecting to database at ${dbUrl}...`);
        this.client = new MongoClient(dbUrl);
        
        this.client.connect()
            .then(() => {
                console.log('Connected to database');
                this.db = this.client.db(dbName);
            })
            .catch(error => {
                console.error('Database connection error:', error);
            });
    }

    getDb(): Db {
        return this.db;
    }

    async closeConnection() {
        await this.client.close();
        console.log('Database connection closed');
    }

    async runWithTransaction(fn: (session: ClientSession) => Promise<any>): Promise<any> {
        
        const session = this.client.startSession();
        session.startTransaction(); 
        console.log("Transaction Started");
        try {
            const result = await fn(session);
            console.log("Transaction committing");
            await session.commitTransaction();
            console.log("Transaction committed");
            return result;
        } catch (error) {
            console.error("Transaction aborted due to error:", error);
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async insertOne(
        collectionName: string,
        document: Document,
        session?: ClientSession
    ) {

        return this.db.collection(collectionName).insertOne(document, { session });
    }

    async find(
        collectionName: string,
        filter: Filter<Document> = {},
        projection?: Partial<Document>,
        session?: ClientSession
    ) {
            
        return this.db.collection(collectionName).find(filter, {projection, session }).toArray();
    }

    async findOne(
        collectionName: string,
        filter: Filter<Document> = {},
        projection?: Partial<Document>,
        session?: ClientSession
    ) {
        return this.db.collection(collectionName).findOne(filter, {projection, session });
    }

    async updateOne(
        collectionName: string,
        filter: Filter<Document>,
        update: Document,
        session?: ClientSession
    ) {
        return this.db.collection(collectionName).updateOne(filter, update, { session });
    }

    async deleteOne(
        collectionName: string,
        filter: Filter<Document>,
        session?: ClientSession
    ) {
        return this.db.collection(collectionName).deleteOne(filter, { session });
    }

    async deleteMany(
        collectionName: string,
        filter: Filter<Document>,
        session?: ClientSession
    ) {
        return this.db.collection(collectionName).deleteMany(filter, { session });
    }
}
