export interface MultiPlatformRedirectUri {
    ios: string;
    android: string;
}
export declare class AdalContext {
    private authError;
    private authResult;
    private authority;
    private clientId;
    private context;
    private redirectUri;
    private useBroker;
    private resourceId;
    private userId;
    constructor(authority: string, clientId: string, resourceId: string, redirectUri?: MultiPlatformRedirectUri | string, useBroker?: boolean);
    initContext(): void;
    login(): Promise<string>;
    getToken(): Promise<string>;
    private isContextInit();
}
