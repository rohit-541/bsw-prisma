import { Injectable, InternalServerErrorException, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  private readonly logger = new Logger(PrismaService.name);
  private isReconnecting = false;

  constructor() {
    super();

    // Middleware to handle errors during queries
    this.$use(async (params, next) => {
      try {
        const result = await next(params);
        return result;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          this.logger.error('Database error occurred during query execution.', error);
          throw new InternalServerErrorException('Error connecting to the database');
        } else {
          this.logger.error('Unexpected error occurred during query execution.', error);
          throw new InternalServerErrorException('Unexpected database error');
        }
      }
    });
  }

  async onModuleInit() {
    this.logger.log("Initializing connection to the database");
    try {
      await this.$connect();
      this.logger.log("Connection to the database established");
      this.createTTLIndex().catch(console.error);
      this.setupDisconnectListener();
    } catch (error) {
      this.logger.error("Error connecting to the database", error);
      await this.reconnect();
    }
  }

  async onModuleDestroy() {
    this.logger.log("Closing connection to the database");
    await this.$disconnect();
    this.logger.log("Connection to the database closed");
  }

  async reconnect() {
    if (this.isReconnecting) return; // Prevent multiple reconnections at once

    this.isReconnecting = true;
    this.logger.log("Reconnecting to the database");
    try {
      await this.$disconnect();
      await this.$connect();
      this.logger.log("Reconnection to the database established");
      this.isReconnecting = false;
    } catch {
      this.logger.error("Error reconnecting to the database, retrying in 5 seconds...");
      setTimeout(() => this.reconnect(), 5000);
    }
  }

  private setupDisconnectListener() {
    process.on('beforeExit', async () => {
      this.logger.warn('Database connection lost. Attempting to reconnect...');
      await this.reconnect();
    });
  }



    async createTTLIndex() {
        const db = this.$runCommandRaw({
            createIndexes: "Document",
            indexes: [
                {
                    key: { expiresAt: 1 },
                    name: "expiresAtTTL",
                    expireAfterSeconds: 0
                }
            ]
        });
        console.log('TTL Index created successfully.');
    }
}