import { Module } from '@nestjs/common';
import { DocumentsService } from './services/documents.service';

@Module({
    providers: [DocumentsService],
})
export class DocumentsModule {}
