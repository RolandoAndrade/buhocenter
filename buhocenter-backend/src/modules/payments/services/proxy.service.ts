import { Injectable, Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as ngrok from 'ngrok';

@Injectable()
export class ProxyService {
    private _url: string;

    constructor (
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    /**
     * Returns the tunnel url created by ngrok
     */
    get url(): string {
        return this._url;
    }
    
    /**
     * Connects localhost with ngrok in order to create the tunnel
     * @returns Promise<void>
     */
    async connect(): Promise<void> {
        this._url = await ngrok.connect(3000);
        this.logger.debug(`Tunnel started! [url=${this._url}]`);
    }

    /**
     * Disconnects the tunnel established with ngrok
     * @returns void
     */
    disconnect(): void {
        this._url = undefined;
        ngrok.disconnect();
        this.logger.debug(`Disconnecting tunnel! [url=${this._url}]`);
    }
}
